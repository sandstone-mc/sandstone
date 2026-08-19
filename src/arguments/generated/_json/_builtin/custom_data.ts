import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'

type JsonMcdocCustomDataDispatcherMap = {}
type JsonMcdocCustomDataKeys = keyof JsonMcdocCustomDataDispatcherMap
type JsonMcdocCustomDataFallback = (JsonMcdocCustomDataFallbackType)
export type JsonMcdocCustomDataFallbackType = JsonNBTObject

export type JsonSymbolMcdocCustomData<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocCustomDataDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocCustomDataKeys
    : CASE extends '%fallback'
      ? JsonMcdocCustomDataFallback
      : CASE extends '%unknown' ? JsonMcdocCustomDataFallbackType : never
