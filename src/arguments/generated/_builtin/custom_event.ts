import type { NBTObject } from 'sandstone/arguments/nbt.ts'

type McdocCustomEventDispatcherMap = {}
type McdocCustomEventKeys = keyof McdocCustomEventDispatcherMap
type McdocCustomEventFallback = (McdocCustomEventFallbackType)
export type McdocCustomEventFallbackType = NBTObject

export type SymbolMcdocCustomEvent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? McdocCustomEventDispatcherMap
  : CASE extends 'keys'
    ? McdocCustomEventKeys
    : CASE extends '%fallback'
      ? McdocCustomEventFallback
      : CASE extends '%unknown' ? McdocCustomEventFallbackType : never
