import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

type UniformValueDispatcherMap = {
  'float': UniformValueFloat
  'minecraft:float': UniformValueFloat
  'int': UniformValueInt
  'minecraft:int': UniformValueInt
  'ivec3': UniformValueIvec3
  'minecraft:ivec3': UniformValueIvec3
  'matrix4x4': UniformValueMatrix4x4
  'minecraft:matrix4x4': UniformValueMatrix4x4
  'vec2': UniformValueVec2
  'minecraft:vec2': UniformValueVec2
  'vec3': UniformValueVec3
  'minecraft:vec3': UniformValueVec3
  'vec4': UniformValueVec4
  'minecraft:vec4': UniformValueVec4
}
type UniformValueKeys = keyof UniformValueDispatcherMap
type UniformValueFallback = (
  | UniformValueFloat
  | UniformValueInt
  | UniformValueIvec3
  | UniformValueMatrix4x4
  | UniformValueVec2
  | UniformValueVec3
  | UniformValueVec4)
type UniformValueFloat = NBTFloat
type UniformValueInt = NBTInt
type UniformValueIvec3 = NBTList<NBTInt, {
  leftExclusive: false
  rightExclusive: false
  min: 3
  max: 3
}>
type UniformValueMatrix4x4 = NBTList<NBTFloat, {
  leftExclusive: false
  rightExclusive: false
  min: 16
  max: 16
}>
type UniformValueVec2 = NBTList<NBTFloat, {
  leftExclusive: false
  rightExclusive: false
  min: 2
  max: 2
}>
type UniformValueVec3 = NBTList<NBTFloat, {
  leftExclusive: false
  rightExclusive: false
  min: 3
  max: 3
}>
type UniformValueVec4 = NBTList<NBTFloat, {
  leftExclusive: false
  rightExclusive: false
  min: 4
  max: 4
}>
export type SymbolUniformValue<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? UniformValueDispatcherMap
  : CASE extends 'keys' ? UniformValueKeys : CASE extends '%fallback' ? UniformValueFallback : never
