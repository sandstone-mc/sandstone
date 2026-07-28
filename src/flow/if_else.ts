import * as util from 'util'

import type { MCFunctionNode, SandstoneCore } from '../core'
import { ContainerNode } from '../core'
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
  resultingExecuteNode?: import('sandstone/commands').ExecuteCommandNode

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
      // so a single `exitContext()` would leave them on the stack and
      // swallow any post-`_.if(...)` commands into the await node. Pop
      // until we're back at the parent depth.
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

export class IfStatement {
  protected node: IfNode

  constructor(
    protected sandstoneCore: SandstoneCore,
    protected condition: ConditionNode,
    protected callback: () => void,
  ) {
    // Generate the body of the If node.
    this.node = new IfNode(sandstoneCore, condition, callback)
  }

  elseIf = (condition: Condition, callback: () => void) => {
    const statement = new IfStatement(
      this.sandstoneCore,
      conditionToNode(condition),
      callback,
    )
    this.node.nextFlowNode = statement.getNode()

    statement.node._isElseIf = true

    return statement
  }

  else = (callback: () => void) => {
    const statement = new ElseStatement(this.sandstoneCore, callback)
    this.node.nextFlowNode = statement.getNode()
    return statement
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
