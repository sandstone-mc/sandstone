import { ExecuteCommandNode, FunctionCommandNode, ReturnCommandNode } from 'sandstone/commands'
import { Node } from 'sandstone/core'
import type { SandstoneCore } from 'sandstone/core'
import { ContainerCommandNode, ContainerNode, MCFunctionNode } from 'sandstone/core'
import type { MCFunctionClass } from 'sandstone/core'
import { GenericSandstoneVisitor } from './visitor'

/**
 * Second pass of throw handling — wires the fail-propagation chain.
 *
 * Runs AFTER `ThrowInlineVisitor` and `ContainerCommandsToMCFunctionVisitor`,
 * so throw MCFunctions exist with their bodies already filled in.
 *
 * Pattern A (direct caller):
 *   For every execute whose body is `run function X` and X is a throw
 *   function, replace the execute with:
 *     `execute <conds> if function X run return fail`
 *   X returns 1 (success) because the throw body sets the score and returns
 *   1; the `if function X` check passes and `run return fail` fires in the
 *   executor's context — failing the enclosing MCFunction.
 *
 * Pattern B (transitive caller):
 *   For every execute whose body is `run function Y` and Y is fallible
 *   (transitively calls a throw function), append ONE sibling execute per
 *   throw score reachable from Y:
 *     `execute <conds> if score #throw_<id> __sandstone matches 1 run return fail`
 *   The score was set inside the throw function deep in Y's call graph, so
 *   it's a reliable signal that the throw actually fired (independent of any
 *   other failure modes Y might have).
 *
 * Both patterns rely on the `#throw_<id>` score set in the throw function's
 * body by `ThrowInlineVisitor`. `collectThrowScoresFromAST` re-derives the
 * throw function set and their scores by walking the AST — no coupling with
 * `ThrowInlineVisitor`'s instance state.
 */
export class ThrowPropagationVisitor extends GenericSandstoneVisitor {
  /** MCFunctions that contain an inlined throw (from `ThrowInlineVisitor`). */
  private throwFunctions = new Set<string>()

  /** MCFunctions that can fail at runtime (transitively call a throw). */
  private fallibleFunctions = new Set<string>()

  /** Throw scores reachable (directly or transitively) from each MCFunction. */
  private reachableScores = new Map<string, string[]>()

  /** Throw scores actually referenced by a Pattern B sibling (not just reachable). */
  private usedScores = new Set<string>()

  /** Scores that need a `scoreboard players reset` at the start of their host MCFunction. */
  private resetSites = new Set<string>()

  /** MCFunctions at the top of the call graph — no other MCFunction calls them. */
  private roots = new Set<string>()

/** Tracks which `ScoreResetNode`s have already been prepended per MCFunction (by resource name). */
  private resetsEmitted = new Map<string, Set<ScoreResetNode>>()

  visitMCFunctionNode = (node: MCFunctionNode) => {
    return this.genericVisit(node)
  }

  onEnd = () => {
    this.collectThrowScoresFromAST()
    this.computeReachableScores()

    // Compute which MCFunctions are roots of the call graph (no other
    // MCFunction calls into them). Only roots need the throw-score reset
    // prepended — intermediate levels can rely on the root having reset
    // before the chain starts.
    this.computeRoots()

    // Strip score sets from throw functions whose scores aren't read by a
    // Pattern B sibling — direct callers detect the throw via
    // `if function X run return fail` (Pattern A), so the score is wasted
    // when there's no transitive caller.
    this.pruneUnusedThrowScores()

    // Iteratively apply Pattern A then Pattern B until no new fallible
    // functions emerge.
    let changed = true
    while (changed) {
      changed = false
      const beforeFallible = this.fallibleFunctions.size
      const beforeBody = new Map<string, number>()
      for (const fn of this.pack.core.resourceNodes) {
        if (fn instanceof MCFunctionNode) beforeBody.set(fn.resource.name, fn.body.length)
      }

      for (const fn of this.pack.core.resourceNodes) {
        if (!(fn instanceof MCFunctionNode)) continue
        this.applyPatternA(fn)
        this.propagate(fn)
      }

      // Re-loop if any MCFunction got newly marked fallible OR grew (new
      // sibling appended).
      const grew = this.fallibleFunctions.size > beforeFallible ||
        [...this.pack.core.resourceNodes].some(
          (fn) => fn instanceof MCFunctionNode && fn.body.length > (beforeBody.get(fn.resource.name) ?? 0),
        )
      if (grew) changed = true
    }
  }

  /**
   * Walk the AST and find every `#throw_<id> __sandstone` score set command.
   * The MCFunction containing it is a throw function. This avoids coupling
   * with `ThrowInlineVisitor`'s instance — we re-derive from the AST.
   */
  private collectThrowScoresFromAST(): void {
    for (const fn of this.pack.core.resourceNodes) {
      if (!(fn instanceof MCFunctionNode)) continue
      const scoreNames = new Set<string>()
      const visit = (container: ContainerNode | ContainerCommandNode) => {
        for (const child of container.body) {
          const cmd = child as any
          if (cmd?.constructor?.name === 'ScoreboardCommandNode' && Array.isArray(cmd.args)) {
            const args: any[] = cmd.args
            if (
              args[0] === 'players' &&
              args[1] === 'set' &&
              typeof args[2] === 'string' &&
              args[2].startsWith('#throw_') &&
              args[3] === '__sandstone' &&
              args[4] === 1
            ) {
              scoreNames.add(args[2].slice(1)) // strip leading '#'
            }
          }
          if (child instanceof ContainerNode || child instanceof ContainerCommandNode) {
            visit(child)
          }
        }
      }
      visit(fn)
      if (scoreNames.size > 0) {
        this.throwFunctions.add(fn.resource.name)
        this.reachableScores.set(fn.resource.name, [...scoreNames])
      }
    }
  }

  /**
   * Remove `scoreboard players set #throw_<id> __sandstone 1` commands from
   * throw functions whose scores are never read by a Pattern B sibling.
   * Direct callers detect the throw via `if function X run return fail`
   * (Pattern A); the score is only needed by transitive callers (Pattern B).
   * If no MCFunction references the score, it's wasted work at runtime.
   */
  private pruneUnusedThrowScores(): void {
    for (const fn of this.pack.core.resourceNodes) {
      if (!(fn instanceof MCFunctionNode)) continue
      if (!this.throwFunctions.has(fn.resource.name)) continue

      this.stripUnusedScores(fn, this.usedScores)
    }
  }

  private stripUnusedScores(node: MCFunctionNode, usedScores: Set<string>): void {
    const visit = (container: ContainerNode | ContainerCommandNode) => {
      for (let i = 0; i < container.body.length; i++) {
        const child = container.body[i]
        const cmd = child as any
        if (
          cmd?.constructor?.name === 'ScoreboardCommandNode' &&
          Array.isArray(cmd.args)
        ) {
          const args: any[] = cmd.args
          if (
            args[0] === 'players' &&
            args[1] === 'set' &&
            typeof args[2] === 'string' &&
            args[2].startsWith('#throw_') &&
            args[3] === '__sandstone' &&
            args[4] === 1 &&
            !usedScores.has(args[2].slice(1))
          ) {
            container.body.splice(i, 1)
            i -= 1
            continue
          }
        }
        if (child instanceof ContainerNode || child instanceof ContainerCommandNode) {
          visit(child)
        }
      }
    }
    visit(node)
  }

  /**
   * Compute, for each MCFunction, the union of throw score names reachable
   * via direct function calls. Fixed-point iteration until stable.
   */
  private computeReachableScores(): void {
    let changed = true
    while (changed) {
      changed = false
      for (const fn of this.pack.core.resourceNodes) {
        if (!(fn instanceof MCFunctionNode)) continue

        const direct = this.collectDirectScores(fn)
        const current = new Set(this.reachableScores.get(fn.resource.name) ?? [])
        for (const s of direct) {
          if (!current.has(s)) {
            current.add(s)
            changed = true
          }
        }
        this.reachableScores.set(fn.resource.name, [...current])
      }
    }
  }

  private collectDirectScores(node: MCFunctionNode): string[] {
    const out = new Set<string>()
    const visit = (container: ContainerNode | ContainerCommandNode) => {
      for (const child of container.body) {
        if (child instanceof ExecuteCommandNode && child.body.length === 1) {
          const inner = child.body[0]
          if (inner instanceof FunctionCommandNode) {
            const target = this.resolveFunctionName(inner)
            if (target) {
              const scores = this.reachableScores.get(target)
              if (scores) for (const s of scores) out.add(s)
            }
          }
        }
        if (child instanceof ContainerNode || child instanceof ContainerCommandNode) {
          visit(child)
        }
      }
    }
    visit(node)
    return [...out]
  }

  /**
   * Compute the set of MCFunctions at the top of the call graph — those
   * that no other MCFunction calls. The reset is only emitted at roots
   * because intermediate levels inherit a fresh score from the root.
   */
  private computeRoots(): void {
    const called = new Set<string>()
    for (const fn of this.pack.core.resourceNodes) {
      if (!(fn instanceof MCFunctionNode)) continue
      const visit = (container: ContainerNode | ContainerCommandNode) => {
        for (const child of container.body) {
          if (child instanceof ExecuteCommandNode && child.body.length === 1) {
            const inner = child.body[0]
            if (inner instanceof FunctionCommandNode) {
              const target = this.resolveFunctionName(inner)
              if (target) called.add(target)
            }
          }
          if (child instanceof ContainerNode || child instanceof ContainerCommandNode) {
            visit(child)
          }
        }
      }
      visit(fn)
    }
    for (const fn of this.pack.core.resourceNodes) {
      if (fn instanceof MCFunctionNode && !called.has(fn.resource.name)) {
        this.roots.add(fn.resource.name)
      }
    }
  }

  /**
   * Pattern A — direct caller rewrite. Replaces `execute ... run function X`
   * with `execute ... if function X run return fail` when X is a throw
   * function. Mutates the execute in place. Also marks the enclosing
   * MCFunction as fallible so Pattern B can pick it up on the next pass.
   */
  private applyPatternA(node: MCFunctionNode): void {
    let wrapped = false
    const visit = (container: ContainerNode | ContainerCommandNode) => {
      for (let i = 0; i < container.body.length; i++) {
        const child = container.body[i]

        if (child instanceof ExecuteCommandNode && child.body.length === 1) {
          if ((child as any).__throwPatternA) continue

          const inner = child.body[0]
          if (inner instanceof FunctionCommandNode) {
            const target = this.resolveFunctionName(inner)
            if (target && this.throwFunctions.has(target)) {
              child.args.push(['if', 'function', target] as any)
              child.body = [this.makeReturn('fail')]
              ;(child as any).__throwPatternA = true
              ;(child as any).isSingleExecute = false
              wrapped = true
              continue
            }
          }
        }

        if (child instanceof ContainerNode || child instanceof ContainerCommandNode) {
          visit(child)
        }
      }
    }

    visit(node)

    if (wrapped) {
      this.fallibleFunctions.add(node.resource.name)
    }
  }

  /**
   * Pattern B — append a sibling execute per throw score reachable from any
   * execute whose body is `run function Y`. Skips executes that have already
   * been Pattern-A'd (they no longer have a function call in their body).
   */
  private propagate(node: MCFunctionNode): void {
    let wrapped = false
    const visit = (container: ContainerNode | ContainerCommandNode) => {
      for (let i = 0; i < container.body.length; i++) {
        const child = container.body[i]

        if (child instanceof ExecuteCommandNode && child.body.length === 1) {
          if ((child as any).__throwPatternB) continue

          const inner = child.body[0]
          if (inner instanceof FunctionCommandNode) {
            const target = this.resolveFunctionName(inner)
            if (
              target &&
              target !== node.resource.name &&
              (this.fallibleFunctions.has(target) || this.throwFunctions.has(target))
            ) {
              const scores = this.reachableScores.get(target) ?? []
              for (const scoreName of scores) {
                // Pattern B is a top-level propagation check — it doesn't
                // inherit the source execute's subcommand args. The score
                // is the throw signal; if it's set, the throw fired and we
                // propagate `return fail`. The source execute's conditions
                // (e.g. `if score ... matches ..10`) are irrelevant because
                // the throw only ever ran under those conditions anyway, and
                // the score itself proves the throw happened.
                const sibling = this.makeIfScoreFailExecute([], scoreName)
                container.body.splice(i + 1, 0, sibling)
                i += 1
                this.usedScores.add(scoreName)
                this.resetSites.add(scoreName)
              }
              if (scores.length > 0) {
                ;(child as any).__throwPatternB = true
                wrapped = true
              }
            }
          }
        }

        if (child instanceof ContainerNode || child instanceof ContainerCommandNode) {
          visit(child)
        }
      }
    }

    visit(node)

    if (wrapped && !this.fallibleFunctions.has(node.resource.name)) {
      this.fallibleFunctions.add(node.resource.name)
    }

    if (wrapped && this.roots.has(node.resource.name)) {
      this.prependScoreResets(node)
    }
  }

  /**
   * Prepend `scoreboard players reset #throw_<id> __sandstone` for each
   * tracked throw score so a stale value from a previous invocation (e.g.
   * /reload) doesn't cause a spurious Pattern B check. Idempotent — already-
   * present resets aren't duplicated.
   */
  private prependScoreResets(node: MCFunctionNode): void {
    let emitted = this.resetsEmitted.get(node.resource.name)
    if (!emitted) {
      emitted = new Set()
      this.resetsEmitted.set(node.resource.name, emitted)
    }
    for (const scoreName of this.resetSites) {
      const reset = new ScoreResetNode(this.pack.core, scoreName)
      if (emitted.has(reset)) continue
      emitted.add(reset)
      node.body.unshift(reset)
    }
  }

  private makeIfScoreFailExecute(args: any[], scoreHolderName: string): ExecuteCommandNode {
    const clonedArgs = args.map((sub) => [...sub]) as any
    clonedArgs.push(['if', 'score', `#${scoreHolderName}`, '__sandstone', 'matches', 1] as any)

    // Empty body initially — append's exitContext requires an active
    // MCFunction, which we don't have during visitor time.
    const node = new ExecuteCommandNode(this.pack, false, clonedArgs, {
      isSingleExecute: true,
      body: [],
    })
    node.body = [this.makeReturn('fail')]
    return node
  }

  private makeReturn(value: number | 'fail'): ReturnCommandNode {
    const node = new ReturnCommandNode(this.pack)
    node.args = [value as any]
    node.commited = false
    return node
  }

  private resolveFunctionName(node: FunctionCommandNode): string | undefined {
    const arg = node.args[0]
    if (typeof arg === 'function' && 'node' in arg) {
      const fnClass = arg as unknown as MCFunctionClass<any, any>
      return fnClass.name
    }
    return undefined
  }
}

/**
 * Marker node that resolves to `scoreboard players reset #throw_<scoreName>
 * __sandstone`. Used by `ThrowPropagationVisitor` to prepend a reset at the
 * start of any MCFunction that needs to check a throw score — so a stale
 * value from a previous invocation (e.g. /reload) doesn't fire a spurious
 * Pattern B check. The visitor tracks emitted instances per MCFunction to
 * avoid duplicates.
 */
class ScoreResetNode extends Node {
  constructor(
    sandstoneCore: SandstoneCore,
    public scoreName: string,
  ) {
    super(sandstoneCore)
  }

  getValue(): string {
    return `scoreboard players reset #${this.scoreName} __sandstone`
  }
}