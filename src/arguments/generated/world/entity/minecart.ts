import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { SlottedItem } from 'sandstone/arguments/generated/util/slot.ts'
import type { BaseCommandBlock } from 'sandstone/arguments/generated/world/block/command_block.ts'
import type { SpawnerEntry, SpawnPotential } from 'sandstone/arguments/generated/world/block/spawner.ts'
import type { EntityBase } from 'sandstone/arguments/generated/world/entity.ts'
import type { NBTByte, NBTDouble, NBTFloat, NBTInt, NBTList, NBTLong, NBTShort } from 'sandstone'

export type ChestMinecart = (Minecart & ContainerMinecart & {
  /**
   * Slots from 0 to 26.
   *
   * Value:
   * List length range: 0..27
   */
  Items?: NBTList<SlottedItem<NBTByte<{
    min: 0
    max: 26
  }>>, {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 27
  }>
})

export type CommandBlockMinecart = (Minecart & BaseCommandBlock)

export type ContainerMinecart = {
  /**
   * Loot table that will populate this minecart.
   */
  LootTable?: (Registry['minecraft:loot_table'] | '')
  /**
   * Seed of the loot table.
   */
  LootTableSeed?: NBTLong
}

export type FurnaceMinecart = (Minecart & {
  /**
   * Acceleration in x axis.
   */
  PushX?: (NBTDouble | number)
  /**
   * Acceleration in z axis.
   */
  PushZ?: (NBTDouble | number)
  /**
   * Ticks until the fuel runs out.
   */
  Fuel?: NBTShort
})

export type HopperMinecart = (Minecart & ContainerMinecart & {
  /**
   * Slots from 0 to 4.
   *
   * Value:
   * List length range: 0..5
   */
  Items?: NBTList<SlottedItem<NBTByte<{
    min: 0
    max: 4
  }>>, {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 5
  }>
  /**
   * Ticks until an item can be transferred.
   */
  TransferCooldown?: NBTInt
  /**
   * Whether it should pick up items.
   */
  Enabled?: boolean
})

export type Minecart = (EntityBase & {
  /**
   * Custom block to display.
   */
  DisplayState?: BlockState
  /**
   * Vertical offset of the block display.
   */
  DisplayOffset?: NBTInt
})

export type SpawnerMinecart = (Minecart & {
  /**
   * List of potential entities to place next.
   */
  SpawnPotentials?: Array<SpawnPotential>
  /**
   * Data for the next mob to place.
   * Will be overwritten by `SpawnPotentials`.
   */
  SpawnData?: SpawnerEntry
  /**
   * Number of entities that will be placed.
   */
  SpawnCount: NBTShort
  /**
   * Range that the spawned entities will be placed in.
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

export type TntMinecart = (Minecart & {
  /**
   * Ticks until it explodes.
   */
  fuse?: NBTInt
  /**
   * Value:
   * Range: 0..128
   */
  explosion_power?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
  }>
  /**
   * Controls the amount of added damage depending on the speed of the minecart.
   *
   * Value:
   * Range: 0..128
   */
  explosion_speed_factor?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
  }>
})
