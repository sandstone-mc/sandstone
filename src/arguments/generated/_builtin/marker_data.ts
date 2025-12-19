type McdocMarkerDataDispatcherMap = {}
type McdocMarkerDataKeys = keyof McdocMarkerDataDispatcherMap
type McdocMarkerDataFallback = (McdocMarkerDataFallbackType)
type McdocMarkerDataFallbackType = unknown
export type SymbolMcdocMarkerData<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? McdocMarkerDataDispatcherMap
    : CASE extends 'keys' ? McdocMarkerDataKeys : CASE extends '%fallback' ? McdocMarkerDataFallback : never
