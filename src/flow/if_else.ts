import * as util from 'util'

import type { MCFunctionNode, SandstoneCore } from '../core'
import { ContainerNode } from '../core'
import type { SandstoneCommands, ExecuteCommandNode } from 'sandstone/commands'
import { FinalCommandOutput } from 'sandstone/commands'
import { makeCallable } from 'sandstone/utils'
import { formatDebugString } from '../utils'
import type { ConditionNode } from './conditions'
import { conditionToNode, type Condition } from './Flow'

export class IfNode extends ContainerNode {
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
    clauseNode: ContainerNode,
    parentMCFunction: MCFunctionNode,
  ): RunProxy {
    const commandsSource = this.sandstoneCore.pack.commands as SandstoneCommands<false>

    const commands = new Proxy(commandsSource, {
      get: (_t, p, _r) => {
        const parentDepth = parentMCFunction.contextStack.length
        parentMCFunction.enterContext(clauseNode)
        return (...args: unknown[]) => {
          const result = (commandsSource as any)[p](...args)
          while (parentMCFunction.contextStack.length > parentDepth) {
            parentMCFunction.exitContext()
          }
          return result
        }
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
      get: (_t, p, _r) => {
        if (p === 'run') return commands
        const parentDepth = parentMCFunction.contextStack.length
        parentMCFunction.enterContext(elseNode)
        return (...args: unknown[]) => {
          const result = (commandsSource as any)[p](...args)
          while (parentMCFunction.contextStack.length > parentDepth) {
            parentMCFunction.exitContext()
          }
          return result
        }
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

export class ElseNode extends ContainerNode {
  constructor(sandstoneCore: SandstoneCore, callback: () => void) {
    super(sandstoneCore)

    // Generate the body of the If node. Pop the stack fully (not just one
    // level) so awaits inside the callback don't leak into the parent.
    const currentNode = this.sandstoneCore.getCurrentMCFunctionOrThrow()
    const parentDepth = currentNode.contextStack.length
    currentNode.enterContext(this)
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
