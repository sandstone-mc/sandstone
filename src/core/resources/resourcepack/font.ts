import { RESOURCE_PATHS } from 'sandstone/arguments'
import type { GlyphProvider } from 'sandstone/arguments/generated/assets/font'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft font definition.
 */
export class FontNode extends ContainerNode implements ResourceNode<FontClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: FontClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.fontJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type FontArguments = {
  /**
   * The font's JSON.
   */
  providers: GlyphProvider[] | []
} & ResourceClassArguments<'list'>

export class FontClass extends ResourceClass<FontNode> implements ListResource {
  static readonly resourceType = 'font'

  fontJSON: { providers: FontArguments['providers'] }

  constructor(core: SandstoneCore, name: string, args: FontArguments) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      FontNode,
      FontClass.resourceType,
      core.pack.resourceToPath(name, RESOURCE_PATHS[FontClass.resourceType].path),
      args
    )

    this.fontJSON = { providers: args.providers }

    this.handleConflicts()
  }

  push(...providers: GlyphProvider[] | FontClass[]) {
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

  unshift(...providers: GlyphProvider[] | FontClass[]) {
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
