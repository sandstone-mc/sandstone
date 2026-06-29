import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTObject } from 'sandstone/arguments/nbt.ts'

export type EquipmentSlot = ('mainhand' | 'offhand' | 'head' | 'chest' | 'legs' | 'feet' | 'body' | 'saddle')

export type EquipmentSlotGroup = (
  | 'mainhand'
  | 'offhand'
  | 'head'
  | 'chest'
  | 'legs'
  | 'feet'
  | 'hand'
  | 'armor'
  | 'any'
  | 'body'
  | 'saddle')

export type SlottedItem<T extends NBTObject> = (ItemStack & {
  /**
   * Inventory slot the item is in
   */
  Slot?: T,
})
