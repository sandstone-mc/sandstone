import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { AnyEntity } from 'sandstone/arguments/generated/world/entity.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTInt, NBTLong } from 'sandstone'

export type ContainerLoot = {
  loot_table: Registry['minecraft:loot_table']
  seed?: NBTLong
}

export type ContainerSlot = {
  /**
   * The slot ID of the container.
   *
   * Value:
   * Range: 0..255
   */
  slot: NBTInt<{
    min: 0
  }>
  /**
   * The item stack in this container slot.
   */
  item: ItemStack
}

export type Occupant = {
  entity_data: AnyEntity
  min_ticks_in_hive: NBTInt
  ticks_in_hive: NBTInt
}
