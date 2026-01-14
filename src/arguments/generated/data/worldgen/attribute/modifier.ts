import type {
  SymbolEnvironmentAttributeArgbColorModifier,
  SymbolEnvironmentAttributeColorModifier,
} from 'sandstone/arguments/generated/dispatcher.ts'
import type { NBTObject, RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat } from 'sandstone'

export type BlendToGray = {
  /**
   * The gray color is `brightness * (0.3 * r + 0.59 * g + 0.11 * b)`.
   *
   * Value:
   * Range: 0..1
   */
  brightness: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  /**
   * The factor to mix with.
   *
   * Value:
   * Range: 0..1
   */
  factor: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type BooleanAttributeModifier = {
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
  modifier: BooleanModifierType
  argument: boolean
}

export type BooleanModifierType = ('override' | 'and' | 'nand' | 'or' | 'nor' | 'xor' | 'xnor')

export type ColorAttributeModifier = NonNullable<({
  [S in Extract<ColorModifierType, string>]?: {
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
    modifier: S
    argument: (S extends undefined
      ? SymbolEnvironmentAttributeColorModifier<'%none'> :
      (S extends keyof SymbolEnvironmentAttributeColorModifier
        ? SymbolEnvironmentAttributeColorModifier[S]
        : SymbolEnvironmentAttributeColorModifier<'%unknown'>))
  };
}[ColorModifierType])>

export type ColorModifierType = ('override' | 'add' | 'subtract' | 'multiply' | 'alpha_blend' | 'blend_to_gray')

export type FloatAttributeModifier<T extends NBTObject> = ({
  [S in Extract<FloatModifierType, string>]?: {
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
    modifier: S
    argument: (S extends undefined
      ? SymbolEnvironmentAttributeFloatModifier<T, '%none'> :
      (S extends keyof SymbolEnvironmentAttributeFloatModifier<T>
        ? SymbolEnvironmentAttributeFloatModifier<T>[S]
        : SymbolEnvironmentAttributeFloatModifier<T, '%unknown'>))
  };
}[FloatModifierType])

export type FloatModifierType = ('override' | 'add' | 'subtract' | 'multiply' | 'minimum' | 'maximum' | 'alpha_blend')

export type FloatWithAlpha = {
  value: NBTFloat
  /**
   * Defaults to 1.0
   *
   * Value:
   * Range: 0..1
   */
  alpha?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type OverrideModifier<T extends NBTObject> = {
  modifier: 'override'
  argument: T
}

export type TranslucentColorAttributeModifier = NonNullable<({
  [S in Extract<ColorModifierType, string>]?: {
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
    modifier: S
    argument: (S extends undefined
      ? SymbolEnvironmentAttributeArgbColorModifier<'%none'> :
      (S extends keyof SymbolEnvironmentAttributeArgbColorModifier
        ? SymbolEnvironmentAttributeArgbColorModifier[S]
        : RootNBT))
  };
}[ColorModifierType])>
type EnvironmentAttributeFloatModifierDispatcherMap<T extends NBTObject> = {
  'alpha_blend': EnvironmentAttributeFloatModifierAlphaBlend<T>
  'minecraft:alpha_blend': EnvironmentAttributeFloatModifierAlphaBlend<T>
  'override': EnvironmentAttributeFloatModifierOverride<T>
  'minecraft:override': EnvironmentAttributeFloatModifierOverride<T>
}
type EnvironmentAttributeFloatModifierKeys = keyof EnvironmentAttributeFloatModifierDispatcherMap<NBTObject>
type EnvironmentAttributeFloatModifierFallback<T extends NBTObject> = (
  | EnvironmentAttributeFloatModifierAlphaBlend<T>
  | EnvironmentAttributeFloatModifierOverride<T>
  | EnvironmentAttributeFloatModifierFallbackType<T>)
export type EnvironmentAttributeFloatModifierFallbackType<T extends NBTObject> = NBTFloat

export type EnvironmentAttributeFloatModifierNoneType<T extends NBTObject> = T

export type EnvironmentAttributeFloatModifierAlphaBlend<T extends NBTObject> = FloatWithAlpha

export type EnvironmentAttributeFloatModifierOverride<T extends NBTObject> = T

export type SymbolEnvironmentAttributeFloatModifier<T extends NBTObject, CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? EnvironmentAttributeFloatModifierDispatcherMap<T>
  : CASE extends 'keys'
    ? EnvironmentAttributeFloatModifierKeys
    : CASE extends '%fallback'
      ? EnvironmentAttributeFloatModifierFallback<T>
      : CASE extends '%none'
        ? EnvironmentAttributeFloatModifierNoneType<T>
        : CASE extends '%unknown' ? EnvironmentAttributeFloatModifierFallbackType<T> : never
