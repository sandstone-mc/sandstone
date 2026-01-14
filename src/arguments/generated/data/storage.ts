import type { DiscreteAttribute } from 'sandstone/arguments/generated/data/worldgen/attribute.ts'
import type { NBTObject } from 'sandstone/arguments/nbt.ts'

export type UnknownStorage = ({
  [Key in `${any}${string}`]?: NBTObject;
})
type StorageDispatcherMap = {}
type StorageKeys = keyof StorageDispatcherMap
type StorageFallback = (StorageFallbackType)
export type StorageFallbackType = UnknownStorage

export type SymbolStorage<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? StorageDispatcherMap
  : CASE extends 'keys'
    ? StorageKeys
    : CASE extends '%fallback' ? StorageFallback : CASE extends '%unknown' ? StorageFallbackType : never
