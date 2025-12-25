import type { SandstoneCore } from 'sandstone/core'
import type { Score } from 'sandstone/variables/Score'
import * as util from 'util'
import { ScoreboardCommandNode } from '../../commands/implementations/entity/scoreboard'
import { formatDebugString } from '../../utils'
import { IfNode } from '../if_else'
import { ConditionNode } from './condition'

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
