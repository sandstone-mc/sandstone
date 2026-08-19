import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'

type JsonMcdocMarkerDataDispatcherMap = {}
type JsonMcdocMarkerDataKeys = keyof JsonMcdocMarkerDataDispatcherMap
type JsonMcdocMarkerDataFallback = (JsonMcdocMarkerDataFallbackType)
export type JsonMcdocMarkerDataFallbackType = JsonNBTObject

export type JsonSymbolMcdocMarkerData<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocMarkerDataDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocMarkerDataKeys
    : CASE extends '%fallback'
      ? JsonMcdocMarkerDataFallback
      : CASE extends '%unknown' ? JsonMcdocMarkerDataFallbackType : never
