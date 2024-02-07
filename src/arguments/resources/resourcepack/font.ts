export type FontProvider = FontProviderBitmap | FontProviderLegacyUnicode | FontProviderTrueType

export type FontProviderType = FontProvider['type']

export type FontProviderFor<T extends FontProviderType> =
  T extends 'bitmap' ? FontProviderBitmap
  : T extends 'legacy_unicode' ? FontProviderLegacyUnicode
  : FontProviderTrueType

export type FontProviderBitmap = {
  type: 'bitmap'
  file: string
  ascent: number
  chars: string[]
  height?: number
}

export type FontProviderLegacyUnicode = {
  type: 'legacy_unicode'
  sizes: string
  template: string
}

export type FontProviderTrueType = {
  type: 'ttf'
  file: string
  shift: [number, number]
  size: number
  oversample: number
  skip: string | string[]
}
