import type { JsonMinMaxBounds } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonNBTObject, JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTDouble, NBTInt, TagClass } from 'sandstone'

export type JsonBiomeCheck = {
  /**
   * Checks if the entity is spawning in specific biomes.
   */
  biomes: ((
        | JsonRegistry['minecraft:worldgen/biome']
        | `#${JsonRegistry['minecraft:tag/worldgen/biome']}`
        | TagClass<'worldgen/biome'>)
      | Array<JsonRegistry['minecraft:worldgen/biome']>),
}

export type JsonMoonBrightnessCheck = {
  /**
   * Checks if the current moon brightness is within a certain range.
   */
  range: JsonMinMaxBounds<(NBTDouble | number)>,
}

export type JsonSoundVariant<T extends JsonNBTObject> = {
  adult_sounds: T,
  baby_sounds: T,
}

export type JsonSpawnCondition = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:spawn_condition_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolSpawnCondition ? JsonSymbolSpawnCondition[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:spawn_condition_type'], string>])>

export type JsonSpawnPrioritySelector = {
  /**
   * The spawn condition to check. If not present, the condition always matches.
   */
  condition?: JsonSpawnCondition,
  /**
   * The spawn priority to use.
   */
  priority: (NBTInt | number),
}

export type JsonSpawnPrioritySelectors = {
  /**
   * The spawn conditions for this variant. Selection process:
   * - Conditions for all variants for the given entity type are evaluated for the spawn position
   * - Entries with a priority lower than the maximum priority of the remaining entries are removed
   * - A random entry is picked out of the remaining ones
   * - If no conditions are remaining, the variant remains unchanged from the default
   */
  spawn_conditions: Array<JsonSpawnPrioritySelector>,
}

export type JsonStructureCheck = {
  /**
   * Checks if the entity is spawning in specific structures.
   */
  structures: ((
        | JsonRegistry['minecraft:worldgen/structure']
        | `#${JsonRegistry['minecraft:tag/worldgen/structure']}`
        | TagClass<'worldgen/structure'>)
      | Array<JsonRegistry['minecraft:worldgen/structure']>),
}
type JsonSpawnConditionDispatcherMap = {
  'biome': JsonSpawnConditionBiome,
  'minecraft:biome': JsonSpawnConditionBiome,
  'moon_brightness': JsonSpawnConditionMoonBrightness,
  'minecraft:moon_brightness': JsonSpawnConditionMoonBrightness,
  'structure': JsonSpawnConditionStructure,
  'minecraft:structure': JsonSpawnConditionStructure,
}
type JsonSpawnConditionKeys = keyof JsonSpawnConditionDispatcherMap
type JsonSpawnConditionFallback = (
  | JsonSpawnConditionBiome
  | JsonSpawnConditionMoonBrightness
  | JsonSpawnConditionStructure)
type JsonSpawnConditionBiome = JsonBiomeCheck
type JsonSpawnConditionMoonBrightness = JsonMoonBrightnessCheck
type JsonSpawnConditionStructure = JsonStructureCheck
export type JsonSymbolSpawnCondition<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonSpawnConditionDispatcherMap
  : CASE extends 'keys' ? JsonSpawnConditionKeys : CASE extends '%fallback' ? JsonSpawnConditionFallback : never
