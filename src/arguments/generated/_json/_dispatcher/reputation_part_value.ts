import type { NBTInt } from 'sandstone'

type JsonReputationPartValueDispatcherMap = {
  'major_negative': JsonReputationPartValueMajorNegative,
  'minecraft:major_negative': JsonReputationPartValueMajorNegative,
  'major_positive': JsonReputationPartValueMajorPositive,
  'minecraft:major_positive': JsonReputationPartValueMajorPositive,
  'minor_negative': JsonReputationPartValueMinorNegative,
  'minecraft:minor_negative': JsonReputationPartValueMinorNegative,
  'minor_positive': JsonReputationPartValueMinorPositive,
  'minecraft:minor_positive': JsonReputationPartValueMinorPositive,
  'trading': JsonReputationPartValueTrading,
  'minecraft:trading': JsonReputationPartValueTrading,
}
type JsonReputationPartValueKeys = keyof JsonReputationPartValueDispatcherMap
type JsonReputationPartValueFallback = (
  | JsonReputationPartValueMajorNegative
  | JsonReputationPartValueMajorPositive
  | JsonReputationPartValueMinorNegative
  | JsonReputationPartValueMinorPositive
  | JsonReputationPartValueTrading)
type JsonReputationPartValueMajorNegative = (NBTInt<{
  min: 5,
  max: 100,
}> | number)
type JsonReputationPartValueMajorPositive = 20
type JsonReputationPartValueMinorNegative = (NBTInt<{
  min: 1,
}> | number)
type JsonReputationPartValueMinorPositive = (NBTInt<{
  min: 1,
  max: 25,
}> | number)
type JsonReputationPartValueTrading = (NBTInt<{
  min: 1,
  max: 25,
}> | number)
export type JsonSymbolReputationPartValue<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonReputationPartValueDispatcherMap
  : CASE extends 'keys'
    ? JsonReputationPartValueKeys
    : CASE extends '%fallback' ? JsonReputationPartValueFallback : never
