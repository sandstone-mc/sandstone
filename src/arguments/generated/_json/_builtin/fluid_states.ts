import type { NonEmptyString } from 'sandstone'

type JsonMcdocFluidStatesDispatcherMap = {
  'flowing_lava': JsonMcdocFluidStatesFlowingLava,
  'minecraft:flowing_lava': JsonMcdocFluidStatesFlowingLava,
  'flowing_water': JsonMcdocFluidStatesFlowingWater,
  'minecraft:flowing_water': JsonMcdocFluidStatesFlowingWater,
  'lava': JsonMcdocFluidStatesLava,
  'minecraft:lava': JsonMcdocFluidStatesLava,
  'water': JsonMcdocFluidStatesWater,
  'minecraft:water': JsonMcdocFluidStatesWater,
}
type JsonMcdocFluidStatesKeys = keyof JsonMcdocFluidStatesDispatcherMap
type JsonMcdocFluidStatesFallback = (
  | JsonMcdocFluidStatesFlowingLava
  | JsonMcdocFluidStatesFlowingWater
  | JsonMcdocFluidStatesLava
  | JsonMcdocFluidStatesWater
  | JsonMcdocFluidStatesFallbackType)
export type JsonMcdocFluidStatesFallbackType = ({
  [Key in NonEmptyString]?: string
})
type JsonMcdocFluidStatesNoneType = ({
  [Key in NonEmptyString]?: string
})
type JsonMcdocFluidStatesFlowingLava = {
  falling?: ('false' | 'true'),
  level?: ('1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'),
}
type JsonMcdocFluidStatesFlowingWater = {
  falling?: ('false' | 'true'),
  level?: ('1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'),
}
type JsonMcdocFluidStatesLava = {
  falling?: ('false' | 'true'),
}
type JsonMcdocFluidStatesWater = {
  falling?: ('false' | 'true'),
}
export type JsonSymbolMcdocFluidStates<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocFluidStatesDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocFluidStatesKeys
    : CASE extends '%fallback'
      ? JsonMcdocFluidStatesFallback
      : CASE extends '%none'
        ? JsonMcdocFluidStatesNoneType
        : CASE extends '%unknown' ? JsonMcdocFluidStatesFallbackType : never
