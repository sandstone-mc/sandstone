import { ContainerNode } from '../../nodes'
import { ResourceClass } from '../resource'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import type { LiteralUnion } from '#utils'

/**
 * A node representing a Minecraft block state.
 */
export class BlockStateNode extends ContainerNode implements ResourceNode<BlockStateClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: BlockStateClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.blockStateJSON)
}

export type BlockStateArguments = {
  /**
   * The block state's JSON.
   */
  blockState?: { variants: Variants } | { multipart: MultipartCase[] }

} & ResourceClassArguments<'list'>

export class BlockStateClass extends ResourceClass<BlockStateNode> implements ListResource {
  blockStateJSON: BlockStateArguments['blockState']

  constructor(core: SandstoneCore, name: string, args: BlockStateArguments) {
    super(core, { packType: core.pack.resourcePack }, BlockStateNode, core.pack.resourceToPath(name, ['blockstates']), args)

    this.blockStateJSON = args.blockState
  }

  push() {}

  unshift() {}
}

export namespace BlockstateData {
  export async function load(loader: ResourceLoader, id: string): Promise<BlockstateData | null> {
    const parsedId = parseNamespacedId(id)
    const rPath = getResourcePath(parsedId, 'blockstates', 'json')
    const data = await loader.readResourceFile(rPath)
    if (data === null) return null
    return JSON.parse(data.toString('utf8'))
  }

  export type Variants = {
    [name: string]: Variant | WeightedVariant[]
  }

  export type Variant = {
    model: string
    x?: 0 | 90 | 180 | 270
    y?: 0 | 90 | 180 | 270
    /**
     * If set to `true`, the textures are not rotated with the block.
     */
    uvlock?: boolean
  }

  export type WeightedVariant = Variant & {
    weight?: number
  }

  export type MultipartCase = {
    /**
     * One condition or an array where at least one condition
     * must apply
     */
    when: Condition | Condition[]
    apply: Variant | WeightedVariant[]
  }

  export type Condition = {
    [state: string]: string
  }
}

export function blockWithState<B extends keyof Blockstates>(
  block: LiteralUnion<B>,
  state?: (B extends keyof Blockstates ? Blockstates[B] : Blockstates[keyof Blockstates]) | { [name: string]: string},
): string {
  let id: string = block
  if (state) {
    id += `[${Object.entries(state).map(([name, val]) => `${name}=${val}`).join(',')}]`
  }
  return id
}
