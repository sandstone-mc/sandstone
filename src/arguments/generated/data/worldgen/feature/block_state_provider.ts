import type { NoiseParameters } from 'sandstone/arguments/generated/data/worldgen/dimension/biome_source'
import type { IntProvider } from 'sandstone/arguments/generated/data/worldgen'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state'
import type { InclusiveRange, NonEmptyWeightedList } from 'sandstone/arguments/generated/util'
import type { NBTFloat, NBTInt } from 'sandstone'

export type BaseNoiseProvider = {
  seed: NBTInt
  noise: NoiseParameters
  /**
     * Value:
     * Range: 0..
     */
  scale: NBTFloat<{
    leftExclusive: false
    min: 0
  }>
}

export type BlockStateProvider = ({
  [S in Extract<Registry['minecraft:worldgen/block_state_provider_type'], string>]?: ({
    type: S
  } & (S extends keyof SymbolBlockStateProvider ? SymbolBlockStateProvider[S] : Record<string, unknown>));
}[Registry['minecraft:worldgen/block_state_provider_type']])

export type DualNoiseProvider = (BaseNoiseProvider & {
  variety: InclusiveRange<NBTInt<{
    min: 1
    max: 64
  }>>
  slow_noise: NoiseParameters
  /**
     * Value:
     * Range: 0..
     */
  slow_scale: NBTFloat<{
    leftExclusive: false
    min: 0
  }>
  states: Array<BlockState>
})

export type NoiseProvider = (BaseNoiseProvider & {
  states: Array<BlockState>
})

export type NoiseThresholdProvider = (BaseNoiseProvider & {
  /**
     * Value:
     * Range: -1..1
     */
  threshold: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
  }>
  /**
     * Value:
     * Range: 0..1
     */
  high_chance: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  default_state: BlockState
  low_states: Array<BlockState>
  high_states: Array<BlockState>
})

export type RandomizedIntStateProvider = {
  property: string
  values: IntProvider<NBTInt>
  source: BlockStateProvider
}

export type SimpleStateProvider = {
  state: BlockState
}

export type WeightedBlockStateProvider = {
  entries: NonEmptyWeightedList<BlockState>
}
type BlockStateProviderDispatcherMap = {
  'dual_noise_provider': BlockStateProviderDualNoiseProvider
  'minecraft:dual_noise_provider': BlockStateProviderDualNoiseProvider
  'noise_provider': BlockStateProviderNoiseProvider
  'minecraft:noise_provider': BlockStateProviderNoiseProvider
  'noise_threshold_provider': BlockStateProviderNoiseThresholdProvider
  'minecraft:noise_threshold_provider': BlockStateProviderNoiseThresholdProvider
  'randomized_int_state_provider': BlockStateProviderRandomizedIntStateProvider
  'minecraft:randomized_int_state_provider': BlockStateProviderRandomizedIntStateProvider
  'rotated_block_provider': BlockStateProviderRotatedBlockProvider
  'minecraft:rotated_block_provider': BlockStateProviderRotatedBlockProvider
  'simple_state_provider': BlockStateProviderSimpleStateProvider
  'minecraft:simple_state_provider': BlockStateProviderSimpleStateProvider
  'weighted_state_provider': BlockStateProviderWeightedStateProvider
  'minecraft:weighted_state_provider': BlockStateProviderWeightedStateProvider
}
type BlockStateProviderKeys = keyof BlockStateProviderDispatcherMap
type BlockStateProviderFallback = (
  | BlockStateProviderDualNoiseProvider
  | BlockStateProviderNoiseProvider
  | BlockStateProviderNoiseThresholdProvider
  | BlockStateProviderRandomizedIntStateProvider
  | BlockStateProviderRotatedBlockProvider
  | BlockStateProviderSimpleStateProvider
  | BlockStateProviderWeightedStateProvider)
type BlockStateProviderDualNoiseProvider = DualNoiseProvider
type BlockStateProviderNoiseProvider = NoiseProvider
type BlockStateProviderNoiseThresholdProvider = NoiseThresholdProvider
type BlockStateProviderRandomizedIntStateProvider = RandomizedIntStateProvider
type BlockStateProviderRotatedBlockProvider = SimpleStateProvider
type BlockStateProviderSimpleStateProvider = SimpleStateProvider
type BlockStateProviderWeightedStateProvider = WeightedBlockStateProvider
export type SymbolBlockStateProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? BlockStateProviderDispatcherMap
  : CASE extends 'keys' ? BlockStateProviderKeys : CASE extends '%fallback' ? BlockStateProviderFallback : never
