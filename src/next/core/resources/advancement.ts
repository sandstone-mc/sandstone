import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { AdvancementJSON } from '@arguments'
import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'

/**
 * A node representing a Minecraft function.
 */
export class AdvancementNode extends ContainerNode implements ResourceNode<AdvancementClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: AdvancementClass) {
    super(sandstoneCore)
  }

  toString = () => JSON.stringify(this.resource)
}

export type AdvancementClassArguments<CriteriaNames extends string = string> = {
  /**
   * The advancement's JSON.
   */
  advancement: AdvancementJSON<CriteriaNames>
} & ResourceClassArguments

export class AdvancementClass<CriteriaNames extends string = string> extends ResourceClass<AdvancementNode> {
  public advancementJSON: NonNullable<AdvancementClassArguments['advancement']>

  constructor(sandstoneCore: SandstoneCore, public name: string, args: AdvancementClassArguments<CriteriaNames>) {
    super(sandstoneCore, AdvancementNode, name, args)

    this.advancementJSON = args.advancement
  }
}
