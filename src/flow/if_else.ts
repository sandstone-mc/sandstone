import { ContainerNode } from '../core/index.js'

import type { SandstoneCore } from '../core/index.js'
import type { ConditionNode } from './conditions/index.js'
import type { Condition } from './Flow.js'

export class IfNode extends ContainerNode {
  nextFlowNode?: IfNode | ElseNode

  protected _isElseIf = false

  constructor(sandstoneCore: SandstoneCore, public condition: ConditionNode, public callback: () => void, reset = false) {
    super(sandstoneCore)

    const currentNode = this.sandstoneCore.getCurrentMCFunctionOrThrow()

    if (reset) {
      currentNode.resource.push(() => sandstoneCore.pack.flowVariable.reset())
    }

    if (callback.toString() !== '() => {}') {
      // Generate the body of the If node.
      currentNode.enterContext(this)
      this.callback()
      currentNode.exitContext()
    }
  }

  getValue = () => {
    throw new Error('Minecraft does not support if statements. This must be postprocessed.')
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
