import { ContainerNode } from '../../nodes.js'
import { ResourceClass } from '../resource.js'

import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource.js'
import type { FontProvider } from 'sandstone/arguments/index.js'

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
    super(core, { packType: core.pack.resourcePack() }, FontNode, core.pack.resourceToPath(name, ['font']), args)

    this.fontJSON = { providers: args.providers }

    this.handleConflicts()
  }

  push(...providers: FontProvider[] | FontClass[]) {
    if (providers[0] instanceof FontClass) {
      for (const provider of providers) {
        /** @ts-ignore */
        this.fontJSON.providers.push(...provider.fontJSON.providers)
      }
    } else {
      /** @ts-ignore */
      this.fontJSON.providers.push(...providers)
    }
  }

  unshift(...providers: FontProvider[] | FontClass[]) {
    if (providers[0] instanceof FontClass) {
      for (const provider of providers) {
        /** @ts-ignore */
        this.fontJSON.providers.unshift(...provider.fontJSON.providers)
      }
    } else {
      /** @ts-ignore */
      this.fontJSON.providers.unshift(...providers)
    }
  }
}
