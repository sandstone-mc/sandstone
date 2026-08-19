import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { FontClass, JsonNBTList, NBTFloat, NBTInt, NonEmptyString } from 'sandstone'

export type JsonBitmapProvider = {
  file: string,
  height?: (NBTInt | number),
  ascent: (NBTInt | number),
  /**
   * Value:
   * List length range: 1..
   */
  chars: JsonNBTList<NonEmptyString, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonFont = {
  providers: Array<JsonGlyphProvider>,
}

export type JsonFontOption = ('uniform' | 'jp')

export type JsonGlyphProvider = NonNullable<({
  [S in Extract<Extract<JsonGlyphProviderType, string>, string>]?: ({
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
    type: S,
    filter?: ({
      [Key in Extract<JsonFontOption, string>]?: boolean
    }),
  } & (S extends keyof JsonSymbolGlyphProvider ? JsonSymbolGlyphProvider[S] : JsonRootNBT))
}[Extract<JsonGlyphProviderType, string>])>

export type JsonGlyphProviderType = ('bitmap' | 'ttf' | 'space' | 'legacy_unicode' | 'unihex' | 'reference')

export type JsonLegacyUnicodeProvider = {
  sizes: string,
  template: string,
}

export type JsonReferenceProvider = {
  id: (JsonRegistry['minecraft:font'] | FontClass),
}

export type JsonSpaceProvider = {
  advances: ({
    [Key in NonEmptyString]?: (NBTFloat | number)
  }),
}

export type JsonTtfProvider = {
  file: string,
  size?: (NBTFloat | number),
  oversample?: (NBTFloat | number),
  /**
   * Value:
   * List length range: 2
   */
  shift?: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 2,
    max: 2,
  }>,
  skip?: (string | Array<string>),
}

export type JsonUnihexOverrideRange = {
  /**
   * Minimum in codepoint range (inclusive).
   */
  from: string,
  /**
   * Maximum in codepoint range (inclusive).
   */
  to: string,
  /**
   * Position of left-most column of the glyph.
   *
   * Value:
   * Range: 0..255
   */
  left: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Position of right-most column of the glyph.
   *
   * Value:
   * Range: 0..255
   */
  right: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonUnihexProvider = ({
  /**
   * ZIP archive containing one or more *.hex files (files in archive with different extensions are ignored).
   */
  hex_file: string,
} & {
  /**
   * List of ranges to override the size of.
   */
  size_overrides?: Array<JsonUnihexOverrideRange>,
})
type JsonGlyphProviderDispatcherMap = {
  'bitmap': JsonGlyphProviderBitmap,
  'minecraft:bitmap': JsonGlyphProviderBitmap,
  'reference': JsonGlyphProviderReference,
  'minecraft:reference': JsonGlyphProviderReference,
  'space': JsonGlyphProviderSpace,
  'minecraft:space': JsonGlyphProviderSpace,
  'ttf': JsonGlyphProviderTtf,
  'minecraft:ttf': JsonGlyphProviderTtf,
  'unihex': JsonGlyphProviderUnihex,
  'minecraft:unihex': JsonGlyphProviderUnihex,
}
type JsonGlyphProviderKeys = keyof JsonGlyphProviderDispatcherMap
type JsonGlyphProviderFallback = (
  | JsonGlyphProviderBitmap
  | JsonGlyphProviderReference
  | JsonGlyphProviderSpace
  | JsonGlyphProviderTtf
  | JsonGlyphProviderUnihex)
type JsonGlyphProviderBitmap = JsonBitmapProvider
type JsonGlyphProviderReference = JsonReferenceProvider
type JsonGlyphProviderSpace = JsonSpaceProvider
type JsonGlyphProviderTtf = JsonTtfProvider
type JsonGlyphProviderUnihex = JsonUnihexProvider
export type JsonSymbolGlyphProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonGlyphProviderDispatcherMap
  : CASE extends 'keys' ? JsonGlyphProviderKeys : CASE extends '%fallback' ? JsonGlyphProviderFallback : never
