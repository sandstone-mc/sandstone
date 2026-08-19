import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { TextureType } from 'sandstone/arguments'
import type { NamespacedString, NBTDouble, NonEmptyString, TextureClass } from 'sandstone'

export type JsonAtlas = {
  /**
   * List of sprite sources which can add or remove sprite textures to this atlas.
   */
  sources: Array<JsonSpriteSource>,
}

export type JsonDirectory = {
  /**
   * Directory of texture locations to include, relative to the `textures` folder, not including the trailing `/`.
   */
  source: string,
  /**
   * The sprite name prefix, usually ending with `/`.
   */
  prefix: string,
}

export type JsonFilter = {
  /**
   * Pattern to remove sprite identifiers already in the atlas. The order of sprite sources is important.
   */
  pattern: JsonFilterPattern,
}

export type JsonFilterPattern = {
  namespace?: NonEmptyString | RegExp,
  path?: NonEmptyString | RegExp,
}

export type JsonPalettedPermutations = {
  textures: Array<(JsonRegistry['minecraft:texture'] | TextureClass<TextureType>)>,
  palette_key: JsonPaletteTexture,
  permutations: ({
    [Key in NonEmptyString]?: JsonPaletteTexture
  }),
  /**
   * Value to use when joining the texture and permutation names to produce the sprite name.
   * Defaults to `_`.
   */
  separator?: string,
}

/**
 *
 * Value: A texture ID within a path root of `(namespace)/textures/palettes/`
 */
export type JsonPaletteRef = NamespacedString

export type JsonPaletteTexture = JsonPaletteRef

export type JsonPermutationsMap = ({
  [Key in NonEmptyString]?: JsonPaletteTexture
})

export type JsonSingle = {
  /**
   * A single texture location of the source.
   */
  resource: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  /**
   * The identifier of the sprite that can referenced.
   * If not specified, matches `resource`.
   *
   * Value:
   *
   * Value: Defines a `texture` id.
   */
  sprite?: NamespacedString,
}

export type JsonSpriteSource = NonNullable<({
  [S in Extract<Extract<JsonSpriteSourceType, string>, string>]?: ({
    /**
     * Value:
     *
     *  - Single(`single`)
     *  - Directory(`directory`)
     *  - Filter(`filter`)
     *  - Unstitch(`unstitch`)
     *  - PalettedPermutations(`paletted_permutations`)
     */
    type: S,
  } & (S extends keyof JsonSymbolSpriteSource ? JsonSymbolSpriteSource[S] : JsonRootNBT))
}[Extract<JsonSpriteSourceType, string>])>

export type JsonSpriteSourceType = ('single' | 'directory' | 'filter' | 'unstitch' | 'paletted_permutations')

export type JsonUnstitch = {
  resource: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  /**
   * If set to the resource width, regions will use pixel coordinates.
   */
  divisor_x?: (NBTDouble | number),
  /**
   * If set to the resource height, regions will use pixel coordinates.
   */
  divisor_y?: (NBTDouble | number),
  regions: Array<JsonUnstitchRegion>,
}

export type JsonUnstitchRegion = {
  /**
   * Value:
   *
   * Value: Defines a `texture` id.
   */
  sprite: NamespacedString,
  x: (NBTDouble | number),
  y: (NBTDouble | number),
  width: (NBTDouble | number),
  height: (NBTDouble | number),
}
type JsonSpriteSourceDispatcherMap = {
  'directory': JsonSpriteSourceDirectory,
  'minecraft:directory': JsonSpriteSourceDirectory,
  'filter': JsonSpriteSourceFilter,
  'minecraft:filter': JsonSpriteSourceFilter,
  'paletted_permutations': JsonSpriteSourcePalettedPermutations,
  'minecraft:paletted_permutations': JsonSpriteSourcePalettedPermutations,
  'single': JsonSpriteSourceSingle,
  'minecraft:single': JsonSpriteSourceSingle,
  'unstitch': JsonSpriteSourceUnstitch,
  'minecraft:unstitch': JsonSpriteSourceUnstitch,
}
type JsonSpriteSourceKeys = keyof JsonSpriteSourceDispatcherMap
type JsonSpriteSourceFallback = (
  | JsonSpriteSourceDirectory
  | JsonSpriteSourceFilter
  | JsonSpriteSourcePalettedPermutations
  | JsonSpriteSourceSingle
  | JsonSpriteSourceUnstitch)
type JsonSpriteSourceDirectory = JsonDirectory
type JsonSpriteSourceFilter = JsonFilter
type JsonSpriteSourcePalettedPermutations = JsonPalettedPermutations
type JsonSpriteSourceSingle = JsonSingle
type JsonSpriteSourceUnstitch = JsonUnstitch
export type JsonSymbolSpriteSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonSpriteSourceDispatcherMap
  : CASE extends 'keys' ? JsonSpriteSourceKeys : CASE extends '%fallback' ? JsonSpriteSourceFallback : never
