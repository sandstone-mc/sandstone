import type { JsonNBTList, NBTFloat, NBTInt } from 'sandstone'

type JsonUniformValueDispatcherMap = {
  'float': JsonUniformValueFloat,
  'minecraft:float': JsonUniformValueFloat,
  'int': JsonUniformValueInt,
  'minecraft:int': JsonUniformValueInt,
  'ivec3': JsonUniformValueIvec3,
  'minecraft:ivec3': JsonUniformValueIvec3,
  'matrix4x4': JsonUniformValueMatrix4x4,
  'minecraft:matrix4x4': JsonUniformValueMatrix4x4,
  'vec2': JsonUniformValueVec2,
  'minecraft:vec2': JsonUniformValueVec2,
  'vec3': JsonUniformValueVec3,
  'minecraft:vec3': JsonUniformValueVec3,
  'vec4': JsonUniformValueVec4,
  'minecraft:vec4': JsonUniformValueVec4,
}
type JsonUniformValueKeys = keyof JsonUniformValueDispatcherMap
type JsonUniformValueFallback = (
  | JsonUniformValueFloat
  | JsonUniformValueInt
  | JsonUniformValueIvec3
  | JsonUniformValueMatrix4x4
  | JsonUniformValueVec2
  | JsonUniformValueVec3
  | JsonUniformValueVec4)
type JsonUniformValueFloat = (NBTFloat | number)
type JsonUniformValueInt = (NBTInt | number)
type JsonUniformValueIvec3 = JsonNBTList<(NBTInt | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 3,
  max: 3,
}>
type JsonUniformValueMatrix4x4 = JsonNBTList<(NBTFloat | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 16,
  max: 16,
}>
type JsonUniformValueVec2 = JsonNBTList<(NBTFloat | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 2,
  max: 2,
}>
type JsonUniformValueVec3 = JsonNBTList<(NBTFloat | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 3,
  max: 3,
}>
type JsonUniformValueVec4 = JsonNBTList<(NBTFloat | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 4,
  max: 4,
}>
export type JsonSymbolUniformValue<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonUniformValueDispatcherMap
  : CASE extends 'keys' ? JsonUniformValueKeys : CASE extends '%fallback' ? JsonUniformValueFallback : never
