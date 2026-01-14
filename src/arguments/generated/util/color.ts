import type { BlendToGray } from 'sandstone/arguments/generated/data/worldgen/attribute/modifier.ts'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

export type DyeColor = (
  | 'white'
  | 'orange'
  | 'magenta'
  | 'light_blue'
  | 'yellow'
  | 'lime'
  | 'pink'
  | 'gray'
  | 'light_gray'
  | 'cyan'
  | 'purple'
  | 'blue'
  | 'brown'
  | 'green'
  | 'red'
  | 'black')

export type DyeColorByte = (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15)

export type DyeColorInt = (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15)

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 3
 */
export type RGB = (NBTInt | NBTList<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
  max: 1
}>, {
  leftExclusive: false
  rightExclusive: false
  min: 3
  max: 3
}>)

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 4
 */
export type RGBA = (NBTInt | NBTList<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
  max: 1
}>, {
  leftExclusive: false
  rightExclusive: false
  min: 4
  max: 4
}>)

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 4
 *
 * *or*
 *
 * *item 2*
 */
export type StringARGB = (NBTInt | NBTList<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
  max: 1
}>, {
  leftExclusive: false
  rightExclusive: false
  min: 4
  max: 4
}> | `#${string}`)

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 3
 *
 * *or*
 *
 * *item 2*
 */
export type StringRGB = (NBTInt | NBTList<NBTFloat<{
  leftExclusive: false
  rightExclusive: false
  min: 0
  max: 1
}>, {
  leftExclusive: false
  rightExclusive: false
  min: 3
  max: 3
}> | `#${string}`)
type EnvironmentAttributeArgbColorModifierDispatcherMap = {
  'add': EnvironmentAttributeArgbColorModifierAdd
  'minecraft:add': EnvironmentAttributeArgbColorModifierAdd
  'alpha_blend': EnvironmentAttributeArgbColorModifierAlphaBlend
  'minecraft:alpha_blend': EnvironmentAttributeArgbColorModifierAlphaBlend
  'blend_to_gray': EnvironmentAttributeArgbColorModifierBlendToGray
  'minecraft:blend_to_gray': EnvironmentAttributeArgbColorModifierBlendToGray
  'multiply': EnvironmentAttributeArgbColorModifierMultiply
  'minecraft:multiply': EnvironmentAttributeArgbColorModifierMultiply
  'override': EnvironmentAttributeArgbColorModifierOverride
  'minecraft:override': EnvironmentAttributeArgbColorModifierOverride
  'subtract': EnvironmentAttributeArgbColorModifierSubtract
  'minecraft:subtract': EnvironmentAttributeArgbColorModifierSubtract
}
type EnvironmentAttributeArgbColorModifierKeys = keyof EnvironmentAttributeArgbColorModifierDispatcherMap
type EnvironmentAttributeArgbColorModifierFallback = (
  | EnvironmentAttributeArgbColorModifierAdd
  | EnvironmentAttributeArgbColorModifierAlphaBlend
  | EnvironmentAttributeArgbColorModifierBlendToGray
  | EnvironmentAttributeArgbColorModifierMultiply
  | EnvironmentAttributeArgbColorModifierOverride
  | EnvironmentAttributeArgbColorModifierSubtract)
type EnvironmentAttributeArgbColorModifierNoneType = StringARGB
type EnvironmentAttributeArgbColorModifierAdd = StringRGB
type EnvironmentAttributeArgbColorModifierAlphaBlend = StringARGB
type EnvironmentAttributeArgbColorModifierBlendToGray = BlendToGray
type EnvironmentAttributeArgbColorModifierMultiply = (StringRGB | StringARGB)
type EnvironmentAttributeArgbColorModifierOverride = StringARGB
type EnvironmentAttributeArgbColorModifierSubtract = StringRGB
export type SymbolEnvironmentAttributeArgbColorModifier<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? EnvironmentAttributeArgbColorModifierDispatcherMap
  : CASE extends 'keys'
    ? EnvironmentAttributeArgbColorModifierKeys
    : CASE extends '%fallback'
      ? EnvironmentAttributeArgbColorModifierFallback
      : CASE extends '%none' ? EnvironmentAttributeArgbColorModifierNoneType : never
