import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../../nodes'
import type { SandstoneCore } from '../../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

/**
 * A node representing a Minecraft Block Transformer (item component).
 */
export class BlockTransformerNode extends ContainerNode implements ResourceNode<BlockTransformerClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: BlockTransformerClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type BlockTransformerClassArguments = {
  /**
   * The block transformer's JSON.
   */
  json: JsonSymbolResource[(typeof BlockTransformerClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class BlockTransformerClass extends ResourceClass<BlockTransformerNode> implements JsonResource {
  static readonly resourceType = 'block_transformer' as const

  public json: NonNullable<BlockTransformerClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: BlockTransformerClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      BlockTransformerNode,
      BlockTransformerClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[BlockTransformerClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
