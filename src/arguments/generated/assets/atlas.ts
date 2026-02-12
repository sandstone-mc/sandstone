import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTDouble, TextureClass } from 'sandstone'

export type Atlas = {
  /**
   * List of sprite sources which can add or remove sprite textures to this atlas.
   */
  sources: Array<SpriteSource>,
}

export type Directory = {
  /**
   * Directory of texture locations to include, relative to the `textures` folder, not including the trailing `/`.
   */
  source: string,
  /**
   * The sprite name prefix, usually ending with `/`.
   */
  prefix: string,
}

export type Filter = {
  /**
   * Pattern to remove sprite identifiers already in the atlas. The order of sprite sources is important.
   */
  pattern: FilterPattern,
}

export type FilterPattern = {
  namespace?: `${any}${string}` | RegExp,
  path?: `${any}${string}` | RegExp,
}

export type PalettedPermutations = {
  textures: Array<(Registry['minecraft:texture'] | TextureClass)>,
  palette_key: (Registry['minecraft:texture'] | TextureClass),
  permutations: ({
    [Key in `${any}${string}`]?: (Registry['minecraft:texture'] | TextureClass)
  }),
  /**
   * Value to use when joining the texture and permutation names to produce the sprite name.
   * Defaults to `_`.
   */
  separator?: string,
}

export type Single = {
  /**
   * A single texture location of the source.
   */
  resource: (Registry['minecraft:texture'] | TextureClass),
  /**
   * The identifier of the sprite that can referenced.
   * If not specified, matches `resource`.
   *
   * Value:
   *
   * Value: Defines a `texture` id.
   */
  sprite?: `${string}:${string}`,
}

export type SpriteSource = NonNullable<({
  [S in Extract<SpriteSourceType, string>]?: ({
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
  } & (S extends keyof SymbolSpriteSource ? SymbolSpriteSource[S] : RootNBT))
}[SpriteSourceType])>

export type SpriteSourceType = ('single' | 'directory' | 'filter' | 'unstitch' | 'paletted_permutations')

export type Unstitch = {
  resource: (Registry['minecraft:texture'] | TextureClass),
  /**
   * If set to the resource width, regions will use pixel coordinates.
   */
  divisor_x?: (NBTDouble | number),
  /**
   * If set to the resource height, regions will use pixel coordinates.
   */
  divisor_y?: (NBTDouble | number),
  regions: Array<UnstitchRegion>,
}

export type UnstitchRegion = {
  /**
   * Value:
   *
   * Value: Defines a `texture` id.
   */
  sprite: `${string}:${string}`,
  x: (NBTDouble | number),
  y: (NBTDouble | number),
  width: (NBTDouble | number),
  height: (NBTDouble | number),
}
type SpriteSourceDispatcherMap = {
  'directory': SpriteSourceDirectory,
  'minecraft:directory': SpriteSourceDirectory,
  'filter': SpriteSourceFilter,
  'minecraft:filter': SpriteSourceFilter,
  'paletted_permutations': SpriteSourcePalettedPermutations,
  'minecraft:paletted_permutations': SpriteSourcePalettedPermutations,
  'single': SpriteSourceSingle,
  'minecraft:single': SpriteSourceSingle,
  'unstitch': SpriteSourceUnstitch,
  'minecraft:unstitch': SpriteSourceUnstitch,
}
type SpriteSourceKeys = keyof SpriteSourceDispatcherMap
type SpriteSourceFallback = (
  | SpriteSourceDirectory
  | SpriteSourceFilter
  | SpriteSourcePalettedPermutations
  | SpriteSourceSingle
  | SpriteSourceUnstitch)
type SpriteSourceDirectory = Directory
type SpriteSourceFilter = Filter
type SpriteSourcePalettedPermutations = PalettedPermutations
type SpriteSourceSingle = Single
type SpriteSourceUnstitch = Unstitch
export type SymbolSpriteSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? SpriteSourceDispatcherMap
  : CASE extends 'keys' ? SpriteSourceKeys : CASE extends '%fallback' ? SpriteSourceFallback : never
