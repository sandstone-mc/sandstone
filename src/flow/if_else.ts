import { ContainerNode } from '../core'

import type { SandstoneCore } from '../core'
import type { ConditionNode } from './conditions'

export class IfNode extends ContainerNode {
  nextFlowNode?: IfNode | ElseNode

  constructor(sandstoneCore: SandstoneCore, public condition: ConditionNode, public callback: () => void) {
    super(sandstoneCore)

    // Generate the body of the If node.
    this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(this)
    this.callback()
    this.sandstoneCore.currentMCFunction?.exitContext()
  }

  getValue = () => {
    throw new Error('Minecraft does not support if statements. This must be postprocessed.')
  }
}

export class IfStatement {
  public node: IfNode

  constructor(public sandstoneCore: SandstoneCore, public condition: ConditionNode, public callback: () => void) {
    // Generate the body of the If node.
    this.node = new IfNode(sandstoneCore, condition, callback)
  }

  elseIf = (condition: ConditionNode, callback: () => void) => {
    const statement = new IfStatement(this.sandstoneCore, condition, callback)
    this.node.nextFlowNode = statement['getNode']()
    return statement
  }

  else = (callback: () => void) => {
    const statement = new ElseStatement(this.sandstoneCore, callback)
    this.node.nextFlowNode = statement['getNode']()
    return statement
  }

  public getNode = () => this.node
}

export class ElseNode extends ContainerNode {
  constructor(sandstoneCore: SandstoneCore, public callback: () => void) {
    super(sandstoneCore)

    // Generate the body of the If node.
    this.sandstoneCore.getCurrentMCFunctionOrThrow().enterContext(this)
    this.callback()
    this.sandstoneCore.currentMCFunction?.exitContext()
  }

  getValue = () => {
    throw new Error('Minecraft does not support else statements. This must be postprocessed.')
  }
}

export class ElseStatement {
  public node: ElseNode

  constructor(public sandstoneCore: SandstoneCore, public callback: () => void) {
    // Generate the body of the If node.
    this.node = new ElseNode(sandstoneCore, callback)
  }

  public getNode = () => this.node
}
