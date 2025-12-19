type McdocCustomDataDispatcherMap = {}
type McdocCustomDataKeys = keyof McdocCustomDataDispatcherMap
type McdocCustomDataFallback = (McdocCustomDataFallbackType)
type McdocCustomDataFallbackType = unknown
export type SymbolMcdocCustomData<CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? McdocCustomDataDispatcherMap
    : CASE extends 'keys' ? McdocCustomDataKeys : CASE extends '%fallback' ? McdocCustomDataFallback : never
