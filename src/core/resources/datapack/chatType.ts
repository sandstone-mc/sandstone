import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

/**
 * A node representing a Minecraft chat type.
 */
export class ChatTypeNode extends ContainerNode implements ResourceNode<ChatTypeClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: ChatTypeClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.chatTypeJSON)
}

export type ChatTypeClassArguments = {
  /**
   * The chat type's JSON.
   */
  chatType: SymbolResource['chat_type']
} & ResourceClassArguments<'default'>

export class ChatTypeClass extends ResourceClass<ChatTypeNode> {
  public chatTypeJSON: NonNullable<ChatTypeClassArguments['chatType']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: ChatTypeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      ChatTypeNode,
      sandstoneCore.pack.resourceToPath(name, ['chat_type']),
      args,
    )

    this.chatTypeJSON = args.chatType

    this.handleConflicts()
  }
}
