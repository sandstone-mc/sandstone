import { ContainerNode } from '../../nodes'
import { ResourceClass } from '../resource'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import type { FontProvider } from '#arguments'

/**
 * A node representing a Minecraft font definition.
 */
export class FontNode extends ContainerNode implements ResourceNode<FontClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: FontClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.fontJSON)
}

export type FontArguments = {
  /**
   * The font's JSON.
   */
  providers: FontProvider[] | []

} & ResourceClassArguments<'list'>

export class FontClass extends ResourceClass<FontNode> implements ListResource {
  fontJSON: { providers: FontArguments['providers'] }

  constructor(core: SandstoneCore, name: string, args: FontArguments) {
    super(core, { packType: core.pack.resourcePack }, FontNode, core.pack.resourceToPath(name, ['font']), args)

    this.fontJSON = { providers: args.providers }
  }

  push() {}

  unshift() {}
}
