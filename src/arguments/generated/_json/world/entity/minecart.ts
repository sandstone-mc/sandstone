import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonSlottedItem } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonBaseCommandBlock } from 'sandstone/arguments/generated/_json/world/block/command_block.ts'
import type { JsonSpawnerEntry, JsonSpawnPotential } from 'sandstone/arguments/generated/_json/world/block/spawner.ts'
import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonNBTList, LootTableClass, NBTByte, NBTDouble, NBTFloat, NBTInt, NBTLong, NBTShort } from 'sandstone'

export type JsonChestMinecart = (JsonMinecart & JsonContainerMinecart & {
  /**
   * Slots from 0 to 26.
   *
   * Value:
   * List length range: 0..27
   */
  Items?: JsonNBTList<JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 26,
  }> | number)>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 27,
  }>,
})

export type JsonCommandBlockMinecart = (JsonMinecart & JsonBaseCommandBlock)

export type JsonContainerMinecart = {
  /**
   * Loot table that will populate this minecart.
   */
  LootTable?: (JsonRegistry['minecraft:loot_table'] | '' | LootTableClass),
  /**
   * Seed of the loot table.
   */
  LootTableSeed?: (NBTLong | number),
}

export type JsonFurnaceMinecart = (JsonMinecart & {
  /**
   * Acceleration in x axis.
   */
  PushX?: (NBTDouble | number),
  /**
   * Acceleration in z axis.
   */
  PushZ?: (NBTDouble | number),
  /**
   * Ticks until the fuel runs out.
   */
  Fuel?: (NBTShort | number),
})

export type JsonHopperMinecart = (JsonMinecart & JsonContainerMinecart & {
  /**
   * Slots from 0 to 4.
   *
   * Value:
   * List length range: 0..5
   */
  Items?: JsonNBTList<JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 4,
  }> | number)>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 5,
  }>,
  /**
   * Ticks until an item can be transferred.
   */
  TransferCooldown?: (NBTInt | number),
  /**
   * Whether it should pick up items.
   */
  Enabled?: boolean,
})

export type JsonMinecart = (JsonEntityBase & {
  /**
   * Custom block to display.
   */
  DisplayState?: JsonBlockState,
  /**
   * Vertical offset of the block display.
   */
  DisplayOffset?: (NBTInt | number),
})

export type JsonSpawnerMinecart = (JsonMinecart & {
  /**
   * List of potential entities to place next.
   */
  SpawnPotentials?: Array<JsonSpawnPotential>,
  /**
   * Data for the next mob to place.
   * Will be overwritten by `SpawnPotentials`.
   */
  SpawnData?: JsonSpawnerEntry,
  /**
   * Number of entities that will be placed.
   */
  SpawnCount: (NBTShort | number),
  /**
   * Range that the spawned entities will be placed in.
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

export type JsonTntMinecart = (JsonMinecart & {
  /**
   * Ticks until it explodes.
   */
  fuse?: (NBTInt | number),
  /**
   * Value:
   * Range: 0..128
   */
  explosion_power?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Controls the amount of added damage depending on the speed of the minecart.
   *
   * Value:
   * Range: 0..128
   */
  explosion_speed_factor?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
})
