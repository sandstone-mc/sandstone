import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'
import type { AllKeys } from 'sandstone/utils'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

export type BlockStateDefinitionJSON = NonNullable<JsonSymbolResource['block_definition']>
export type BlockStateDefinitionType = AllKeys<BlockStateDefinitionJSON>

/**
 * A node representing a Minecraft block state definition.
 */
export class BlockStateDefinitionNode<JSON extends BlockStateDefinitionJSON>
  extends ContainerNode
  implements ResourceNode<BlockStateDefinitionClass<JSON>> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: BlockStateDefinitionClass<JSON>,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.blockStateDefinitionJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type BlockStateDefinitionArguments<JSON extends BlockStateDefinitionJSON> = {
  /**
   * The block state definition's JSON.
   */
  json: JSON
} & ResourceClassArguments<'list'>

export class BlockStateDefinitionClass<JSON extends BlockStateDefinitionJSON, Type = Extract<AllKeys<JSON>, BlockStateDefinitionType>>
  extends ResourceClass<BlockStateDefinitionNode<JSON>>
  implements ListResource {
  static readonly resourceType = 'block_definition'

  blockStateDefinitionJSON: JSON

  type: Type

  constructor(
    core: SandstoneCore,
    name: string,
    args: BlockStateDefinitionArguments<JSON>,
  ) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      BlockStateDefinitionNode,
      BlockStateDefinitionClass.resourceType,
      core.pack.resourceToPath(name, RESOURCE_PATHS[BlockStateDefinitionClass.resourceType].path),
      args,
    )

    this.blockStateDefinitionJSON = args.json

    this.type = Object.keys(this.blockStateDefinitionJSON)[0] as Type

    this.handleConflicts()
  }

  push(...states: BlockStateDefinitionClass<any, Type>[] | BlockStateDefinitionJSON[]) {
    if (this.type === 'variants') {
      if (states[0] instanceof BlockStateDefinitionClass) {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateDefinitionJSON.variants = { ...this.blockStateDefinitionJSON.variants, ...state.blockStateDefinitionJSON.variants }
        }
      } else {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateDefinitionJSON.variants = { ...this.blockStateDefinitionJSON.variants, ...state.variants }
        }
      }
    }
    if (this.type === 'multipart') {
      if (states[0] instanceof BlockStateDefinitionClass) {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateDefinitionJSON.multipart.push(...state.blockStateDefinitionJSON.multipart)
        }
      } else {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateDefinitionJSON.multipart.push(...state.multipart)
        }
      }
    }
  }

  unshift(...states: BlockStateDefinitionClass<any, Type>[] | BlockStateDefinitionJSON[]) {
    if (this.type === 'variants') {
      if (states[0] instanceof BlockStateDefinitionClass) {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateDefinitionJSON.variants = { ...state.blockStateDefinitionJSON.variants, ...this.blockStateDefinitionJSON.variants }
        }
      } else {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateDefinitionJSON.variants = { ...state.variants, ...this.blockStateDefinitionJSON.variants }
        }
      }
    }
    if (this.type === 'multipart') {
      if (states[0] instanceof BlockStateDefinitionClass) {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateDefinitionJSON.multipart.unshift(...state.blockStateDefinitionJSON.multipart)
        }
      } else {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateDefinitionJSON.multipart.unshift(...state.multipart)
        }
      }
    }
  }

  async load() {}
}
