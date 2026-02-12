import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

export type AudibleVariantType = (
  | 'cat'
  | 'chicken'
  | 'cow'
  | 'pig'
  | 'wolf'
)

/**
 * All supported variant types.
 */
export type VariantType = (
  | 'frog'
  | 'painting'
  | 'zombie_nautilus'
  | AudibleVariantType
  | `${AudibleVariantType}_sound`
)

/**
 * Maps variant types to their SymbolResource keys.
 */
type VariantSymbolKey<T extends VariantType> = `${T}_variant`

/**
 * Gets the JSON type for a variant from SymbolResource.
 */
type VariantJSON<T extends VariantType> = SymbolResource[VariantSymbolKey<T>]

/**
 * A node representing a Minecraft entity variant.
 */
export class VariantNode<T extends VariantType> extends ContainerNode implements ResourceNode<VariantClass<T>> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: VariantClass<T>,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.variantJSON)
}

export type VariantClassArguments<T extends VariantType> = {
  /**
   * The variant's JSON.
   */
  variant: VariantJSON<T>
} & ResourceClassArguments<'default'>

export class VariantClass<T extends VariantType> extends ResourceClass<VariantNode<T>> {
  public variantJSON: NonNullable<VariantJSON<T>>

  constructor(
    sandstoneCore: SandstoneCore,
    public variantType: T,
    name: string,
    args: VariantClassArguments<T>,
  ) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      VariantNode<T>,
      sandstoneCore.pack.resourceToPath(name, [`${variantType}_variant`]),
      args,
    )

    this.variantJSON = args.variant

    this.handleConflicts()
  }
}
