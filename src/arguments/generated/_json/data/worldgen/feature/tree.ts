import type {
  JsonBlockStateProviderRef,
} from 'sandstone/arguments/generated/_json/data/worldgen/feature/block_state_provider.ts'
import type { JsonIntProvider, JsonUniformIntProvider } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonDirection } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type JsonAboveRootPlacement = {
  above_root_provider: JsonBlockStateProviderRef,
  /**
   * Value:
   * Range: 0..1
   */
  above_root_placement_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonAlterGroundTreeDecorator = {
  provider: JsonBlockStateProviderRef,
}

export type JsonAttachedToLeavesTreeDecorator = {
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..16
   */
  exclusion_radius_xz: (NBTInt<{
    min: 0,
    max: 16,
  }> | number),
  /**
   * Value:
   * Range: 0..16
   */
  exclusion_radius_y: (NBTInt<{
    min: 0,
    max: 16,
  }> | number),
  /**
   * Value:
   * Range: 1..16
   */
  required_empty_blocks: (NBTInt<{
    min: 1,
    max: 16,
  }> | number),
  block_provider: JsonBlockStateProviderRef,
  /**
   * Value:
   * List length range: 1..
   */
  directions: JsonNBTList<JsonDirection, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonAttachedToLogsTreeDecorator = {
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  block_provider: JsonBlockStateProviderRef,
  /**
   * Value:
   * List length range: 1..
   */
  directions: JsonNBTList<JsonDirection, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonBeehiveTreeDecorator = {
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonBendingTrunkPlacer = {
  bend_length: JsonIntProvider<(NBTInt<{
    min: 1,
    max: 64,
  }> | number)>,
  /**
   * Value:
   * Range: 1..
   */
  min_height_for_leaves?: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonCherryFoliagePlacer = {
  height: JsonIntProvider<(NBTInt<{
    min: 4,
    max: 16,
  }> | number)>,
  /**
   * Value:
   * Range: 0..1
   */
  wide_bottom_layer_hole_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  corner_hole_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  hanging_leaves_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  hanging_leaves_extension_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonCherryTrunkPlacer = {
  branch_count: JsonIntProvider<(NBTInt<{
    min: 1,
    max: 3,
  }> | number)>,
  branch_horizontal_length: JsonIntProvider<(NBTInt<{
    min: 2,
    max: 16,
  }> | number)>,
  branch_start_offset_from_top: JsonUniformIntProvider<(NBTInt<{
    min: -16,
    max: 0,
  }> | number)>,
  branch_end_offset_from_top: JsonIntProvider<(NBTInt<{
    min: -16,
    max: 16,
  }> | number)>,
}

export type JsonCocoaTreeDecorator = {
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonCreakingHeartTreeDecorator = {
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonFallenTreeConfig = {
  trunk_provider: JsonBlockStateProviderRef,
  log_length: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 16,
  }> | number)>,
  stump_decorators: Array<JsonTreeDecorator>,
  log_decorators: Array<JsonTreeDecorator>,
}

export type JsonFeatureSize = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/feature_size_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolFeatureSize ? JsonSymbolFeatureSize[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/feature_size_type'], string>])>

export type JsonFoliagePlacer = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/foliage_placer_type'], string>, string>]?: ({
    type: S,
    radius: JsonIntProvider<(NBTInt<{
      min: 0,
      max: 16,
    }> | number)>,
    offset: JsonIntProvider<(NBTInt<{
      min: 0,
      max: 16,
    }> | number)>,
  } & (S extends keyof JsonSymbolFoliagePlacer ? JsonSymbolFoliagePlacer[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/foliage_placer_type'], string>])>

export type JsonHeightFoliagePlacer = {
  /**
   * Value:
   * Range: 0..16
   */
  height: (NBTInt<{
    min: 0,
    max: 16,
  }> | number),
}

export type JsonLeaveVineTreeDecorator = {
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonMangroveRootPlacement = {
  /**
   * Value:
   * Range: 1..12
   */
  max_root_width: (NBTInt<{
    min: 1,
    max: 12,
  }> | number),
  /**
   * Value:
   * Range: 1..64
   */
  max_root_length: (NBTInt<{
    min: 1,
    max: 64,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  random_skew_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  can_grow_through: (
      | Array<JsonRegistry['minecraft:block']> | (
      JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)),
  muddy_roots_in: (
      | Array<JsonRegistry['minecraft:block']> | (
      JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)),
  muddy_roots_provider: JsonBlockStateProviderRef,
}

export type JsonMangroveRootPlacer = {
  mangrove_root_placement: JsonMangroveRootPlacement,
}

export type JsonMegaPineFoliagePlacer = {
  crown_height: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 24,
  }> | number)>,
}

export type JsonPaleMossTreeDecorator = {
  /**
   * Value:
   * Range: 0..1
   */
  leaves_probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  trunk_probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  ground_probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonPineFoliagePlacer = {
  height: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 24,
  }> | number)>,
}

export type JsonPlaceOnGroundTreeDecorator = {
  /**
   * Defaults to `128`.
   *
   * Value:
   * Range: 1..
   */
  tries?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Defaults to `2`.
   *
   * Value:
   * Range: 0..
   */
  radius?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Defaults to `1`.
   *
   * Value:
   * Range: 0..
   */
  height?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * The block to place on the ground.
   */
  block_state_provider: JsonBlockStateProviderRef,
}

export type JsonPoplarFoliagePlacer = {
  height: JsonIntProvider<(NBTInt<{
    min: 5,
    max: 16,
  }> | number)>,
  /**
   * Value:
   * Range: 0..1
   */
  side_hole_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonPoplarTrunkPlacer = {
  trunk_height_above_branches: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 8,
  }> | number)>,
  branch_amount: JsonIntProvider<(NBTInt<{
    min: 1,
    max: 4,
  }> | number)>,
}

export type JsonRandomSpreadFoliagePlacer = {
  foliage_height: JsonIntProvider<(NBTInt<{
    min: 1,
  }> | number)>,
  /**
   * Value:
   * Range: 0..256
   */
  leaf_placement_attempts: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonRootPlacer = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/root_placer_type'], string>, string>]?: ({
    type: S,
    root_provider: JsonBlockStateProviderRef,
    trunk_offset_y: JsonIntProvider<(NBTInt | number)>,
    above_root_placement?: JsonAboveRootPlacement,
  } & (S extends keyof JsonSymbolRootPlacer ? JsonSymbolRootPlacer[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/root_placer_type'], string>])>

export type JsonShelfMushroomTreeDecorator = {
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonSprucePineFoliagePlacer = {
  trunk_height: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 24,
  }> | number)>,
}

export type JsonThreeLayersFeatureSize = {
  /**
   * Value:
   * Range: 0..80
   */
  min_clipped_height?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..80
   */
  limit?: (NBTInt<{
    min: 0,
    max: 80,
  }> | number),
  /**
   * Value:
   * Range: 0..80
   */
  upper_limit?: (NBTInt<{
    min: 0,
    max: 80,
  }> | number),
  /**
   * Value:
   * Range: 0..16
   */
  lower_size?: (NBTInt<{
    min: 0,
    max: 16,
  }> | number),
  /**
   * Value:
   * Range: 0..16
   */
  middle_size?: (NBTInt<{
    min: 0,
    max: 16,
  }> | number),
  /**
   * Value:
   * Range: 0..16
   */
  upper_size?: (NBTInt<{
    min: 0,
    max: 16,
  }> | number),
}

export type JsonTreeConfig = ({
  ignore_vines?: boolean,
  minimum_size: JsonFeatureSize,
  trunk_provider: JsonBlockStateProviderRef,
  foliage_provider: JsonBlockStateProviderRef,
  root_placer?: JsonRootPlacer,
  trunk_placer: JsonTrunkPlacer,
  foliage_placer: JsonFoliagePlacer,
  decorators: Array<JsonTreeDecorator>,
} & {
  below_trunk_provider: JsonBlockStateProviderRef,
})

export type JsonTreeDecorator = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/tree_decorator_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolTreeDecorator ? JsonSymbolTreeDecorator[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/tree_decorator_type'], string>])>

export type JsonTrunkPlacer = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/trunk_placer_type'], string>, string>]?: ({
    type: S,
    /**
     * Value:
     * Range: 0..32
     */
    base_height: (NBTInt<{
      min: 0,
      max: 32,
    }> | number),
    /**
     * Value:
     * Range: 0..24
     */
    height_rand_a: (NBTInt<{
      min: 0,
      max: 24,
    }> | number),
    /**
     * Value:
     * Range: 0..24
     */
    height_rand_b: (NBTInt<{
      min: 0,
      max: 24,
    }> | number),
  } & (S extends keyof JsonSymbolTrunkPlacer ? JsonSymbolTrunkPlacer[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/trunk_placer_type'], string>])>

export type JsonTwoLayersFeatureSize = {
  /**
   * Value:
   * Range: 0..80
   */
  min_clipped_height?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..81
   */
  limit?: (NBTInt<{
    min: 0,
    max: 81,
  }> | number),
  /**
   * Value:
   * Range: 0..16
   */
  lower_size?: (NBTInt<{
    min: 0,
    max: 16,
  }> | number),
  /**
   * Value:
   * Range: 0..16
   */
  upper_size?: (NBTInt<{
    min: 0,
    max: 16,
  }> | number),
}

export type JsonUpwardsBranchingTrunkPlacer = {
  extra_branch_steps: JsonIntProvider<(NBTInt<{
    min: 1,
  }> | number)>,
  extra_branch_length: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
  /**
   * Value:
   * Range: 0..1
   */
  place_branch_per_log_probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  can_grow_through: (
      | Array<JsonRegistry['minecraft:block']> | (
      JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)),
}
type JsonFeatureSizeDispatcherMap = {
  'three_layers_feature_size': JsonFeatureSizeThreeLayersFeatureSize,
  'minecraft:three_layers_feature_size': JsonFeatureSizeThreeLayersFeatureSize,
  'two_layers_feature_size': JsonFeatureSizeTwoLayersFeatureSize,
  'minecraft:two_layers_feature_size': JsonFeatureSizeTwoLayersFeatureSize,
}
type JsonFeatureSizeKeys = keyof JsonFeatureSizeDispatcherMap
type JsonFeatureSizeFallback = (JsonFeatureSizeThreeLayersFeatureSize | JsonFeatureSizeTwoLayersFeatureSize)
type JsonFeatureSizeThreeLayersFeatureSize = JsonThreeLayersFeatureSize
type JsonFeatureSizeTwoLayersFeatureSize = JsonTwoLayersFeatureSize
export type JsonSymbolFeatureSize<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonFeatureSizeDispatcherMap
  : CASE extends 'keys' ? JsonFeatureSizeKeys : CASE extends '%fallback' ? JsonFeatureSizeFallback : never
type JsonFoliagePlacerDispatcherMap = {
  'blob_foliage_placer': JsonFoliagePlacerBlobFoliagePlacer,
  'minecraft:blob_foliage_placer': JsonFoliagePlacerBlobFoliagePlacer,
  'bush_foliage_placer': JsonFoliagePlacerBushFoliagePlacer,
  'minecraft:bush_foliage_placer': JsonFoliagePlacerBushFoliagePlacer,
  'cherry_foliage_placer': JsonFoliagePlacerCherryFoliagePlacer,
  'minecraft:cherry_foliage_placer': JsonFoliagePlacerCherryFoliagePlacer,
  'fancy_foliage_placer': JsonFoliagePlacerFancyFoliagePlacer,
  'minecraft:fancy_foliage_placer': JsonFoliagePlacerFancyFoliagePlacer,
  'jungle_foliage_placer': JsonFoliagePlacerJungleFoliagePlacer,
  'minecraft:jungle_foliage_placer': JsonFoliagePlacerJungleFoliagePlacer,
  'mega_pine_foliage_placer': JsonFoliagePlacerMegaPineFoliagePlacer,
  'minecraft:mega_pine_foliage_placer': JsonFoliagePlacerMegaPineFoliagePlacer,
  'pine_foliage_placer': JsonFoliagePlacerPineFoliagePlacer,
  'minecraft:pine_foliage_placer': JsonFoliagePlacerPineFoliagePlacer,
  'poplar_foliage_placer': JsonFoliagePlacerPoplarFoliagePlacer,
  'minecraft:poplar_foliage_placer': JsonFoliagePlacerPoplarFoliagePlacer,
  'random_spread_foliage_placer': JsonFoliagePlacerRandomSpreadFoliagePlacer,
  'minecraft:random_spread_foliage_placer': JsonFoliagePlacerRandomSpreadFoliagePlacer,
  'spruce_foliage_placer': JsonFoliagePlacerSpruceFoliagePlacer,
  'minecraft:spruce_foliage_placer': JsonFoliagePlacerSpruceFoliagePlacer,
}
type JsonFoliagePlacerKeys = keyof JsonFoliagePlacerDispatcherMap
type JsonFoliagePlacerFallback = (
  | JsonFoliagePlacerBlobFoliagePlacer
  | JsonFoliagePlacerBushFoliagePlacer
  | JsonFoliagePlacerCherryFoliagePlacer
  | JsonFoliagePlacerFancyFoliagePlacer
  | JsonFoliagePlacerJungleFoliagePlacer
  | JsonFoliagePlacerMegaPineFoliagePlacer
  | JsonFoliagePlacerPineFoliagePlacer
  | JsonFoliagePlacerPoplarFoliagePlacer
  | JsonFoliagePlacerRandomSpreadFoliagePlacer
  | JsonFoliagePlacerSpruceFoliagePlacer)
type JsonFoliagePlacerBlobFoliagePlacer = JsonHeightFoliagePlacer
type JsonFoliagePlacerBushFoliagePlacer = JsonHeightFoliagePlacer
type JsonFoliagePlacerCherryFoliagePlacer = JsonCherryFoliagePlacer
type JsonFoliagePlacerFancyFoliagePlacer = JsonHeightFoliagePlacer
type JsonFoliagePlacerJungleFoliagePlacer = JsonHeightFoliagePlacer
type JsonFoliagePlacerMegaPineFoliagePlacer = JsonMegaPineFoliagePlacer
type JsonFoliagePlacerPineFoliagePlacer = JsonPineFoliagePlacer
type JsonFoliagePlacerPoplarFoliagePlacer = JsonPoplarFoliagePlacer
type JsonFoliagePlacerRandomSpreadFoliagePlacer = JsonRandomSpreadFoliagePlacer
type JsonFoliagePlacerSpruceFoliagePlacer = JsonSprucePineFoliagePlacer
export type JsonSymbolFoliagePlacer<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonFoliagePlacerDispatcherMap
  : CASE extends 'keys' ? JsonFoliagePlacerKeys : CASE extends '%fallback' ? JsonFoliagePlacerFallback : never
type JsonRootPlacerDispatcherMap = {
  'mangrove_root_placer': JsonRootPlacerMangroveRootPlacer,
  'minecraft:mangrove_root_placer': JsonRootPlacerMangroveRootPlacer,
}
type JsonRootPlacerKeys = keyof JsonRootPlacerDispatcherMap
type JsonRootPlacerFallback = (JsonRootPlacerMangroveRootPlacer)
type JsonRootPlacerMangroveRootPlacer = JsonMangroveRootPlacer
export type JsonSymbolRootPlacer<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonRootPlacerDispatcherMap
  : CASE extends 'keys' ? JsonRootPlacerKeys : CASE extends '%fallback' ? JsonRootPlacerFallback : never
type JsonTreeDecoratorDispatcherMap = {
  'alter_ground': JsonTreeDecoratorAlterGround,
  'minecraft:alter_ground': JsonTreeDecoratorAlterGround,
  'attached_to_leaves': JsonTreeDecoratorAttachedToLeaves,
  'minecraft:attached_to_leaves': JsonTreeDecoratorAttachedToLeaves,
  'attached_to_logs': JsonTreeDecoratorAttachedToLogs,
  'minecraft:attached_to_logs': JsonTreeDecoratorAttachedToLogs,
  'beehive': JsonTreeDecoratorBeehive,
  'minecraft:beehive': JsonTreeDecoratorBeehive,
  'cocoa': JsonTreeDecoratorCocoa,
  'minecraft:cocoa': JsonTreeDecoratorCocoa,
  'creaking_heart': JsonTreeDecoratorCreakingHeart,
  'minecraft:creaking_heart': JsonTreeDecoratorCreakingHeart,
  'leave_vine': JsonTreeDecoratorLeaveVine,
  'minecraft:leave_vine': JsonTreeDecoratorLeaveVine,
  'pale_moss': JsonTreeDecoratorPaleMoss,
  'minecraft:pale_moss': JsonTreeDecoratorPaleMoss,
  'place_on_ground': JsonTreeDecoratorPlaceOnGround,
  'minecraft:place_on_ground': JsonTreeDecoratorPlaceOnGround,
  'shelf_mushroom': JsonTreeDecoratorShelfMushroom,
  'minecraft:shelf_mushroom': JsonTreeDecoratorShelfMushroom,
}
type JsonTreeDecoratorKeys = keyof JsonTreeDecoratorDispatcherMap
type JsonTreeDecoratorFallback = (
  | JsonTreeDecoratorAlterGround
  | JsonTreeDecoratorAttachedToLeaves
  | JsonTreeDecoratorAttachedToLogs
  | JsonTreeDecoratorBeehive
  | JsonTreeDecoratorCocoa
  | JsonTreeDecoratorCreakingHeart
  | JsonTreeDecoratorLeaveVine
  | JsonTreeDecoratorPaleMoss
  | JsonTreeDecoratorPlaceOnGround
  | JsonTreeDecoratorShelfMushroom)
type JsonTreeDecoratorAlterGround = JsonAlterGroundTreeDecorator
type JsonTreeDecoratorAttachedToLeaves = JsonAttachedToLeavesTreeDecorator
type JsonTreeDecoratorAttachedToLogs = JsonAttachedToLogsTreeDecorator
type JsonTreeDecoratorBeehive = JsonBeehiveTreeDecorator
type JsonTreeDecoratorCocoa = JsonCocoaTreeDecorator
type JsonTreeDecoratorCreakingHeart = JsonCreakingHeartTreeDecorator
type JsonTreeDecoratorLeaveVine = JsonLeaveVineTreeDecorator
type JsonTreeDecoratorPaleMoss = JsonPaleMossTreeDecorator
type JsonTreeDecoratorPlaceOnGround = JsonPlaceOnGroundTreeDecorator
type JsonTreeDecoratorShelfMushroom = JsonShelfMushroomTreeDecorator
export type JsonSymbolTreeDecorator<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonTreeDecoratorDispatcherMap
  : CASE extends 'keys' ? JsonTreeDecoratorKeys : CASE extends '%fallback' ? JsonTreeDecoratorFallback : never
type JsonTrunkPlacerDispatcherMap = {
  'bending_trunk_placer': JsonTrunkPlacerBendingTrunkPlacer,
  'minecraft:bending_trunk_placer': JsonTrunkPlacerBendingTrunkPlacer,
  'cherry_trunk_placer': JsonTrunkPlacerCherryTrunkPlacer,
  'minecraft:cherry_trunk_placer': JsonTrunkPlacerCherryTrunkPlacer,
  'dark_oak_trunk_placer': JsonTrunkPlacerDarkOakTrunkPlacer,
  'minecraft:dark_oak_trunk_placer': JsonTrunkPlacerDarkOakTrunkPlacer,
  'fancy_trunk_placer': JsonTrunkPlacerFancyTrunkPlacer,
  'minecraft:fancy_trunk_placer': JsonTrunkPlacerFancyTrunkPlacer,
  'forking_trunk_placer': JsonTrunkPlacerForkingTrunkPlacer,
  'minecraft:forking_trunk_placer': JsonTrunkPlacerForkingTrunkPlacer,
  'giant_trunk_placer': JsonTrunkPlacerGiantTrunkPlacer,
  'minecraft:giant_trunk_placer': JsonTrunkPlacerGiantTrunkPlacer,
  'mega_jungle_trunk_placer': JsonTrunkPlacerMegaJungleTrunkPlacer,
  'minecraft:mega_jungle_trunk_placer': JsonTrunkPlacerMegaJungleTrunkPlacer,
  'poplar_trunk_placer': JsonTrunkPlacerPoplarTrunkPlacer,
  'minecraft:poplar_trunk_placer': JsonTrunkPlacerPoplarTrunkPlacer,
  'straight_trunk_placer': JsonTrunkPlacerStraightTrunkPlacer,
  'minecraft:straight_trunk_placer': JsonTrunkPlacerStraightTrunkPlacer,
  'upwards_branching_trunk_placer': JsonTrunkPlacerUpwardsBranchingTrunkPlacer,
  'minecraft:upwards_branching_trunk_placer': JsonTrunkPlacerUpwardsBranchingTrunkPlacer,
}
type JsonTrunkPlacerKeys = keyof JsonTrunkPlacerDispatcherMap
type JsonTrunkPlacerFallback = (
  | JsonTrunkPlacerBendingTrunkPlacer
  | JsonTrunkPlacerCherryTrunkPlacer
  | JsonTrunkPlacerDarkOakTrunkPlacer
  | JsonTrunkPlacerFancyTrunkPlacer
  | JsonTrunkPlacerForkingTrunkPlacer
  | JsonTrunkPlacerGiantTrunkPlacer
  | JsonTrunkPlacerMegaJungleTrunkPlacer
  | JsonTrunkPlacerPoplarTrunkPlacer
  | JsonTrunkPlacerStraightTrunkPlacer
  | JsonTrunkPlacerUpwardsBranchingTrunkPlacer)
type JsonTrunkPlacerBendingTrunkPlacer = JsonBendingTrunkPlacer
type JsonTrunkPlacerCherryTrunkPlacer = JsonCherryTrunkPlacer
type JsonTrunkPlacerDarkOakTrunkPlacer = Record<string, never>
type JsonTrunkPlacerFancyTrunkPlacer = Record<string, never>
type JsonTrunkPlacerForkingTrunkPlacer = Record<string, never>
type JsonTrunkPlacerGiantTrunkPlacer = Record<string, never>
type JsonTrunkPlacerMegaJungleTrunkPlacer = Record<string, never>
type JsonTrunkPlacerPoplarTrunkPlacer = JsonPoplarTrunkPlacer
type JsonTrunkPlacerStraightTrunkPlacer = Record<string, never>
type JsonTrunkPlacerUpwardsBranchingTrunkPlacer = JsonUpwardsBranchingTrunkPlacer
export type JsonSymbolTrunkPlacer<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonTrunkPlacerDispatcherMap
  : CASE extends 'keys' ? JsonTrunkPlacerKeys : CASE extends '%fallback' ? JsonTrunkPlacerFallback : never
