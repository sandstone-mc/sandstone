// Block tag (~ ~ ~), Entity tag (@s)

import type { SandstoneCore } from 'sandstone/core'
import { SingleConditionNode } from '../condition'
import { targetParser } from 'sandstone/variables'

export class TagConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public type: 'block' | 'entity_type',
    public tag: `#${string}:${string}`,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    if (this.type === 'block') {
      return ['block', '~ ~ ~', this.tag]
    }
    return ['entity', targetParser(this.sandstoneCore.pack.Selector('@s', { type: this.tag }))]
  }
}
