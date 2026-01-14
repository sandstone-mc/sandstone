import type { BlockStateProvider } from 'sandstone/arguments/generated/data/worldgen/feature/block_state_provider'
import type { IntProvider, UniformIntProvider } from 'sandstone/arguments/generated/data/worldgen'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { Direction } from 'sandstone/arguments/generated/util/direction'
import type { NBTFloat, NBTInt, NBTList, TagClass } from 'sandstone'
import type { RootNBT } from 'sandstone/arguments/nbt'

export type AboveRootPlacement = {
  above_root_provider: BlockStateProvider
  /**
     * Value:
     * Range: 0..1
     */
  above_root_placement_chance: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type AlterGroundTreeDecorator = {
  provider: BlockStateProvider
}

export type AttachedToLeavesTreeDecorator = {
  /**
     * Value:
     * Range: 0..1
     */
  probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  /**
     * Value:
     * Range: 0..16
     */
  exclusion_radius_xz: NBTInt<{
    min: 0
    max: 16
  }>
  /**
     * Value:
     * Range: 0..16
     */
  exclusion_radius_y: NBTInt<{
    min: 0
    max: 16
  }>
  /**
     * Value:
     * Range: 1..16
     */
  required_empty_blocks: NBTInt<{
    min: 1
    max: 16
  }>
  block_provider: BlockStateProvider
  /**
     * Value:
     * List length range: 1..
     */
  directions: NBTList<Direction, {
    leftExclusive: false
    min: 1
  }>
}

export type AttachedToLogsTreeDecorator = {
  /**
     * Value:
     * Range: 0..1
     */
  probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  block_provider: BlockStateProvider
  /**
     * Value:
     * List length range: 1..
     */
  directions: NBTList<Direction, {
    leftExclusive: false
    min: 1
  }>
}

export type BeehiveTreeDecorator = {
  /**
     * Value:
     * Range: 0..1
     */
  probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type BendingTrunkPlacer = {
  bend_length: IntProvider<NBTInt<{
    min: 1
    max: 64
  }>>
  /**
     * Value:
     * Range: 1..
     */
  min_height_for_leaves?: NBTInt<{
    min: 1
  }>
}

export type CherryFoliagePlacer = {
  height: IntProvider<NBTInt<{
    min: 4
    max: 16
  }>>
  /**
     * Value:
     * Range: 0..1
     */
  wide_bottom_layer_hole_chance: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  /**
     * Value:
     * Range: 0..1
     */
  corner_hole_chance: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  /**
     * Value:
     * Range: 0..1
     */
  hanging_leaves_chance: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  /**
     * Value:
     * Range: 0..1
     */
  hanging_leaves_extension_chance: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type CherryTrunkPlacer = {
  branch_count: IntProvider<NBTInt<{
    min: 1
    max: 3
  }>>
  branch_horizontal_length: IntProvider<NBTInt<{
    min: 2
    max: 16
  }>>
  branch_start_offset_from_top: UniformIntProvider<NBTInt<{
    min: -16
    max: 0
  }>>
  branch_end_offset_from_top: IntProvider<NBTInt<{
    min: -16
    max: 16
  }>>
}

export type CocoaTreeDecorator = {
  /**
     * Value:
     * Range: 0..1
     */
  probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type CreakingHeartTreeDecorator = {
  /**
     * Value:
     * Range: 0..1
     */
  probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type FallenTreeConfig = {
  trunk_provider: BlockStateProvider
  log_length: IntProvider<NBTInt<{
    min: 0
    max: 16
  }>>
  stump_decorators: Array<TreeDecorator>
  log_decorators: Array<TreeDecorator>
}

export type FeatureSize = ({
  [S in Extract<Registry['minecraft:worldgen/feature_size_type'], string>]?: ({
    type: S
  } & (S extends keyof SymbolFeatureSize ? SymbolFeatureSize[S] : RootNBT));
}[Registry['minecraft:worldgen/feature_size_type']])

export type FoliagePlacer = ({
  [S in Extract<Registry['minecraft:worldgen/foliage_placer_type'], string>]?: ({
    type: S
    radius: IntProvider<NBTInt<{
      min: 0
      max: 16
    }>>
    offset: IntProvider<NBTInt<{
      min: 0
      max: 16
    }>>
  } & (S extends keyof SymbolFoliagePlacer ? SymbolFoliagePlacer[S] : RootNBT));
}[Registry['minecraft:worldgen/foliage_placer_type']])

export type HeightFoliagePlacer = {
  /**
     * Value:
     * Range: 0..16
     */
  height: NBTInt<{
    min: 0
    max: 16
  }>
}

export type LeaveVineTreeDecorator = {
  /**
     * Value:
     * Range: 0..1
     */
  probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type MangroveRootPlacement = {
  /**
     * Value:
     * Range: 1..12
     */
  max_root_width: NBTInt<{
    min: 1
    max: 12
  }>
  /**
     * Value:
     * Range: 1..64
     */
  max_root_length: NBTInt<{
    min: 1
    max: 64
  }>
  /**
     * Value:
     * Range: 0..1
     */
  random_skew_chance: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  can_grow_through: (
      | Array<Registry['minecraft:block']> | (
      Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>))
  muddy_roots_in: (
      | Array<Registry['minecraft:block']> | (
      Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>))
  muddy_roots_provider: BlockStateProvider
}

export type MangroveRootPlacer = {
  mangrove_root_placement: MangroveRootPlacement
}

export type MegaPineFoliagePlacer = {
  crown_height: IntProvider<NBTInt<{
    min: 0
    max: 24
  }>>
}

export type PaleMossTreeDecorator = {
  /**
     * Value:
     * Range: 0..1
     */
  leaves_probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  /**
     * Value:
     * Range: 0..1
     */
  trunk_probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  /**
     * Value:
     * Range: 0..1
     */
  ground_probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type PineFoliagePlacer = {
  height: IntProvider<NBTInt<{
    min: 0
    max: 24
  }>>
}

export type PlaceOnGroundTreeDecorator = {
  /**
     * Defaults to `128`.
     *
     * Value:
     * Range: 1..
     */
  tries?: NBTInt<{
    min: 1
  }>
  /**
     * Defaults to `2`.
     *
     * Value:
     * Range: 0..
     */
  radius?: NBTInt<{
    min: 0
  }>
  /**
     * Defaults to `1`.
     *
     * Value:
     * Range: 0..
     */
  height?: NBTInt<{
    min: 0
  }>
  /**
     * The block to place on the ground.
     */
  block_state_provider: BlockStateProvider
}

export type RandomSpreadFoliagePlacer = {
  foliage_height: IntProvider<NBTInt<{
    min: 1
  }>>
  /**
     * Value:
     * Range: 0..256
     */
  leaf_placement_attempts: NBTInt<{
    min: 0
  }>
}

export type RootPlacer = ({
  [S in Extract<Registry['minecraft:worldgen/root_placer_type'], string>]?: ({
    type: S
    root_provider: BlockStateProvider
    trunk_offset_y: IntProvider<NBTInt>
    above_root_placement?: AboveRootPlacement
  } & (S extends keyof SymbolRootPlacer ? SymbolRootPlacer[S] : RootNBT));
}[Registry['minecraft:worldgen/root_placer_type']])

export type SprucePineFoliagePlacer = {
  trunk_height: IntProvider<NBTInt<{
    min: 0
    max: 24
  }>>
}

export type ThreeLayersFeatureSize = {
  /**
     * Value:
     * Range: 0..80
     */
  min_clipped_height?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
  }>
  /**
     * Value:
     * Range: 0..80
     */
  limit?: NBTInt<{
    min: 0
    max: 80
  }>
  /**
     * Value:
     * Range: 0..80
     */
  upper_limit?: NBTInt<{
    min: 0
    max: 80
  }>
  /**
     * Value:
     * Range: 0..16
     */
  lower_size?: NBTInt<{
    min: 0
    max: 16
  }>
  /**
     * Value:
     * Range: 0..16
     */
  middle_size?: NBTInt<{
    min: 0
    max: 16
  }>
  /**
     * Value:
     * Range: 0..16
     */
  upper_size?: NBTInt<{
    min: 0
    max: 16
  }>
}

export type TreeConfig = {
  ignore_vines?: boolean
  force_dirt?: boolean
  minimum_size: FeatureSize
  dirt_provider: BlockStateProvider
  trunk_provider: BlockStateProvider
  foliage_provider: BlockStateProvider
  root_placer?: RootPlacer
  trunk_placer: TrunkPlacer
  foliage_placer: FoliagePlacer
  decorators: Array<TreeDecorator>
}

export type TreeDecorator = ({
  [S in Extract<Registry['minecraft:worldgen/tree_decorator_type'], string>]?: ({
    type: S
  } & (S extends keyof SymbolTreeDecorator ? SymbolTreeDecorator[S] : RootNBT));
}[Registry['minecraft:worldgen/tree_decorator_type']])

export type TrunkPlacer = ({
  [S in Extract<Registry['minecraft:worldgen/trunk_placer_type'], string>]?: ({
    type: S
    /**
         * Value:
         * Range: 0..32
         */
    base_height: NBTInt<{
      min: 0
      max: 32
    }>
    /**
         * Value:
         * Range: 0..24
         */
    height_rand_a: NBTInt<{
      min: 0
      max: 24
    }>
    /**
         * Value:
         * Range: 0..24
         */
    height_rand_b: NBTInt<{
      min: 0
      max: 24
    }>
  } & (S extends keyof SymbolTrunkPlacer ? SymbolTrunkPlacer[S] : RootNBT));
}[Registry['minecraft:worldgen/trunk_placer_type']])

export type TwoLayersFeatureSize = {
  /**
     * Value:
     * Range: 0..80
     */
  min_clipped_height?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
  }>
  /**
     * Value:
     * Range: 0..81
     */
  limit?: NBTInt<{
    min: 0
    max: 81
  }>
  /**
     * Value:
     * Range: 0..16
     */
  lower_size?: NBTInt<{
    min: 0
    max: 16
  }>
  /**
     * Value:
     * Range: 0..16
     */
  upper_size?: NBTInt<{
    min: 0
    max: 16
  }>
}

export type UpwardsBranchingTrunkPlacer = {
  extra_branch_steps: IntProvider<NBTInt<{
    min: 1
  }>>
  extra_branch_length: IntProvider<NBTInt<{
    min: 0
  }>>
  /**
     * Value:
     * Range: 0..1
     */
  place_branch_per_log_probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  can_grow_through: (
      | Array<Registry['minecraft:block']> | (
      Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>))
}
type FeatureSizeDispatcherMap = {
  'three_layers_feature_size': FeatureSizeThreeLayersFeatureSize
  'minecraft:three_layers_feature_size': FeatureSizeThreeLayersFeatureSize
  'two_layers_feature_size': FeatureSizeTwoLayersFeatureSize
  'minecraft:two_layers_feature_size': FeatureSizeTwoLayersFeatureSize
}
type FeatureSizeKeys = keyof FeatureSizeDispatcherMap
type FeatureSizeFallback = (FeatureSizeThreeLayersFeatureSize | FeatureSizeTwoLayersFeatureSize)
type FeatureSizeThreeLayersFeatureSize = ThreeLayersFeatureSize
type FeatureSizeTwoLayersFeatureSize = TwoLayersFeatureSize
export type SymbolFeatureSize<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? FeatureSizeDispatcherMap
  : CASE extends 'keys' ? FeatureSizeKeys : CASE extends '%fallback' ? FeatureSizeFallback : never
type FoliagePlacerDispatcherMap = {
  'blob_foliage_placer': FoliagePlacerBlobFoliagePlacer
  'minecraft:blob_foliage_placer': FoliagePlacerBlobFoliagePlacer
  'bush_foliage_placer': FoliagePlacerBushFoliagePlacer
  'minecraft:bush_foliage_placer': FoliagePlacerBushFoliagePlacer
  'cherry_foliage_placer': FoliagePlacerCherryFoliagePlacer
  'minecraft:cherry_foliage_placer': FoliagePlacerCherryFoliagePlacer
  'fancy_foliage_placer': FoliagePlacerFancyFoliagePlacer
  'minecraft:fancy_foliage_placer': FoliagePlacerFancyFoliagePlacer
  'jungle_foliage_placer': FoliagePlacerJungleFoliagePlacer
  'minecraft:jungle_foliage_placer': FoliagePlacerJungleFoliagePlacer
  'mega_pine_foliage_placer': FoliagePlacerMegaPineFoliagePlacer
  'minecraft:mega_pine_foliage_placer': FoliagePlacerMegaPineFoliagePlacer
  'pine_foliage_placer': FoliagePlacerPineFoliagePlacer
  'minecraft:pine_foliage_placer': FoliagePlacerPineFoliagePlacer
  'random_spread_foliage_placer': FoliagePlacerRandomSpreadFoliagePlacer
  'minecraft:random_spread_foliage_placer': FoliagePlacerRandomSpreadFoliagePlacer
  'spruce_foliage_placer': FoliagePlacerSpruceFoliagePlacer
  'minecraft:spruce_foliage_placer': FoliagePlacerSpruceFoliagePlacer
}
type FoliagePlacerKeys = keyof FoliagePlacerDispatcherMap
type FoliagePlacerFallback = (
  | FoliagePlacerBlobFoliagePlacer
  | FoliagePlacerBushFoliagePlacer
  | FoliagePlacerCherryFoliagePlacer
  | FoliagePlacerFancyFoliagePlacer
  | FoliagePlacerJungleFoliagePlacer
  | FoliagePlacerMegaPineFoliagePlacer
  | FoliagePlacerPineFoliagePlacer
  | FoliagePlacerRandomSpreadFoliagePlacer
  | FoliagePlacerSpruceFoliagePlacer)
type FoliagePlacerBlobFoliagePlacer = HeightFoliagePlacer
type FoliagePlacerBushFoliagePlacer = HeightFoliagePlacer
type FoliagePlacerCherryFoliagePlacer = CherryFoliagePlacer
type FoliagePlacerFancyFoliagePlacer = HeightFoliagePlacer
type FoliagePlacerJungleFoliagePlacer = HeightFoliagePlacer
type FoliagePlacerMegaPineFoliagePlacer = MegaPineFoliagePlacer
type FoliagePlacerPineFoliagePlacer = PineFoliagePlacer
type FoliagePlacerRandomSpreadFoliagePlacer = RandomSpreadFoliagePlacer
type FoliagePlacerSpruceFoliagePlacer = SprucePineFoliagePlacer
export type SymbolFoliagePlacer<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? FoliagePlacerDispatcherMap
  : CASE extends 'keys' ? FoliagePlacerKeys : CASE extends '%fallback' ? FoliagePlacerFallback : never
type RootPlacerDispatcherMap = {
  'mangrove_root_placer': RootPlacerMangroveRootPlacer
  'minecraft:mangrove_root_placer': RootPlacerMangroveRootPlacer
}
type RootPlacerKeys = keyof RootPlacerDispatcherMap
type RootPlacerFallback = (RootPlacerMangroveRootPlacer)
type RootPlacerMangroveRootPlacer = MangroveRootPlacer
export type SymbolRootPlacer<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? RootPlacerDispatcherMap
  : CASE extends 'keys' ? RootPlacerKeys : CASE extends '%fallback' ? RootPlacerFallback : never
type TreeDecoratorDispatcherMap = {
  'alter_ground': TreeDecoratorAlterGround
  'minecraft:alter_ground': TreeDecoratorAlterGround
  'attached_to_leaves': TreeDecoratorAttachedToLeaves
  'minecraft:attached_to_leaves': TreeDecoratorAttachedToLeaves
  'attached_to_logs': TreeDecoratorAttachedToLogs
  'minecraft:attached_to_logs': TreeDecoratorAttachedToLogs
  'beehive': TreeDecoratorBeehive
  'minecraft:beehive': TreeDecoratorBeehive
  'cocoa': TreeDecoratorCocoa
  'minecraft:cocoa': TreeDecoratorCocoa
  'creaking_heart': TreeDecoratorCreakingHeart
  'minecraft:creaking_heart': TreeDecoratorCreakingHeart
  'leave_vine': TreeDecoratorLeaveVine
  'minecraft:leave_vine': TreeDecoratorLeaveVine
  'pale_moss': TreeDecoratorPaleMoss
  'minecraft:pale_moss': TreeDecoratorPaleMoss
  'place_on_ground': TreeDecoratorPlaceOnGround
  'minecraft:place_on_ground': TreeDecoratorPlaceOnGround
}
type TreeDecoratorKeys = keyof TreeDecoratorDispatcherMap
type TreeDecoratorFallback = (
  | TreeDecoratorAlterGround
  | TreeDecoratorAttachedToLeaves
  | TreeDecoratorAttachedToLogs
  | TreeDecoratorBeehive
  | TreeDecoratorCocoa
  | TreeDecoratorCreakingHeart
  | TreeDecoratorLeaveVine
  | TreeDecoratorPaleMoss
  | TreeDecoratorPlaceOnGround)
type TreeDecoratorAlterGround = AlterGroundTreeDecorator
type TreeDecoratorAttachedToLeaves = AttachedToLeavesTreeDecorator
type TreeDecoratorAttachedToLogs = AttachedToLogsTreeDecorator
type TreeDecoratorBeehive = BeehiveTreeDecorator
type TreeDecoratorCocoa = CocoaTreeDecorator
type TreeDecoratorCreakingHeart = CreakingHeartTreeDecorator
type TreeDecoratorLeaveVine = LeaveVineTreeDecorator
type TreeDecoratorPaleMoss = PaleMossTreeDecorator
type TreeDecoratorPlaceOnGround = PlaceOnGroundTreeDecorator
export type SymbolTreeDecorator<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? TreeDecoratorDispatcherMap
  : CASE extends 'keys' ? TreeDecoratorKeys : CASE extends '%fallback' ? TreeDecoratorFallback : never
type TrunkPlacerDispatcherMap = {
  'bending_trunk_placer': TrunkPlacerBendingTrunkPlacer
  'minecraft:bending_trunk_placer': TrunkPlacerBendingTrunkPlacer
  'cherry_trunk_placer': TrunkPlacerCherryTrunkPlacer
  'minecraft:cherry_trunk_placer': TrunkPlacerCherryTrunkPlacer
  'dark_oak_trunk_placer': TrunkPlacerDarkOakTrunkPlacer
  'minecraft:dark_oak_trunk_placer': TrunkPlacerDarkOakTrunkPlacer
  'fancy_trunk_placer': TrunkPlacerFancyTrunkPlacer
  'minecraft:fancy_trunk_placer': TrunkPlacerFancyTrunkPlacer
  'forking_trunk_placer': TrunkPlacerForkingTrunkPlacer
  'minecraft:forking_trunk_placer': TrunkPlacerForkingTrunkPlacer
  'giant_trunk_placer': TrunkPlacerGiantTrunkPlacer
  'minecraft:giant_trunk_placer': TrunkPlacerGiantTrunkPlacer
  'mega_jungle_trunk_placer': TrunkPlacerMegaJungleTrunkPlacer
  'minecraft:mega_jungle_trunk_placer': TrunkPlacerMegaJungleTrunkPlacer
  'straight_trunk_placer': TrunkPlacerStraightTrunkPlacer
  'minecraft:straight_trunk_placer': TrunkPlacerStraightTrunkPlacer
  'upwards_branching_trunk_placer': TrunkPlacerUpwardsBranchingTrunkPlacer
  'minecraft:upwards_branching_trunk_placer': TrunkPlacerUpwardsBranchingTrunkPlacer
}
type TrunkPlacerKeys = keyof TrunkPlacerDispatcherMap
type TrunkPlacerFallback = (
  | TrunkPlacerBendingTrunkPlacer
  | TrunkPlacerCherryTrunkPlacer
  | TrunkPlacerDarkOakTrunkPlacer
  | TrunkPlacerFancyTrunkPlacer
  | TrunkPlacerForkingTrunkPlacer
  | TrunkPlacerGiantTrunkPlacer
  | TrunkPlacerMegaJungleTrunkPlacer
  | TrunkPlacerStraightTrunkPlacer
  | TrunkPlacerUpwardsBranchingTrunkPlacer)
type TrunkPlacerBendingTrunkPlacer = BendingTrunkPlacer
type TrunkPlacerCherryTrunkPlacer = CherryTrunkPlacer
type TrunkPlacerDarkOakTrunkPlacer = Record<string, never>
type TrunkPlacerFancyTrunkPlacer = Record<string, never>
type TrunkPlacerForkingTrunkPlacer = Record<string, never>
type TrunkPlacerGiantTrunkPlacer = Record<string, never>
type TrunkPlacerMegaJungleTrunkPlacer = Record<string, never>
type TrunkPlacerStraightTrunkPlacer = Record<string, never>
type TrunkPlacerUpwardsBranchingTrunkPlacer = UpwardsBranchingTrunkPlacer
export type SymbolTrunkPlacer<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? TrunkPlacerDispatcherMap
  : CASE extends 'keys' ? TrunkPlacerKeys : CASE extends '%fallback' ? TrunkPlacerFallback : never
