import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type { PositionalEnvironmentAttributeMap } from 'sandstone/arguments/generated/data/worldgen/attribute.ts'
import type { CarverRef } from 'sandstone/arguments/generated/data/worldgen/carver.ts'
import type { PlacedFeatureRef } from 'sandstone/arguments/generated/data/worldgen/feature/placement.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { StringRGB } from 'sandstone/arguments/generated/util/color.ts'
import type { NBTDouble, NBTFloat, NBTInt, NBTList, TagClass } from 'sandstone'

export type Biome = {
  attributes?: PositionalEnvironmentAttributeMap,
  temperature: NBTFloat,
  downfall: NBTFloat,
  has_precipitation: boolean,
  /**
   * Value:
   *
   *  - None(`none`)
   *  - Frozen(`frozen`)
   */
  temperature_modifier?: TemperatureModifier,
  /**
   * Value:
   * Range: 0..1
   */
  creature_spawn_probability?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  effects: BiomeEffects,
  spawners: ({
    [Key in Extract<MobCategory, string>]?: Array<SpawnerData>
  }),
  spawn_costs: ({
    [Key in Extract<Registry['minecraft:entity_type'], string>]?: MobSpawnCost
  }),
  carvers: (
      | Array<CarverRef> | (
        | Registry['minecraft:worldgen/configured_carver']
        | `#${string}:${string}`
        | TagClass<'worldgen/configured_carver'>)),
  /**
   * Value:
   * List length range: ..11
   */
  features: NBTList<(Array<PlacedFeatureRef> | (`#${string}:${string}` | TagClass<'worldgen/placed_feature'>)), {
    rightExclusive: false,
  }>,
}

export type BiomeCategory = (
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

export type BiomeEffects = {
  water_color: StringRGB,
  grass_color?: StringRGB,
  foliage_color?: StringRGB,
  dry_foliage_color?: StringRGB,
  /**
   * Value:
   *
   *  - None(`none`)
   *  - DarkForest(`dark_forest`)
   *  - Swamp(`swamp`)
   */
  grass_color_modifier?: GrassColorModifier,
}

export type BiomeMusic = ({
  sound: SoundEventRef,
  /**
   * Value:
   * Range: 0..
   */
  min_delay: NBTInt<{
    min: 0,
  }>,
  /**
   * Value:
   * Range: 0..
   */
  max_delay: NBTInt<{
    min: 0,
  }>,
} & {
  /**
   * Defaults to `false`.
   */
  replace_current_music?: boolean,
})

export type BiomeSoundAdditions = {
  sound: SoundEventRef,
  /**
   * Value:
   * Range: 0..1
   */
  tick_chance: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type GrassColorModifier = ('none' | 'dark_forest' | 'swamp')

export type MobCategory = (
  | 'monster'
  | 'creature'
  | 'ambient'
  | 'axolotls'
  | 'underground_water_creature'
  | 'water_creature'
  | 'water_ambient'
  | 'misc')

export type MobSpawnCost = {
  energy_budget: (NBTDouble | number),
  charge: (NBTDouble | number),
}

export type MoodSound = {
  sound: SoundEventRef,
  tick_delay: NBTInt,
  block_search_extent: NBTInt,
  offset: NBTFloat,
}

export type Precipitation = ('none' | 'rain' | 'snow')

export type SpawnerData = {
  type: Registry['minecraft:entity_type'],
  weight: NBTInt,
  minCount: NBTInt,
  maxCount: NBTInt,
}

export type TemperatureModifier = ('none' | 'frozen')
