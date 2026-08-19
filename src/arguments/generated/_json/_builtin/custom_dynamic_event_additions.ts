import type { JsonUnknownDynamicAdditions } from 'sandstone/arguments/generated/_json/util/custom_event.ts'

type JsonMcdocCustomDynamicEventAdditionsDispatcherMap = {}
type JsonMcdocCustomDynamicEventAdditionsKeys = keyof JsonMcdocCustomDynamicEventAdditionsDispatcherMap
type JsonMcdocCustomDynamicEventAdditionsFallback = (JsonMcdocCustomDynamicEventAdditionsFallbackType)
export type JsonMcdocCustomDynamicEventAdditionsFallbackType = JsonUnknownDynamicAdditions

export type JsonSymbolMcdocCustomDynamicEventAdditions<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocCustomDynamicEventAdditionsDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocCustomDynamicEventAdditionsKeys
    : CASE extends '%fallback'
      ? JsonMcdocCustomDynamicEventAdditionsFallback
      : CASE extends '%unknown' ? JsonMcdocCustomDynamicEventAdditionsFallbackType : never
