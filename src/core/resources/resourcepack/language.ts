import { RESOURCE_PATHS } from 'sandstone/arguments'
import type { LiteralUnion, SetType } from 'sandstone/utils'
import { ContainerNode } from '../../nodes'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { TRANSLATION_KEYS_SET } from 'sandstone/arguments/generated/_registry/translation_keys'

/**
 * A node representing a Minecraft language file.
 */
export class LanguageNode extends ContainerNode implements ResourceNode<LanguageClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: LanguageClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type LanguageArguments = {
  /**
   * The language's JSON.
   */
  language?: Partial<Record<LiteralUnion<SetType<typeof TRANSLATION_KEYS_SET>>, string>>
} & ResourceClassArguments<'list'>

export class LanguageClass extends ResourceClass<LanguageNode> implements JsonResource, ListResource {
  static readonly resourceType = 'lang'

  json: NonNullable<LanguageArguments['language']>

  constructor(core: SandstoneCore, name: string, args: LanguageArguments) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      LanguageNode,
      LanguageClass.resourceType,
      core.pack.resourceToPath(name, RESOURCE_PATHS[LanguageClass.resourceType].path), args)

    this.json = args.language ?? {}

    this.handleConflicts()
  }

  push(...translations: NonNullable<LanguageArguments['language']>[] | LanguageClass[]) {
    if (translations[0] instanceof LanguageClass) {
      for (const translation of translations) {
        /** @ts-ignore */
        this.json = { ...this.json, ...translation.json }
      }
    } else {
      for (const translation of translations) {
        /** @ts-ignore */
        this.json = { ...this.json, ...translation }
      }
    }
  }

  unshift(...translations: NonNullable<LanguageArguments['language']>[] | LanguageClass[]) {
    if (translations[0] instanceof LanguageClass) {
      for (const translation of translations) {
        /** @ts-ignore */
        this.json = { ...translation.json, ...this.json }
      }
    } else {
      for (const translation of translations) {
        /** @ts-ignore */
        this.json = { ...translation, ...this.json }
      }
    }
  }
}
