import type { JsonNoiseParameters } from 'sandstone/arguments/generated/_json/data/worldgen/dimension/biome_source.ts'
import type { JsonRuleBasedBlockStateProvider } from 'sandstone/arguments/generated/_json/data/worldgen/feature.ts'
import type { JsonIntProvider } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonDirection } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonInclusiveRange, JsonNonEmptyWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt, TagClass } from 'sandstone'

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

export type JsonBlockStateProvider = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/block_state_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolBlockStateProvider ? JsonSymbolBlockStateProvider[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/block_state_provider_type'], string>])>

export type JsonCopyPropertiesProvider = {
  source: JsonBlockStateProvider,
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
  source: JsonBlockStateProvider,
}

export type JsonRotatedStateProvider = {
  state: JsonBlockStateProvider,
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

export type JsonWeightedBlockStateProvider = {
  entries: JsonNonEmptyWeightedList<JsonBlockState>,
}
type JsonBlockStateProviderDispatcherMap = {
  'copy_properties_provider': JsonBlockStateProviderCopyPropertiesProvider,
  'minecraft:copy_properties_provider': JsonBlockStateProviderCopyPropertiesProvider,
  'dual_noise_provider': JsonBlockStateProviderDualNoiseProvider,
  'minecraft:dual_noise_provider': JsonBlockStateProviderDualNoiseProvider,
  'noise_provider': JsonBlockStateProviderNoiseProvider,
  'minecraft:noise_provider': JsonBlockStateProviderNoiseProvider,
  'noise_threshold_provider': JsonBlockStateProviderNoiseThresholdProvider,
  'minecraft:noise_threshold_provider': JsonBlockStateProviderNoiseThresholdProvider,
  'random_block_provider': JsonBlockStateProviderRandomBlockProvider,
  'minecraft:random_block_provider': JsonBlockStateProviderRandomBlockProvider,
  'randomized_int_state_provider': JsonBlockStateProviderRandomizedIntStateProvider,
  'minecraft:randomized_int_state_provider': JsonBlockStateProviderRandomizedIntStateProvider,
  'rotated_block_provider': JsonBlockStateProviderRotatedBlockProvider,
  'minecraft:rotated_block_provider': JsonBlockStateProviderRotatedBlockProvider,
  'rule_based_state_provider': JsonBlockStateProviderRuleBasedStateProvider,
  'minecraft:rule_based_state_provider': JsonBlockStateProviderRuleBasedStateProvider,
  'simple_state_provider': JsonBlockStateProviderSimpleStateProvider,
  'minecraft:simple_state_provider': JsonBlockStateProviderSimpleStateProvider,
  'weighted_state_provider': JsonBlockStateProviderWeightedStateProvider,
  'minecraft:weighted_state_provider': JsonBlockStateProviderWeightedStateProvider,
}
type JsonBlockStateProviderKeys = keyof JsonBlockStateProviderDispatcherMap
type JsonBlockStateProviderFallback = (
  | JsonBlockStateProviderCopyPropertiesProvider
  | JsonBlockStateProviderDualNoiseProvider
  | JsonBlockStateProviderNoiseProvider
  | JsonBlockStateProviderNoiseThresholdProvider
  | JsonBlockStateProviderRandomBlockProvider
  | JsonBlockStateProviderRandomizedIntStateProvider
  | JsonBlockStateProviderRotatedBlockProvider
  | JsonBlockStateProviderRuleBasedStateProvider
  | JsonBlockStateProviderSimpleStateProvider
  | JsonBlockStateProviderWeightedStateProvider)
type JsonBlockStateProviderCopyPropertiesProvider = JsonCopyPropertiesProvider
type JsonBlockStateProviderDualNoiseProvider = JsonDualNoiseProvider
type JsonBlockStateProviderNoiseProvider = JsonNoiseProvider
type JsonBlockStateProviderNoiseThresholdProvider = JsonNoiseThresholdProvider
type JsonBlockStateProviderRandomBlockProvider = JsonRandomBlockStateProvider
type JsonBlockStateProviderRandomizedIntStateProvider = JsonRandomizedIntStateProvider
type JsonBlockStateProviderRotatedBlockProvider = JsonRotatedStateProvider
type JsonBlockStateProviderRuleBasedStateProvider = JsonRuleBasedBlockStateProvider
type JsonBlockStateProviderSimpleStateProvider = JsonSimpleStateProvider
type JsonBlockStateProviderWeightedStateProvider = JsonWeightedBlockStateProvider
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
