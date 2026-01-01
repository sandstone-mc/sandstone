type McdocBlockItemStatesDispatcherMap = {}
type McdocBlockItemStatesKeys = keyof McdocBlockItemStatesDispatcherMap
type McdocBlockItemStatesFallback = (McdocBlockItemStatesFallbackType)
export type McdocBlockItemStatesFallbackType = ({
  [Key in `${any}${string}`]?: string;
})
type McdocBlockItemStatesNoneType = ({
  [Key in `${any}${string}`]?: string;
})
export type SymbolMcdocBlockItemStates<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? McdocBlockItemStatesDispatcherMap
  : CASE extends 'keys'
    ? McdocBlockItemStatesKeys
    : CASE extends '%fallback'
      ? McdocBlockItemStatesFallback
      : CASE extends '%none' ? McdocBlockItemStatesNoneType : never
