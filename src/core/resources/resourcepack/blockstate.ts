import { ContainerNode } from '../../nodes'
import { ResourceClass } from '../resource'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'

/**
 * A node representing a Minecraft block state.
 */
export class BlockStateNode<Type extends BlockStateType> extends ContainerNode implements ResourceNode<BlockStateClass<Type>> {
  constructor(sandstoneCore: SandstoneCore, public resource: BlockStateClass<Type>) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.blockStateJSON)
}

type BlockStateType = 'variant' | 'multipart'

type Variant = {
  model: string
  x?: 0 | 90 | 180 | 270
  y?: 0 | 90 | 180 | 270
  /**
   * If set to `true`, the textures are not rotated with the block.
   */
  uvlock?: boolean
}

type WeightedVariant = Variant & {
  weight?: number
}

type StringRecord = { [state: string]: string }

type MultipartCase = {
  /**
   * One condition or an array where at least one condition
   * must apply
   */
  when: StringRecord | StringRecord[]
  apply: Variant | WeightedVariant[]
}

export type BlockStateArguments<Type extends BlockStateType> = {
  /**
   * The block state's JSON.
   */
  blockState?: Type extends 'variant' ? { variants: { [name: string]: Variant | WeightedVariant[] } } : { multipart: MultipartCase[] }

} & ResourceClassArguments<'list'>

export class BlockStateClass<Type extends BlockStateType> extends ResourceClass<BlockStateNode<Type>> implements ListResource {
  blockStateJSON: BlockStateArguments<Type>['blockState']

  constructor(core: SandstoneCore, name: string, type: Type, args: BlockStateArguments<Type>) {
    super(core, { packType: core.pack.resourcePack }, BlockStateNode, core.pack.resourceToPath(name, ['blockstates']), args)

    this.blockStateJSON = args.blockState
  }

  push() {}

  unshift() {}

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
}
