import type { NBTObject } from 'sandstone/arguments/nbt.ts'

type McdocCustomDataDispatcherMap = {}
type McdocCustomDataKeys = keyof McdocCustomDataDispatcherMap
type McdocCustomDataFallback = (McdocCustomDataFallbackType)
export type McdocCustomDataFallbackType = NBTObject

export type SymbolMcdocCustomData<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? McdocCustomDataDispatcherMap
  : CASE extends 'keys'
    ? McdocCustomDataKeys
    : CASE extends '%fallback'
      ? McdocCustomDataFallback
      : CASE extends '%unknown' ? McdocCustomDataFallbackType : never
