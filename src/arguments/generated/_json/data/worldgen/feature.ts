import type { JsonBlockPredicate } from 'sandstone/arguments/generated/_json/data/worldgen/feature/block_predicate.ts'
import type {
  JsonBlockStateProvider,
} from 'sandstone/arguments/generated/_json/data/worldgen/feature/block_state_provider.ts'
import type { JsonConfiguredDecorator } from 'sandstone/arguments/generated/_json/data/worldgen/feature/decorator.ts'
import type {
  JsonPlacedFeatureListRef,
  JsonPlacedFeatureRef,
} from 'sandstone/arguments/generated/_json/data/worldgen/feature/placement.ts'
import type {
  JsonFallenTreeConfig,
  JsonTreeConfig,
} from 'sandstone/arguments/generated/_json/data/worldgen/feature/tree.ts'
import type {
  JsonCaveSurface,
  JsonFloatProvider,
  JsonIntProvider,
} from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type {
  JsonProcessorListRef,
  JsonRuleTest,
} from 'sandstone/arguments/generated/_json/data/worldgen/processor_list.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonDirection, JsonVerticalDirection } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonFluidState } from 'sandstone/arguments/generated/_json/util/fluid_state.ts'
import type { JsonRotation, JsonWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NamespacedString, NBTFloat, NBTInt, StructureClass, TagClass } from 'sandstone'

export type JsonBlockBlobConfig = {
  state: JsonBlockState,
  can_place_on: JsonBlockPredicate,
}

export type JsonBlockColumnConfig = {
  /**
   * Value:
   *
   *  - Down(`down`)
   *  - Up(`up`)
   *  - North(`north`)
   *  - East(`east`)
   *  - South(`south`)
   *  - West(`west`)
   */
  direction: JsonDirection,
  allowed_placement: JsonBlockPredicate,
  prioritize_tip: boolean,
  layers: Array<JsonBlockColumnLayer>,
}

export type JsonBlockColumnLayer = {
  height: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
  provider: JsonBlockStateProvider,
}

export type JsonBlockPileConfig = {
  state_provider: JsonBlockStateProvider,
}

export type JsonBlockPlacer = NonNullable<({
  [S in Extract<Extract<NamespacedString, string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolBlockPlacer ? JsonSymbolBlockPlacer[S] : JsonRootNBT))
}[Extract<NamespacedString, string>])>

export type JsonBlockStateRuleProviderEntry = {
  if_true: JsonBlockPredicate,
  then: JsonBlockStateProvider,
}

export type JsonColumnPlacer = {
  size: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
}

export type JsonColumnsConfig = {
  block: JsonBlockStateProvider,
  can_replace: JsonBlockPredicate,
  continue_through: JsonBlockPredicate,
  cannot_place_on: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
  column_reach: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 3,
  }> | number)>,
  column_count: JsonIntProvider<(NBTInt<{
    min: 1,
  }> | number)>,
  height: JsonIntProvider<(NBTInt<{
    min: 1,
    max: 10,
  }> | number)>,
  /**
   * The effective reach is limited by `height`.
   */
  cluster_reach: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 13,
  }> | number)>,
}

export type JsonConfiguredFeature = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/feature_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolFeatureConfig ? JsonSymbolFeatureConfig[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/feature_type'], string>])>

export type JsonConfiguredFeatureRef = (JsonRegistry['minecraft:worldgen/feature'] | JsonConfiguredFeature)

export type JsonCoralConfig = {
  feature: JsonPlacedFeatureRef,
}

export type JsonDecoratedConfig = {
  decorator: JsonConfiguredDecorator,
  feature: JsonFeatureRef,
}

export type JsonDeltaConfig = {
  contents: JsonBlockState,
  rim: JsonBlockState,
  size: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 16,
  }> | number)>,
  rim_size: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 16,
  }> | number)>,
}

export type JsonDiskConfig = {
  state_provider: JsonBlockStateProvider,
  radius: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 8,
  }> | number)>,
  /**
   * Value:
   * Range: 0..4
   */
  half_height: (NBTInt<{
    min: 0,
    max: 4,
  }> | number),
  target: JsonBlockPredicate,
}

export type JsonEmeraldOreConfig = {
  state: JsonBlockState,
  target: JsonBlockState,
}

export type JsonEndGatewayConfig = {
  exact: boolean,
  /**
   * Value:
   * List length range: 3
   */
  exit?: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
}

export type JsonEndPodiumConfig = {
  /**
   * Defaults to `false`.
   */
  active?: boolean,
}

export type JsonEndSpike = {
  centerX: (NBTInt | number),
  centerZ: (NBTInt | number),
  radius: (NBTInt | number),
  height: (NBTInt | number),
  guarded?: boolean,
}

export type JsonEndSpikeConfig = {
  spikes: Array<JsonEndSpike>,
  crystal_invulnerable?: boolean,
  /**
   * Value:
   * List length range: 3
   */
  crystal_beam_target?: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
}

export type JsonFeatureRef = JsonPlacedFeatureRef

export type JsonFillLayerConfig = {
  state: JsonBlockState,
  /**
   * Value:
   * Range: 0..255
   */
  height: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonForestRockConfig = {
  state: JsonBlockState,
}

export type JsonFossilConfig = {
  /**
   * If more corners are exposed to air, feature placement is cancelled.
   *
   * Value:
   * Range: 0..7
   */
  max_empty_corners_allowed: (NBTInt<{
    min: 0,
    max: 7,
  }> | number),
  fossil_structures: Array<(JsonRegistry['minecraft:structure'] | StructureClass)>,
  overlay_structures: Array<(JsonRegistry['minecraft:structure'] | StructureClass)>,
  fossil_processors: JsonProcessorListRef,
  overlay_processors: JsonProcessorListRef,
}

export type JsonGeodeBlockSettings = {
  filling_provider: JsonBlockStateProvider,
  inner_layer_provider: JsonBlockStateProvider,
  alternate_inner_layer_provider: JsonBlockStateProvider,
  middle_layer_provider: JsonBlockStateProvider,
  outer_layer_provider: JsonBlockStateProvider,
  /**
   * Value:
   * List length range: 1..
   */
  inner_placements: JsonNBTList<JsonBlockState, {
    leftExclusive: false,
    min: 1,
  }>,
  /**
   * Blocks that will not be replaced by the geode.
   */
  cannot_replace: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
  /**
   * When encountering an invalid block, feature placement is cancelled.
   */
  invalid_blocks: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
}

export type JsonGeodeConfig = {
  blocks: JsonGeodeBlockSettings,
  layers: JsonGeodeLayerSettings,
  crack: JsonGeodeCrackSettings,
  /**
   * Value:
   * Range: 0..1
   */
  noise_multiplier?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  use_potential_placements_chance?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  use_alternate_layer0_chance?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  placements_require_layer0_alternate?: boolean,
  outer_wall_distance?: JsonIntProvider<(NBTInt<{
    min: 1,
    max: 20,
  }> | number)>,
  distribution_points?: JsonIntProvider<(NBTInt<{
    min: 1,
    max: 20,
  }> | number)>,
  point_offset?: JsonIntProvider<(NBTInt<{
    min: 1,
    max: 10,
  }> | number)>,
  min_gen_offset?: (NBTInt | number),
  max_gen_offset?: (NBTInt | number),
  invalid_blocks_threshold: (NBTInt | number),
}

export type JsonGeodeCrackSettings = {
  /**
   * Value:
   * Range: 0..1
   */
  generate_crack_chance?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..5
   */
  base_crack_size?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..10
   */
  crack_point_offset?: (NBTInt<{
    min: 0,
    max: 10,
  }> | number),
}

export type JsonGeodeLayerSettings = {
  /**
   * Value:
   * Range: 0.01..50
   */
  filling?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0.01..50
   */
  inner_layer?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0.01..50
   */
  middle_layer?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0.01..50
   */
  outer_layer?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
}

export type JsonGrowingPlantConfig = {
  /**
   * Value:
   *
   *  - Down(`down`)
   *  - Up(`up`)
   *  - North(`north`)
   *  - East(`east`)
   *  - South(`south`)
   *  - West(`west`)
   */
  direction: JsonDirection,
  allow_water: boolean,
  height_distribution: Array<JsonGrowingPlantHeight>,
  body_provider: JsonBlockStateProvider,
  head_provider: JsonBlockStateProvider,
}

export type JsonGrowingPlantHeight = {
  weight: (NBTInt | number),
  data: JsonIntProvider<(NBTInt | number)>,
}

export type JsonHugeFungusConfig = {
  hat_state: JsonBlockState,
  decor_state: JsonBlockState,
  stem_state: JsonBlockState,
  valid_base_block: JsonBlockState,
  planted?: boolean,
  replaceable_blocks: JsonBlockPredicate,
}

export type JsonHugeMushroomConfig = {
  cap_provider: JsonBlockStateProvider,
  stem_provider: JsonBlockStateProvider,
  foliage_radius: (NBTInt | number),
  can_place_on: JsonBlockPredicate,
}

export type JsonIcebergConfig = {
  state: JsonBlockState,
}

export type JsonLakeConfig = {
  fluid: JsonBlockStateProvider,
  barrier: JsonBlockStateProvider,
  can_place_feature: JsonBlockPredicate,
  can_replace_with_air_or_fluid: JsonBlockPredicate,
  can_replace_with_barrier: JsonBlockPredicate,
}

export type JsonLargeDripstoneConfig = {
  replaceable_blocks: (
      | Array<JsonRegistry['minecraft:block']> | (
      JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)),
  /**
   * Value:
   * Range: 1..512
   */
  floor_to_ceiling_search_range?: (NBTInt<{
    min: 1,
  }> | number),
  column_radius: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 16,
  }> | number)>,
  height_scale: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number)>,
  /**
   * Value:
   * Range: 0..1
   */
  max_column_radius_to_cave_height_ratio: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  stalactite_bluntness: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number)>,
  stalagmite_bluntness: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number)>,
  wind_speed: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number)>,
  /**
   * Value:
   * Range: 0..100
   */
  min_radius_for_wind: (NBTInt<{
    min: 0,
    max: 100,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  min_bluntness_for_wind: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonModernNetherVegetationConfig = {
  /**
   * Value:
   * Range: 1..
   */
  spread_width: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..
   */
  spread_height: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonModernPatchConfig = {
  /**
   * Defaults to 7.
   *
   * Value:
   * Range: 0..
   */
  xz_spread?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Defaults to 3.
   *
   * Value:
   * Range: 0..
   */
  y_spread?: (NBTInt<{
    min: 0,
  }> | number),
  feature: JsonFeatureRef,
}

export type JsonMultifaceBlock = ('glow_lichen' | 'sculk_vein')

export type JsonMultifaceGrowthConfig = ({
  /**
   * Value:
   *
   *  - GlowLichen(`glow_lichen`)
   *  - SculkVein(`sculk_vein`)
   */
  block: (JsonMultifaceBlock | `minecraft:${JsonMultifaceBlock}`),
} & {
  /**
   * Value:
   * Range: 1..64
   */
  search_range?: (NBTInt<{
    min: 1,
    max: 64,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_spreading?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  can_place_on_floor?: boolean,
  can_place_on_ceiling?: boolean,
  can_place_on_wall?: boolean,
  can_be_placed_on?: (
      | Array<JsonRegistry['minecraft:block']> | (
      JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)),
})

export type JsonNetherForestVegetationConfig = ({
  state_provider: JsonBlockStateProvider,
} & {
  /**
   * Value:
   * Range: 1..
   */
  spread_width: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..
   */
  spread_height: (NBTInt<{
    min: 1,
  }> | number),
})

export type JsonNetherrackReplaceBlobsConfig = {
  state: JsonBlockState,
  target: JsonBlockState,
  radius: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 12,
  }> | number)>,
}

export type JsonOldPatchConfig = {
  can_replace?: boolean,
  project?: boolean,
  need_water?: boolean,
  /**
   * Value:
   * Range: 0..
   */
  xspread?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..
   */
  yspread?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..
   */
  zspread?: (NBTInt<{
    min: 0,
  }> | number),
  state_provider: JsonBlockStateProvider,
  block_placer: JsonBlockPlacer,
  whitelist: Array<JsonBlockState>,
  blacklist: Array<JsonBlockState>,
}

export type JsonOldSimpleBlockConfig = {
  place_on: Array<JsonBlockState>,
  place_in: Array<JsonBlockState>,
  place_under: Array<JsonBlockState>,
}

export type JsonOptionalSimpleBlockConfig = {
  place_on?: Array<JsonBlockState>,
  place_in?: Array<JsonBlockState>,
  place_under?: Array<JsonBlockState>,
}

export type JsonOreConfig = {
  targets: Array<JsonTargetBlock>,
  /**
   * Value:
   * Range: 0..64
   */
  size: (NBTInt<{
    min: 0,
    max: 64,
  }> | number),
  /**
   * Chance that feature placement will be discarded if the ore is exposed to air blocks.
   *
   * Value:
   * Range: 0..1
   */
  discard_chance_on_air_exposure: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonOverlayConfig = {
  /**
   * The features to generate, in order. \
   * All features are placed regardless of individual placement success.
   */
  features: JsonPlacedFeatureListRef,
}

export type JsonProbabilityConfig = {
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

export type JsonProjectedSquareConfig = {
  block: JsonBlockStateProvider,
  project_through: JsonBlockPredicate,
  size: JsonIntProvider<(NBTInt<{
    min: 1,
    max: 16,
  }> | number)>,
  /**
   * Value:
   * Range: 0..
   */
  max_projection_height: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonRandomBooleanSelector = {
  feature_false: JsonFeatureRef,
  feature_true: JsonFeatureRef,
}

export type JsonRandomFeatureEntry = {
  /**
   * Value:
   * Range: 0..1
   */
  chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  feature: JsonFeatureRef,
}

export type JsonRandomNeighborSpreadConfig = {
  block: JsonBlockStateProvider,
  accepted_neighbors: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
  can_replace: JsonBlockPredicate,
  attempts: JsonIntProvider<(NBTInt<{
    min: 1,
  }> | number)>,
  xz_offset: JsonIntProvider<(NBTInt<{
    min: -16,
    max: 16,
  }> | number)>,
  y_offset: JsonIntProvider<(NBTInt<{
    min: -16,
    max: 16,
  }> | number)>,
}

export type JsonRandomPatchConfig = ({
  /**
   * How many attempts will be made to find a placement. Defaults to 128.
   *
   * Value:
   * Range: 1..
   */
  tries?: (NBTInt<{
    min: 1,
  }> | number),
} & {
  /**
   * Defaults to 7.
   *
   * Value:
   * Range: 0..
   */
  xz_spread?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Defaults to 3.
   *
   * Value:
   * Range: 0..
   */
  y_spread?: (NBTInt<{
    min: 0,
  }> | number),
  feature: JsonFeatureRef,
})

export type JsonRandomSelector = {
  features: Array<{
    /**
     * Value:
     * Range: 0..1
     */
    chance: (NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
      min: 0,
      max: 1,
    }> | number),
    feature: JsonFeatureRef,
  }>,
  default: JsonFeatureRef,
}

export type JsonReplaceSingleBlockConfig = {
  targets: Array<JsonTargetBlock>,
}

export type JsonRootSystemConfig = {
  /**
   * Value:
   * Range: 1..64
   */
  required_vertical_space_for_tree: (NBTInt<{
    min: 1,
    max: 64,
  }> | number),
  /**
   * Value:
   * Range: 0..16
   */
  level_test_distance: (NBTInt<{
    min: 0,
    max: 16,
  }> | number),
  /**
   * Value:
   * Range: 0..64
   */
  max_level_deviation: (NBTInt<{
    min: 0,
    max: 64,
  }> | number),
  /**
   * Value:
   * Range: 1..64
   */
  root_radius: (NBTInt<{
    min: 1,
    max: 64,
  }> | number),
  /**
   * Value:
   * Range: 1..256
   */
  root_placement_attempts: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..4096
   */
  root_column_max_height: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..64
   */
  hanging_root_radius: (NBTInt<{
    min: 1,
    max: 64,
  }> | number),
  /**
   * Value:
   * Range: 1..16
   */
  hanging_roots_vertical_span: (NBTInt<{
    min: 1,
    max: 16,
  }> | number),
  /**
   * Value:
   * Range: 0..256
   */
  hanging_root_placement_attempts: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 1..64
   */
  allowed_vertical_water_for_tree: (NBTInt<{
    min: 1,
    max: 64,
  }> | number),
  root_replaceable: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
  root_state_provider: JsonBlockStateProvider,
  hanging_root_state_provider: JsonBlockStateProvider,
  allowed_tree_position: JsonBlockPredicate,
  feature: JsonFeatureRef,
}

export type JsonRuleBasedBlockStateProvider = ({
  fallback?: JsonBlockStateProvider,
} & {
  rules: Array<{
    if_true: JsonBlockPredicate,
    then: JsonBlockStateProvider,
  }>,
})

export type JsonSculkPatchConfig = {
  /**
   * Value:
   * Range: 1..32
   */
  charge_count: (NBTInt<{
    min: 1,
    max: 32,
  }> | number),
  /**
   * Value:
   * Range: 1..500
   */
  amount_per_charge: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..64
   */
  spread_attempts: (NBTInt<{
    min: 1,
    max: 64,
  }> | number),
  /**
   * Value:
   * Range: 0..8
   */
  growth_rounds: (NBTInt<{
    min: 0,
    max: 8,
  }> | number),
  /**
   * Value:
   * Range: 0..8
   */
  spread_rounds: (NBTInt<{
    min: 0,
    max: 8,
  }> | number),
}

export type JsonSeaPickleConfig = {
  count: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
}

export type JsonSequenceConfig = {
  /**
   * The features to generate, in order. \
   * If any feature in the list is not placed, the following features will also be skipped.
   */
  features: JsonPlacedFeatureListRef,
}

export type JsonSimpleBlockConfig = {
  to_place: JsonBlockStateProvider,
  /**
   * Whether to schedule a block update. Defaults to `false`.
   */
  schedule_tick?: boolean,
}

export type JsonSimpleRandomSelectorConfig = {
  features: JsonPlacedFeatureListRef,
}

export type JsonSingleBlockPillarConfig = {
  block: JsonBlockStateProvider,
  /**
   * Defaults to "always true".
   */
  can_replace?: JsonBlockPredicate,
  /**
   * Value:
   *
   *  - Down(`down`)
   *  - Up(`up`)
   */
  direction: JsonVerticalDirection,
  /**
   * Defaults to 1.
   *
   * Value:
   * Range: 0..1
   */
  chance_to_continue?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  cap_feature?: JsonPlacedFeatureRef,
}

export type JsonSmallDripstoneConfig = {
  /**
   * Value:
   * Range: 0..100
   */
  max_placements?: (NBTInt<{
    min: 0,
    max: 100,
  }> | number),
  /**
   * Value:
   * Range: 0..20
   */
  empty_space_search_radius?: (NBTInt<{
    min: 0,
    max: 20,
  }> | number),
  /**
   * Value:
   * Range: 0..20
   */
  max_offset_from_origin?: (NBTInt<{
    min: 0,
    max: 20,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_taller_dripstone?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonSpeleothemClusterConfig = {
  base_block: JsonBlockState,
  pointed_block: JsonBlockState,
  replaceable_blocks: (
      | Array<JsonRegistry['minecraft:block']> | (
      JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)),
  /**
   * Value:
   * Range: 1..512
   */
  floor_to_ceiling_search_range: (NBTInt<{
    min: 1,
  }> | number),
  height: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
  radius: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
  /**
   * Max height difference between the stalagmite and stalactite.
   *
   * Value:
   * Range: 0..64
   */
  max_stalagmite_stalactite_height_diff: (NBTInt<{
    min: 0,
    max: 64,
  }> | number),
  /**
   * Value:
   * Range: 1..64
   */
  height_deviation: (NBTInt<{
    min: 1,
    max: 64,
  }> | number),
  speleothem_block_layer_thickness: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
  density: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number)>,
  wetness: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number)>,
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_speleothem_at_max_distance_from_center: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..64
   */
  max_distance_from_edge_affecting_chance_of_speleothem: (NBTInt<{
    min: 1,
    max: 64,
  }> | number),
  /**
   * Value:
   * Range: 1..64
   */
  max_distance_from_center_affecting_height_bias: (NBTInt<{
    min: 1,
    max: 64,
  }> | number),
}

export type JsonSpeleothemConfig = {
  base_block: JsonBlockState,
  pointed_block: JsonBlockState,
  replaceable_blocks: (
      | Array<JsonRegistry['minecraft:block']> | (
      JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)),
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_taller_generation?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_directional_spread?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_spread_radius2?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_spread_radius3?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonSpikeConfig = {
  state: JsonBlockState,
  can_place_on: JsonBlockPredicate,
  can_replace: JsonBlockPredicate,
}

export type JsonSpringConfig = {
  state: JsonFluidState,
  rock_count: (NBTInt | number),
  hole_count: (NBTInt | number),
  requires_block_below: boolean,
  valid_blocks: (
      | Array<JsonRegistry['minecraft:block']> | (
      JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)),
}

export type JsonTargetBlock = {
  target: JsonRuleTest,
  state: JsonBlockState,
}

export type JsonTemplateConfig = {
  templates: JsonWeightedList<JsonTemplateEntry>,
  processors?: JsonProcessorListRef,
}

export type JsonTemplateEntry = {
  /**
   * The structure template to place.
   */
  id: (JsonRegistry['minecraft:structure'] | StructureClass),
  /**
   * Rotations to choose from and apply to this template, centered around the origin.
   * If not specified, defaults to all allowed rotations.
   */
  rotations?: Array<JsonRotation>,
}

export type JsonTwistingVinesConfig = {
  /**
   * Value:
   * Range: 1..
   */
  spread_width: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..
   */
  spread_height: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..
   */
  max_height: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonUnderwaterMagmaConfig = {
  /**
   * Value:
   * Range: 0..512
   */
  floor_search_range: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..64
   */
  placement_radius_around_floor: (NBTInt<{
    min: 0,
    max: 64,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  placement_probability_per_valid_position: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonVegetationPatchConfig = {
  /**
   * Value:
   *
   *  - Floor(`floor`)
   *  - Ceiling(`ceiling`)
   */
  surface: JsonCaveSurface,
  depth: JsonIntProvider<(NBTInt<{
    min: 1,
  }> | number)>,
  /**
   * Value:
   * Range: 1..256
   */
  vertical_range: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  extra_bottom_block_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  extra_edge_column_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  vegetation_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  xz_radius: JsonIntProvider<(NBTInt | number)>,
  replaceable: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
  ground_state: JsonBlockStateProvider,
  vegetation_feature: JsonFeatureRef,
}

export type JsonWeightedRandomFeatureConfig = {
  features: JsonWeightedList<JsonPlacedFeatureRef>,
}
type JsonBlockPlacerDispatcherMap = {
  'column_placer': JsonBlockPlacerColumnPlacer,
  'minecraft:column_placer': JsonBlockPlacerColumnPlacer,
  'double_plant_placer': JsonBlockPlacerDoublePlantPlacer,
  'minecraft:double_plant_placer': JsonBlockPlacerDoublePlantPlacer,
  'simple_block_placer': JsonBlockPlacerSimpleBlockPlacer,
  'minecraft:simple_block_placer': JsonBlockPlacerSimpleBlockPlacer,
}
type JsonBlockPlacerKeys = keyof JsonBlockPlacerDispatcherMap
type JsonBlockPlacerFallback = (
  | JsonBlockPlacerColumnPlacer
  | JsonBlockPlacerDoublePlantPlacer
  | JsonBlockPlacerSimpleBlockPlacer)
type JsonBlockPlacerColumnPlacer = JsonColumnPlacer
type JsonBlockPlacerDoublePlantPlacer = Record<string, never>
type JsonBlockPlacerSimpleBlockPlacer = Record<string, never>
export type JsonSymbolBlockPlacer<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonBlockPlacerDispatcherMap
  : CASE extends 'keys' ? JsonBlockPlacerKeys : CASE extends '%fallback' ? JsonBlockPlacerFallback : never
type JsonFeatureConfigDispatcherMap = {
  'bamboo': JsonFeatureConfigBamboo,
  'minecraft:bamboo': JsonFeatureConfigBamboo,
  'block_blob': JsonFeatureConfigBlockBlob,
  'minecraft:block_blob': JsonFeatureConfigBlockBlob,
  'block_column': JsonFeatureConfigBlockColumn,
  'minecraft:block_column': JsonFeatureConfigBlockColumn,
  'block_pile': JsonFeatureConfigBlockPile,
  'minecraft:block_pile': JsonFeatureConfigBlockPile,
  'coral_claw': JsonFeatureConfigCoralClaw,
  'minecraft:coral_claw': JsonFeatureConfigCoralClaw,
  'coral_tree': JsonFeatureConfigCoralTree,
  'minecraft:coral_tree': JsonFeatureConfigCoralTree,
  'delta_feature': JsonFeatureConfigDeltaFeature,
  'minecraft:delta_feature': JsonFeatureConfigDeltaFeature,
  'disk': JsonFeatureConfigDisk,
  'minecraft:disk': JsonFeatureConfigDisk,
  'emerald_ore': JsonFeatureConfigEmeraldOre,
  'minecraft:emerald_ore': JsonFeatureConfigEmeraldOre,
  'end_gateway': JsonFeatureConfigEndGateway,
  'minecraft:end_gateway': JsonFeatureConfigEndGateway,
  'end_podium': JsonFeatureConfigEndPodium,
  'minecraft:end_podium': JsonFeatureConfigEndPodium,
  'end_spike': JsonFeatureConfigEndSpike,
  'minecraft:end_spike': JsonFeatureConfigEndSpike,
  'fallen_tree': JsonFeatureConfigFallenTree,
  'minecraft:fallen_tree': JsonFeatureConfigFallenTree,
  'fill_layer': JsonFeatureConfigFillLayer,
  'minecraft:fill_layer': JsonFeatureConfigFillLayer,
  'flower': JsonFeatureConfigFlower,
  'minecraft:flower': JsonFeatureConfigFlower,
  'fossil': JsonFeatureConfigFossil,
  'minecraft:fossil': JsonFeatureConfigFossil,
  'geode': JsonFeatureConfigGeode,
  'minecraft:geode': JsonFeatureConfigGeode,
  'glow_lichen': JsonFeatureConfigGlowLichen,
  'minecraft:glow_lichen': JsonFeatureConfigGlowLichen,
  'huge_brown_mushroom': JsonFeatureConfigHugeBrownMushroom,
  'minecraft:huge_brown_mushroom': JsonFeatureConfigHugeBrownMushroom,
  'huge_fungus': JsonFeatureConfigHugeFungus,
  'minecraft:huge_fungus': JsonFeatureConfigHugeFungus,
  'huge_red_mushroom': JsonFeatureConfigHugeRedMushroom,
  'minecraft:huge_red_mushroom': JsonFeatureConfigHugeRedMushroom,
  'ice_patch': JsonFeatureConfigIcePatch,
  'minecraft:ice_patch': JsonFeatureConfigIcePatch,
  'iceberg': JsonFeatureConfigIceberg,
  'minecraft:iceberg': JsonFeatureConfigIceberg,
  'lake': JsonFeatureConfigLake,
  'minecraft:lake': JsonFeatureConfigLake,
  'large_dripstone': JsonFeatureConfigLargeDripstone,
  'minecraft:large_dripstone': JsonFeatureConfigLargeDripstone,
  'multiface_growth': JsonFeatureConfigMultifaceGrowth,
  'minecraft:multiface_growth': JsonFeatureConfigMultifaceGrowth,
  'netherrack_replace_blobs': JsonFeatureConfigNetherrackReplaceBlobs,
  'minecraft:netherrack_replace_blobs': JsonFeatureConfigNetherrackReplaceBlobs,
  'no_bonemeal_flower': JsonFeatureConfigNoBonemealFlower,
  'minecraft:no_bonemeal_flower': JsonFeatureConfigNoBonemealFlower,
  'no_surface_ore': JsonFeatureConfigNoSurfaceOre,
  'minecraft:no_surface_ore': JsonFeatureConfigNoSurfaceOre,
  'ore': JsonFeatureConfigOre,
  'minecraft:ore': JsonFeatureConfigOre,
  'overlay': JsonFeatureConfigOverlay,
  'minecraft:overlay': JsonFeatureConfigOverlay,
  'projected_random_patchy_square': JsonFeatureConfigProjectedRandomPatchySquare,
  'minecraft:projected_random_patchy_square': JsonFeatureConfigProjectedRandomPatchySquare,
  'random_boolean_selector': JsonFeatureConfigRandomBooleanSelector,
  'minecraft:random_boolean_selector': JsonFeatureConfigRandomBooleanSelector,
  'random_neighbor_spread': JsonFeatureConfigRandomNeighborSpread,
  'minecraft:random_neighbor_spread': JsonFeatureConfigRandomNeighborSpread,
  'random_patch': JsonFeatureConfigRandomPatch,
  'minecraft:random_patch': JsonFeatureConfigRandomPatch,
  'random_selector': JsonFeatureConfigRandomSelector,
  'minecraft:random_selector': JsonFeatureConfigRandomSelector,
  'replace_single_block': JsonFeatureConfigReplaceSingleBlock,
  'minecraft:replace_single_block': JsonFeatureConfigReplaceSingleBlock,
  'root_system': JsonFeatureConfigRootSystem,
  'minecraft:root_system': JsonFeatureConfigRootSystem,
  'scattered_ore': JsonFeatureConfigScatteredOre,
  'minecraft:scattered_ore': JsonFeatureConfigScatteredOre,
  'sculk_patch': JsonFeatureConfigSculkPatch,
  'minecraft:sculk_patch': JsonFeatureConfigSculkPatch,
  'sequence': JsonFeatureConfigSequence,
  'minecraft:sequence': JsonFeatureConfigSequence,
  'simple_block': JsonFeatureConfigSimpleBlock,
  'minecraft:simple_block': JsonFeatureConfigSimpleBlock,
  'simple_random_selector': JsonFeatureConfigSimpleRandomSelector,
  'minecraft:simple_random_selector': JsonFeatureConfigSimpleRandomSelector,
  'single_block_pillar': JsonFeatureConfigSingleBlockPillar,
  'minecraft:single_block_pillar': JsonFeatureConfigSingleBlockPillar,
  'speleothem': JsonFeatureConfigSpeleothem,
  'minecraft:speleothem': JsonFeatureConfigSpeleothem,
  'speleothem_cluster': JsonFeatureConfigSpeleothemCluster,
  'minecraft:speleothem_cluster': JsonFeatureConfigSpeleothemCluster,
  'spike': JsonFeatureConfigSpike,
  'minecraft:spike': JsonFeatureConfigSpike,
  'spring_feature': JsonFeatureConfigSpringFeature,
  'minecraft:spring_feature': JsonFeatureConfigSpringFeature,
  'stepped_column_cluster': JsonFeatureConfigSteppedColumnCluster,
  'minecraft:stepped_column_cluster': JsonFeatureConfigSteppedColumnCluster,
  'template': JsonFeatureConfigTemplate,
  'minecraft:template': JsonFeatureConfigTemplate,
  'tree': JsonFeatureConfigTree,
  'minecraft:tree': JsonFeatureConfigTree,
  'underwater_magma': JsonFeatureConfigUnderwaterMagma,
  'minecraft:underwater_magma': JsonFeatureConfigUnderwaterMagma,
  'vegetation_patch': JsonFeatureConfigVegetationPatch,
  'minecraft:vegetation_patch': JsonFeatureConfigVegetationPatch,
  'waterlogged_vegetation_patch': JsonFeatureConfigWaterloggedVegetationPatch,
  'minecraft:waterlogged_vegetation_patch': JsonFeatureConfigWaterloggedVegetationPatch,
  'weighted_random_selector': JsonFeatureConfigWeightedRandomSelector,
  'minecraft:weighted_random_selector': JsonFeatureConfigWeightedRandomSelector,
}
type JsonFeatureConfigKeys = keyof JsonFeatureConfigDispatcherMap
type JsonFeatureConfigFallback = (
  | JsonFeatureConfigBamboo
  | JsonFeatureConfigBlockBlob
  | JsonFeatureConfigBlockColumn
  | JsonFeatureConfigBlockPile
  | JsonFeatureConfigCoralClaw
  | JsonFeatureConfigCoralTree
  | JsonFeatureConfigDeltaFeature
  | JsonFeatureConfigDisk
  | JsonFeatureConfigEmeraldOre
  | JsonFeatureConfigEndGateway
  | JsonFeatureConfigEndPodium
  | JsonFeatureConfigEndSpike
  | JsonFeatureConfigFallenTree
  | JsonFeatureConfigFillLayer
  | JsonFeatureConfigFlower
  | JsonFeatureConfigFossil
  | JsonFeatureConfigGeode
  | JsonFeatureConfigGlowLichen
  | JsonFeatureConfigHugeBrownMushroom
  | JsonFeatureConfigHugeFungus
  | JsonFeatureConfigHugeRedMushroom
  | JsonFeatureConfigIcePatch
  | JsonFeatureConfigIceberg
  | JsonFeatureConfigLake
  | JsonFeatureConfigLargeDripstone
  | JsonFeatureConfigMultifaceGrowth
  | JsonFeatureConfigNetherrackReplaceBlobs
  | JsonFeatureConfigNoBonemealFlower
  | JsonFeatureConfigNoSurfaceOre
  | JsonFeatureConfigOre
  | JsonFeatureConfigOverlay
  | JsonFeatureConfigProjectedRandomPatchySquare
  | JsonFeatureConfigRandomBooleanSelector
  | JsonFeatureConfigRandomNeighborSpread
  | JsonFeatureConfigRandomPatch
  | JsonFeatureConfigRandomSelector
  | JsonFeatureConfigReplaceSingleBlock
  | JsonFeatureConfigRootSystem
  | JsonFeatureConfigScatteredOre
  | JsonFeatureConfigSculkPatch
  | JsonFeatureConfigSequence
  | JsonFeatureConfigSimpleBlock
  | JsonFeatureConfigSimpleRandomSelector
  | JsonFeatureConfigSingleBlockPillar
  | JsonFeatureConfigSpeleothem
  | JsonFeatureConfigSpeleothemCluster
  | JsonFeatureConfigSpike
  | JsonFeatureConfigSpringFeature
  | JsonFeatureConfigSteppedColumnCluster
  | JsonFeatureConfigTemplate
  | JsonFeatureConfigTree
  | JsonFeatureConfigUnderwaterMagma
  | JsonFeatureConfigVegetationPatch
  | JsonFeatureConfigWaterloggedVegetationPatch
  | JsonFeatureConfigWeightedRandomSelector)
type JsonFeatureConfigBamboo = JsonProbabilityConfig
type JsonFeatureConfigBlockBlob = JsonBlockBlobConfig
type JsonFeatureConfigBlockColumn = JsonBlockColumnConfig
type JsonFeatureConfigBlockPile = JsonBlockPileConfig
type JsonFeatureConfigCoralClaw = JsonCoralConfig
type JsonFeatureConfigCoralTree = JsonCoralConfig
type JsonFeatureConfigDeltaFeature = JsonDeltaConfig
type JsonFeatureConfigDisk = JsonDiskConfig
type JsonFeatureConfigEmeraldOre = JsonEmeraldOreConfig
type JsonFeatureConfigEndGateway = JsonEndGatewayConfig
type JsonFeatureConfigEndPodium = JsonEndPodiumConfig
type JsonFeatureConfigEndSpike = JsonEndSpikeConfig
type JsonFeatureConfigFallenTree = JsonFallenTreeConfig
type JsonFeatureConfigFillLayer = JsonFillLayerConfig
type JsonFeatureConfigFlower = JsonRandomPatchConfig
type JsonFeatureConfigFossil = JsonFossilConfig
type JsonFeatureConfigGeode = JsonGeodeConfig
type JsonFeatureConfigGlowLichen = JsonMultifaceGrowthConfig
type JsonFeatureConfigHugeBrownMushroom = JsonHugeMushroomConfig
type JsonFeatureConfigHugeFungus = JsonHugeFungusConfig
type JsonFeatureConfigHugeRedMushroom = JsonHugeMushroomConfig
type JsonFeatureConfigIcePatch = JsonDiskConfig
type JsonFeatureConfigIceberg = JsonIcebergConfig
type JsonFeatureConfigLake = JsonLakeConfig
type JsonFeatureConfigLargeDripstone = JsonLargeDripstoneConfig
type JsonFeatureConfigMultifaceGrowth = JsonMultifaceGrowthConfig
type JsonFeatureConfigNetherrackReplaceBlobs = JsonNetherrackReplaceBlobsConfig
type JsonFeatureConfigNoBonemealFlower = JsonRandomPatchConfig
type JsonFeatureConfigNoSurfaceOre = JsonOreConfig
type JsonFeatureConfigOre = JsonOreConfig
type JsonFeatureConfigOverlay = JsonOverlayConfig
type JsonFeatureConfigProjectedRandomPatchySquare = JsonProjectedSquareConfig
type JsonFeatureConfigRandomBooleanSelector = JsonRandomBooleanSelector
type JsonFeatureConfigRandomNeighborSpread = JsonRandomNeighborSpreadConfig
type JsonFeatureConfigRandomPatch = JsonRandomPatchConfig
type JsonFeatureConfigRandomSelector = JsonRandomSelector
type JsonFeatureConfigReplaceSingleBlock = JsonReplaceSingleBlockConfig
type JsonFeatureConfigRootSystem = JsonRootSystemConfig
type JsonFeatureConfigScatteredOre = JsonOreConfig
type JsonFeatureConfigSculkPatch = JsonSculkPatchConfig
type JsonFeatureConfigSequence = JsonSequenceConfig
type JsonFeatureConfigSimpleBlock = JsonSimpleBlockConfig
type JsonFeatureConfigSimpleRandomSelector = JsonSimpleRandomSelectorConfig
type JsonFeatureConfigSingleBlockPillar = JsonSingleBlockPillarConfig
type JsonFeatureConfigSpeleothem = JsonSpeleothemConfig
type JsonFeatureConfigSpeleothemCluster = JsonSpeleothemClusterConfig
type JsonFeatureConfigSpike = JsonSpikeConfig
type JsonFeatureConfigSpringFeature = JsonSpringConfig
type JsonFeatureConfigSteppedColumnCluster = JsonColumnsConfig
type JsonFeatureConfigTemplate = JsonTemplateConfig
type JsonFeatureConfigTree = JsonTreeConfig
type JsonFeatureConfigUnderwaterMagma = JsonUnderwaterMagmaConfig
type JsonFeatureConfigVegetationPatch = JsonVegetationPatchConfig
type JsonFeatureConfigWaterloggedVegetationPatch = JsonVegetationPatchConfig
type JsonFeatureConfigWeightedRandomSelector = JsonWeightedRandomFeatureConfig
export type JsonSymbolFeatureConfig<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonFeatureConfigDispatcherMap
  : CASE extends 'keys' ? JsonFeatureConfigKeys : CASE extends '%fallback' ? JsonFeatureConfigFallback : never
