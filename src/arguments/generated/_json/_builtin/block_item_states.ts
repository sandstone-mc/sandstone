import type { NonEmptyString } from 'sandstone'

type JsonMcdocBlockItemStatesDispatcherMap = {}
type JsonMcdocBlockItemStatesKeys = keyof JsonMcdocBlockItemStatesDispatcherMap
type JsonMcdocBlockItemStatesFallback = (JsonMcdocBlockItemStatesFallbackType)
export type JsonMcdocBlockItemStatesFallbackType = ({
  [Key in NonEmptyString]?: string
})
type JsonMcdocBlockItemStatesNoneType = ({
  [Key in NonEmptyString]?: string
})
export type JsonSymbolMcdocBlockItemStates<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocBlockItemStatesDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocBlockItemStatesKeys
    : CASE extends '%fallback'
      ? JsonMcdocBlockItemStatesFallback
      : CASE extends '%none'
        ? JsonMcdocBlockItemStatesNoneType
        : CASE extends '%unknown' ? JsonMcdocBlockItemStatesFallbackType : never
