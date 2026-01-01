type McdocCustomEventDispatcherMap = {}
type McdocCustomEventKeys = keyof McdocCustomEventDispatcherMap
type McdocCustomEventFallback = (McdocCustomEventFallbackType)
export type McdocCustomEventFallbackType = unknown

export type SymbolMcdocCustomEvent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? McdocCustomEventDispatcherMap
  : CASE extends 'keys' ? McdocCustomEventKeys : CASE extends '%fallback' ? McdocCustomEventFallback : never
