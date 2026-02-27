import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.chatTypeJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type ChatTypeClassArguments = {
  /**
   * The chat type's JSON.
   */
  json: SymbolResource[(typeof ChatTypeClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class ChatTypeClass extends ResourceClass<ChatTypeNode> {
  static readonly resourceType = 'chat_type' as const

  public chatTypeJSON: NonNullable<ChatTypeClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: ChatTypeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      ChatTypeNode,
      ChatTypeClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[ChatTypeClass.resourceType].path),
      args,
    )

    this.chatTypeJSON = args.json

    this.handleConflicts()
  }
}
