import type { NoiseParameters } from 'sandstone/arguments/generated/data/worldgen/dimension/biome_source.ts'
import type { RuleBasedBlockStateProvider } from 'sandstone/arguments/generated/data/worldgen/feature.ts'
import type { IntProvider } from 'sandstone/arguments/generated/data/worldgen.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState, FullBlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { Direction } from 'sandstone/arguments/generated/util/direction.ts'
import type { InclusiveRange, NonEmptyWeightedList } from 'sandstone/arguments/generated/util.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NamespacedString, NBTFloat, NBTInt, TagClass } from 'sandstone'

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

export type BlockStateProvider = (TypedBlockStateProvider | FullBlockState)

export type BlockStateProviderRef = (BlockStateProvider | NamespacedString)

export type CopyPropertiesProvider = {
  source: BlockStateProviderRef,
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
  source: BlockStateProviderRef,
}

export type RotatedStateProvider = {
  state: BlockStateProviderRef,
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

export type TypedBlockStateProvider = NonNullable<({
  [S in Extract<Extract<Registry['minecraft:worldgen/block_state_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolBlockStateProvider ? SymbolBlockStateProvider[S] : RootNBT))
}[Extract<Registry['minecraft:worldgen/block_state_provider_type'], string>])>

export type WeightedBlockStateProvider = {
  entries: NonEmptyWeightedList<BlockState>,
}
type BlockStateProviderDispatcherMap = {
  'copy_properties': BlockStateProviderCopyProperties,
  'minecraft:copy_properties': BlockStateProviderCopyProperties,
  'dual_noise': BlockStateProviderDualNoise,
  'minecraft:dual_noise': BlockStateProviderDualNoise,
  'noise': BlockStateProviderNoise,
  'minecraft:noise': BlockStateProviderNoise,
  'noise_threshold': BlockStateProviderNoiseThreshold,
  'minecraft:noise_threshold': BlockStateProviderNoiseThreshold,
  'random': BlockStateProviderRandom,
  'minecraft:random': BlockStateProviderRandom,
  'randomized_int_state': BlockStateProviderRandomizedIntState,
  'minecraft:randomized_int_state': BlockStateProviderRandomizedIntState,
  'rotated': BlockStateProviderRotated,
  'minecraft:rotated': BlockStateProviderRotated,
  'rule_based': BlockStateProviderRuleBased,
  'minecraft:rule_based': BlockStateProviderRuleBased,
  'simple': BlockStateProviderSimple,
  'minecraft:simple': BlockStateProviderSimple,
  'weighted': BlockStateProviderWeighted,
  'minecraft:weighted': BlockStateProviderWeighted,
}
type BlockStateProviderKeys = keyof BlockStateProviderDispatcherMap
type BlockStateProviderFallback = (
  | BlockStateProviderCopyProperties
  | BlockStateProviderDualNoise
  | BlockStateProviderNoise
  | BlockStateProviderNoiseThreshold
  | BlockStateProviderRandom
  | BlockStateProviderRandomizedIntState
  | BlockStateProviderRotated
  | BlockStateProviderRuleBased
  | BlockStateProviderSimple
  | BlockStateProviderWeighted)
type BlockStateProviderCopyProperties = CopyPropertiesProvider
type BlockStateProviderDualNoise = DualNoiseProvider
type BlockStateProviderNoise = NoiseProvider
type BlockStateProviderNoiseThreshold = NoiseThresholdProvider
type BlockStateProviderRandom = RandomBlockStateProvider
type BlockStateProviderRandomizedIntState = RandomizedIntStateProvider
type BlockStateProviderRotated = RotatedStateProvider
type BlockStateProviderRuleBased = RuleBasedBlockStateProvider
type BlockStateProviderSimple = SimpleStateProvider
type BlockStateProviderWeighted = WeightedBlockStateProvider
export type SymbolBlockStateProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? BlockStateProviderDispatcherMap
  : CASE extends 'keys' ? BlockStateProviderKeys : CASE extends '%fallback' ? BlockStateProviderFallback : never
