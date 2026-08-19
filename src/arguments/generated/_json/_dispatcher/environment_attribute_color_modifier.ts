import type { JsonBlendToGray } from 'sandstone/arguments/generated/_json/data/worldgen/attribute/modifier.ts'
import type { JsonStringARGB, JsonStringRGB } from 'sandstone/arguments/generated/_json/util/color.ts'

type JsonEnvironmentAttributeColorModifierDispatcherMap = {
  'alpha_blend': JsonEnvironmentAttributeColorModifierAlphaBlend,
  'minecraft:alpha_blend': JsonEnvironmentAttributeColorModifierAlphaBlend,
  'blend_to_gray': JsonEnvironmentAttributeColorModifierBlendToGray,
  'minecraft:blend_to_gray': JsonEnvironmentAttributeColorModifierBlendToGray,
  'override': JsonEnvironmentAttributeColorModifierOverride,
  'minecraft:override': JsonEnvironmentAttributeColorModifierOverride,
}
type JsonEnvironmentAttributeColorModifierKeys = keyof JsonEnvironmentAttributeColorModifierDispatcherMap
type JsonEnvironmentAttributeColorModifierFallback = (
  | JsonEnvironmentAttributeColorModifierAlphaBlend
  | JsonEnvironmentAttributeColorModifierBlendToGray
  | JsonEnvironmentAttributeColorModifierOverride
  | JsonEnvironmentAttributeColorModifierFallbackType)
export type JsonEnvironmentAttributeColorModifierFallbackType = JsonStringRGB
type JsonEnvironmentAttributeColorModifierNoneType = JsonStringRGB
type JsonEnvironmentAttributeColorModifierAlphaBlend = JsonStringARGB
type JsonEnvironmentAttributeColorModifierBlendToGray = JsonBlendToGray
type JsonEnvironmentAttributeColorModifierOverride = JsonStringRGB
export type JsonSymbolEnvironmentAttributeColorModifier<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonEnvironmentAttributeColorModifierDispatcherMap
  : CASE extends 'keys'
    ? JsonEnvironmentAttributeColorModifierKeys
    : CASE extends '%fallback'
      ? JsonEnvironmentAttributeColorModifierFallback
      : CASE extends '%none'
        ? JsonEnvironmentAttributeColorModifierNoneType
        : CASE extends '%unknown' ? JsonEnvironmentAttributeColorModifierFallbackType : never
