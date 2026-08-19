import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'

type JsonMcdocCustomEventDispatcherMap = {}
type JsonMcdocCustomEventKeys = keyof JsonMcdocCustomEventDispatcherMap
type JsonMcdocCustomEventFallback = (JsonMcdocCustomEventFallbackType)
export type JsonMcdocCustomEventFallbackType = JsonNBTObject

export type JsonSymbolMcdocCustomEvent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocCustomEventDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocCustomEventKeys
    : CASE extends '%fallback'
      ? JsonMcdocCustomEventFallback
      : CASE extends '%unknown' ? JsonMcdocCustomEventFallbackType : never
