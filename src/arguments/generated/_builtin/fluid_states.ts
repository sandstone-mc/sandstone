type McdocFluidStatesDispatcherMap = {
  'flowing_lava': McdocFluidStatesFlowingLava
  'minecraft:flowing_lava': McdocFluidStatesFlowingLava
  'flowing_water': McdocFluidStatesFlowingWater
  'minecraft:flowing_water': McdocFluidStatesFlowingWater
  'lava': McdocFluidStatesLava
  'minecraft:lava': McdocFluidStatesLava
  'water': McdocFluidStatesWater
  'minecraft:water': McdocFluidStatesWater
}
type McdocFluidStatesKeys = keyof McdocFluidStatesDispatcherMap
type McdocFluidStatesFallback = (
  | McdocFluidStatesFlowingLava
  | McdocFluidStatesFlowingWater
  | McdocFluidStatesLava
  | McdocFluidStatesWater
  | McdocFluidStatesFallbackType)
type McdocFluidStatesFallbackType = ({
  [Key in `${any}${string}`]?: string;
})
type McdocFluidStatesNoneType = ({
  [Key in `${any}${string}`]?: string;
})
type McdocFluidStatesFlowingLava = {
  falling?: ('false' | 'true')
  level?: ('1' | '2' | '3' | '4' | '5' | '6' | '7' | '8')
}
type McdocFluidStatesFlowingWater = {
  falling?: ('false' | 'true')
  level?: ('1' | '2' | '3' | '4' | '5' | '6' | '7' | '8')
}
type McdocFluidStatesLava = {
  falling?: ('false' | 'true')
}
type McdocFluidStatesWater = {
  falling?: ('false' | 'true')
}
export type SymbolMcdocFluidStates<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? McdocFluidStatesDispatcherMap
  : CASE extends 'keys'
    ? McdocFluidStatesKeys
    : CASE extends '%fallback' ? McdocFluidStatesFallback : CASE extends '%none' ? McdocFluidStatesNoneType : never
