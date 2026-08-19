import type { JsonTrialSpawnerConfig } from 'sandstone/arguments/generated/_json/data/trial_spawner.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonInclusiveRange, JsonWeightedEntry } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonEquipmentSlot } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonAnyEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonNBTList, LootTableClass, NBTFloat, NBTInt, NBTLong, NBTShort, TrialSpawnerClass } from 'sandstone'

export type JsonCustomSpawnRules = {
  /**
   * Range of block light level required for the entity to spawn.
   */
  block_light_limit?: JsonInclusiveRange<(NBTInt<{
    min: 0,
    max: 15,
  }> | number)>,
  /**
   * Range of sky light level required for the entity to spawn.
   */
  sky_light_limit?: JsonInclusiveRange<(NBTInt<{
    min: 0,
    max: 15,
  }> | number)>,
}

export type JsonSpawnEquipment = {
  /**
   * Generates the equipment.
   */
  loot_table: (JsonRegistry['minecraft:loot_table'] | LootTableClass),
  /**
   * Chance the mob will drop the equipment on death.
   *
   * Value:
   * *either*
   *
   * Range: 0..1
   *
   * *or*
   *
   * *item 1*
   */
  slot_drop_chances: ((NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number) | ({
    [Key in Extract<JsonEquipmentSlot, string>]?: (NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
      min: 0,
      max: 1,
    }> | number)
  })),
}

export type JsonSpawner = (JsonBlockEntity & {
  /**
   * Entities that can be placed.
   */
  SpawnPotentials?: Array<JsonSpawnPotential>,
  /**
   * Data for the next mob to spawn.
   * Overwritten by `SpawnPotentials`.
   */
  SpawnData?: JsonSpawnerEntry,
  /**
   * Number of entities that will be placed.
   */
  SpawnCount?: (NBTShort | number),
  /**
   * Range that the spawned entities will be placed.
   */
  SpawnRange?: (NBTShort | number),
  /**
   * Ticks until the next spawn.
   */
  Delay?: (NBTShort | number),
  /**
   * Minimum random delay for the next spawn.
   */
  MinSpawnDelay?: (NBTShort | number),
  /**
   * Maximum random delay for the next spawn.
   */
  MaxSpawnDelay?: (NBTShort | number),
  /**
   * Maximum number of entities nearby.
   */
  MaxNearbyEntities?: (NBTShort | number),
  /**
   * Radius in blocks that a player has to be within to spawn entities.
   */
  RequiredPlayerRange?: (NBTShort | number),
})

export type JsonSpawnerEntry = {
  entity: JsonAnyEntity,
  custom_spawn_rules?: JsonCustomSpawnRules,
  /**
   * Rolled items from the specified loot table will be equipped to the mob that spawns.
   */
  equipment?: JsonSpawnEquipment,
}

export type JsonSpawnPotential = JsonWeightedEntry<JsonSpawnerEntry>

export type JsonTrialSpawner = {
  /**
   * Spawning behavior when the player does not have the Bad Omen effect.
   */
  normal_config?: (JsonTrialSpawnerConfig | (JsonRegistry['minecraft:trial_spawner'] | TrialSpawnerClass)),
  /**
   * Spawning behavior when the player has the Bad Omen effect.
   */
  ominous_config?: (JsonTrialSpawnerConfig | (JsonRegistry['minecraft:trial_spawner'] | TrialSpawnerClass)),
  /**
   * Maximum distance for players to activate the trial spawner, or join a battle
   *
   * Value:
   * Range: 1..128
   */
  required_player_range?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Time in ticks for the cooldown period. Included the time spend dispensing the reward.
   */
  target_cooldown_length?: (NBTInt | number),
  /**
   * Players that are have been nearby during the current battle
   */
  registered_players?: Array<JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>>,
  /**
   * All mobs that have been spawned by this trial spawner and are currently alive
   */
  current_mobs?: Array<JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>>,
  /**
   * Gametime in ticks when the cooldown ends
   */
  cooldown_ends_at?: (NBTLong | number),
  /**
   * Gametime in ticks when the next spawning attempt happens
   */
  next_mob_spawns_at?: (NBTLong | number),
  total_mobs_spawned?: (NBTInt | number),
  /**
   * The next entity to spawn, also controlls the entity displayed in the trial spawner
   */
  spawn_data?: JsonSpawnerEntry,
  /**
   * The loot table selected to be used to determine the reward
   */
  ejecting_loot_table?: (JsonRegistry['minecraft:loot_table'] | LootTableClass),
}
