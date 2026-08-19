import type { JsonItemPredicate } from 'sandstone/arguments/generated/_json/data/advancement/predicate.ts'
import type { JsonContainerComponents } from 'sandstone/arguments/generated/_json/data/loot/function.ts'
import type { JsonBlockEntityTarget, JsonEntityTarget } from 'sandstone/arguments/generated/_json/data/loot.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { ENTITY_SLOTS } from 'sandstone/arguments'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { LiteralUnion, NamespacedString, NBTInt, SlotSourceClass, TagClass } from 'sandstone'

export type JsonContentsSlotSource = {
  /**
   * The slots to search.
   */
  slot_source: JsonSlotSource,
  /**
   * If an item targeted by `slot_source` has this container component, selects all items inside.
   *
   * Value:
   *
   *  - Container(`container`)
   *  - BundleContents(`bundle_contents`)
   *  - ChargedProjectiles(`charged_projectiles`)
   */
  component: (JsonContainerComponents | `minecraft:${JsonContainerComponents}`),
}

export type JsonFilterSlotSource = {
  slot_source: JsonSlotSource,
  item_filter: JsonItemPredicate,
}

export type JsonGroupSlotSource = {
  terms: JsonSlotSource,
}

export type JsonLimitCountSlotSource = {
  slot_source: JsonSlotSource,
  /**
   * Value:
   * Range: 1..
   */
  limit: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonRangeSlotSource = ({
  /**
   * Defaults to `container`.
   *
   * Value:
   * *either*
   *
   *
   *
   * *or*
   *
   * *item 1*
   *
   * *or*
   *
   * *item 2*
   */
  source?: (JsonEntityTarget | JsonBlockEntityTarget | 'container'),
} & {
  slots: LiteralUnion<ENTITY_SLOTS>,
})

export type JsonSlotSource = (
  | JsonTypedSlotSource
  | Array<JsonSlotSource> | (
  NamespacedString | `#${string}:${string}` | TagClass<'slot_source'> | SlotSourceClass))

export type JsonSlotSourceRoot = JsonTypedSlotSource

export type JsonTypedSlotSource = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:slot_source_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolSlotSource ? JsonSymbolSlotSource[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:slot_source_type'], string>])>
type JsonSlotSourceDispatcherMap = {
  'contents': JsonSlotSourceContents,
  'minecraft:contents': JsonSlotSourceContents,
  'empty': JsonSlotSourceEmpty,
  'minecraft:empty': JsonSlotSourceEmpty,
  'filtered': JsonSlotSourceFiltered,
  'minecraft:filtered': JsonSlotSourceFiltered,
  'group': JsonSlotSourceGroup,
  'minecraft:group': JsonSlotSourceGroup,
  'limit_slots': JsonSlotSourceLimitSlots,
  'minecraft:limit_slots': JsonSlotSourceLimitSlots,
  'slot_range': JsonSlotSourceSlotRange,
  'minecraft:slot_range': JsonSlotSourceSlotRange,
}
type JsonSlotSourceKeys = keyof JsonSlotSourceDispatcherMap
type JsonSlotSourceFallback = (
  | JsonSlotSourceContents
  | JsonSlotSourceEmpty
  | JsonSlotSourceFiltered
  | JsonSlotSourceGroup
  | JsonSlotSourceLimitSlots
  | JsonSlotSourceSlotRange)
type JsonSlotSourceContents = JsonContentsSlotSource
type JsonSlotSourceEmpty = Record<string, never>
type JsonSlotSourceFiltered = JsonFilterSlotSource
type JsonSlotSourceGroup = JsonGroupSlotSource
type JsonSlotSourceLimitSlots = JsonLimitCountSlotSource
type JsonSlotSourceSlotRange = JsonRangeSlotSource
export type JsonSymbolSlotSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonSlotSourceDispatcherMap
  : CASE extends 'keys' ? JsonSlotSourceKeys : CASE extends '%fallback' ? JsonSlotSourceFallback : never
