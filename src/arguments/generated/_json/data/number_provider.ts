import type { JsonLevelBasedValue } from 'sandstone/arguments/generated/_json/data/enchantment/level_based_value.ts'
import type { JsonPredicateRef } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonScoreProvider } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonNumericalEnvironmentAttribute } from 'sandstone/arguments/generated/_json/data/worldgen/attribute.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonNonEmptyWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  DataPointClass,
  JsonNBTList,
  NamespacedString,
  NBTFloat,
  NonEmptyString,
  NumberProviderClass,
  ObjectiveClass,
  TagClass,
} from 'sandstone'

export type JsonAggregateNumberProvider = {
  operands: JsonAggregateOperands,
}

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * *item 1*
 *
 * *or*
 *
 * List length range: 1..
 */
export type JsonAggregateOperands = (JsonNumberProvider | (
  | JsonRegistry['minecraft:number_provider']
  | `#${string}:${string}`
  | TagClass<'number_provider'>
  | NumberProviderClass) | JsonNBTList<((
    | JsonRegistry['minecraft:number_provider'] | NumberProviderClass)
    | JsonNumberProvider), {
    leftExclusive: false,
    min: 1,
  }>)

export type JsonBinomialNumberProvider = {
  n: JsonNumberProviderRef,
  p: JsonNumberProviderRef,
}

export type JsonConditionalNumberProvider = {
  condition: JsonPredicateRef,
  on_true: JsonNumberProviderRef,
  /**
   * Defaults to constant 0.
   */
  on_false?: JsonNumberProviderRef,
}

export type JsonConstantNumberProvider = {
  value: (NBTFloat | number),
}

export type JsonEnchantmentLevelProvider = {
  amount: JsonLevelBasedValue,
}

export type JsonEnvironmentAttributeNumberProvider = {
  /**
   * Value:
   *
   *  - CloudHeight(`visual/cloud_height`)
   *  - FogStartDistance(`visual/fog_start_distance`)
   *  - MoonAngle(`visual/moon_angle`)
   *  - StarAngle(`visual/star_angle`)
   *  - SunAngle(`visual/sun_angle`)
   *  - WaterFogStartDistance(`visual/water_fog_start_distance`)
   *  - CloudFogEndDistance(`visual/cloud_fog_end_distance`)
   *  - FogEndDistance(`visual/fog_end_distance`)
   *  - SkyFogEndDistance(`visual/sky_fog_end_distance`)
   *  - WaterFogEndDistance(`visual/water_fog_end_distance`)
   *  - SkyLightFactor(`visual/sky_light_factor`)
   *  - StarBrightness(`visual/star_brightness`)
   *  - MusicVolume(`audio/music_volume`)
   *  - CatWakingUpGiftChance(`gameplay/cat_waking_up_gift_chance`)
   *  - CreatureWorldgenSpawnProbability(`gameplay/creature_world_gen_spawn_probability`)
   *  - SurfaceSlimeSpawnChance(`gameplay/surface_slime_spawn_chance`)
   *  - TurtleEggHatchChance(`gameplay/turtle_egg_hatch_chance`)
   *  - SkyLightLevel(`gameplay/sky_light_level`)
   */
  attribute: JsonNumericalEnvironmentAttribute,
}

export type JsonNumberDispatcher = {
  cases: Array<{
    condition: JsonPredicateRef,
    number_provider: JsonNumberProviderRef,
  }>,
  /**
   * Defaults to constant 0.
   */
  default?: JsonNumberProviderRef,
}

export type JsonNumberProvider = ((NBTFloat | number) | ({
  [S in Extract<Extract<JsonRegistry['minecraft:loot_number_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends undefined
    ? JsonSymbolNumberProvider<'%none'> :
    (S extends keyof JsonSymbolNumberProvider ? JsonSymbolNumberProvider[S] : JsonRootNBT)))
}[Extract<JsonRegistry['minecraft:loot_number_provider_type'], string>]))

export type JsonNumberProviderListRef = (
  | JsonNumberProvider | (
    | JsonRegistry['minecraft:number_provider']
    | `#${string}:${string}`
    | TagClass<'number_provider'>
    | NumberProviderClass)
  | Array<((JsonRegistry['minecraft:number_provider'] | NumberProviderClass) | JsonNumberProvider)>)

export type JsonNumberProviderRef = (
  | JsonNumberProvider | (
  JsonRegistry['minecraft:number_provider'] | NumberProviderClass))

export type JsonResolvableNumber = ((
  | NBTFloat | number) | (
  JsonRegistry['minecraft:number_provider'] | NumberProviderClass))

export type JsonScoreNumberProvider = {
  target: JsonScoreProvider,
  score: NonEmptyString | ObjectiveClass,
  scale?: (NBTFloat | number),
}

export type JsonStorageNumberProvider = {
  storage: NamespacedString,
  path: NonEmptyString | DataPointClass,
}

export type JsonUniformNumberProvider = {
  min?: JsonNumberProviderRef,
  max?: JsonNumberProviderRef,
}

export type JsonWeightedNumberProvider = {
  distribution: JsonNonEmptyWeightedList<JsonNumberProviderRef>,
}
type JsonNumberProviderDispatcherMap = {
  'average': JsonNumberProviderAverage,
  'minecraft:average': JsonNumberProviderAverage,
  'binomial': JsonNumberProviderBinomial,
  'minecraft:binomial': JsonNumberProviderBinomial,
  'conditional': JsonNumberProviderConditional,
  'minecraft:conditional': JsonNumberProviderConditional,
  'constant': JsonNumberProviderConstant,
  'minecraft:constant': JsonNumberProviderConstant,
  'enchantment_level': JsonNumberProviderEnchantmentLevel,
  'minecraft:enchantment_level': JsonNumberProviderEnchantmentLevel,
  'environment_attribute': JsonNumberProviderEnvironmentAttribute,
  'minecraft:environment_attribute': JsonNumberProviderEnvironmentAttribute,
  'maximum': JsonNumberProviderMaximum,
  'minecraft:maximum': JsonNumberProviderMaximum,
  'minimum': JsonNumberProviderMinimum,
  'minecraft:minimum': JsonNumberProviderMinimum,
  'number_dispatcher': JsonNumberProviderNumberDispatcher,
  'minecraft:number_dispatcher': JsonNumberProviderNumberDispatcher,
  'product': JsonNumberProviderProduct,
  'minecraft:product': JsonNumberProviderProduct,
  'score': JsonNumberProviderScore,
  'minecraft:score': JsonNumberProviderScore,
  'storage': JsonNumberProviderStorage,
  'minecraft:storage': JsonNumberProviderStorage,
  'sum': JsonNumberProviderSum,
  'minecraft:sum': JsonNumberProviderSum,
  'uniform': JsonNumberProviderUniform,
  'minecraft:uniform': JsonNumberProviderUniform,
  'weighted_list': JsonNumberProviderWeightedList,
  'minecraft:weighted_list': JsonNumberProviderWeightedList,
}
type JsonNumberProviderKeys = keyof JsonNumberProviderDispatcherMap
type JsonNumberProviderFallback = (
  | JsonNumberProviderAverage
  | JsonNumberProviderBinomial
  | JsonNumberProviderConditional
  | JsonNumberProviderConstant
  | JsonNumberProviderEnchantmentLevel
  | JsonNumberProviderEnvironmentAttribute
  | JsonNumberProviderMaximum
  | JsonNumberProviderMinimum
  | JsonNumberProviderNumberDispatcher
  | JsonNumberProviderProduct
  | JsonNumberProviderScore
  | JsonNumberProviderStorage
  | JsonNumberProviderSum
  | JsonNumberProviderUniform
  | JsonNumberProviderWeightedList)
type JsonNumberProviderNoneType = JsonUniformNumberProvider
type JsonNumberProviderAverage = JsonAggregateNumberProvider
type JsonNumberProviderBinomial = JsonBinomialNumberProvider
type JsonNumberProviderConditional = JsonConditionalNumberProvider
type JsonNumberProviderConstant = JsonConstantNumberProvider
type JsonNumberProviderEnchantmentLevel = JsonEnchantmentLevelProvider
type JsonNumberProviderEnvironmentAttribute = JsonEnvironmentAttributeNumberProvider
type JsonNumberProviderMaximum = JsonAggregateNumberProvider
type JsonNumberProviderMinimum = JsonAggregateNumberProvider
type JsonNumberProviderNumberDispatcher = JsonNumberDispatcher
type JsonNumberProviderProduct = JsonAggregateNumberProvider
type JsonNumberProviderScore = JsonScoreNumberProvider
type JsonNumberProviderStorage = JsonStorageNumberProvider
type JsonNumberProviderSum = JsonAggregateNumberProvider
type JsonNumberProviderUniform = JsonUniformNumberProvider
type JsonNumberProviderWeightedList = JsonWeightedNumberProvider
export type JsonSymbolNumberProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonNumberProviderDispatcherMap
  : CASE extends 'keys'
    ? JsonNumberProviderKeys
    : CASE extends '%fallback'
      ? JsonNumberProviderFallback
      : CASE extends '%none' ? JsonNumberProviderNoneType : never
