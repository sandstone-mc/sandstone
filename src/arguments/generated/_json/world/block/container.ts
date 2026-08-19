import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonSlottedItem } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonBlockEntity, JsonLockable, JsonNameable } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonNBTList, LootTableClass, NBTByte, NBTInt, NBTLong } from 'sandstone'

export type JsonContainer27 = (JsonContainerBase & {
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

export type JsonContainer9 = (JsonContainerBase & {
  /**
   * Slots from 0 to 8.
   *
   * Value:
   * List length range: 0..9
   */
  Items?: JsonNBTList<JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 8,
  }> | number)>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 9,
  }>,
})

export type JsonContainerBase = (JsonBlockEntity & JsonNameable & JsonLockable & {
  /**
   * Loot table that will populate this container.
   */
  LootTable?: (JsonRegistry['minecraft:loot_table'] | '' | LootTableClass),
  /**
   * Seed of the loot table.
   */
  LootTableSeed?: (NBTLong | number),
})

export type JsonHopper = (JsonContainerBase & {
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
})

export type JsonShelf = (JsonContainerBase & {
  /**
   * Slots from 0 to 2.
   *
   * Value:
   * List length range: 0..3
   */
  Items?: JsonNBTList<JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 2,
  }> | number)>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 3,
  }>,
  /**
   * Defaults to `false`.
   */
  align_items_to_bottom?: boolean,
})
