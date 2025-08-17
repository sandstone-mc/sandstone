import type { SandstoneCore } from 'sandstone/core'
import type { Score } from 'sandstone/variables/Score.js'
import * as util from 'util'
import { ScoreboardCommandNode } from '../../commands/implementations/entity/scoreboard.js'
import { formatDebugString } from '../../utils.js'
import { IfNode } from '../if_else.js'
import { ConditionNode } from './condition.js'

export class OrNode extends ConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public conditions: ConditionNode[],
  ) {
    super(sandstoneCore)
  }

  getValue = (negated?: boolean | undefined) => {
    throw new Error('Minecraft does not support OR conditions. This must be processed.')
  };

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(this.constructor.name, this.conditions, undefined, options.indent)
  }
}
