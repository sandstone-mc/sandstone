import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type {
  JsonPositionalEnvironmentAttributeMap,
} from 'sandstone/arguments/generated/_json/data/worldgen/attribute.ts'
import type { JsonCarverListRef } from 'sandstone/arguments/generated/_json/data/worldgen/carver.ts'
import type { JsonPlacedFeatureRef } from 'sandstone/arguments/generated/_json/data/worldgen/feature/placement.ts'
import type { JsonCarveStep, JsonIntProvider } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonStringRGB } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonFlatWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonParticle } from 'sandstone/arguments/generated/_json/util/particle.ts'
import type { JsonNBTList, NamespacedString, NBTDouble, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type JsonBiome = {
  attributes?: JsonPositionalEnvironmentAttributeMap,
  temperature: (NBTFloat | number),
  downfall: (NBTFloat | number),
  has_precipitation: boolean,
  /**
   * Value:
   *
   *  - None(`none`)
   *  - Frozen(`frozen`)
   */
  temperature_modifier?: JsonTemperatureModifier,
  effects: JsonBiomeEffects,
  carvers: JsonCarverListRef,
  /**
   * Value:
   * List length range: ..11
   */
  features: JsonNBTList<(
      | Array<JsonPlacedFeatureRef> | (
      `#${string}:${string}` | TagClass<'worldgen/placed_feature'>)), {
    rightExclusive: false,
  }>,
}

export type JsonBiomeCategory = (
  | 'beach'
  | 'desert'
  | 'extreme_hills'
  | 'forest'
  | 'icy'
  | 'jungle'
  | 'mesa'
  | 'mountain'
  | 'mushroom'
  | 'nether'
  | 'none'
  | 'ocean'
  | 'plains'
  | 'river'
  | 'savanna'
  | 'swamp'
  | 'taiga'
  | 'the_end'
  | 'underground')

export type JsonBiomeEffects = {
  water_color: JsonStringRGB,
  grass_color?: JsonStringRGB,
  foliage_color?: JsonStringRGB,
  dry_foliage_color?: JsonStringRGB,
  /**
   * Value:
   *
   *  - None(`none`)
   *  - DarkForest(`dark_forest`): Grass color will be average of the base color and `#28340a`.
   *  - Swamp(`swamp`):
   *    Grass color will be either `#4c763c` or `#6a7039`, depending on block position. \
   *    The base color is ignored.
   */
  grass_color_modifier?: JsonGrassColorModifier,
}

export type JsonBiomeMusic = ({
  sound: JsonSoundEventRef,
  /**
   * Value:
   * Range: 0..
   */
  min_delay: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..
   */
  max_delay: (NBTInt<{
    min: 0,
  }> | number),
} & {
  /**
   * Defaults to `false`.
   */
  replace_current_music?: boolean,
})

export type JsonBiomeParticle = {
  options: JsonParticle,
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

export type JsonBiomeSoundAdditions = {
  sound: JsonSoundEventRef,
  /**
   * Value:
   * Range: 0..1
   */
  tick_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonCarversPerStep = ({
  [Key in Extract<JsonCarveStep, string>]?: JsonCarverListRef
})

export type JsonGrassColorModifier = ('none' | 'dark_forest' | 'swamp')

export type JsonMobCategory = (
  | 'monster'
  | 'creature'
  | 'ambient'
  | 'axolotls'
  | 'underground_water_creature'
  | 'water_creature'
  | 'water_ambient'
  | 'misc')

export type JsonMobSpawnCost = {
  energy_budget: (NBTDouble | number),
  charge: (NBTDouble | number),
}

export type JsonMoodSound = {
  sound: JsonSoundEventRef,
  tick_delay: (NBTInt | number),
  block_search_extent: (NBTInt | number),
  offset: (NBTFloat | number),
}

export type JsonNaturalMobSpawns = {
  spawns_by_category: JsonSpawnerDataMap,
  spawn_costs: ({
    [Key in Extract<NamespacedString, string>]?: JsonMobSpawnCost
  }),
}

export type JsonPrecipitation = ('none' | 'rain' | 'snow')

export type JsonSpawnerData = {
  type: JsonRegistry['minecraft:entity_type'],
  count: JsonIntProvider<(NBTInt | number)>,
}

export type JsonSpawnerDataMap = ({
  [Key in Extract<JsonMobCategory, string>]?: JsonFlatWeightedList<JsonSpawnerData>
})

export type JsonTemperatureModifier = ('none' | 'frozen')
