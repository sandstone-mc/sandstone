import type { NBTObject } from 'sandstone/arguments/nbt.ts'

type McdocMarkerDataDispatcherMap = {}
type McdocMarkerDataKeys = keyof McdocMarkerDataDispatcherMap
type McdocMarkerDataFallback = (McdocMarkerDataFallbackType)
export type McdocMarkerDataFallbackType = NBTObject

export type SymbolMcdocMarkerData<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? McdocMarkerDataDispatcherMap
  : CASE extends 'keys'
    ? McdocMarkerDataKeys
    : CASE extends '%fallback'
      ? McdocMarkerDataFallback
      : CASE extends '%unknown' ? McdocMarkerDataFallbackType : never
