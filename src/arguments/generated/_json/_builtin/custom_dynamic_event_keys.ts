type JsonMcdocCustomDynamicEventKeysDispatcherMap = {}
type JsonMcdocCustomDynamicEventKeysKeys = keyof JsonMcdocCustomDynamicEventKeysDispatcherMap
type JsonMcdocCustomDynamicEventKeysFallback = (JsonMcdocCustomDynamicEventKeysFallbackType)
export type JsonMcdocCustomDynamicEventKeysFallbackType = string

export type JsonSymbolMcdocCustomDynamicEventKeys<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocCustomDynamicEventKeysDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocCustomDynamicEventKeysKeys
    : CASE extends '%fallback'
      ? JsonMcdocCustomDynamicEventKeysFallback
      : CASE extends '%unknown' ? JsonMcdocCustomDynamicEventKeysFallbackType : never
