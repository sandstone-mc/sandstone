import type { JsonLevelBasedValue } from 'sandstone/arguments/generated/_json/data/enchantment/level_based_value.ts'
import type { JsonScoreProvider } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonNumericalEnvironmentAttribute } from 'sandstone/arguments/generated/_json/data/worldgen/attribute.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { DataPointClass, NamespacedString, NBTFloat, NonEmptyString, ObjectiveClass } from 'sandstone'

export type JsonBinomialNumberProvider = {
  n: JsonLegacyNumberProvider,
  p: JsonLegacyNumberProvider,
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

export type JsonLegacyNumberProvider = ((NBTFloat | number) | ({
  [S in Extract<Extract<NamespacedString, string>, string>]?: ({
    /**
     * Defaults to `minecraft:uniform`.
     */
    type?: S,
  } & (S extends undefined
    ? JsonSymbolNumberProvider<'%none'> :
    (S extends keyof JsonSymbolNumberProvider ? JsonSymbolNumberProvider[S] : JsonRootNBT)))
}[Extract<NamespacedString, string>]))

export type JsonLegacySumNumberProvider = {
  summands: Array<JsonLegacyNumberProvider>,
}

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
  min?: JsonLegacyNumberProvider,
  max?: JsonLegacyNumberProvider,
}
type JsonNumberProviderDispatcherMap = {
  'binomial': JsonNumberProviderBinomial,
  'minecraft:binomial': JsonNumberProviderBinomial,
  'constant': JsonNumberProviderConstant,
  'minecraft:constant': JsonNumberProviderConstant,
  'enchantment_level': JsonNumberProviderEnchantmentLevel,
  'minecraft:enchantment_level': JsonNumberProviderEnchantmentLevel,
  'environment_attribute': JsonNumberProviderEnvironmentAttribute,
  'minecraft:environment_attribute': JsonNumberProviderEnvironmentAttribute,
  'score': JsonNumberProviderScore,
  'minecraft:score': JsonNumberProviderScore,
  'storage': JsonNumberProviderStorage,
  'minecraft:storage': JsonNumberProviderStorage,
  'sum': JsonNumberProviderSum,
  'minecraft:sum': JsonNumberProviderSum,
  'uniform': JsonNumberProviderUniform,
  'minecraft:uniform': JsonNumberProviderUniform,
}
type JsonNumberProviderKeys = keyof JsonNumberProviderDispatcherMap
type JsonNumberProviderFallback = (
  | JsonNumberProviderBinomial
  | JsonNumberProviderConstant
  | JsonNumberProviderEnchantmentLevel
  | JsonNumberProviderEnvironmentAttribute
  | JsonNumberProviderScore
  | JsonNumberProviderStorage
  | JsonNumberProviderSum
  | JsonNumberProviderUniform)
type JsonNumberProviderNoneType = JsonUniformNumberProvider
type JsonNumberProviderBinomial = JsonBinomialNumberProvider
type JsonNumberProviderConstant = JsonConstantNumberProvider
type JsonNumberProviderEnchantmentLevel = JsonEnchantmentLevelProvider
type JsonNumberProviderEnvironmentAttribute = JsonEnvironmentAttributeNumberProvider
type JsonNumberProviderScore = JsonScoreNumberProvider
type JsonNumberProviderStorage = JsonStorageNumberProvider
type JsonNumberProviderSum = JsonLegacySumNumberProvider
type JsonNumberProviderUniform = JsonUniformNumberProvider
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
