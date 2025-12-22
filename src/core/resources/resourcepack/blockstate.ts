import type { Dispatcher } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes.js'

import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource.js'
import { ResourceClass } from '../resource.js'
import { AllKeys } from 'sandstone/utils.js'

type BlockStateJSON = Dispatcher<'minecraft:resource'>['block_definition']
type BlockStateType = AllKeys<Dispatcher<'minecraft:resource'>['block_definition']>

/**
 * A node representing a Minecraft block state.
 */
export class BlockStateNode<Type extends BlockStateType>
  extends ContainerNode
  implements ResourceNode<BlockStateClass<Type>>
{
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: BlockStateClass<Type>,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.blockStateJSON)
}

export type BlockStateArguments<Type extends BlockStateType> = {
  /**
   * The block state's JSON.
   */
  blockState: Dispatcher<'minecraft:resource'>['block_definition']
} & ResourceClassArguments<'list'>

export class BlockStateClass<Type extends BlockStateType>
  extends ResourceClass<BlockStateNode<Type>>
  implements ListResource
{
  blockStateJSON: NonNullable<BlockStateArguments<Type>['blockState']>

  constructor(
    core: SandstoneCore,
    name: string,
    public type: Type,
    args: BlockStateArguments<Type>,
  ) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      BlockStateNode,
      core.pack.resourceToPath(name, ['blockstates']),
      args,
    )

    /** @ts-ignore */
    this.blockStateJSON = args.blockState || (type === 'variant' ? { variants: {} } : { multipart: [] })

    this.handleConflicts()
  }

  push(...states: BlockStateClass<Type>[] | BlockStateJSON[]) {
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

  unshift(...states: BlockStateClass<Type>[] | BlockStateJSON[]) {
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
