type JsonMcdocFluidStateKeysDispatcherMap = {
  'flowing_lava': JsonMcdocFluidStateKeysFlowingLava,
  'minecraft:flowing_lava': JsonMcdocFluidStateKeysFlowingLava,
  'flowing_water': JsonMcdocFluidStateKeysFlowingWater,
  'minecraft:flowing_water': JsonMcdocFluidStateKeysFlowingWater,
  'lava': JsonMcdocFluidStateKeysLava,
  'minecraft:lava': JsonMcdocFluidStateKeysLava,
  'water': JsonMcdocFluidStateKeysWater,
  'minecraft:water': JsonMcdocFluidStateKeysWater,
}
type JsonMcdocFluidStateKeysKeys = keyof JsonMcdocFluidStateKeysDispatcherMap
type JsonMcdocFluidStateKeysFallback = (
  | JsonMcdocFluidStateKeysFlowingLava
  | JsonMcdocFluidStateKeysFlowingWater
  | JsonMcdocFluidStateKeysLava
  | JsonMcdocFluidStateKeysWater)
type JsonMcdocFluidStateKeysFlowingLava = ('falling' | 'level')
type JsonMcdocFluidStateKeysFlowingWater = ('falling' | 'level')
type JsonMcdocFluidStateKeysLava = 'falling'
type JsonMcdocFluidStateKeysWater = 'falling'
export type JsonSymbolMcdocFluidStateKeys<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMcdocFluidStateKeysDispatcherMap
  : CASE extends 'keys'
    ? JsonMcdocFluidStateKeysKeys
    : CASE extends '%fallback' ? JsonMcdocFluidStateKeysFallback : never
