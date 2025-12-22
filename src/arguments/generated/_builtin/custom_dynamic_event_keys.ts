type McdocCustomDynamicEventKeysDispatcherMap = {}
type McdocCustomDynamicEventKeysKeys = keyof McdocCustomDynamicEventKeysDispatcherMap
type McdocCustomDynamicEventKeysFallback = (McdocCustomDynamicEventKeysFallbackType)
type McdocCustomDynamicEventKeysFallbackType = string
export type SymbolMcdocCustomDynamicEventKeys<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? McdocCustomDynamicEventKeysDispatcherMap
  : CASE extends 'keys'
    ? McdocCustomDynamicEventKeysKeys
    : CASE extends '%fallback' ? McdocCustomDynamicEventKeysFallback : never
