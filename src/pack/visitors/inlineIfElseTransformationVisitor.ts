import type { Node } from 'sandstone/core'
import { ExecuteCommandNode } from 'sandstone/commands'
import { IfNode } from 'sandstone/flow'
import { ElseNode } from 'sandstone/flow'
import type { Score } from 'sandstone/variables'
import { TestMCFunctionNode } from 'sandstone/test/mcfunction'
import { GenericSandstoneVisitor } from './visitor'

function* flattenIfNode(node: IfNode): IterableIterator<IfNode | ElseNode> {
  yield node

  const next = node.nextFlowNode

  if (next instanceof IfNode) {
    yield* flattenIfNode(next)
  } else if (next) {
    yield next
  }
}

/**
 * Build an ExecuteCommandNode and mark it `isSingleExecute: true` so
 * `ContainerCommandsToMCFunctionVisitor` doesn't extract its body into a
 * child MCFunction — the whole point of this visitor is to keep test
 * bodies flat, with no helper MCFunctions or `return` chains.
 *
 * Body must be assigned post-construction (not via the constructor's
 * `body` option) so the constructor's `append(...body)` call doesn't
 * fire with `isSingleExecute: true` and trip `exitContext()` at visitor
 * time (no MCFunction context is on the stack during visitor passes).
 */
const flatExecute = (
  pack: import('sandstone/pack').SandstonePack,
  args: import('sandstone/commands').SubCommand[],
  givenCallbackName: string,
  body: Node[],
): ExecuteCommandNode => {
  const node = new ExecuteCommandNode(pack, false, args, {
    isSingleExecute: false,
    givenCallbackName,
    body: [],
  })
  node.body = body
  node.isSingleExecute = true
  return node
}

/**
 * Alternative if/else transform used only inside `TestMCFunctionNode` bodies.
 *
 * Unlike `IfElseTransformationVisitor`, this never extracts body commands
 * into a child MCFunction and never emits `return` — both would break
 * PackTest's per-test result tracking. Each if/elseIf/else arm stores its
 * condition outcome in an anonymous flag score (set to 1 when the arm
 * should fire), then body commands run as flat top-level `execute if score
 * … run …` lines, each gated on its arm's flag.
 *
 * For a single if with a single-command body and no chain, the fast path
 * emits a plain `execute if <cond> run <cmd>`.
 *
 * Flag-setter shape (per arm `i`):
 *   execute store success score <flag_i> if score <flag_0> matches 0
 *     [if score <flag_1> matches 0 …] if score <X_i> matches 0
 *
 * The store MUST precede the gates: MC's `store success` modifier captures
 * the success of every later modifier, and is itself skipped if the chain
 * aborts before it (which can't happen here since it's first, but the
 * ordering matters for correctness of the capture). When every gate
 * passes, `flag_i` is set to 1; when any gate fails, the chain aborts at
 * that gate and `flag_i` stays at its default (0).
 *
 * Arm-body gate: `if score <flag_i> matches 1 run <cmd>`
 * Else-body gate: `if score <flag_0> matches 0 [if score <flag_1> matches 0 …] run <cmd>`
 *
 * Anything above 0 in a flag means its arm fired, which must NOT let the
 * else-body run — hence the else gate uses `matches 0` (strict equality),
 * not `matches 0..` (which would also accept 1+).
 */
export class InlineIfElseTransformationVisitor extends GenericSandstoneVisitor {
  visitIfNode = (node_: IfNode) => {
    // Scope: only transform when the parent MCFunction opted into the
    // inline flow transform (TestMCFunctionNode always; normal MCFunctions
    // when `pack.compile({ inline: true })` set the core flag).
    if (!node_.parentMCFunction?.useInlineTransforms) {
      return node_
    }

    // elseIf nodes are reached via the root's chain handling — never
    // visit them as standalone roots.
    if (node_._isElseIf) {
      return []
    }

    if (node_.body.length === 0) {
      throw new Error('Flow clause body is empty. Add at least one command to it (or remove the branch).')
    }

    const nodes = Array.from(flattenIfNode(node_))

    // Fast path: single if + single-cmd body + no chain.
    // Plain `execute if <cond> run <cmd>`.
    if (nodes.length === 1 && node_.body.length === 1) {
      return this.visit(
        flatExecute(this.pack, [[node_.condition.getValue()]], 'if', node_.body),
      )
    }

    // General path: per-arm flag score + flat top-level executes.
    const flags: Score[] = nodes
      .filter((n): n is IfNode => n instanceof IfNode)
      .map((_, i) => this.core.pack.Variable(undefined, `flow_flag_${i}`))

    const result: Node[] = []

    nodes.forEach((node, i) => {
      if (!(node instanceof IfNode)) return

      const gateParts: string[] = []
      // Gate on every earlier arm's flag being 0 (i.e. earlier arm didn't fire).
      for (let j = 0; j < i; j++) {
        gateParts.push(`if score ${flags[j]} matches 0`)
      }
      // Gate on this arm's condition.
      gateParts.push(node.condition.getValue())

      // `store success` FIRST so it captures the success of every gate
      // that follows. When all gates pass, flag_i becomes 1.
      const flagSetter = flatExecute(
        this.pack,
        [[`store success score ${flags[i].toString()}`, ...gateParts]],
        i === 0 ? 'if' : 'elseif',
        [],
      )
      const visitedSetter = this.visit(flagSetter)
      result.push(...(Array.isArray(visitedSetter) ? visitedSetter : [visitedSetter]))
    })

    nodes.forEach((node, i) => {
      const isElse = node instanceof ElseNode
      const armFlagIndex = nodes.slice(0, i + 1).filter((n) => n instanceof IfNode).length - 1

      let gate: string
      if (!isElse) {
        gate = `if score ${flags[armFlagIndex]} matches 1`
      } else {
        // Else fires when no earlier arm fired: every flag must be 0.
        // Use `matches 0` (NOT `0..`) so a non-zero flag suppresses else.
        const parts: string[] = []
        for (let j = 0; j < flags.length; j++) {
          parts.push(`if score ${flags[j]} matches 0`)
        }
        gate = parts.join(' ')
      }

      const callbackName = !isElse ? (i === 0 ? 'if' : 'elseif') : 'else'

      for (const cmd of node.body) {
        const bodyExec = flatExecute(this.pack, [[gate]], `${callbackName}_body`, [cmd])
        const visited = this.visit(bodyExec)
        result.push(...(Array.isArray(visited) ? visited : [visited]))
      }
    })

    return result
  }
}