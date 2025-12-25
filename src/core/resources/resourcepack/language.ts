import { LiteralUnion, SetType } from 'sandstone/utils'
import { ContainerNode } from '../../nodes'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'
import { TRANSLATION_KEYS_SET } from 'sandstone/arguments/generated/_registry/translation_keys'

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

  getValue = () => JSON.stringify(this.resource.languageJSON)
}

export type LanguageArguments = {
  /**
   * The language's JSON.
   */
  language?: Partial<Record<LiteralUnion<SetType<typeof TRANSLATION_KEYS_SET>>, string>>
} & ResourceClassArguments<'list'>

export class LanguageClass extends ResourceClass<LanguageNode> implements ListResource {
  languageJSON: NonNullable<LanguageArguments['language']>

  constructor(core: SandstoneCore, name: string, args: LanguageArguments) {
    super(core, { packType: core.pack.resourcePack() }, LanguageNode, core.pack.resourceToPath(name, ['lang']), args)

    this.languageJSON = args.language ?? {}

    this.handleConflicts()
  }

  push(...translations: NonNullable<LanguageArguments['language']>[] | LanguageClass[]) {
    if (translations[0] instanceof LanguageClass) {
      for (const translation of translations) {
        /** @ts-ignore */
        this.languageJSON = { ...this.languageJSON, ...translation.languageJSON }
      }
    } else {
      for (const translation of translations) {
        /** @ts-ignore */
        this.languageJSON = { ...this.languageJSON, ...translation }
      }
    }
  }

  unshift(...translations: NonNullable<LanguageArguments['language']>[] | LanguageClass[]) {
    if (translations[0] instanceof LanguageClass) {
      for (const translation of translations) {
        /** @ts-ignore */
        this.languageJSON = { ...translation.languageJSON, ...this.languageJSON }
      }
    } else {
      for (const translation of translations) {
        /** @ts-ignore */
        this.languageJSON = { ...translation, ...this.languageJSON }
      }
    }
  }
}
