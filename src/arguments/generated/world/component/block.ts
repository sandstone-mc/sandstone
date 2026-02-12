import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { AnyEntity } from 'sandstone/arguments/generated/world/entity.ts'
import type { ItemStackTemplate } from 'sandstone/arguments/generated/world/item.ts'
import type { LootTableClass, NBTInt, NBTLong } from 'sandstone'

export type ContainerLoot = {
  loot_table: (Registry['minecraft:loot_table'] | LootTableClass),
  seed?: NBTLong,
}

export type ContainerSlot = {
  /**
   * The slot ID of the container.
   *
   * Value:
   * Range: 0..255
   */
  slot: NBTInt<{
    min: 0,
  }>,
  /**
   * The item stack in this container slot.
   */
  item: ItemStackTemplate,
}

export type Occupant = {
  entity_data: AnyEntity,
  min_ticks_in_hive: NBTInt,
  ticks_in_hive: NBTInt,
}
