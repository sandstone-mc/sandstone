import { ContainerNode } from '../../nodes'
import { ResourceClass } from '../resource'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'

/**
 * A node representing a Minecraft language file.
 */
export class LanguageNode extends ContainerNode implements ResourceNode<LanguageClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: LanguageClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.languageJSON)
}

export type LanguageArguments = {
  /**
   * The language's JSON.
   */
  language?: Partial<Record<TRANSLATION_KEYS, string>> | { [key: string]: string }

} & ResourceClassArguments<'list'>

export class LanguageClass extends ResourceClass<LanguageNode> implements ListResource {
  languageJSON: LanguageArguments['language']

  constructor(core: SandstoneCore, name: string, args: LanguageArguments) {
    super(core, { packType: core.pack.resourcePack }, LanguageNode, core.pack.resourceToPath(name, ['lang']), args)

    this.languageJSON = args.language
  }

  push() {}

  unshift() {}
}
