import type { JsonBlendToGray } from 'sandstone/arguments/generated/_json/data/worldgen/attribute/modifier.ts'
import type { JsonNBTList, NBTFloat, NBTInt } from 'sandstone'

export type JsonDyeColor = (
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

export type JsonDyeColorByte = (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15)

export type JsonDyeColorInt = (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15)

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 3
 */
export type JSONRGB = ((NBTInt | number) | JsonNBTList<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 3,
  max: 3,
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
export type JSONRGBA = ((NBTInt | number) | JsonNBTList<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 4,
  max: 4,
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
export type JsonStringARGB = ((NBTInt | number) | JsonNBTList<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 4,
  max: 4,
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
export type JsonStringRGB = ((NBTInt | number) | JsonNBTList<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 3,
  max: 3,
}> | `#${string}`)
type JsonEnvironmentAttributeArgbColorModifierDispatcherMap = {
  'add': JsonEnvironmentAttributeArgbColorModifierAdd,
  'minecraft:add': JsonEnvironmentAttributeArgbColorModifierAdd,
  'alpha_blend': JsonEnvironmentAttributeArgbColorModifierAlphaBlend,
  'minecraft:alpha_blend': JsonEnvironmentAttributeArgbColorModifierAlphaBlend,
  'blend_to_gray': JsonEnvironmentAttributeArgbColorModifierBlendToGray,
  'minecraft:blend_to_gray': JsonEnvironmentAttributeArgbColorModifierBlendToGray,
  'multiply': JsonEnvironmentAttributeArgbColorModifierMultiply,
  'minecraft:multiply': JsonEnvironmentAttributeArgbColorModifierMultiply,
  'override': JsonEnvironmentAttributeArgbColorModifierOverride,
  'minecraft:override': JsonEnvironmentAttributeArgbColorModifierOverride,
  'subtract': JsonEnvironmentAttributeArgbColorModifierSubtract,
  'minecraft:subtract': JsonEnvironmentAttributeArgbColorModifierSubtract,
}
type JsonEnvironmentAttributeArgbColorModifierKeys = keyof JsonEnvironmentAttributeArgbColorModifierDispatcherMap
type JsonEnvironmentAttributeArgbColorModifierFallback = (
  | JsonEnvironmentAttributeArgbColorModifierAdd
  | JsonEnvironmentAttributeArgbColorModifierAlphaBlend
  | JsonEnvironmentAttributeArgbColorModifierBlendToGray
  | JsonEnvironmentAttributeArgbColorModifierMultiply
  | JsonEnvironmentAttributeArgbColorModifierOverride
  | JsonEnvironmentAttributeArgbColorModifierSubtract)
type JsonEnvironmentAttributeArgbColorModifierNoneType = JsonStringARGB
type JsonEnvironmentAttributeArgbColorModifierAdd = JsonStringRGB
type JsonEnvironmentAttributeArgbColorModifierAlphaBlend = JsonStringARGB
type JsonEnvironmentAttributeArgbColorModifierBlendToGray = JsonBlendToGray
type JsonEnvironmentAttributeArgbColorModifierMultiply = (JsonStringRGB | JsonStringARGB)
type JsonEnvironmentAttributeArgbColorModifierOverride = JsonStringARGB
type JsonEnvironmentAttributeArgbColorModifierSubtract = JsonStringRGB
export type JsonSymbolEnvironmentAttributeArgbColorModifier<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonEnvironmentAttributeArgbColorModifierDispatcherMap
  : CASE extends 'keys'
    ? JsonEnvironmentAttributeArgbColorModifierKeys
    : CASE extends '%fallback'
      ? JsonEnvironmentAttributeArgbColorModifierFallback
      : CASE extends '%none' ? JsonEnvironmentAttributeArgbColorModifierNoneType : never
