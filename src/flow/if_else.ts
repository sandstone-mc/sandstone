import { reset } from 'chalk/index.js'
import { ContainerNode } from '../core/index.js'

import type { Node, SandstoneCore } from '../core/index.js'
import type { ConditionNode } from './conditions/index.js'
import type { Condition } from './Flow.js'
import * as util from 'node:util'
import { formatDebugString } from '../utils.js'

export class IfNode extends ContainerNode {
  nextFlowNode?: IfNode | ElseNode

  protected _isElseIf = false

  constructor(sandstoneCore: SandstoneCore, public condition: ConditionNode, public callback?: () => void) {
    super(sandstoneCore)

    if (callback && callback.toString() !== '() => {}') {
      // Generate the body of the If node.
      this.sandstoneCore.insideContext(this, callback, true)
    }
  }

  getValue = () => {
    throw new Error('Minecraft does not support if statements. This must be postprocessed.')
  }

  [util.inspect.custom](depth: number, options: any) {
    const indent = options.indent || ''
    const currentFormatting = formatDebugString(this.constructor.name, {
      condition: this.condition,
      isElseIf: this._isElseIf,
    }, this.body, indent)

    if (!this.nextFlowNode) {
      return currentFormatting
    }

    const nextFormatting = util.inspect(this.nextFlowNode, options)

    return `${currentFormatting}\n${indent}${nextFormatting}`
  }
}

export class IfStatement {
  protected node: IfNode

  constructor(protected sandstoneCore: SandstoneCore, protected condition: ConditionNode, protected callback: () => void) {
    // Generate the body of the If node.
    this.node = new IfNode(sandstoneCore, condition, callback)
  }

  elseIf = (condition: Condition, callback: () => void) => {
    const statement = new IfStatement(this.sandstoneCore, this.sandstoneCore.pack.flow.conditionToNode(condition), callback)
    this.node.nextFlowNode = statement['getNode']()

    statement.node['_isElseIf'] = true

    return statement
  }

  else = (callback: () => void) => {
    const statement = new ElseStatement(this.sandstoneCore, callback)
    this.node.nextFlowNode = statement['getNode']()
    return statement
  }

  protected getNode = () => this.node
}

export class ElseNode extends ContainerNode {
  constructor(sandstoneCore: SandstoneCore, public callback: () => void) {
    super(sandstoneCore)

    // Generate the body of the If node.
    this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(this)
    this.callback()
    this.sandstoneCore.currentMCFunction?.exitContext()
  }

  getValue = () => null
}

export class ElseStatement {
  protected node: ElseNode

  constructor(protected sandstoneCore: SandstoneCore, protected callback: () => void) {
    // Generate the body of the If node.
    this.node = new ElseNode(sandstoneCore, callback)
  }

  protected getNode = () => this.node
}
