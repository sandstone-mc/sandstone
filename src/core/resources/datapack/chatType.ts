import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type ChatTypeClassArguments = {
  /**
   * The chat type's JSON.
   */
  json: JsonSymbolResource[(typeof ChatTypeClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class ChatTypeClass extends ResourceClass<ChatTypeNode> implements JsonResource {
  static readonly resourceType = 'chat_type' as const

  public json: NonNullable<ChatTypeClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: ChatTypeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      ChatTypeNode,
      ChatTypeClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[ChatTypeClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
