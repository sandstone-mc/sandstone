import type { MinMaxBounds } from 'sandstone/arguments/generated/data/util'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { NBTDouble, NBTInt, TagClass } from 'sandstone'
import type { RootNBT } from 'sandstone/arguments/nbt'

export type BiomeCheck = {
  /**
     * Checks if the entity is spawning in specific biomes.
     */
  biomes: ((
        | Registry['minecraft:worldgen/biome']
        | `#${Registry['minecraft:tag/worldgen/biome']}`
        | TagClass<'worldgen/biome'>)
      | Array<Registry['minecraft:worldgen/biome']>)
}

export type MoonBrightnessCheck = {
  /**
     * Checks if the current moon brightness is within a certain range.
     */
  range: MinMaxBounds<(NBTDouble | number)>
}

export type SpawnCondition = ({
  [S in Extract<Registry['minecraft:spawn_condition_type'], string>]?: ({
    type: S
  } & (S extends keyof SymbolSpawnCondition ? SymbolSpawnCondition[S] : RootNBT));
}[Registry['minecraft:spawn_condition_type']])

export type SpawnPrioritySelector = {
  /**
     * The spawn condition to check. If not present, the condition always matches.
     */
  condition?: SpawnCondition
  /**
     * The spawn priority to use.
     */
  priority: NBTInt
}

export type SpawnPrioritySelectors = {
  /**
     * The spawn conditions for this variant. Selection process:
     * - Conditions for all variants for the given entity type are evaluated for the spawn position
     * - Entries with a priority lower than the maximum priority of the remaining entries are removed
     * - A random entry is picked out of the remaining ones
     * - If no conditions are remaining, the variant remains unchanged from the default
     */
  spawn_conditions: Array<SpawnPrioritySelector>
}

export type StructureCheck = {
  /**
     * Checks if the entity is spawning in specific structures.
     */
  structures: ((
        | Registry['minecraft:worldgen/structure']
        | `#${Registry['minecraft:tag/worldgen/structure']}`
        | TagClass<'worldgen/structure'>)
      | Array<Registry['minecraft:worldgen/structure']>)
}
type SpawnConditionDispatcherMap = {
  'biome': SpawnConditionBiome
  'minecraft:biome': SpawnConditionBiome
  'moon_brightness': SpawnConditionMoonBrightness
  'minecraft:moon_brightness': SpawnConditionMoonBrightness
  'structure': SpawnConditionStructure
  'minecraft:structure': SpawnConditionStructure
}
type SpawnConditionKeys = keyof SpawnConditionDispatcherMap
type SpawnConditionFallback = (SpawnConditionBiome | SpawnConditionMoonBrightness | SpawnConditionStructure)
type SpawnConditionBiome = BiomeCheck
type SpawnConditionMoonBrightness = MoonBrightnessCheck
type SpawnConditionStructure = StructureCheck
export type SymbolSpawnCondition<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? SpawnConditionDispatcherMap
  : CASE extends 'keys' ? SpawnConditionKeys : CASE extends '%fallback' ? SpawnConditionFallback : never
