export type UnknownStorage = ({
  [Key in `${any}${string}`]?: unknown;
})
type StorageDispatcherMap = {}
type StorageKeys = keyof StorageDispatcherMap
type StorageFallback = (StorageFallbackType)
export type StorageFallbackType = UnknownStorage

export type SymbolStorage<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? StorageDispatcherMap
  : CASE extends 'keys' ? StorageKeys : CASE extends '%fallback' ? StorageFallback : never
