import { SingleConditionNode } from '../condition'

import type { SandstoneCore } from '#core'

export class AdvancementConditionNode extends SingleConditionNode {
  protected advancementArgument: any

  constructor(sandstoneCore: SandstoneCore, advancement: string, criteria?: string) {
    super(sandstoneCore)

    if (criteria) {
      this.advancementArgument = {}
      this.advancementArgument[advancement] = {}
      this.advancementArgument[advancement][criteria] = true
    } else {
      this.advancementArgument = {}
      this.advancementArgument[advancement] = true
    }
  }

  getCondition(): unknown[] {
    return ['entity', this.sandstoneCore.pack.Selector('@s', { advancements: this.advancementArgument })]
  }
}
