import type { Registry } from 'sandstone/arguments/generated/registry.js'

type StatisticTypeDispatcherMap = {
  'broken': StatisticTypeBroken
  'minecraft:broken': StatisticTypeBroken
  'crafted': StatisticTypeCrafted
  'minecraft:crafted': StatisticTypeCrafted
  'custom': StatisticTypeCustom
  'minecraft:custom': StatisticTypeCustom
  'dropped': StatisticTypeDropped
  'minecraft:dropped': StatisticTypeDropped
  'killed': StatisticTypeKilled
  'minecraft:killed': StatisticTypeKilled
  'killed_by': StatisticTypeKilledBy
  'minecraft:killed_by': StatisticTypeKilledBy
  'mined': StatisticTypeMined
  'minecraft:mined': StatisticTypeMined
  'picked_up': StatisticTypePickedUp
  'minecraft:picked_up': StatisticTypePickedUp
  'used': StatisticTypeUsed
  'minecraft:used': StatisticTypeUsed
}
type StatisticTypeKeys = keyof StatisticTypeDispatcherMap
type StatisticTypeFallback = (
  | StatisticTypeBroken
  | StatisticTypeCrafted
  | StatisticTypeCustom
  | StatisticTypeDropped
  | StatisticTypeKilled
  | StatisticTypeKilledBy
  | StatisticTypeMined
  | StatisticTypePickedUp
  | StatisticTypeUsed
  | StatisticTypeFallbackType)
type StatisticTypeFallbackType = string
type StatisticTypeBroken = Registry['minecraft:item']
type StatisticTypeCrafted = Registry['minecraft:item']
type StatisticTypeCustom = Registry['minecraft:custom_stat']
type StatisticTypeDropped = Registry['minecraft:item']
type StatisticTypeKilled = Registry['minecraft:entity_type']
type StatisticTypeKilledBy = Registry['minecraft:entity_type']
type StatisticTypeMined = Registry['minecraft:block']
type StatisticTypePickedUp = Registry['minecraft:item']
type StatisticTypeUsed = Registry['minecraft:item']
export type SymbolStatisticType<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? StatisticTypeDispatcherMap
  : CASE extends 'keys' ? StatisticTypeKeys : CASE extends '%fallback' ? StatisticTypeFallback : never
