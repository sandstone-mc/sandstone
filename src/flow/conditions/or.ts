import type { SandstoneCore } from 'sandstone/core'
import * as util from 'util'
import { formatDebugString } from '../../utils'
import { ConditionNode } from './condition'

export class OrNode extends ConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public conditions: ConditionNode[],
  ) {
    super(sandstoneCore)
  }

  getValue = (_negated?: boolean | undefined) => {
    throw new Error('Minecraft does not support OR conditions. This should never happen and must be processed.')
  };

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(this.constructor.name, this.conditions, undefined, options.indent)
  }
}
