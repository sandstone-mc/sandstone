import type { Registry } from 'sandstone/arguments/generated/registry'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'
import type { RootNBT } from 'sandstone/arguments/nbt'

export type BitmapProvider = {
  file: string
  height?: NBTInt
  ascent: NBTInt
  /**
     * Value:
     * List length range: 1..
     */
  chars: NBTList<`${any}${string}`, {
    leftExclusive: false
    min: 1
  }>
}

export type Font = {
  providers: Array<GlyphProvider>
}

export type FontOption = ('uniform' | 'jp')

export type GlyphProvider = ({
  [S in Extract<GlyphProviderType, string>]?: ({
    /**
         * Value:
         *
         *  - Bitmap(`bitmap`)
         *  - TrueType(`ttf`)
         *  - Space(`space`)
         *  - LegacyUnicode(`legacy_unicode`)
         *  - Unihex(`unihex`)
         *  - Reference(`reference`)
         */
    type: S
    filter?: ({
      [Key in Extract<FontOption, string>]?: boolean;
    })
  } & (S extends keyof SymbolGlyphProvider ? SymbolGlyphProvider[S] : RootNBT));
}[GlyphProviderType])

export type GlyphProviderType = ('bitmap' | 'ttf' | 'space' | 'legacy_unicode' | 'unihex' | 'reference')

export type LegacyUnicodeProvider = {
  sizes: string
  template: string
}

export type ReferenceProvider = {
  id: Registry['minecraft:font']
}

export type SpaceProvider = {
  advances: ({
    [Key in Extract<`${any}${string}`, string>]?: NBTFloat;
  })
}

export type TtfProvider = {
  file: string
  size?: NBTFloat
  oversample?: NBTFloat
  /**
     * Value:
     * List length range: 2
     */
  shift?: NBTList<NBTFloat, {
    leftExclusive: false
    rightExclusive: false
    min: 2
    max: 2
  }>
  skip?: (string | Array<string>)
}

export type UnihexOverrideRange = {
  /**
     * Minimum in codepoint range (inclusive).
     */
  from: string
  /**
     * Maximum in codepoint range (inclusive).
     */
  to: string
  /**
     * Position of left-most column of the glyph.
     *
     * Value:
     * Range: 0..255
     */
  left: NBTInt<{
    min: 0
  }>
  /**
     * Position of right-most column of the glyph.
     *
     * Value:
     * Range: 0..255
     */
  right: NBTInt<{
    min: 0
  }>
}

export type UnihexProvider = ({
  /**
     * ZIP archive containing one or more *.hex files (files in archive with different extensions are ignored).
     */
  hex_file: string
} & {
  /**
     * List of ranges to override the size of.
     */
  size_overrides?: Array<UnihexOverrideRange>
})
type GlyphProviderDispatcherMap = {
  'bitmap': GlyphProviderBitmap
  'minecraft:bitmap': GlyphProviderBitmap
  'legacy_unicode': GlyphProviderLegacyUnicode
  'minecraft:legacy_unicode': GlyphProviderLegacyUnicode
  'reference': GlyphProviderReference
  'minecraft:reference': GlyphProviderReference
  'space': GlyphProviderSpace
  'minecraft:space': GlyphProviderSpace
  'ttf': GlyphProviderTtf
  'minecraft:ttf': GlyphProviderTtf
  'unihex': GlyphProviderUnihex
  'minecraft:unihex': GlyphProviderUnihex
}
type GlyphProviderKeys = keyof GlyphProviderDispatcherMap
type GlyphProviderFallback = (
  | GlyphProviderBitmap
  | GlyphProviderLegacyUnicode
  | GlyphProviderReference
  | GlyphProviderSpace
  | GlyphProviderTtf
  | GlyphProviderUnihex)
type GlyphProviderBitmap = BitmapProvider
type GlyphProviderLegacyUnicode = LegacyUnicodeProvider
type GlyphProviderReference = ReferenceProvider
type GlyphProviderSpace = SpaceProvider
type GlyphProviderTtf = TtfProvider
type GlyphProviderUnihex = UnihexProvider
export type SymbolGlyphProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? GlyphProviderDispatcherMap
  : CASE extends 'keys' ? GlyphProviderKeys : CASE extends '%fallback' ? GlyphProviderFallback : never
