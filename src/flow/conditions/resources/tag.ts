// Block tag (~ ~ ~), Entity tag (@s)

import type { SandstoneCore } from 'sandstone/core'
import { SingleConditionNode } from '../condition.js'

export class TagConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public type: 'blocks' | 'entity_types',
    public tag: string,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    if (this.type === 'blocks') {
      return ['block', '~ ~ ~', `#${this.tag}`]
    }
    return ['entity', this.sandstoneCore.pack.Selector('@s', { type: `#${this.tag}` })]
  }
}
