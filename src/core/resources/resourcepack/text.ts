import { ContainerNode } from '../../nodes'
import { ResourceClass } from '../resource'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import type { JSONTextComponent } from '#arguments'

/**
 * A node representing a Minecraft text.
 */
export class PlainTextNode extends ContainerNode implements ResourceNode<PlainTextClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: PlainTextClass) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.texts
}

export type PlainTextArguments = {
  /**
   * The text.
   */
  text?: string | string[] | JSONTextComponent[]

} & ResourceClassArguments<'list'>

export class PlainTextClass extends ResourceClass<PlainTextNode> implements ListResource {
  texts: NonNullable<PlainTextArguments['text']> = ''

  constructor(core: SandstoneCore, name: string, args: PlainTextArguments) {
    super(core, { packType: core.pack.resourcePack, extension: 'txt' }, PlainTextNode, core.pack.resourceToPath(name, ['texts']), args)

    // TODO
    this.texts = args.text || ''
  }

  push(...texts: (string | JSONTextComponent)[]) {

  }

  unshift(...texts: (string | JSONTextComponent)[]) {

  }
}
