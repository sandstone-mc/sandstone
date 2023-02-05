import { ConditionNode } from './condition'

import type { SandstoneCore } from '#core'

export class OrNode extends ConditionNode {
  constructor(sandstoneCore: SandstoneCore, public conditions: ConditionNode[]) {
    super(sandstoneCore)
  }

  getValue = (negated?: boolean | undefined) => {
    throw new Error('OR conditions must be postprocessed.')
  }
}
