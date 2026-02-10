import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { WeightedList } from 'sandstone/arguments/generated/util.ts'
import type { SpawnPotential } from 'sandstone/arguments/generated/world/block/spawner.ts'
import type { LootTableClass, NBTFloat, NBTInt } from 'sandstone'

export type TrialSpawnerConfig = {
  /**
   * Maximum distance from the spawner that en entity can spawn
   *
   * Value:
   * Range: 1..128
   */
  spawn_range?: NBTInt<{
    min: 1,
  }>,
  /**
   * Total amount of entities that are spawned during one activation, when 1 player is nearby
   */
  total_mobs?: NBTFloat,
  /**
   * Number added to `total_mobs` for each additional player
   */
  total_mobs_added_per_player?: NBTFloat,
  /**
   * Number of entities that that can be present at once, when 1 player is nearby
   */
  simultaneous_mobs?: NBTFloat,
  /**
   * Number added to `simultaneous_mobs` for each additional player
   */
  simultaneous_mobs_added_per_player?: NBTFloat,
  /**
   * Ticks until the next spawn.
   */
  ticks_between_spawn?: NBTInt,
  /**
   * Entities that can be placed.
   */
  spawn_potentials?: Array<SpawnPotential>,
  /**
   * Loot tables to use when ejecting loot. Chooses one loot table based on weight and then uses it as often as there are players nearby.
   */
  loot_tables_to_eject?: WeightedList<(Registry['minecraft:loot_table'] | LootTableClass)>,
  /**
   * Loot table to use when summoning ominous item spawners. One roll seeded based on rough location to determine all items used during the battle.
   */
  items_to_drop_when_ominous?: (Registry['minecraft:loot_table'] | LootTableClass),
}
