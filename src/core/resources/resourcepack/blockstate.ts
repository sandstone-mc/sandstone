import { ContainerNode } from '../../nodes'
import { ResourceClass } from '../resource'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import type { BlockStateDefinition, BlockStateType } from '#arguments'

/**
 * A node representing a Minecraft block state.
 */
export class BlockStateNode<Type extends BlockStateType> extends ContainerNode implements ResourceNode<BlockStateClass<Type>> {
  constructor(sandstoneCore: SandstoneCore, public resource: BlockStateClass<Type>) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.blockStateJSON)
}

export type BlockStateArguments<Type extends BlockStateType> = {
  /**
   * The block state's JSON.
   */
  blockState?: BlockStateDefinition<Type>

} & ResourceClassArguments<'list'>

export class BlockStateClass<Type extends BlockStateType> extends ResourceClass<BlockStateNode<Type>> implements ListResource {
  blockStateJSON: NonNullable<BlockStateArguments<Type>['blockState']>

  constructor(core: SandstoneCore, name: string, public type: Type, args: BlockStateArguments<Type>) {
    super(core, { packType: core.pack.resourcePack() }, BlockStateNode, core.pack.resourceToPath(name, ['blockstates']), args)

    /** @ts-ignore */
    this.blockStateJSON = args.blockState || (type === 'variant' ? { variants: {} } : { multipart: [] })

    this.handleConflicts()
  }

  push(...states: BlockStateClass<Type>[] | BlockStateDefinition<Type>[]) {
    if (this.type === 'variant') {
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

  unshift(...states: BlockStateClass<Type>[] | BlockStateDefinition<Type>[]) {
    if (this.type === 'variant') {
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

  /*
   * blockWithState<B extends keyof Blockstates>(
   * block: LiteralUnion<B>,
   * state?: (B extends keyof Blockstates ? Blockstates[B] : Blockstates[keyof Blockstates]) | { [name: string]: string},
   * ): string {
   * let id: string = block
   * if (state) {
   *  id += `[${Object.entries(state).map(([name, val]) => `${name}=${val}`).join(',')}]`
   * }
   * return id
   * }
   */

  async load() {

  }
}
