import type { ItemPredicate } from 'sandstone/arguments/generated/data/advancement/predicate.ts'
import type { BlockEntityTarget, EntityTarget } from 'sandstone/arguments/generated/data/loot.ts'
import type { ContainerComponents } from 'sandstone/arguments/generated/data/loot/function.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { ENTITY_SLOTS } from 'sandstone/arguments'
import type { NBTObject, RootNBT } from 'sandstone/arguments/nbt.ts'
import type { LiteralUnion, NBTInt } from 'sandstone'

export type ContentsSlotSource = {
  /**
   * The slots to search.
   */
  slot_source: SlotSource
  /**
   * If an item targeted by `slot_source` has this container component, selects all items inside.
   *
   * Value:
   *
   *  - Container(`container`)
   *  - BundleContents(`bundle_contents`)
   *  - ChargedProjectiles(`charged_projectiles`)
   */
  component: (ContainerComponents | `minecraft:${ContainerComponents}`)
}

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

export type FilterSlotSource = {
  slot_source: SlotSource
  item_filter: ItemPredicate
}

export type GroupSlotSource = {
  terms: Array<SlotSource>
}

export type LimitCountSlotSource = {
  slot_source: SlotSource
  /**
   * Value:
   * Range: 1..
   */
  limit: NBTInt<{
    min: 1
  }>
}

export type RangeSlotSource = {
  /**
   * Value:
   * *either*
   *
   *
   *
   * *or*
   *
   * *item 1*
   */
  source: (EntityTarget | BlockEntityTarget)
  slots: LiteralUnion<ENTITY_SLOTS>
}

export type SlotSource = (TypedSlotSource | Array<TypedSlotSource>)

export type SlottedItem<T extends NBTObject> = (ItemStack & {
  /**
   * Inventory slot the item is in
   */
  Slot?: T
})

export type TypedSlotSource = NonNullable<({
  [S in Extract<Registry['minecraft:slot_source_type'], string>]?: ({
    type: S
  } & (S extends keyof SymbolSlotSource ? SymbolSlotSource[S] : RootNBT));
}[Registry['minecraft:slot_source_type']])>
type SlotSourceDispatcherMap = {
  'contents': SlotSourceContents
  'minecraft:contents': SlotSourceContents
  'empty': SlotSourceEmpty
  'minecraft:empty': SlotSourceEmpty
  'filtered': SlotSourceFiltered
  'minecraft:filtered': SlotSourceFiltered
  'group': SlotSourceGroup
  'minecraft:group': SlotSourceGroup
  'limit_slots': SlotSourceLimitSlots
  'minecraft:limit_slots': SlotSourceLimitSlots
  'slot_range': SlotSourceSlotRange
  'minecraft:slot_range': SlotSourceSlotRange
}
type SlotSourceKeys = keyof SlotSourceDispatcherMap
type SlotSourceFallback = (
  | SlotSourceContents
  | SlotSourceEmpty
  | SlotSourceFiltered
  | SlotSourceGroup
  | SlotSourceLimitSlots
  | SlotSourceSlotRange)
type SlotSourceContents = ContentsSlotSource
type SlotSourceEmpty = Record<string, never>
type SlotSourceFiltered = FilterSlotSource
type SlotSourceGroup = GroupSlotSource
type SlotSourceLimitSlots = LimitCountSlotSource
type SlotSourceSlotRange = RangeSlotSource
export type SymbolSlotSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? SlotSourceDispatcherMap
  : CASE extends 'keys' ? SlotSourceKeys : CASE extends '%fallback' ? SlotSourceFallback : never
