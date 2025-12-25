import { reset } from 'chalk'
import * as util from 'util'

import type { Node, SandstoneCore } from '../core'
import { ContainerNode } from '../core'
import { formatDebugString } from '../utils'
import type { ConditionNode } from './conditions'
import type { Condition } from './Flow'

export class IfNode extends ContainerNode {
  nextFlowNode?: IfNode | ElseNode

  _isElseIf = false

  constructor(
    sandstoneCore: SandstoneCore,
    public condition: ConditionNode,
    public callback?: () => void,
  ) {
    super(sandstoneCore)

    if (callback && callback.toString() !== '() => {}') {
      // Generate the body of the If node.
      this.sandstoneCore.insideContext(this, callback, true)
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
      this.sandstoneCore.pack.flow.conditionToNode(condition),
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

    // Generate the body of the If node.
    this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(this)
    callback()
    this.sandstoneCore.currentMCFunction?.exitContext()
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
