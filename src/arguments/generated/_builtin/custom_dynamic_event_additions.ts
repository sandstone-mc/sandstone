import type { UnknownDynamicAdditions } from 'sandstone/arguments/generated/util/custom_event.js'

type McdocCustomDynamicEventAdditionsDispatcherMap = {}
type McdocCustomDynamicEventAdditionsKeys = keyof McdocCustomDynamicEventAdditionsDispatcherMap
type McdocCustomDynamicEventAdditionsFallback = (McdocCustomDynamicEventAdditionsFallbackType)
type McdocCustomDynamicEventAdditionsFallbackType = UnknownDynamicAdditions
export type SymbolMcdocCustomDynamicEventAdditions<CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? McdocCustomDynamicEventAdditionsDispatcherMap
    : CASE extends 'keys'
        ? McdocCustomDynamicEventAdditionsKeys
        : CASE extends '%fallback' ? McdocCustomDynamicEventAdditionsFallback : never
