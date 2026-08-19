import type { AdvancementDisplay, RootAdvancementDisplay } from 'sandstone/arguments/generated/data/advancement.ts'

type McdocAdvancementDisplayDispatcherMap = {}
type McdocAdvancementDisplayKeys = keyof McdocAdvancementDisplayDispatcherMap
type McdocAdvancementDisplayFallback = (McdocAdvancementDisplayFallbackType)
export type McdocAdvancementDisplayFallbackType = AdvancementDisplay
type McdocAdvancementDisplayNoneType = RootAdvancementDisplay
export type SymbolMcdocAdvancementDisplay<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? McdocAdvancementDisplayDispatcherMap
  : CASE extends 'keys'
    ? McdocAdvancementDisplayKeys
    : CASE extends '%fallback'
      ? McdocAdvancementDisplayFallback
      : CASE extends '%none'
        ? McdocAdvancementDisplayNoneType
        : CASE extends '%unknown' ? McdocAdvancementDisplayFallbackType : never
