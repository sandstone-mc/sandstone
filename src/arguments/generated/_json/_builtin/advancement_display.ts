import type {
  JsonAdvancementDisplay,
  JsonRootAdvancementDisplay,
} from 'sandstone/arguments/generated/_json/data/advancement.ts'

type JsonMcdocAdvancementDisplayDispatcherMap = {}
type JsonMcdocAdvancementDisplayKeys = keyof JsonMcdocAdvancementDisplayDispatcherMap
type JsonMcdocAdvancementDisplayFallback = (JsonMcdocAdvancementDisplayFallbackType)
export type JsonMcdocAdvancementDisplayFallbackType = JsonAdvancementDisplay
type JsonMcdocAdvancementDisplayNoneType = JsonRootAdvancementDisplay
export type JsonSymbolMcdocAdvancementDisplay<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocAdvancementDisplayDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocAdvancementDisplayKeys
    : CASE extends '%fallback'
      ? JsonMcdocAdvancementDisplayFallback
      : CASE extends '%none'
        ? JsonMcdocAdvancementDisplayNoneType
        : CASE extends '%unknown' ? JsonMcdocAdvancementDisplayFallbackType : never
