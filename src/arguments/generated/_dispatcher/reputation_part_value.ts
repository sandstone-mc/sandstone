import type { NBTInt } from 'sandstone'

type ReputationPartValueDispatcherMap = {
    'major_negative': ReputationPartValueMajorNegative
    'minecraft:major_negative': ReputationPartValueMajorNegative
    'major_positive': ReputationPartValueMajorPositive
    'minecraft:major_positive': ReputationPartValueMajorPositive
    'minor_negative': ReputationPartValueMinorNegative
    'minecraft:minor_negative': ReputationPartValueMinorNegative
    'minor_positive': ReputationPartValueMinorPositive
    'minecraft:minor_positive': ReputationPartValueMinorPositive
    'trading': ReputationPartValueTrading
    'minecraft:trading': ReputationPartValueTrading
}
type ReputationPartValueKeys = keyof ReputationPartValueDispatcherMap
type ReputationPartValueFallback = (
  | ReputationPartValueMajorNegative
  | ReputationPartValueMajorPositive
  | ReputationPartValueMinorNegative
  | ReputationPartValueMinorPositive
  | ReputationPartValueTrading)
type ReputationPartValueMajorNegative = NBTInt<{
    min: 5
    max: 100
}>
type ReputationPartValueMajorPositive = 20
type ReputationPartValueMinorNegative = NBTInt<{
    min: 1
}>
type ReputationPartValueMinorPositive = NBTInt<{
    min: 1
    max: 25
}>
type ReputationPartValueTrading = NBTInt<{
    min: 1
    max: 25
}>
export type SymbolReputationPartValue<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? ReputationPartValueDispatcherMap
    : CASE extends 'keys' ? ReputationPartValueKeys : CASE extends '%fallback' ? ReputationPartValueFallback : never
