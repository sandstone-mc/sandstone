import * as util from 'util'

import type { MCFunctionNode, SandstoneCore } from '../core'
import { ContainerNode } from '../core'
import type { Node } from '../core/nodes'
import type { SandstoneCommands, ExecuteCommandNode } from 'sandstone/commands'
import { FinalCommandOutput } from 'sandstone/commands'
import { makeCallable } from 'sandstone/utils'
import { formatDebugString } from '../utils'
import type { ConditionNode } from './conditions'
import { conditionToNode, type Condition } from './Flow'

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
      while (parentMCFunction.contextStack.length > this.singleCommandDepth) {
        parentMCFunction.exitContext()
      }
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

    if (callback && callback.toString() !== '() => {}') {
      // Generate the body of the If node. Sleep nodes (and other awaits)
      // inside the callback enter their own context without balancing it,
      // so a single `exitContext()` after `loopback()` would only pop the
      // topmost context (the await's) — leaving `this` (LoopNode) on the
      // stack, which causes post-loop commands to be appended to the
      // loop's body instead of the parent MCFunction. Pop until we're back
      // at the parent's depth.
      const currentNode = this.parentMCFunction
      const parentDepth = currentNode.contextStack.length
      currentNode.enterContext(this)
      this.addedToBody = true
      callback()
      while (currentNode.contextStack.length > parentDepth) {
        currentNode.exitContext()
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
type ElseProxy = { readonly run: SandstoneCommands<false> } & ((callback: () => void) => FinalCommandOutput)

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

  get else(): ElseProxy {
    return this._buildElse() as unknown as ElseProxy
  }

  /** Callback provided — clause body is set; `.run` is unavailable. */
  elseIf(condition: Condition, callback: () => void): IfStatement<false>
  /** No callback — clause body is supplied via `.run`. */
  elseIf(condition: Condition): IfStatement<true>
  elseIf(
    condition: Condition,
    callback?: () => void,
  ): IfStatement<boolean> {
    const cb = callback ?? (() => {})
    const statement = new IfStatement<boolean>(
      this.sandstoneCore,
      conditionToNode(condition),
      cb,
    )
    this.node.nextFlowNode = statement.getNode()
    statement.node._isElseIf = true

    return statement as IfStatement<boolean>
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
    const elseNode = new ElseNode(this.sandstoneCore, () => {})
    this.node.nextFlowNode = elseNode
    const parentMCFunction = this.node.parentMCFunction

    const commandsSource = this.sandstoneCore.pack.commands as SandstoneCommands<false>

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

    return makeCallable(
      commands,
      (callback: () => void): FinalCommandOutput => {
        const parentDepth = parentMCFunction.contextStack.length
        parentMCFunction.enterContext(elseNode)
        callback()
        while (parentMCFunction.contextStack.length > parentDepth) {
          parentMCFunction.exitContext()
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

    // Generate the body of the If node. Pop the stack fully (not just one
    // level) so awaits inside the callback don't leak into the parent.
    const currentNode = this.sandstoneCore.getCurrentMCFunctionOrThrow()
    const parentDepth = currentNode.contextStack.length
    currentNode.enterContext(this)
    this.addedToBody = true
    callback()
    while (currentNode.contextStack.length > parentDepth) {
      currentNode.exitContext()
    }
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
