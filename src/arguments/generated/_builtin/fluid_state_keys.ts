type McdocFluidStateKeysDispatcherMap = {
    'flowing_lava': McdocFluidStateKeysFlowingLava
    'minecraft:flowing_lava': McdocFluidStateKeysFlowingLava
    'flowing_water': McdocFluidStateKeysFlowingWater
    'minecraft:flowing_water': McdocFluidStateKeysFlowingWater
    'lava': McdocFluidStateKeysLava
    'minecraft:lava': McdocFluidStateKeysLava
    'water': McdocFluidStateKeysWater
    'minecraft:water': McdocFluidStateKeysWater
}
type McdocFluidStateKeysKeys = keyof McdocFluidStateKeysDispatcherMap
type McdocFluidStateKeysFallback = (
  | McdocFluidStateKeysFlowingLava
  | McdocFluidStateKeysFlowingWater
  | McdocFluidStateKeysLava
  | McdocFluidStateKeysWater)
type McdocFluidStateKeysFlowingLava = ('falling' | 'level')
type McdocFluidStateKeysFlowingWater = ('falling' | 'level')
type McdocFluidStateKeysLava = 'falling'
type McdocFluidStateKeysWater = 'falling'
export type SymbolMcdocFluidStateKeys<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? McdocFluidStateKeysDispatcherMap
    : CASE extends 'keys' ? McdocFluidStateKeysKeys : CASE extends '%fallback' ? McdocFluidStateKeysFallback : never
