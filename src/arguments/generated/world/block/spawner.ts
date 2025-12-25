import type { TrialSpawnerConfig } from 'sandstone/arguments/generated/data/trial_spawner'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { InclusiveRange, WeightedEntry } from 'sandstone/arguments/generated/util'
import type { EquipmentSlot } from 'sandstone/arguments/generated/util/slot'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block'
import type { AnyEntity } from 'sandstone/arguments/generated/world/entity'
import type { NBTFloat, NBTInt, NBTList, NBTLong, NBTShort } from 'sandstone'

export type CustomSpawnRules = {
  /**
     * Range of block light level required for the entity to spawn.
     */
  block_light_limit?: InclusiveRange<NBTInt<{
    min: 0
    max: 15
  }>>
  /**
     * Range of sky light level required for the entity to spawn.
     */
  sky_light_limit?: InclusiveRange<NBTInt<{
    min: 0
    max: 15
  }>>
}

export type SpawnEquipment = {
  /**
     * Generates the equipment.
     */
  loot_table: Registry['minecraft:loot_table']
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
  slot_drop_chances: (NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }> | ({
    [Key in Extract<EquipmentSlot, string>]?: NBTFloat<{
      leftExclusive: false
      rightExclusive: false
      min: 0
      max: 1
    }>;
  }))
}

export type Spawner = (BlockEntity & {
  /**
     * Entities that can be placed.
     */
  SpawnPotentials?: Array<SpawnPotential>
  /**
     * Data for the next mob to spawn.
     * Overwritten by `SpawnPotentials`.
     */
  SpawnData?: SpawnerEntry
  /**
     * Number of entities that will be placed.
     */
  SpawnCount?: NBTShort
  /**
     * Range that the spawned entities will be placed.
     */
  SpawnRange?: NBTShort
  /**
     * Ticks until the next spawn.
     */
  Delay?: NBTShort
  /**
     * Minimum random delay for the next spawn.
     */
  MinSpawnDelay?: NBTShort
  /**
     * Maximum random delay for the next spawn.
     */
  MaxSpawnDelay?: NBTShort
  /**
     * Maximum number of entities nearby.
     */
  MaxNearbyEntities?: NBTShort
  /**
     * Radius in blocks that a player has to be within to spawn entities.
     */
  RequiredPlayerRange?: NBTShort
})

export type SpawnerEntry = {
  entity: AnyEntity
  custom_spawn_rules?: CustomSpawnRules
  /**
     * Rolled items from the specified loot table will be equipped to the mob that spawns.
     */
  equipment?: SpawnEquipment
}

export type SpawnPotential = WeightedEntry<SpawnerEntry>

export type TrialSpawner = {
  /**
     * Spawning behavior when the player does not have the Bad Omen effect.
     */
  normal_config?: (TrialSpawnerConfig | Registry['minecraft:trial_spawner'])
  /**
     * Spawning behavior when the player has the Bad Omen effect.
     */
  ominous_config?: (TrialSpawnerConfig | Registry['minecraft:trial_spawner'])
  /**
     * Maximum distance for players to activate the trial spawner, or join a battle
     *
     * Value:
     * Range: 1..128
     */
  required_player_range?: NBTInt<{
    min: 1
  }>
  /**
     * Time in ticks for the cooldown period. Included the time spend dispensing the reward.
     */
  target_cooldown_length?: NBTInt
  /**
     * Players that are have been nearby during the current battle
     */
  registered_players?: Array<NBTList<NBTInt, {
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>>
  /**
     * All mobs that have been spawned by this trial spawner and are currently alive
     */
  current_mobs?: Array<NBTList<NBTInt, {
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>>
  /**
     * Gametime in ticks when the cooldown ends
     */
  cooldown_ends_at?: NBTLong
  /**
     * Gametime in ticks when the next spawning attempt happens
     */
  next_mob_spawns_at?: NBTLong
  total_mobs_spawned?: NBTInt
  /**
     * The next entity to spawn, also controlls the entity displayed in the trial spawner
     */
  spawn_data?: SpawnerEntry
  /**
     * The loot table selected to be used to determine the reward
     */
  ejecting_loot_table?: Registry['minecraft:loot_table']
}
