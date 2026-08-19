import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'

export type JsonEquipmentSlot = ('mainhand' | 'offhand' | 'head' | 'chest' | 'legs' | 'feet' | 'body' | 'saddle')

export type JsonEquipmentSlotGroup = (
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

export type JsonSlottedItem<T extends JsonNBTObject> = (JsonItemStack & {
  /**
   * Inventory slot the item is in
   */
  Slot?: T,
})
