import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonSpawnPotential } from 'sandstone/arguments/generated/_json/world/block/spawner.ts'
import type { LootTableClass, NBTFloat, NBTInt } from 'sandstone'

export type JsonTrialSpawnerConfig = {
  /**
   * Maximum distance from the spawner that en entity can spawn
   *
   * Value:
   * Range: 1..128
   */
  spawn_range?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Total amount of entities that are spawned during one activation, when 1 player is nearby
   */
  total_mobs?: (NBTFloat | number),
  /**
   * Number added to `total_mobs` for each additional player
   */
  total_mobs_added_per_player?: (NBTFloat | number),
  /**
   * Number of entities that that can be present at once, when 1 player is nearby
   */
  simultaneous_mobs?: (NBTFloat | number),
  /**
   * Number added to `simultaneous_mobs` for each additional player
   */
  simultaneous_mobs_added_per_player?: (NBTFloat | number),
  /**
   * Ticks until the next spawn.
   */
  ticks_between_spawn?: (NBTInt | number),
  /**
   * Entities that can be placed.
   */
  spawn_potentials?: Array<JsonSpawnPotential>,
  /**
   * Loot tables to use when ejecting loot. Chooses one loot table based on weight and then uses it as often as there are players nearby.
   */
  loot_tables_to_eject?: JsonWeightedList<(JsonRegistry['minecraft:loot_table'] | LootTableClass)>,
  /**
   * Loot table to use when summoning ominous item spawners. One roll seeded based on rough location to determine all items used during the battle.
   */
  items_to_drop_when_ominous?: (JsonRegistry['minecraft:loot_table'] | LootTableClass),
}
