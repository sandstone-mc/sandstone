import type { JsonNoiseParameters } from 'sandstone/arguments/generated/_json/data/worldgen/dimension/biome_source.ts'
import type { JsonRuleBasedBlockStateProvider } from 'sandstone/arguments/generated/_json/data/worldgen/feature.ts'
import type { JsonIntProvider } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState, JsonFullBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonDirection } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonInclusiveRange, JsonNonEmptyWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NamespacedString, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type JsonBaseNoiseProvider = {
  seed: (NBTInt | number),
  noise: JsonNoiseParameters,
  /**
   * Value:
   * Range: 0..
   */
  scale: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
}

export type JsonBlockStateProvider = (JsonTypedBlockStateProvider | JsonFullBlockState)

export type JsonBlockStateProviderRef = (JsonBlockStateProvider | NamespacedString)

export type JsonCopyPropertiesProvider = {
  source: JsonBlockStateProviderRef,
}

export type JsonDualNoiseProvider = (JsonBaseNoiseProvider & {
  variety: JsonInclusiveRange<(NBTInt<{
    min: 1,
    max: 64,
  }> | number)>,
  slow_noise: JsonNoiseParameters,
  /**
   * Value:
   * Range: 0..
   */
  slow_scale: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
  states: Array<JsonBlockState>,
})

export type JsonNoiseProvider = (JsonBaseNoiseProvider & {
  states: Array<JsonBlockState>,
})

export type JsonNoiseThresholdProvider = (JsonBaseNoiseProvider & {
  /**
   * Value:
   * Range: -1..1
   */
  threshold: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  high_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  default_state: JsonBlockState,
  low_states: Array<JsonBlockState>,
  high_states: Array<JsonBlockState>,
})

export type JsonRandomBlockStateProvider = {
  blocks: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
}

export type JsonRandomizedIntStateProvider = {
  property: string,
  values: JsonIntProvider<(NBTInt | number)>,
  source: JsonBlockStateProviderRef,
}

export type JsonRotatedStateProvider = {
  state: JsonBlockStateProviderRef,
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
  direction?: JsonDirection,
}

export type JsonSimpleStateProvider = {
  state: JsonBlockState,
}

export type JsonTypedBlockStateProvider = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/block_state_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolBlockStateProvider ? JsonSymbolBlockStateProvider[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/block_state_provider_type'], string>])>

export type JsonWeightedBlockStateProvider = {
  entries: JsonNonEmptyWeightedList<JsonBlockState>,
}
type JsonBlockStateProviderDispatcherMap = {
  'copy_properties': JsonBlockStateProviderCopyProperties,
  'minecraft:copy_properties': JsonBlockStateProviderCopyProperties,
  'dual_noise': JsonBlockStateProviderDualNoise,
  'minecraft:dual_noise': JsonBlockStateProviderDualNoise,
  'noise': JsonBlockStateProviderNoise,
  'minecraft:noise': JsonBlockStateProviderNoise,
  'noise_threshold': JsonBlockStateProviderNoiseThreshold,
  'minecraft:noise_threshold': JsonBlockStateProviderNoiseThreshold,
  'random': JsonBlockStateProviderRandom,
  'minecraft:random': JsonBlockStateProviderRandom,
  'randomized_int_state': JsonBlockStateProviderRandomizedIntState,
  'minecraft:randomized_int_state': JsonBlockStateProviderRandomizedIntState,
  'rotated': JsonBlockStateProviderRotated,
  'minecraft:rotated': JsonBlockStateProviderRotated,
  'rule_based': JsonBlockStateProviderRuleBased,
  'minecraft:rule_based': JsonBlockStateProviderRuleBased,
  'simple': JsonBlockStateProviderSimple,
  'minecraft:simple': JsonBlockStateProviderSimple,
  'weighted': JsonBlockStateProviderWeighted,
  'minecraft:weighted': JsonBlockStateProviderWeighted,
}
type JsonBlockStateProviderKeys = keyof JsonBlockStateProviderDispatcherMap
type JsonBlockStateProviderFallback = (
  | JsonBlockStateProviderCopyProperties
  | JsonBlockStateProviderDualNoise
  | JsonBlockStateProviderNoise
  | JsonBlockStateProviderNoiseThreshold
  | JsonBlockStateProviderRandom
  | JsonBlockStateProviderRandomizedIntState
  | JsonBlockStateProviderRotated
  | JsonBlockStateProviderRuleBased
  | JsonBlockStateProviderSimple
  | JsonBlockStateProviderWeighted)
type JsonBlockStateProviderCopyProperties = JsonCopyPropertiesProvider
type JsonBlockStateProviderDualNoise = JsonDualNoiseProvider
type JsonBlockStateProviderNoise = JsonNoiseProvider
type JsonBlockStateProviderNoiseThreshold = JsonNoiseThresholdProvider
type JsonBlockStateProviderRandom = JsonRandomBlockStateProvider
type JsonBlockStateProviderRandomizedIntState = JsonRandomizedIntStateProvider
type JsonBlockStateProviderRotated = JsonRotatedStateProvider
type JsonBlockStateProviderRuleBased = JsonRuleBasedBlockStateProvider
type JsonBlockStateProviderSimple = JsonSimpleStateProvider
type JsonBlockStateProviderWeighted = JsonWeightedBlockStateProvider
export type JsonSymbolBlockStateProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonBlockStateProviderDispatcherMap
  : CASE extends 'keys'
    ? JsonBlockStateProviderKeys
    : CASE extends '%fallback' ? JsonBlockStateProviderFallback : never
