import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'

type JsonStatisticTypeDispatcherMap = {
  'broken': JsonStatisticTypeBroken,
  'minecraft:broken': JsonStatisticTypeBroken,
  'crafted': JsonStatisticTypeCrafted,
  'minecraft:crafted': JsonStatisticTypeCrafted,
  'custom': JsonStatisticTypeCustom,
  'minecraft:custom': JsonStatisticTypeCustom,
  'dropped': JsonStatisticTypeDropped,
  'minecraft:dropped': JsonStatisticTypeDropped,
  'killed': JsonStatisticTypeKilled,
  'minecraft:killed': JsonStatisticTypeKilled,
  'killed_by': JsonStatisticTypeKilledBy,
  'minecraft:killed_by': JsonStatisticTypeKilledBy,
  'mined': JsonStatisticTypeMined,
  'minecraft:mined': JsonStatisticTypeMined,
  'picked_up': JsonStatisticTypePickedUp,
  'minecraft:picked_up': JsonStatisticTypePickedUp,
  'used': JsonStatisticTypeUsed,
  'minecraft:used': JsonStatisticTypeUsed,
}
type JsonStatisticTypeKeys = keyof JsonStatisticTypeDispatcherMap
type JsonStatisticTypeFallback = (
  | JsonStatisticTypeBroken
  | JsonStatisticTypeCrafted
  | JsonStatisticTypeCustom
  | JsonStatisticTypeDropped
  | JsonStatisticTypeKilled
  | JsonStatisticTypeKilledBy
  | JsonStatisticTypeMined
  | JsonStatisticTypePickedUp
  | JsonStatisticTypeUsed
  | JsonStatisticTypeFallbackType)
export type JsonStatisticTypeFallbackType = string
type JsonStatisticTypeBroken = JsonRegistry['minecraft:item']
type JsonStatisticTypeCrafted = JsonRegistry['minecraft:item']
type JsonStatisticTypeCustom = JsonRegistry['minecraft:custom_stat']
type JsonStatisticTypeDropped = JsonRegistry['minecraft:item']
type JsonStatisticTypeKilled = JsonRegistry['minecraft:entity_type']
type JsonStatisticTypeKilledBy = JsonRegistry['minecraft:entity_type']
type JsonStatisticTypeMined = JsonRegistry['minecraft:block']
type JsonStatisticTypePickedUp = JsonRegistry['minecraft:item']
type JsonStatisticTypeUsed = JsonRegistry['minecraft:item']
export type JsonSymbolStatisticType<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonStatisticTypeDispatcherMap
  : CASE extends 'keys'
    ? JsonStatisticTypeKeys
    : CASE extends '%fallback'
      ? JsonStatisticTypeFallback
      : CASE extends '%unknown' ? JsonStatisticTypeFallbackType : never
