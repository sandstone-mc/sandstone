import * as util from 'util'

import type { MCFunctionNode, SandstoneCore } from '../core'
import { ContainerNode } from '../core'
import type { Node } from '../core/nodes'
import type { SandstoneCommands, ExecuteCommandNode } from 'sandstone/commands'
import { FinalCommandOutput, ReturnCommandNode, ReturnRunCommandNode } from 'sandstone/commands'
import { makeCallable } from 'sandstone/utils'
import { formatDebugString } from '../utils'
import type { ConditionNode } from './conditions'
import { conditionToNode, NO_CALLBACK_SENTINEL, type Condition } from './Flow'

/**
 * Shared base for `IfNode` / `ElseNode`.
 *
 * A clause body can be given either as a callback (`_.if(cond, () => {...})`,
 * `.elseIf(cond, cb)`, `.else(cb)`) or as a single command reached through
 * `.run` — spelled `.run.<command>` on an `if` / `elseIf`, and
 * `.else.run.<command>` on an `else`. The statement chain ends at that
 * command: `.run.<command>` returns the command's `FinalCommandOutput`, not
 * the `IfStatement`, so `.else` / `.elseIf` have to hang off the callback form
 * or off a separately held statement.
 *
 * `.run` hands back the raw `SandstoneCommands` object so that a command's own
 * chain (`.run.execute.as('@a').at('@s').run.say(...)`) resolves normally.
 * That means the proxy can't tell when the chain is done, so the clause node
 * closes the context itself: the first node committed into its body pops back
 * to the depth recorded by `enterSingleCommand`.
 *
 * Mirrors `ExecuteCommandNode`'s single-execute handling.
 */
export abstract class FlowClauseNode extends ContainerNode {
  /** MCFunction whose context stack `enterSingleCommand` pushed onto. */
  private singleCommandFunction: MCFunctionNode | null = null

  /** Context depth to pop back to once a command lands in the body. */
  private singleCommandDepth = 0

  /**
   * Whether this node already sits in a parent body. `IfNode` built without a
   * callback is not committed by its constructor, so the first
   * `enterSingleCommand` has to add it; re-entering must not add it twice.
   */
  protected addedToBody = false

  /**
   * True when the user committed any form of `return` (`return` /
   * `return N` / `return fail` / `return run …`) into this clause's body.
   * Used by `IfElseTransformationVisitor` to keep the resulting execute
   * inline in the parent MCFunction rather than extracting it to a child —
   * a child MCFunction's return only escapes the child, but the user's
   * `return` must escape the parent.
   * @internal
   */
  bareReturn: boolean = false

  /**
   * Push this node onto `parentMCFunction`'s context stack so the next
   * committed command lands in `this.body`. `append` pops it back off.
   *
   * @internal
   */
  enterSingleCommand = (parentMCFunction: MCFunctionNode) => {
    if (this.singleCommandFunction) {
      // Context is already open from a previous property access.
      return
    }

    this.singleCommandFunction = parentMCFunction
    this.singleCommandDepth = parentMCFunction.contextStack.length
    parentMCFunction.enterContext(this, !this.addedToBody)
    this.addedToBody = true
  }

  append = (...nodes: Node[]) => {
    this.body.push(...nodes)

    const parentMCFunction = this.singleCommandFunction
    if (parentMCFunction) {
      this.singleCommandFunction = null

      // Pop the whole way back rather than a single level: a sleep (or any
      // other await) inside the command enters its own context without
      // balancing it, which would otherwise leave `this` on the stack.
      parentMCFunction.popToDepth(this.singleCommandDepth)
    }

    return (nodes.length === 1 ? nodes[0] : nodes) as any
  }
}

export class IfNode extends FlowClauseNode {
  nextFlowNode?: IfNode | ElseNode

  _isElseIf = false

  parentMCFunction: MCFunctionNode

  /** Optional callback name override (e.g., 'loop' for loop transformations) */
  givenCallbackName?: string

  /** Set by IfElseTransformationVisitor to the resulting ExecuteCommandNode */
  resultingExecuteNode?: ExecuteCommandNode

  constructor(
    sandstoneCore: SandstoneCore,
    public condition: ConditionNode,
    public callback?: () => void,
    parentMCFunction?: MCFunctionNode,
  ) {
    super(sandstoneCore)

    this.parentMCFunction = parentMCFunction ?? sandstoneCore.getCurrentMCFunctionOrThrow()

    if (callback === NO_CALLBACK_SENTINEL) {
      // No callback supplied — `_.if(cond)` form, expecting the user to
      // chain `.run.<cmd>` or `.return(...)` after. Add the IfNode to the
      // parent MCFunction body immediately so the visitor (or any later
      // check) can see it. If body stays empty at visit time, the
      // empty-body check in `IfElseTransformationVisitor` throws.
      this.parentMCFunction.appendNode(this)
      this.addedToBody = true
      return
    }

    if (callback) {
      // Generate the body of the If node. Awaits inside the callback
      // enter their own context without balancing it — `balanceContext`
      // pops the whole stack back to the pre-enter depth for us.
      this.parentMCFunction.balanceContext(this, callback)
      this.addedToBody = true

      // Reject a callback whose entire body is a `return` / `return run …`.
      // Such a callback only escapes the if-body, not the parent MCFunction,
      // because there's no `execute` wrapper around it — it commits directly
      // to the clause body. The user almost certainly meant
      // `_.if(cond).return(...)` (or `.return.run.<cmd>`) instead, which
      // routes through the if-transformation visitor and gets a proper
      // `execute … run return …` form. Allowed: `_.if(cond).run.returnCmd`
      // — no callback, commits via the run proxy.
      if (
        this.body.length === 1
        && (this.body[0] instanceof ReturnCommandNode || this.body[0] instanceof ReturnRunCommandNode)
      ) {
        throw new Error(
          `Flow anti-pattern detected. Did you mean \`_.if(cond).return()\`, `
          + `\`\.return.run.<cmd>\`, or \`_.if(cond).run.returnCmd()\`? MC return inside a Flow callback `
          + `is only allowed to interrupt flow inside of the callback's context, not the host context.`,
        )
      }

      // Reject an empty callback body — `_.if(cond, () => {})` is a bug
      // (user wrote an explicit empty callback). Detected here because the
      // body is fully populated by `balanceContext` and won't change.
      // The clause type (if / elseIf / else) is reported as "Flow clause" since
      // the constructor doesn't distinguish them — `elseIf`/`else` paths
      // construct this same `IfNode`.
      if (this.body.length === 0) {
        throw new Error(
          `Flow clause body is empty. Add at least one command to it (or remove the branch).`,
        )
      }
    }
  }

  getValue = () => {
    throw new Error('Minecraft does not support if statements. This must be postprocessed.')
  };

  [util.inspect.custom](depth: number, options: any) {
    const indent = options.indent || ''
    const currentFormatting = formatDebugString(
      this.constructor.name,
      {
        condition: this.condition,
        isElseIf: this._isElseIf,
      },
      this.body,
      indent,
    )

    if (!this.nextFlowNode) {
      return currentFormatting
    }

    const nextFormatting = util.inspect(this.nextFlowNode, options)

    return `${currentFormatting}\n${indent}${nextFormatting}`
  }
}

type RunProxy = SandstoneCommands<false>

/**
 * Returned by `ElseProxy.return` (i.e. `_.if(cond, cb).else.return`). Callable
 * for `return [value]`, plus `.run.<cmd>` and `.fail()`. No chain-extension
 * methods (`elseIf` / `else`) — an else branch is the chain terminus.
 */
type ElseReturnInterface = {
  readonly run: SandstoneCommands<false>
  fail: () => FinalCommandOutput
} & ((value?: number) => ElseReturnInterface)

type ElseProxy = {
  readonly run: SandstoneCommands<false>
  readonly return: ElseReturnInterface
} & ((callback: () => void) => any)

/**
 * Returned by `IfStatement.return`. Combines a `ReturnCommand`-shaped surface
 * (callable for `return [value]`, plus `.run.<cmd>` and `.fail()`) with the
 * `.elseIf` / `.else` methods that extend the chain. Both callable forms
 * (`if(A).return()` and `if(A).return(15)`) commit their node and hand back
 * the chain-extending subset (`elseIf` + `else`) so `.else(cb)` can follow.
 */
type IfReturnInterface<R extends boolean> = R extends true
  ? {
      readonly run: SandstoneCommands<false>
      fail: () => FinalCommandOutput
      elseIf: IfStatement<R>['elseIf']
      else: ElseProxy
    } & ((
      value?: number,
    ) => {
      elseIf: IfStatement<R>['elseIf']
      else: ElseProxy
    })
  : never

export class IfStatement<R extends boolean = true> {
  protected node: IfNode

  constructor(
    protected sandstoneCore: SandstoneCore,
    protected condition: ConditionNode,
    protected callback: () => void,
  ) {
    this.node = new IfNode(sandstoneCore, condition, callback)
  }

  get run(): R extends true ? RunProxy : never {
    return this._buildRun(this.node, this.node.parentMCFunction) as R extends true ? RunProxy : never
  }

  /**
   * Open the else branch on a callback-supplied if. Gated by `R extends false`
   * (callback provided) — chaining `.else` onto `_.if(cond)` (no callback,
   * no `.run`) is a type error because the if branch has no body to contrast
   * against.
   */
  get else(): R extends false ? ElseProxy : never {
    return this._buildElse() as unknown as R extends false ? ElseProxy : never
  }

  /** Callback provided — open elseIf with a body. */
  elseIf(
    condition: Condition,
    callback: () => void,
  ): R extends false ? IfStatement<false> : never
  /** Callback provided on parent — open elseIf without a body. */
  elseIf(condition: Condition): R extends false ? IfStatement<true> : never
  elseIf(
    condition: Condition,
    callback?: () => void,
  ): IfStatement<boolean> {
    const cb = callback ?? NO_CALLBACK_SENTINEL
    const statement = new IfStatement<boolean>(
      this.sandstoneCore,
      conditionToNode(condition),
      cb,
    )
    this.node.nextFlowNode = statement.getNode()
    statement.node._isElseIf = true

    return statement as IfStatement<boolean>
  }

  get return(): IfReturnInterface<R> {
    const sandstoneCore = this.sandstoneCore
    const ifNode = this.node
    const parentMCFunction = ifNode.parentMCFunction

    const elseIf = this.elseIf.bind(this)
    const elseProxyGetter = (): ElseProxy => this.else

    const result = makeCallable(
      {
        run: new Proxy(sandstoneCore.pack.commands, {
          get: (target, p, receiver) => {
            if (typeof p === 'symbol' || !(p in target)) {
              return Reflect.get(target, p, receiver)
            }

            ifNode.enterSingleCommand(parentMCFunction)

            const returnRun = new ReturnRunCommandNode(
              sandstoneCore.pack,
              false,
              ['run'],
              { isSingleExecute: true, isFlowControl: true },
            )
            ifNode.append(returnRun)
            ifNode.bareReturn = true
            parentMCFunction.contextStack.push(returnRun)

            return (target as any)[p]
          },
        }) as SandstoneCommands<false>,
        fail: () => {
          ifNode.enterSingleCommand(parentMCFunction)
          const returnCmdNode = new ReturnCommandNode(sandstoneCore.pack, ['fail'])
          returnCmdNode.commit()
          ifNode.bareReturn = true
          return new FinalCommandOutput(returnCmdNode)
        },
        elseIf,
        // Don't put `else` here — `Object.assign` inside `makeCallable` would
        // invoke a getter immediately, building the ElseNode and linking it
        // onto the chain. Define it as a lazy getter on the result instead.
      },
      ((value?: number) => {
        ifNode.enterSingleCommand(parentMCFunction)
        const returnCmdNode = new ReturnCommandNode(sandstoneCore.pack, [value ?? 0])
        returnCmdNode.commit()
        ifNode.bareReturn = true
        return {
          elseIf,
          get else() {
            return elseProxyGetter()
          },
        }
      }),
    ) as IfReturnInterface<R>
    // Attach `else` lazily so reading `.return.else` builds the ElseProxy on
    // demand rather than eagerly.
    Object.defineProperty(result, 'else', {
      get: () => elseProxyGetter(),
      enumerable: true,
      configurable: true,
    })
    return result
  }

  private _buildRun(
    clauseNode: FlowClauseNode,
    parentMCFunction: MCFunctionNode,
  ): RunProxy {
    const commandsSource = this.sandstoneCore.pack.commands as SandstoneCommands<false>

    const commands = new Proxy(commandsSource, {
      get: (target, p, receiver) => {
        // Don't open a context for incidental probes (util.inspect, `then`
        // on await, ...) — only for real command accesses.
        if (typeof p === 'symbol' || !(p in target)) {
          return Reflect.get(target, p, receiver)
        }

        clauseNode.enterSingleCommand(parentMCFunction)

        // Hand back the raw command object so the command's own chain
        // resolves (`.run.execute.as('@a').at('@s').run.say(...)`).
        // `clauseNode.append` closes the context once the command commits.
        return (target as any)[p]
      },
    }) as SandstoneCommands<false>

    return commands as RunProxy
  }

  private _buildElse(): ElseProxy {
    const sandstoneCore = this.sandstoneCore
    const parentMCFunction = this.node.parentMCFunction

    const elseNode = new ElseNode(sandstoneCore, () => {})
    this.node.nextFlowNode = elseNode

    const commandsSource = sandstoneCore.pack.commands as SandstoneCommands<false>

    const commands = new Proxy(commandsSource, {
      get: (target, p, receiver) => {
        // `ElseProxy` exposes the body as `.else.run.<command>`, so `run` is a
        // self-reference: it yields this same proxy, and the command accessed
        // off it is what opens the clause context below.
        if (p === 'run') return commands

        if (typeof p === 'symbol' || !(p in target)) {
          return Reflect.get(target, p, receiver)
        }

        elseNode.enterSingleCommand(parentMCFunction)

        return (target as any)[p]
      },
    }) as SandstoneCommands<false>

    // `.else.return` — early return scoped to the else body. Same shape as
    // `IfStatement.return` (callable for `return [value]`, plus `.run.<cmd>`
    // and `.fail()`), minus `.elseIf` / `.else` since the else branch is the
    // chain terminus.
    const returnRunProxy = new Proxy(commandsSource, {
      get: (target, p, receiver) => {
        if (typeof p === 'symbol' || !(p in target)) {
          return Reflect.get(target, p, receiver)
        }

        elseNode.enterSingleCommand(parentMCFunction)

        const returnRun = new ReturnRunCommandNode(
          sandstoneCore.pack,
          false,
          ['run'],
          { isSingleExecute: true, isFlowControl: true },
        )
        elseNode.append(returnRun)
        elseNode.bareReturn = true
        parentMCFunction.contextStack.push(returnRun)

        return (target as any)[p]
      },
    }) as SandstoneCommands<false>

    const failFn = (): FinalCommandOutput => {
      elseNode.enterSingleCommand(parentMCFunction)
      const returnCmdNode = new ReturnCommandNode(sandstoneCore.pack, ['fail'])
      returnCmdNode.commit()
      elseNode.bareReturn = true
      return new FinalCommandOutput(returnCmdNode)
    }

    // Self-referencing callable: calling `return()` or `return(N)` commits
    // the return node and hands `returnInterface` back for further chaining
    // (e.g. `.else.return().run.<cmd>` — though the chain is terminal since
    // there are no elseIf/else methods here).
    const returnInterface = makeCallable(
      { run: returnRunProxy, fail: failFn },
      ((value?: number): any => {
        elseNode.enterSingleCommand(parentMCFunction)
        const returnCmdNode = new ReturnCommandNode(sandstoneCore.pack, [value ?? 0])
        returnCmdNode.commit()
        elseNode.bareReturn = true
        return returnInterface
      }),
    ) as ElseReturnInterface

    return makeCallable(
      { run: commands, return: returnInterface },
      (callback: () => void): FinalCommandOutput => {
        parentMCFunction.balanceContext(elseNode, callback)
        // Reject a callback whose entire body is a `return` / `return run …`.
        // Same rationale as the IfNode constructor check — the user almost
        // certainly meant `_.if(cond, cb1).else.return(...)` instead.
        if (
          elseNode.body.length === 1
          && (elseNode.body[0] instanceof ReturnCommandNode || elseNode.body[0] instanceof ReturnRunCommandNode)
        ) {
          throw new Error(
            `Flow anti-pattern detected. Did you mean \`_.if(cond, cb1).else.return()\`, `
            + `\`\.else.return.run.<cmd>\`, or \`_.if(cond, cb1).else.run.returnCmd()\`? MC return inside a Flow callback `
            + `is only allowed to interrupt flow inside of the callback's context, not the host context.`,
          )
        }
        return new FinalCommandOutput(elseNode as any)
      },
      true,
    ) as unknown as ElseProxy
  }

  protected getNode = () => this.node
}

export class ElseNode extends FlowClauseNode {
  constructor(sandstoneCore: SandstoneCore, callback: () => void) {
    super(sandstoneCore)

    // Generate the body of the Else node. Awaits inside the callback
    // enter their own context without balancing it — `balanceContext`
    // pops the whole stack back to the pre-enter depth for us.
    const currentNode = this.sandstoneCore.getCurrentMCFunctionOrThrow()
    currentNode.balanceContext(this, callback)
    this.addedToBody = true
  }

  /** @internal */
  getValue = () => null
}

export class ElseStatement {
  protected node: ElseNode

  constructor(
    protected sandstoneCore: SandstoneCore,
    protected callback: () => void,
  ) {
    // Generate the body of the If node.
    this.node = new ElseNode(sandstoneCore, callback)
  }

  /** @internal */
  getNode = () => this.node
}
