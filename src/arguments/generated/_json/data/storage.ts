import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'
import type { NonEmptyString } from 'sandstone'

export type JsonUnknownStorage = ({
  [Key in NonEmptyString]?: JsonNBTObject
})
type JsonStorageDispatcherMap = {}
type JsonStorageKeys = keyof JsonStorageDispatcherMap
type JsonStorageFallback = (JsonStorageFallbackType)
export type JsonStorageFallbackType = JsonUnknownStorage

export type JsonSymbolStorage<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonStorageDispatcherMap
  : CASE extends 'keys'
    ? JsonStorageKeys
    : CASE extends '%fallback' ? JsonStorageFallback : CASE extends '%unknown' ? JsonStorageFallbackType : never
