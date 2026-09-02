import type { LevelBasedValue } from 'sandstone/arguments/generated/data/enchantment/level_based_value.ts'
import type { ScoreProvider } from 'sandstone/arguments/generated/data/util.ts'
import type { NumericalEnvironmentAttribute } from 'sandstone/arguments/generated/data/worldgen/attribute.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { DataPointClass, NamespacedString, NBTFloat, NonEmptyString, ObjectiveClass } from 'sandstone'

export type BinomialNumberProvider = {
  n: LegacyNumberProvider,
  p: LegacyNumberProvider,
}

export type ConstantNumberProvider = {
  value: NBTFloat,
}

export type EnchantmentLevelProvider = {
  amount: LevelBasedValue,
}

export type EnvironmentAttributeNumberProvider = {
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
  attribute: NumericalEnvironmentAttribute,
}

export type LegacyNumberProvider = (NBTFloat | ({
  [S in Extract<Extract<NamespacedString, string>, string>]?: ({
    /**
     * Defaults to `minecraft:uniform`.
     */
    type?: S,
  } & (S extends undefined
    ? SymbolNumberProvider<'%none'> :
    (S extends keyof SymbolNumberProvider ? SymbolNumberProvider[S] : RootNBT)))
}[Extract<NamespacedString, string>]))

export type LegacySumNumberProvider = {
  summands: Array<LegacyNumberProvider>,
}

export type ScoreNumberProvider = {
  target: ScoreProvider,
  score: NonEmptyString | ObjectiveClass,
  scale?: NBTFloat,
}

export type StorageNumberProvider = {
  storage: NamespacedString,
  path: NonEmptyString | DataPointClass,
}

export type UniformNumberProvider = {
  min?: LegacyNumberProvider,
  max?: LegacyNumberProvider,
}
type NumberProviderDispatcherMap = {
  'binomial': NumberProviderBinomial,
  'minecraft:binomial': NumberProviderBinomial,
  'constant': NumberProviderConstant,
  'minecraft:constant': NumberProviderConstant,
  'enchantment_level': NumberProviderEnchantmentLevel,
  'minecraft:enchantment_level': NumberProviderEnchantmentLevel,
  'environment_attribute': NumberProviderEnvironmentAttribute,
  'minecraft:environment_attribute': NumberProviderEnvironmentAttribute,
  'score': NumberProviderScore,
  'minecraft:score': NumberProviderScore,
  'storage': NumberProviderStorage,
  'minecraft:storage': NumberProviderStorage,
  'sum': NumberProviderSum,
  'minecraft:sum': NumberProviderSum,
  'uniform': NumberProviderUniform,
  'minecraft:uniform': NumberProviderUniform,
}
type NumberProviderKeys = keyof NumberProviderDispatcherMap
type NumberProviderFallback = (
  | NumberProviderBinomial
  | NumberProviderConstant
  | NumberProviderEnchantmentLevel
  | NumberProviderEnvironmentAttribute
  | NumberProviderScore
  | NumberProviderStorage
  | NumberProviderSum
  | NumberProviderUniform)
type NumberProviderNoneType = UniformNumberProvider
type NumberProviderBinomial = BinomialNumberProvider
type NumberProviderConstant = ConstantNumberProvider
type NumberProviderEnchantmentLevel = EnchantmentLevelProvider
type NumberProviderEnvironmentAttribute = EnvironmentAttributeNumberProvider
type NumberProviderScore = ScoreNumberProvider
type NumberProviderStorage = StorageNumberProvider
type NumberProviderSum = LegacySumNumberProvider
type NumberProviderUniform = UniformNumberProvider
export type SymbolNumberProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? NumberProviderDispatcherMap
  : CASE extends 'keys'
    ? NumberProviderKeys
    : CASE extends '%fallback' ? NumberProviderFallback : CASE extends '%none' ? NumberProviderNoneType : never
