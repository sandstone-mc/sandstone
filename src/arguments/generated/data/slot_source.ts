import type { ItemPredicate } from 'sandstone/arguments/generated/data/advancement/predicate.ts'
import type { BlockEntityTarget, EntityTarget } from 'sandstone/arguments/generated/data/loot.ts'
import type { ContainerComponents } from 'sandstone/arguments/generated/data/loot/function.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { ENTITY_SLOTS } from 'sandstone/arguments'
import type { NBTObject, RootNBT } from 'sandstone/arguments/nbt.ts'
import type { LiteralUnion, NBTInt, SlotSourceClass } from 'sandstone'

export type ContentsSlotSource<S extends NBTObject> = {
  /**
   * The slots to search.
   */
  slot_source: SlotSourceOf<S>,
  /**
   * If an item targeted by `slot_source` has this container component, selects all items inside.
   *
   * Value:
   *
   *  - Container(`container`)
   *  - BundleContents(`bundle_contents`)
   *  - ChargedProjectiles(`charged_projectiles`)
   */
  component: (ContainerComponents | `minecraft:${ContainerComponents}`),
}

export type FilterSlotSource<S extends NBTObject> = {
  slot_source: SlotSourceOf<S>,
  item_filter: ItemPredicate,
}

export type GroupSlotSource<S extends NBTObject> = {
  terms: Array<SlotSourceOf<S>>,
}

export type LimitCountSlotSource<S extends NBTObject> = {
  slot_source: SlotSourceOf<S>,
  /**
   * Value:
   * Range: 1..
   */
  limit: NBTInt<{
    min: 1,
  }>,
}

export type RangeSlotSource = ({
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
  source: (EntityTarget | BlockEntityTarget),
} & {
  slots: LiteralUnion<ENTITY_SLOTS>,
})

export type SlotSource = SlotSourceOf<Registry['minecraft:slot_source_type']>

export type SlotSourceOf<S extends NBTObject> = (TypedSlotSourceOf<S> | Array<TypedSlotSourceOf<S>>)

export type TypedSlotSourceOf<S extends NBTObject> = ({
  [S in keyof SlotSourceDispatcherMap<S>]?: ({
    type: S,
  } & (S extends keyof SlotSourceDispatcherMap<S> ? SlotSourceDispatcherMap<S>[S] : RootNBT))
}[keyof SlotSourceDispatcherMap<S>])
type SlotSourceDispatcherMap<S extends NBTObject> = {
  'contents': SlotSourceContents<S>,
  'minecraft:contents': SlotSourceContents<S>,
  'empty': SlotSourceEmpty<S>,
  'minecraft:empty': SlotSourceEmpty<S>,
  'filtered': SlotSourceFiltered<S>,
  'minecraft:filtered': SlotSourceFiltered<S>,
  'group': SlotSourceGroup<S>,
  'minecraft:group': SlotSourceGroup<S>,
  'limit_slots': SlotSourceLimitSlots<S>,
  'minecraft:limit_slots': SlotSourceLimitSlots<S>,
  'reference': SlotSourceReference<S>,
  'minecraft:reference': SlotSourceReference<S>,
  'slot_range': SlotSourceSlotRange<S>,
  'minecraft:slot_range': SlotSourceSlotRange<S>,
}
type SlotSourceKeys = keyof SlotSourceDispatcherMap<NBTObject>
type SlotSourceFallback<S extends NBTObject> = (
  | SlotSourceContents<S>
  | SlotSourceEmpty<S>
  | SlotSourceFiltered<S>
  | SlotSourceGroup<S>
  | SlotSourceLimitSlots<S>
  | SlotSourceReference<S>
  | SlotSourceSlotRange<S>)
export type SlotSourceContents<S extends NBTObject> = ContentsSlotSource<S>

export type SlotSourceEmpty<S extends NBTObject> = Record<string, never>

export type SlotSourceFiltered<S extends NBTObject> = FilterSlotSource<S>

export type SlotSourceGroup<S extends NBTObject> = GroupSlotSource<S>

export type SlotSourceLimitSlots<S extends NBTObject> = LimitCountSlotSource<S>

export type SlotSourceReference<S extends NBTObject> = {
  name: (`${string}:${string}` | SlotSource),
}

export type SlotSourceSlotRange<S extends NBTObject> = RangeSlotSource

export type SymbolSlotSource<S extends NBTObject, CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? SlotSourceDispatcherMap<S>
  : CASE extends 'keys' ? SlotSourceKeys : CASE extends '%fallback' ? SlotSourceFallback<S> : never
