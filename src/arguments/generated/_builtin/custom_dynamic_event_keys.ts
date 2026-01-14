type McdocCustomDynamicEventKeysDispatcherMap = {}
type McdocCustomDynamicEventKeysKeys = keyof McdocCustomDynamicEventKeysDispatcherMap
type McdocCustomDynamicEventKeysFallback = (McdocCustomDynamicEventKeysFallbackType)
export type McdocCustomDynamicEventKeysFallbackType = string

export type SymbolMcdocCustomDynamicEventKeys<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? McdocCustomDynamicEventKeysDispatcherMap
  : CASE extends 'keys'
    ? McdocCustomDynamicEventKeysKeys
    : CASE extends '%fallback'
      ? McdocCustomDynamicEventKeysFallback
      : CASE extends '%unknown' ? McdocCustomDynamicEventKeysFallbackType : never
