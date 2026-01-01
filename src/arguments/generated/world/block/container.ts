import type { Registry } from 'sandstone/arguments/generated/registry'
import type { SlottedItem } from 'sandstone/arguments/generated/util/slot'
import type { BlockEntity, Lockable, Nameable } from 'sandstone/arguments/generated/world/block'
import type { NBTByte, NBTInt, NBTList, NBTLong } from 'sandstone'

export type Container27 = (ContainerBase & {
  /**
     * Slots from 0 to 26.
     *
     * Value:
     * List length range: 0..27
     */
  Items?: SlottedItem<NBTByte<{
    min: 0
    max: 26
  }>>[]
})

export type Container9 = (ContainerBase & {
  /**
     * Slots from 0 to 8.
     *
     * Value:
     * List length range: 0..9
     */
  Items?: NBTList<SlottedItem<NBTByte<{
    min: 0
    max: 8
  }>>, {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 9
  }>
})

export type ContainerBase = (BlockEntity & Nameable & Lockable & {
  /**
     * Loot table that will populate this container.
     */
  LootTable?: (Registry['minecraft:loot_table'] | '')
  /**
     * Seed of the loot table.
     */
  LootTableSeed?: NBTLong
})

export type Hopper = (ContainerBase & {
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
})

export type Shelf = (ContainerBase & {
  /**
     * Slots from 0 to 2.
     *
     * Value:
     * List length range: 0..3
     */
  Items?: NBTList<SlottedItem<NBTByte<{
    min: 0
    max: 2
  }>>, {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 3
  }>
  /**
     * Defaults to `false`.
     */
  align_items_to_bottom?: boolean
})
