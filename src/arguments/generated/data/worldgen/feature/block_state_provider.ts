import type { NoiseParameters } from 'sandstone/arguments/generated/data/worldgen/dimension/biome_source.ts'
import type { RuleBasedBlockStateProvider } from 'sandstone/arguments/generated/data/worldgen/feature.ts'
import type { IntProvider } from 'sandstone/arguments/generated/data/worldgen.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { Direction } from 'sandstone/arguments/generated/util/direction.ts'
import type { InclusiveRange, NonEmptyWeightedList } from 'sandstone/arguments/generated/util.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt, TagClass } from 'sandstone'

export type BaseNoiseProvider = {
  seed: NBTInt,
  noise: NoiseParameters,
  /**
   * Value:
   * Range: 0..
   */
  scale: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
}

export type BlockStateProvider = NonNullable<({
  [S in Extract<Extract<Registry['minecraft:worldgen/block_state_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolBlockStateProvider ? SymbolBlockStateProvider[S] : RootNBT))
}[Extract<Registry['minecraft:worldgen/block_state_provider_type'], string>])>

export type CopyPropertiesProvider = {
  source: BlockStateProvider,
}

export type DualNoiseProvider = (BaseNoiseProvider & {
  variety: InclusiveRange<NBTInt<{
    min: 1,
    max: 64,
  }>>,
  slow_noise: NoiseParameters,
  /**
   * Value:
   * Range: 0..
   */
  slow_scale: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
  states: Array<BlockState>,
})

export type NoiseProvider = (BaseNoiseProvider & {
  states: Array<BlockState>,
})

export type NoiseThresholdProvider = (BaseNoiseProvider & {
  /**
   * Value:
   * Range: -1..1
   */
  threshold: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }>,
  /**
   * Value:
   * Range: 0..1
   */
  high_chance: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  default_state: BlockState,
  low_states: Array<BlockState>,
  high_states: Array<BlockState>,
})

export type RandomBlockStateProvider = {
  blocks: ((
      | Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<Registry['minecraft:block']>),
}

export type RandomizedIntStateProvider = {
  property: string,
  values: IntProvider<NBTInt>,
  source: BlockStateProvider,
}

export type RotatedStateProvider = {
  state: BlockStateProvider,
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
  direction?: Direction,
}

export type SimpleStateProvider = {
  state: BlockState,
}

export type WeightedBlockStateProvider = {
  entries: NonEmptyWeightedList<BlockState>,
}
type BlockStateProviderDispatcherMap = {
  'copy_properties_provider': BlockStateProviderCopyPropertiesProvider,
  'minecraft:copy_properties_provider': BlockStateProviderCopyPropertiesProvider,
  'dual_noise_provider': BlockStateProviderDualNoiseProvider,
  'minecraft:dual_noise_provider': BlockStateProviderDualNoiseProvider,
  'noise_provider': BlockStateProviderNoiseProvider,
  'minecraft:noise_provider': BlockStateProviderNoiseProvider,
  'noise_threshold_provider': BlockStateProviderNoiseThresholdProvider,
  'minecraft:noise_threshold_provider': BlockStateProviderNoiseThresholdProvider,
  'random_block_provider': BlockStateProviderRandomBlockProvider,
  'minecraft:random_block_provider': BlockStateProviderRandomBlockProvider,
  'randomized_int_state_provider': BlockStateProviderRandomizedIntStateProvider,
  'minecraft:randomized_int_state_provider': BlockStateProviderRandomizedIntStateProvider,
  'rotated_block_provider': BlockStateProviderRotatedBlockProvider,
  'minecraft:rotated_block_provider': BlockStateProviderRotatedBlockProvider,
  'rule_based_state_provider': BlockStateProviderRuleBasedStateProvider,
  'minecraft:rule_based_state_provider': BlockStateProviderRuleBasedStateProvider,
  'simple_state_provider': BlockStateProviderSimpleStateProvider,
  'minecraft:simple_state_provider': BlockStateProviderSimpleStateProvider,
  'weighted_state_provider': BlockStateProviderWeightedStateProvider,
  'minecraft:weighted_state_provider': BlockStateProviderWeightedStateProvider,
}
type BlockStateProviderKeys = keyof BlockStateProviderDispatcherMap
type BlockStateProviderFallback = (
  | BlockStateProviderCopyPropertiesProvider
  | BlockStateProviderDualNoiseProvider
  | BlockStateProviderNoiseProvider
  | BlockStateProviderNoiseThresholdProvider
  | BlockStateProviderRandomBlockProvider
  | BlockStateProviderRandomizedIntStateProvider
  | BlockStateProviderRotatedBlockProvider
  | BlockStateProviderRuleBasedStateProvider
  | BlockStateProviderSimpleStateProvider
  | BlockStateProviderWeightedStateProvider)
type BlockStateProviderCopyPropertiesProvider = CopyPropertiesProvider
type BlockStateProviderDualNoiseProvider = DualNoiseProvider
type BlockStateProviderNoiseProvider = NoiseProvider
type BlockStateProviderNoiseThresholdProvider = NoiseThresholdProvider
type BlockStateProviderRandomBlockProvider = RandomBlockStateProvider
type BlockStateProviderRandomizedIntStateProvider = RandomizedIntStateProvider
type BlockStateProviderRotatedBlockProvider = RotatedStateProvider
type BlockStateProviderRuleBasedStateProvider = RuleBasedBlockStateProvider
type BlockStateProviderSimpleStateProvider = SimpleStateProvider
type BlockStateProviderWeightedStateProvider = WeightedBlockStateProvider
export type SymbolBlockStateProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? BlockStateProviderDispatcherMap
  : CASE extends 'keys' ? BlockStateProviderKeys : CASE extends '%fallback' ? BlockStateProviderFallback : never
