import { RESOURCE_PATHS } from 'sandstone/arguments'
import type { GlyphProvider } from 'sandstone/arguments/generated/assets/font'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'
import type { JsonGlyphProvider } from 'sandstone/arguments/generated/_json/assets/font'

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type FontArguments = {
  /**
   * The font's JSON.
   */
  providers: JsonGlyphProvider[] | []
} & ResourceClassArguments<'list'>

export class FontClass extends ResourceClass<FontNode> implements JsonResource, ListResource {
  static readonly resourceType = 'font'

  json: { providers: FontArguments['providers'] }

  constructor(core: SandstoneCore, name: string, args: FontArguments) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      FontNode,
      FontClass.resourceType,
      core.pack.resourceToPath(name, RESOURCE_PATHS[FontClass.resourceType].path),
      args
    )

    this.json = { providers: args.providers }

    this.handleConflicts()
  }

  push(...providers: JsonGlyphProvider[] | FontClass[]) {
    if (providers[0] instanceof FontClass) {
      for (const provider of providers) {
        /** @ts-ignore */
        this.json.providers.push(...provider.fontJSON.providers)
      }
    } else {
      /** @ts-ignore */
      this.json.providers.push(...providers)
    }
  }

  unshift(...providers: JsonGlyphProvider[] | FontClass[]) {
    if (providers[0] instanceof FontClass) {
      for (const provider of providers) {
        /** @ts-ignore */
        this.json.providers.unshift(...provider.fontJSON.providers)
      }
    } else {
      /** @ts-ignore */
      this.json.providers.unshift(...providers)
    }
  }
}
