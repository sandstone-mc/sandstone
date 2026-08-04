import type { NonEmptyString } from 'sandstone'

type McdocBlockItemStatesDispatcherMap = {}
type McdocBlockItemStatesKeys = keyof McdocBlockItemStatesDispatcherMap
type McdocBlockItemStatesFallback = (McdocBlockItemStatesFallbackType)
export type McdocBlockItemStatesFallbackType = ({
  [Key in NonEmptyString]?: string
})
type McdocBlockItemStatesNoneType = ({
  [Key in NonEmptyString]?: string
})
export type SymbolMcdocBlockItemStates<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? McdocBlockItemStatesDispatcherMap
  : CASE extends 'keys'
    ? McdocBlockItemStatesKeys
    : CASE extends '%fallback'
      ? McdocBlockItemStatesFallback
      : CASE extends '%none'
        ? McdocBlockItemStatesNoneType
        : CASE extends '%unknown' ? McdocBlockItemStatesFallbackType : never
