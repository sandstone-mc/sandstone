import type { BlendToGray } from 'sandstone/arguments/generated/data/worldgen/attribute/modifier'
import type { StringARGB, StringRGB } from 'sandstone/arguments/generated/util/color'

type EnvironmentAttributeColorModifierDispatcherMap = {
  'alpha_blend': EnvironmentAttributeColorModifierAlphaBlend
  'minecraft:alpha_blend': EnvironmentAttributeColorModifierAlphaBlend
  'blend_to_gray': EnvironmentAttributeColorModifierBlendToGray
  'minecraft:blend_to_gray': EnvironmentAttributeColorModifierBlendToGray
  'override': EnvironmentAttributeColorModifierOverride
  'minecraft:override': EnvironmentAttributeColorModifierOverride
}
type EnvironmentAttributeColorModifierKeys = keyof EnvironmentAttributeColorModifierDispatcherMap
type EnvironmentAttributeColorModifierFallback = (
  | EnvironmentAttributeColorModifierAlphaBlend
  | EnvironmentAttributeColorModifierBlendToGray
  | EnvironmentAttributeColorModifierOverride
  | EnvironmentAttributeColorModifierFallbackType)
export type EnvironmentAttributeColorModifierFallbackType = StringRGB
type EnvironmentAttributeColorModifierNoneType = StringRGB
type EnvironmentAttributeColorModifierAlphaBlend = StringARGB
type EnvironmentAttributeColorModifierBlendToGray = BlendToGray
type EnvironmentAttributeColorModifierOverride = StringRGB
export type SymbolEnvironmentAttributeColorModifier<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? EnvironmentAttributeColorModifierDispatcherMap
  : CASE extends 'keys'
    ? EnvironmentAttributeColorModifierKeys
    : CASE extends '%fallback'
      ? EnvironmentAttributeColorModifierFallback
      : CASE extends '%none' ? EnvironmentAttributeColorModifierNoneType : never
