import type {
  JsonSymbolEnvironmentAttributeArgbColorModifier,
  JsonSymbolEnvironmentAttributeColorModifier,
} from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonNBTObject, JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat } from 'sandstone'

export type JsonBlendToGray = {
  /**
   * The gray color is `brightness * (0.3 * r + 0.59 * g + 0.11 * b)`.
   *
   * Value:
   * Range: 0..1
   */
  brightness: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * The factor to mix with.
   *
   * Value:
   * Range: 0..1
   */
  factor: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonBooleanAttributeModifier = {
  /**
   * Value:
   *
   *  - Override(`override`)
   *  - And(`and`)
   *  - Nand(`nand`)
   *  - Or(`or`)
   *  - Nor(`nor`)
   *  - Xor(`xor`)
   *  - Xnor(`xnor`)
   */
  modifier: JsonBooleanModifierType,
  argument: boolean,
}

export type JsonBooleanModifierType = ('override' | 'and' | 'nand' | 'or' | 'nor' | 'xor' | 'xnor')

export type JsonColorAttributeModifier = NonNullable<({
  [S in Extract<Extract<JsonColorModifierType, string>, string>]?: {
    /**
     * Value:
     *
     *  - Override(`override`)
     *  - Add(`add`)
     *  - Subtract(`subtract`)
     *  - Multiply(`multiply`)
     *  - AlphaBlend(`alpha_blend`)
     *  - BlendToGray(`blend_to_gray`)
     */
    modifier: S,
    argument: (S extends undefined
      ? JsonSymbolEnvironmentAttributeColorModifier<'%none'> :
      (S extends keyof JsonSymbolEnvironmentAttributeColorModifier
        ? JsonSymbolEnvironmentAttributeColorModifier[S]
        : JsonSymbolEnvironmentAttributeColorModifier<'%unknown'>)),
  }
}[Extract<JsonColorModifierType, string>])>

export type JsonColorModifierType = ('override' | 'add' | 'subtract' | 'multiply' | 'alpha_blend' | 'blend_to_gray')

export type JsonFloatAttributeModifier<T extends JsonNBTObject> = ({
  [S in Extract<Extract<JsonFloatModifierType, string>, string>]?: {
    /**
     * Value:
     *
     *  - Override(`override`)
     *  - Add(`add`)
     *  - Subtract(`subtract`)
     *  - Multiply(`multiply`)
     *  - Minimum(`minimum`)
     *  - Maximum(`maximum`)
     *  - AlphaBlend(`alpha_blend`)
     */
    modifier: S,
    argument: (S extends undefined
      ? JsonSymbolEnvironmentAttributeFloatModifier<T, '%none'> :
      (S extends keyof JsonSymbolEnvironmentAttributeFloatModifier<T>
        ? JsonSymbolEnvironmentAttributeFloatModifier<T>[S]
        : JsonSymbolEnvironmentAttributeFloatModifier<T, '%unknown'>)),
  }
}[Extract<JsonFloatModifierType, string>])

export type JsonFloatModifierType = (
  | 'override'
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'minimum'
  | 'maximum'
  | 'alpha_blend')

export type JsonFloatWithAlpha = {
  value: (NBTFloat | number),
  /**
   * Defaults to 1.0
   *
   * Value:
   * Range: 0..1
   */
  alpha?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonListModifier<E extends JsonNBTObject> = {
  /**
   * Value:
   *
   *  - Override(`override`)
   *  - Append(`append`)
   */
  modifier: JsonListModifierType,
  argument: Array<E>,
}

export type JsonListModifierType = ('override' | 'append')

export type JsonMergeableModifier<T extends JsonNBTObject> = {
  /**
   * Value:
   *
   *  - Override(`override`)
   *  - Overlay(`overlay`)
   */
  modifier: JsonMergeableModifierType,
  argument: T,
}

export type JsonMergeableModifierType = ('override' | 'overlay')

export type JsonOverrideModifier<T extends JsonNBTObject> = {
  modifier: 'override',
  argument: T,
}

export type JsonTranslucentColorAttributeModifier = NonNullable<({
  [S in Extract<Extract<JsonColorModifierType, string>, string>]?: {
    /**
     * Value:
     *
     *  - Override(`override`)
     *  - Add(`add`)
     *  - Subtract(`subtract`)
     *  - Multiply(`multiply`)
     *  - AlphaBlend(`alpha_blend`)
     *  - BlendToGray(`blend_to_gray`)
     */
    modifier: S,
    argument: (S extends undefined
      ? JsonSymbolEnvironmentAttributeArgbColorModifier<'%none'> :
      (S extends keyof JsonSymbolEnvironmentAttributeArgbColorModifier
        ? JsonSymbolEnvironmentAttributeArgbColorModifier[S]
        : JsonRootNBT)),
  }
}[Extract<JsonColorModifierType, string>])>
type JsonEnvironmentAttributeFloatModifierDispatcherMap<T extends JsonNBTObject> = {
  'alpha_blend': JsonEnvironmentAttributeFloatModifierAlphaBlend<T>,
  'minecraft:alpha_blend': JsonEnvironmentAttributeFloatModifierAlphaBlend<T>,
  'override': JsonEnvironmentAttributeFloatModifierOverride<T>,
  'minecraft:override': JsonEnvironmentAttributeFloatModifierOverride<T>,
}
type JsonEnvironmentAttributeFloatModifierKeys = keyof JsonEnvironmentAttributeFloatModifierDispatcherMap<JsonNBTObject>
type JsonEnvironmentAttributeFloatModifierFallback<T extends JsonNBTObject> = (
  | JsonEnvironmentAttributeFloatModifierAlphaBlend<T>
  | JsonEnvironmentAttributeFloatModifierOverride<T>
  | JsonEnvironmentAttributeFloatModifierFallbackType<T>)
export type JsonEnvironmentAttributeFloatModifierFallbackType<T extends JsonNBTObject> = (NBTFloat | number)

export type JsonEnvironmentAttributeFloatModifierNoneType<T extends JsonNBTObject> = T

export type JsonEnvironmentAttributeFloatModifierAlphaBlend<T extends JsonNBTObject> = JsonFloatWithAlpha

export type JsonEnvironmentAttributeFloatModifierOverride<T extends JsonNBTObject> = T

export type JsonSymbolEnvironmentAttributeFloatModifier<T extends JsonNBTObject, CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonEnvironmentAttributeFloatModifierDispatcherMap<T>
  : CASE extends 'keys'
    ? JsonEnvironmentAttributeFloatModifierKeys
    : CASE extends '%fallback'
      ? JsonEnvironmentAttributeFloatModifierFallback<T>
      : CASE extends '%none'
        ? JsonEnvironmentAttributeFloatModifierNoneType<T>
        : CASE extends '%unknown' ? JsonEnvironmentAttributeFloatModifierFallbackType<T> : never
