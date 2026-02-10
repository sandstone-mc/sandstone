import type { CaveSurface, FloatProvider, IntProvider } from 'sandstone/arguments/generated/data/worldgen.ts'
import type { BlockPredicate } from 'sandstone/arguments/generated/data/worldgen/feature/block_predicate.ts'
import type { BlockStateProvider } from 'sandstone/arguments/generated/data/worldgen/feature/block_state_provider.ts'
import type { ConfiguredDecorator } from 'sandstone/arguments/generated/data/worldgen/feature/decorator.ts'
import type { PlacedFeatureRef } from 'sandstone/arguments/generated/data/worldgen/feature/placement.ts'
import type { FallenTreeConfig, TreeConfig } from 'sandstone/arguments/generated/data/worldgen/feature/tree.ts'
import type { ProcessorListRef, RuleTest } from 'sandstone/arguments/generated/data/worldgen/processor_list.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { Direction } from 'sandstone/arguments/generated/util/direction.ts'
import type { FluidState } from 'sandstone/arguments/generated/util/fluid_state.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt, NBTList, StructureClass, TagClass } from 'sandstone'

export type BlockBlobConfig = {
  state: BlockState,
  can_place_on: BlockPredicate,
}

export type BlockColumnConfig = {
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
  direction: Direction,
  allowed_placement: BlockPredicate,
  prioritize_tip: boolean,
  layers: Array<BlockColumnLayer>,
}

export type BlockColumnLayer = {
  height: IntProvider<NBTInt<{
    min: 0,
  }>>,
  provider: BlockStateProvider,
}

export type BlockPileConfig = {
  state_provider: BlockStateProvider,
}

export type BlockPlacer = NonNullable<({
  [S in Extract<`${string}:${string}`, string>]?: ({
    type: S,
  } & (S extends keyof SymbolBlockPlacer ? SymbolBlockPlacer[S] : RootNBT))
}[`${string}:${string}`])>

export type ColumnPlacer = {
  size: IntProvider<NBTInt<{
    min: 0,
  }>>,
}

export type ColumnsConfig = {
  reach: IntProvider<NBTInt<{
    min: 0,
    max: 3,
  }>>,
  height: IntProvider<NBTInt<{
    min: 1,
    max: 10,
  }>>,
}

export type ConfiguredFeature = NonNullable<({
  [S in Extract<Registry['minecraft:worldgen/feature'], string>]?: {
    type: S,
    config: (S extends keyof SymbolFeatureConfig ? SymbolFeatureConfig[S] : RootNBT),
  }
}[Registry['minecraft:worldgen/feature']])>

export type ConfiguredFeatureRef = (Registry['minecraft:worldgen/configured_feature'] | ConfiguredFeature)

export type DecoratedConfig = {
  decorator: ConfiguredDecorator,
  feature: FeatureRef,
}

export type DeltaConfig = {
  contents: BlockState,
  rim: BlockState,
  size: IntProvider<NBTInt<{
    min: 0,
    max: 16,
  }>>,
  rim_size: IntProvider<NBTInt<{
    min: 0,
    max: 16,
  }>>,
}

export type DiskConfig = {
  state_provider: RuleBasedBlockStateProvider,
  radius: IntProvider<NBTInt<{
    min: 0,
    max: 8,
  }>>,
  /**
   * Value:
   * Range: 0..4
   */
  half_height: NBTInt<{
    min: 0,
    max: 4,
  }>,
  target: BlockPredicate,
}

export type DripstoneClusterConfig = {
  /**
   * Value:
   * Range: 1..512
   */
  floor_to_ceiling_search_range: NBTInt<{
    min: 1,
  }>,
  height: IntProvider<NBTInt<{
    min: 0,
  }>>,
  radius: IntProvider<NBTInt<{
    min: 0,
  }>>,
  /**
   * Max height difference between the stalagmite and stalactite.
   *
   * Value:
   * Range: 0..64
   */
  max_stalagmite_stalactite_height_diff: NBTInt<{
    min: 0,
    max: 64,
  }>,
  /**
   * Value:
   * Range: 1..64
   */
  height_deviation: NBTInt<{
    min: 1,
    max: 64,
  }>,
  dripstone_block_layer_thickness: IntProvider<NBTInt<{
    min: 0,
  }>>,
  density: FloatProvider<NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>>,
  wetness: FloatProvider<NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>>,
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_dripstone_column_at_max_distance_from_center: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Value:
   * Range: 1..64
   */
  max_distance_from_edge_affecting_chance_of_dripstone_column: NBTInt<{
    min: 1,
    max: 64,
  }>,
  /**
   * Value:
   * Range: 1..64
   */
  max_distance_from_center_affecting_height_bias: NBTInt<{
    min: 1,
    max: 64,
  }>,
}

export type EmeraldOreConfig = {
  state: BlockState,
  target: BlockState,
}

export type EndGatewayConfig = {
  exact: boolean,
  /**
   * Value:
   * List length range: 3
   */
  exit?: NBTList<NBTInt, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
}

export type EndSpike = {
  centerX: NBTInt,
  centerZ: NBTInt,
  radius: NBTInt,
  height: NBTInt,
  guarded?: boolean,
}

export type EndSpikeConfig = {
  spikes: Array<EndSpike>,
  crystal_invulnerable?: boolean,
  /**
   * Value:
   * List length range: 3
   */
  crystal_beam_target?: NBTList<NBTInt, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
}

export type FeatureRef = PlacedFeatureRef

export type FillLayerConfig = {
  state: BlockState,
  /**
   * Value:
   * Range: 0..255
   */
  height: NBTInt<{
    min: 0,
  }>,
}

export type ForestRockConfig = {
  state: BlockState,
}

export type FossilConfig = {
  /**
   * If more corners are exposed to air, feature placement is cancelled.
   *
   * Value:
   * Range: 0..7
   */
  max_empty_corners_allowed: NBTInt<{
    min: 0,
    max: 7,
  }>,
  fossil_structures: Array<(Registry['minecraft:structure'] | StructureClass)>,
  overlay_structures: Array<(Registry['minecraft:structure'] | StructureClass)>,
  fossil_processors: ProcessorListRef,
  overlay_processors: ProcessorListRef,
}

export type GeodeBlockSettings = {
  filling_provider: BlockStateProvider,
  inner_layer_provider: BlockStateProvider,
  alternate_inner_layer_provider: BlockStateProvider,
  middle_layer_provider: BlockStateProvider,
  outer_layer_provider: BlockStateProvider,
  /**
   * Value:
   * List length range: 1..
   */
  inner_placements: NBTList<BlockState, {
    leftExclusive: false,
    min: 1,
  }>,
  /**
   * Blocks that will not be replaced by the geode.
   */
  cannot_replace: (
      | Array<Registry['minecraft:block']> | (
      Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)),
  /**
   * When encountering an invalid block, feature placement is cancelled.
   */
  invalid_blocks: (
      | Array<Registry['minecraft:block']> | (
      Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)),
}

export type GeodeConfig = {
  blocks: GeodeBlockSettings,
  layers: GeodeLayerSettings,
  crack: GeodeCrackSettings,
  /**
   * Value:
   * Range: 0..1
   */
  noise_multiplier?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  use_potential_placements_chance?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  use_alternate_layer0_chance?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  placements_require_layer0_alternate?: boolean,
  outer_wall_distance?: IntProvider<NBTInt<{
    min: 1,
    max: 20,
  }>>,
  distribution_points?: IntProvider<NBTInt<{
    min: 1,
    max: 20,
  }>>,
  point_offset?: IntProvider<NBTInt<{
    min: 1,
    max: 10,
  }>>,
  min_gen_offset?: NBTInt,
  max_gen_offset?: NBTInt,
  invalid_blocks_threshold: NBTInt,
}

export type GeodeCrackSettings = {
  /**
   * Value:
   * Range: 0..1
   */
  generate_crack_chance?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Value:
   * Range: 0..5
   */
  base_crack_size?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>,
  /**
   * Value:
   * Range: 0..10
   */
  crack_point_offset?: NBTInt<{
    min: 0,
    max: 10,
  }>,
}

export type GeodeLayerSettings = {
  /**
   * Value:
   * Range: 0.01..50
   */
  filling?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>,
  /**
   * Value:
   * Range: 0.01..50
   */
  inner_layer?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>,
  /**
   * Value:
   * Range: 0.01..50
   */
  middle_layer?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>,
  /**
   * Value:
   * Range: 0.01..50
   */
  outer_layer?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>,
}

export type GrowingPlantConfig = {
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
  direction: Direction,
  allow_water: boolean,
  height_distribution: Array<GrowingPlantHeight>,
  body_provider: BlockStateProvider,
  head_provider: BlockStateProvider,
}

export type GrowingPlantHeight = {
  weight: NBTInt,
  data: IntProvider<NBTInt>,
}

export type HugeFungusConfig = {
  hat_state: BlockState,
  decor_state: BlockState,
  stem_state: BlockState,
  valid_base_block: BlockState,
  planted?: boolean,
  replaceable_blocks: BlockPredicate,
}

export type HugeMushroomConfig = {
  cap_provider: BlockStateProvider,
  stem_provider: BlockStateProvider,
  foliage_radius: NBTInt,
  can_place_on: BlockPredicate,
}

export type IcebergConfig = {
  state: BlockState,
}

export type LakeConfig = {
  fluid: BlockStateProvider,
  barrier: BlockStateProvider,
}

export type LargeDripstoneConfig = {
  /**
   * Value:
   * Range: 1..512
   */
  floor_to_ceiling_search_range?: NBTInt<{
    min: 1,
  }>,
  column_radius: IntProvider<NBTInt<{
    min: 0,
    max: 60,
  }>>,
  height_scale: FloatProvider<NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>>,
  /**
   * Value:
   * Range: 0..1
   */
  max_column_radius_to_cave_height_ratio: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  stalactite_bluntness: FloatProvider<NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>>,
  stalagmite_bluntness: FloatProvider<NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>>,
  wind_speed: FloatProvider<NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>>,
  /**
   * Value:
   * Range: 0..100
   */
  min_radius_for_wind: NBTInt<{
    min: 0,
    max: 100,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  min_bluntness_for_wind: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type MultifaceBlock = ('glow_lichen' | 'sculk_vein')

export type MultifaceGrowthConfig = {
  /**
   * Value:
   *
   *  - GlowLichen(`glow_lichen`)
   *  - SculkVein(`sculk_vein`)
   */
  block?: (MultifaceBlock | `minecraft:${MultifaceBlock}`),
  /**
   * Value:
   * Range: 1..64
   */
  search_range?: NBTInt<{
    min: 1,
    max: 64,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_spreading?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  can_place_on_floor?: boolean,
  can_place_on_ceiling?: boolean,
  can_place_on_wall?: boolean,
  can_be_placed_on?: (
      | Array<Registry['minecraft:block']> | (
      Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)),
}

export type NetherForestVegetationConfig = ({
  state_provider: BlockStateProvider,
} & {
  /**
   * Value:
   * Range: 1..
   */
  spread_width: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..
   */
  spread_height: NBTInt<{
    min: 1,
  }>,
})

export type NetherrackReplaceBlobsConfig = {
  state: BlockState,
  target: BlockState,
  radius: IntProvider<NBTInt<{
    min: 0,
    max: 12,
  }>>,
}

export type OreConfig = {
  targets: Array<TargetBlock>,
  /**
   * Value:
   * Range: 0..64
   */
  size: NBTInt<{
    min: 0,
    max: 64,
  }>,
  /**
   * Chance that feature placement will be discarded if the ore is exposed to air blocks.
   *
   * Value:
   * Range: 0..1
   */
  discard_chance_on_air_exposure: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type PointedDripstoneConfig = {
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_taller_dripstone?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_directional_spread?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_spread_radius2?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_spread_radius3?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type ProbabilityConfig = {
  /**
   * Value:
   * Range: 0..1
   */
  probability: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type RandomBooleanSelector = {
  feature_false: FeatureRef,
  feature_true: FeatureRef,
}

export type RandomPatchConfig = ({
  /**
   * How many attempts will be made to find a placement. Defaults to 128.
   *
   * Value:
   * Range: 1..
   */
  tries?: NBTInt<{
    min: 1,
  }>,
} & {
  /**
   * Defaults to 7.
   *
   * Value:
   * Range: 0..
   */
  xz_spread?: NBTInt<{
    min: 0,
  }>,
  /**
   * Defaults to 3.
   *
   * Value:
   * Range: 0..
   */
  y_spread?: NBTInt<{
    min: 0,
  }>,
  feature: FeatureRef,
})

export type RandomSelector = {
  features: Array<{
    /**
     * Value:
     * Range: 0..1
     */
    chance: NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
      min: 0,
      max: 1,
    }>,
    feature: FeatureRef,
  }>,
  default: FeatureRef,
}

export type ReplaceSingleBlockConfig = {
  targets: Array<TargetBlock>,
}

export type RootSystemConfig = {
  /**
   * Value:
   * Range: 1..64
   */
  required_vertical_space_for_tree: NBTInt<{
    min: 1,
    max: 64,
  }>,
  /**
   * Value:
   * Range: 1..64
   */
  root_radius: NBTInt<{
    min: 1,
    max: 64,
  }>,
  /**
   * Value:
   * Range: 1..256
   */
  root_placement_attempts: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..4096
   */
  root_column_max_height: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..64
   */
  hanging_root_radius: NBTInt<{
    min: 1,
    max: 64,
  }>,
  /**
   * Value:
   * Range: 1..16
   */
  hanging_roots_vertical_span: NBTInt<{
    min: 1,
    max: 16,
  }>,
  /**
   * Value:
   * Range: 0..256
   */
  hanging_root_placement_attempts: NBTInt<{
    min: 0,
  }>,
  /**
   * Value:
   * Range: 1..64
   */
  allowed_vertical_water_for_tree: NBTInt<{
    min: 1,
    max: 64,
  }>,
  root_replaceable: (
      | Array<Registry['minecraft:block']> | (
      Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)),
  root_state_provider: BlockStateProvider,
  hanging_root_state_provider: BlockStateProvider,
  allowed_tree_position: BlockPredicate,
  feature: FeatureRef,
}

export type RuleBasedBlockStateProvider = ({
  fallback?: BlockStateProvider,
} & {
  rules: Array<{
    if_true: BlockPredicate,
    then: BlockStateProvider,
  }>,
})

export type SculkPatchConfig = {
  /**
   * Value:
   * Range: 1..32
   */
  charge_count: NBTInt<{
    min: 1,
    max: 32,
  }>,
  /**
   * Value:
   * Range: 1..500
   */
  amount_per_charge: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..64
   */
  spread_attempts: NBTInt<{
    min: 1,
    max: 64,
  }>,
  /**
   * Value:
   * Range: 0..8
   */
  growth_rounds: NBTInt<{
    min: 0,
    max: 8,
  }>,
  /**
   * Value:
   * Range: 0..8
   */
  spread_rounds: NBTInt<{
    min: 0,
    max: 8,
  }>,
  extra_rare_growths: IntProvider<NBTInt>,
  /**
   * Value:
   * Range: 0..1
   */
  catalyst_chance: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type SeaPickleConfig = {
  count: IntProvider<NBTInt<{
    min: 0,
  }>>,
}

export type SimpleBlockConfig = {
  to_place: BlockStateProvider,
  /**
   * Whether to schedule a block update. Defaults to `false`.
   */
  schedule_tick?: boolean,
}

export type SimpleRandomSelectorConfig = {
  features: (
      | Array<FeatureRef> | (
      Registry['minecraft:worldgen/placed_feature'] | `#${string}:${string}` | TagClass<'worldgen/placed_feature'>)),
}

export type SmallDripstoneConfig = {
  /**
   * Value:
   * Range: 0..100
   */
  max_placements?: NBTInt<{
    min: 0,
    max: 100,
  }>,
  /**
   * Value:
   * Range: 0..20
   */
  empty_space_search_radius?: NBTInt<{
    min: 0,
    max: 20,
  }>,
  /**
   * Value:
   * Range: 0..20
   */
  max_offset_from_origin?: NBTInt<{
    min: 0,
    max: 20,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  chance_of_taller_dripstone?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type SpikeConfig = {
  state: BlockState,
  can_place_on: BlockPredicate,
  can_replace: BlockPredicate,
}

export type SpringConfig = {
  state: FluidState,
  rock_count: NBTInt,
  hole_count: NBTInt,
  requires_block_below: boolean,
  valid_blocks: (
      | Array<Registry['minecraft:block']> | (
      Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)),
}

export type TargetBlock = {
  target: RuleTest,
  state: BlockState,
}

export type TwistingVinesConfig = {
  /**
   * Value:
   * Range: 1..
   */
  spread_width: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..
   */
  spread_height: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..
   */
  max_height: NBTInt<{
    min: 1,
  }>,
}

export type UnderwaterMagmaConfig = {
  /**
   * Value:
   * Range: 0..512
   */
  floor_search_range: NBTInt<{
    min: 0,
  }>,
  /**
   * Value:
   * Range: 0..64
   */
  placement_radius_around_floor: NBTInt<{
    min: 0,
    max: 64,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  placement_probability_per_valid_position: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type VegetationPatchConfig = {
  /**
   * Value:
   *
   *  - Floor(`floor`)
   *  - Ceiling(`ceiling`)
   */
  surface: CaveSurface,
  depth: IntProvider<NBTInt<{
    min: 1,
  }>>,
  /**
   * Value:
   * Range: 1..256
   */
  vertical_range: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  extra_bottom_block_chance: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  extra_edge_column_chance: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  vegetation_chance: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  xz_radius: IntProvider<NBTInt>,
  replaceable: (`#${Registry['minecraft:tag/block']}` | TagClass<'block'>),
  ground_state: BlockStateProvider,
  vegetation_feature: FeatureRef,
}
type BlockPlacerDispatcherMap = {
  'column_placer': BlockPlacerColumnPlacer,
  'minecraft:column_placer': BlockPlacerColumnPlacer,
  'double_plant_placer': BlockPlacerDoublePlantPlacer,
  'minecraft:double_plant_placer': BlockPlacerDoublePlantPlacer,
  'simple_block_placer': BlockPlacerSimpleBlockPlacer,
  'minecraft:simple_block_placer': BlockPlacerSimpleBlockPlacer,
}
type BlockPlacerKeys = keyof BlockPlacerDispatcherMap
type BlockPlacerFallback = (BlockPlacerColumnPlacer | BlockPlacerDoublePlantPlacer | BlockPlacerSimpleBlockPlacer)
type BlockPlacerColumnPlacer = ColumnPlacer
type BlockPlacerDoublePlantPlacer = Record<string, never>
type BlockPlacerSimpleBlockPlacer = Record<string, never>
export type SymbolBlockPlacer<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? BlockPlacerDispatcherMap
  : CASE extends 'keys' ? BlockPlacerKeys : CASE extends '%fallback' ? BlockPlacerFallback : never
type FeatureConfigDispatcherMap = {
  'bamboo': FeatureConfigBamboo,
  'minecraft:bamboo': FeatureConfigBamboo,
  'basalt_columns': FeatureConfigBasaltColumns,
  'minecraft:basalt_columns': FeatureConfigBasaltColumns,
  'block_blob': FeatureConfigBlockBlob,
  'minecraft:block_blob': FeatureConfigBlockBlob,
  'block_column': FeatureConfigBlockColumn,
  'minecraft:block_column': FeatureConfigBlockColumn,
  'block_pile': FeatureConfigBlockPile,
  'minecraft:block_pile': FeatureConfigBlockPile,
  'decorated': FeatureConfigDecorated,
  'minecraft:decorated': FeatureConfigDecorated,
  'delta_feature': FeatureConfigDeltaFeature,
  'minecraft:delta_feature': FeatureConfigDeltaFeature,
  'disk': FeatureConfigDisk,
  'minecraft:disk': FeatureConfigDisk,
  'dripstone_cluster': FeatureConfigDripstoneCluster,
  'minecraft:dripstone_cluster': FeatureConfigDripstoneCluster,
  'emerald_ore': FeatureConfigEmeraldOre,
  'minecraft:emerald_ore': FeatureConfigEmeraldOre,
  'end_gateway': FeatureConfigEndGateway,
  'minecraft:end_gateway': FeatureConfigEndGateway,
  'end_spike': FeatureConfigEndSpike,
  'minecraft:end_spike': FeatureConfigEndSpike,
  'fallen_tree': FeatureConfigFallenTree,
  'minecraft:fallen_tree': FeatureConfigFallenTree,
  'fill_layer': FeatureConfigFillLayer,
  'minecraft:fill_layer': FeatureConfigFillLayer,
  'flower': FeatureConfigFlower,
  'minecraft:flower': FeatureConfigFlower,
  'forest_rock': FeatureConfigForestRock,
  'minecraft:forest_rock': FeatureConfigForestRock,
  'fossil': FeatureConfigFossil,
  'minecraft:fossil': FeatureConfigFossil,
  'geode': FeatureConfigGeode,
  'minecraft:geode': FeatureConfigGeode,
  'glow_lichen': FeatureConfigGlowLichen,
  'minecraft:glow_lichen': FeatureConfigGlowLichen,
  'growing_plant': FeatureConfigGrowingPlant,
  'minecraft:growing_plant': FeatureConfigGrowingPlant,
  'huge_brown_mushroom': FeatureConfigHugeBrownMushroom,
  'minecraft:huge_brown_mushroom': FeatureConfigHugeBrownMushroom,
  'huge_fungus': FeatureConfigHugeFungus,
  'minecraft:huge_fungus': FeatureConfigHugeFungus,
  'huge_red_mushroom': FeatureConfigHugeRedMushroom,
  'minecraft:huge_red_mushroom': FeatureConfigHugeRedMushroom,
  'ice_patch': FeatureConfigIcePatch,
  'minecraft:ice_patch': FeatureConfigIcePatch,
  'iceberg': FeatureConfigIceberg,
  'minecraft:iceberg': FeatureConfigIceberg,
  'lake': FeatureConfigLake,
  'minecraft:lake': FeatureConfigLake,
  'large_dripstone': FeatureConfigLargeDripstone,
  'minecraft:large_dripstone': FeatureConfigLargeDripstone,
  'multiface_growth': FeatureConfigMultifaceGrowth,
  'minecraft:multiface_growth': FeatureConfigMultifaceGrowth,
  'nether_forest_vegetation': FeatureConfigNetherForestVegetation,
  'minecraft:nether_forest_vegetation': FeatureConfigNetherForestVegetation,
  'netherrack_replace_blobs': FeatureConfigNetherrackReplaceBlobs,
  'minecraft:netherrack_replace_blobs': FeatureConfigNetherrackReplaceBlobs,
  'no_bonemeal_flower': FeatureConfigNoBonemealFlower,
  'minecraft:no_bonemeal_flower': FeatureConfigNoBonemealFlower,
  'no_surface_ore': FeatureConfigNoSurfaceOre,
  'minecraft:no_surface_ore': FeatureConfigNoSurfaceOre,
  'ore': FeatureConfigOre,
  'minecraft:ore': FeatureConfigOre,
  'pointed_dripstone': FeatureConfigPointedDripstone,
  'minecraft:pointed_dripstone': FeatureConfigPointedDripstone,
  'random_boolean_selector': FeatureConfigRandomBooleanSelector,
  'minecraft:random_boolean_selector': FeatureConfigRandomBooleanSelector,
  'random_patch': FeatureConfigRandomPatch,
  'minecraft:random_patch': FeatureConfigRandomPatch,
  'random_selector': FeatureConfigRandomSelector,
  'minecraft:random_selector': FeatureConfigRandomSelector,
  'replace_single_block': FeatureConfigReplaceSingleBlock,
  'minecraft:replace_single_block': FeatureConfigReplaceSingleBlock,
  'root_system': FeatureConfigRootSystem,
  'minecraft:root_system': FeatureConfigRootSystem,
  'scattered_ore': FeatureConfigScatteredOre,
  'minecraft:scattered_ore': FeatureConfigScatteredOre,
  'sculk_patch': FeatureConfigSculkPatch,
  'minecraft:sculk_patch': FeatureConfigSculkPatch,
  'sea_pickle': FeatureConfigSeaPickle,
  'minecraft:sea_pickle': FeatureConfigSeaPickle,
  'seagrass': FeatureConfigSeagrass,
  'minecraft:seagrass': FeatureConfigSeagrass,
  'simple_block': FeatureConfigSimpleBlock,
  'minecraft:simple_block': FeatureConfigSimpleBlock,
  'simple_random_selector': FeatureConfigSimpleRandomSelector,
  'minecraft:simple_random_selector': FeatureConfigSimpleRandomSelector,
  'small_dripstone': FeatureConfigSmallDripstone,
  'minecraft:small_dripstone': FeatureConfigSmallDripstone,
  'spike': FeatureConfigSpike,
  'minecraft:spike': FeatureConfigSpike,
  'spring_feature': FeatureConfigSpringFeature,
  'minecraft:spring_feature': FeatureConfigSpringFeature,
  'tree': FeatureConfigTree,
  'minecraft:tree': FeatureConfigTree,
  'twisting_vines': FeatureConfigTwistingVines,
  'minecraft:twisting_vines': FeatureConfigTwistingVines,
  'underwater_magma': FeatureConfigUnderwaterMagma,
  'minecraft:underwater_magma': FeatureConfigUnderwaterMagma,
  'vegetation_patch': FeatureConfigVegetationPatch,
  'minecraft:vegetation_patch': FeatureConfigVegetationPatch,
  'waterlogged_vegetation_patch': FeatureConfigWaterloggedVegetationPatch,
  'minecraft:waterlogged_vegetation_patch': FeatureConfigWaterloggedVegetationPatch,
}
type FeatureConfigKeys = keyof FeatureConfigDispatcherMap
type FeatureConfigFallback = (
  | FeatureConfigBamboo
  | FeatureConfigBasaltColumns
  | FeatureConfigBlockBlob
  | FeatureConfigBlockColumn
  | FeatureConfigBlockPile
  | FeatureConfigDecorated
  | FeatureConfigDeltaFeature
  | FeatureConfigDisk
  | FeatureConfigDripstoneCluster
  | FeatureConfigEmeraldOre
  | FeatureConfigEndGateway
  | FeatureConfigEndSpike
  | FeatureConfigFallenTree
  | FeatureConfigFillLayer
  | FeatureConfigFlower
  | FeatureConfigForestRock
  | FeatureConfigFossil
  | FeatureConfigGeode
  | FeatureConfigGlowLichen
  | FeatureConfigGrowingPlant
  | FeatureConfigHugeBrownMushroom
  | FeatureConfigHugeFungus
  | FeatureConfigHugeRedMushroom
  | FeatureConfigIcePatch
  | FeatureConfigIceberg
  | FeatureConfigLake
  | FeatureConfigLargeDripstone
  | FeatureConfigMultifaceGrowth
  | FeatureConfigNetherForestVegetation
  | FeatureConfigNetherrackReplaceBlobs
  | FeatureConfigNoBonemealFlower
  | FeatureConfigNoSurfaceOre
  | FeatureConfigOre
  | FeatureConfigPointedDripstone
  | FeatureConfigRandomBooleanSelector
  | FeatureConfigRandomPatch
  | FeatureConfigRandomSelector
  | FeatureConfigReplaceSingleBlock
  | FeatureConfigRootSystem
  | FeatureConfigScatteredOre
  | FeatureConfigSculkPatch
  | FeatureConfigSeaPickle
  | FeatureConfigSeagrass
  | FeatureConfigSimpleBlock
  | FeatureConfigSimpleRandomSelector
  | FeatureConfigSmallDripstone
  | FeatureConfigSpike
  | FeatureConfigSpringFeature
  | FeatureConfigTree
  | FeatureConfigTwistingVines
  | FeatureConfigUnderwaterMagma
  | FeatureConfigVegetationPatch
  | FeatureConfigWaterloggedVegetationPatch)
type FeatureConfigBamboo = ProbabilityConfig
type FeatureConfigBasaltColumns = ColumnsConfig
type FeatureConfigBlockBlob = BlockBlobConfig
type FeatureConfigBlockColumn = BlockColumnConfig
type FeatureConfigBlockPile = BlockPileConfig
type FeatureConfigDecorated = DecoratedConfig
type FeatureConfigDeltaFeature = DeltaConfig
type FeatureConfigDisk = DiskConfig
type FeatureConfigDripstoneCluster = DripstoneClusterConfig
type FeatureConfigEmeraldOre = EmeraldOreConfig
type FeatureConfigEndGateway = EndGatewayConfig
type FeatureConfigEndSpike = EndSpikeConfig
type FeatureConfigFallenTree = FallenTreeConfig
type FeatureConfigFillLayer = FillLayerConfig
type FeatureConfigFlower = RandomPatchConfig
type FeatureConfigForestRock = ForestRockConfig
type FeatureConfigFossil = FossilConfig
type FeatureConfigGeode = GeodeConfig
type FeatureConfigGlowLichen = MultifaceGrowthConfig
type FeatureConfigGrowingPlant = GrowingPlantConfig
type FeatureConfigHugeBrownMushroom = HugeMushroomConfig
type FeatureConfigHugeFungus = HugeFungusConfig
type FeatureConfigHugeRedMushroom = HugeMushroomConfig
type FeatureConfigIcePatch = DiskConfig
type FeatureConfigIceberg = IcebergConfig
type FeatureConfigLake = LakeConfig
type FeatureConfigLargeDripstone = LargeDripstoneConfig
type FeatureConfigMultifaceGrowth = MultifaceGrowthConfig
type FeatureConfigNetherForestVegetation = NetherForestVegetationConfig
type FeatureConfigNetherrackReplaceBlobs = NetherrackReplaceBlobsConfig
type FeatureConfigNoBonemealFlower = RandomPatchConfig
type FeatureConfigNoSurfaceOre = OreConfig
type FeatureConfigOre = OreConfig
type FeatureConfigPointedDripstone = PointedDripstoneConfig
type FeatureConfigRandomBooleanSelector = RandomBooleanSelector
type FeatureConfigRandomPatch = RandomPatchConfig
type FeatureConfigRandomSelector = RandomSelector
type FeatureConfigReplaceSingleBlock = ReplaceSingleBlockConfig
type FeatureConfigRootSystem = RootSystemConfig
type FeatureConfigScatteredOre = OreConfig
type FeatureConfigSculkPatch = SculkPatchConfig
type FeatureConfigSeaPickle = SeaPickleConfig
type FeatureConfigSeagrass = ProbabilityConfig
type FeatureConfigSimpleBlock = SimpleBlockConfig
type FeatureConfigSimpleRandomSelector = SimpleRandomSelectorConfig
type FeatureConfigSmallDripstone = SmallDripstoneConfig
type FeatureConfigSpike = SpikeConfig
type FeatureConfigSpringFeature = SpringConfig
type FeatureConfigTree = TreeConfig
type FeatureConfigTwistingVines = TwistingVinesConfig
type FeatureConfigUnderwaterMagma = UnderwaterMagmaConfig
type FeatureConfigVegetationPatch = VegetationPatchConfig
type FeatureConfigWaterloggedVegetationPatch = VegetationPatchConfig
export type SymbolFeatureConfig<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? FeatureConfigDispatcherMap
  : CASE extends 'keys' ? FeatureConfigKeys : CASE extends '%fallback' ? FeatureConfigFallback : never
