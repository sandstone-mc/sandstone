// Block tag (~ ~ ~), Entity tag (@s)

import type { SandstoneCore } from 'sandstone/core'
import { NamespacedString } from 'sandstone/utils'
import { SingleConditionNode } from '../condition'

export class TagConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public type: 'block' | 'entity_type',
    public tag: NamespacedString,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    if (this.type === 'block') {
      return ['block', '~ ~ ~', `#${this.tag}`]
    }
    return ['entity', this.sandstoneCore.pack.Selector('@s', { type: `#${this.tag}` })]
  }
}
