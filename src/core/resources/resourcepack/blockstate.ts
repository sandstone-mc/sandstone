import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'
import type { AllKeys } from 'sandstone/utils'

export type BlockStateJSON = NonNullable<SymbolResource['block_definition']>
export type BlockStateType = AllKeys<BlockStateJSON>

/**
 * A node representing a Minecraft block state.
 */
export class BlockStateNode<JSON extends BlockStateJSON>
  extends ContainerNode
  implements ResourceNode<BlockStateClass<JSON>> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: BlockStateClass<JSON>,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.blockStateJSON)
}

export type BlockStateArguments<JSON extends BlockStateJSON> = {
  /**
   * The block state's JSON.
   */
  blockState: JSON
} & ResourceClassArguments<'list'>

export class BlockStateClass<JSON extends BlockStateJSON, Type = Extract<AllKeys<JSON>, BlockStateType>>
  extends ResourceClass<BlockStateNode<JSON>>
  implements ListResource {
  blockStateJSON: JSON

  type: Type

  constructor(
    core: SandstoneCore,
    name: string,
    args: BlockStateArguments<JSON>,
  ) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      BlockStateNode,
      core.pack.resourceToPath(name, ['blockstates']),
      args,
    )

    this.blockStateJSON = args.blockState

    this.type = Object.keys(this.blockStateJSON)[0] as Type

    this.handleConflicts()
  }

  push(...states: BlockStateClass<any, Type>[] | BlockStateJSON[]) {
    if (this.type === 'variants') {
      if (states[0] instanceof BlockStateClass) {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateJSON.variants = { ...this.blockStateJSON.variants, ...state.blockStateJSON.variants }
        }
      } else {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateJSON.variants = { ...this.blockStateJSON.variants, ...state.variants }
        }
      }
    }
    if (this.type === 'multipart') {
      if (states[0] instanceof BlockStateClass) {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateJSON.multipart.push(...state.blockStateJSON.multipart)
        }
      } else {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateJSON.multipart.push(...state.multipart)
        }
      }
    }
  }

  unshift(...states: BlockStateClass<any, Type>[] | BlockStateJSON[]) {
    if (this.type === 'variants') {
      if (states[0] instanceof BlockStateClass) {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateJSON.variants = { ...state.blockStateJSON.variants, ...this.blockStateJSON.variants }
        }
      } else {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateJSON.variants = { ...state.variants, ...this.blockStateJSON.variants }
        }
      }
    }
    if (this.type === 'multipart') {
      if (states[0] instanceof BlockStateClass) {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateJSON.multipart.unshift(...state.blockStateJSON.multipart)
        }
      } else {
        for (const state of states) {
          /** @ts-ignore */
          this.blockStateJSON.multipart.unshift(...state.multipart)
        }
      }
    }
  }

  async load() {}
}
