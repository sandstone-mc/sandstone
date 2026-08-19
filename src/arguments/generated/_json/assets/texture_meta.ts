import type { JsonPaletteRef } from 'sandstone/arguments/generated/_json/assets/atlas.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt } from 'sandstone'

export type JsonColormapTextureMeta = {
  /**
   * Causes the texture to blur when viewed from close up. Defaults to false.
   */
  blur?: boolean,
  /**
   * Causes the texture to stretch instead of tiling in cases where it otherwise would, such as on the shadow. Defaults to false.
   */
  clamp?: boolean,
  /**
   * Defaults to `auto`.
   *
   * Value:
   *
   *  - Auto(`auto`)
   *  - Mean(`mean`)
   *  - Cutout(`cutout`)
   *  - StrictCutout(`strict_cutout`)
   *  - DarkCutout(`dark_cutout`)
   */
  mipmap_strategy?: JsonMipmapStrategy,
  /**
   * The alpha bias for cutout textures. \
   * Positive values make the texture more opaque at distance.
   * Negative values make the texture more transparent at distance. \
   * Defaults to 0.0
   *
   * Value:
   * Range: -1..1
   */
  alpha_cutoff_bias?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }> | number),
}

export type JsonGuiMeta = {
  /**
   * Configures how the GUI texture should be scaled. Defaults to `stretch`.
   */
  scaling?: JsonGuiSpriteScaling,
}

export type JsonGuiSpriteScaling = NonNullable<({
  [S in Extract<Extract<JsonGuiSpriteScalingType, string>, string>]?: ({
    /**
     * Value:
     *
     *  - Stretch(`stretch`)
     *  - Tile(`tile`)
     *  - NineSlice(`nine_slice`)
     */
    type: S,
  } & (S extends keyof JsonSymbolGuiSpriteScaling ? JsonSymbolGuiSpriteScaling[S] : JsonRootNBT))
}[Extract<JsonGuiSpriteScalingType, string>])>

export type JsonGuiSpriteScalingType = ('stretch' | 'tile' | 'nine_slice')

export type JsonMipmapStrategy = ('auto' | 'mean' | 'cutout' | 'strict_cutout' | 'dark_cutout')

export type JsonNineSlice = {
  /**
   * Value:
   * Range: 1..
   */
  width: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..
   */
  height: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * *either*
   *
   * Range: 1..
   *
   * *or*
   *
   * *item 1*
   */
  border: ((NBTInt<{
    min: 1,
  }> | number) | JsonNineSliceBorder),
  /**
   * Defaults to `false`.
   */
  stretch_inner?: boolean,
}

export type JsonNineSliceBorder = {
  /**
   * Value:
   * Range: 0..
   */
  left: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..
   */
  top: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..
   */
  right: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..
   */
  bottom: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonPaletteMeta = {
  base_palette: JsonPaletteRef,
}

export type JsonTextureAnimation = {
  /**
   * If true, additional frames will be generated between frames with a frame time greater than 1 between them. Defaults to false.
   */
  interpolate?: boolean,
  /**
   * The width of the tile, as a direct ratio rather than in pixels. Can be used by resource packs to have frames that are not perfect squares.
   *
   * Value:
   * Range: 1..
   */
  width?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * The height of the tile, as a direct ratio rather than in pixels. Can be used by resource packs to have frames that are not perfect squares.
   *
   * Value:
   * Range: 1..
   */
  height?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Sets the default time for each frame in increments of one game tick. Defaults to 1.
   *
   * Value:
   * Range: 1..
   */
  frametime?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Defaults to displaying all the frames from top to bottom.
   */
  frames?: Array<({
    /**
     * A number corresponding to position of a frame from the top, with the top frame being 0.
     *
     * Value:
     * Range: 0..
     */
    index: (NBTInt<{
      min: 0,
    }> | number),
    /**
     * The time in ticks to show this frame, overriding `frametime` above.
     *
     * Value:
     * Range: 1..
     */
    time?: (NBTInt<{
      min: 1,
    }> | number),
  } | (NBTInt<{
    min: 0,
  }> | number))>,
}

export type JsonTextureAnimationFrame = {
  /**
   * A number corresponding to position of a frame from the top, with the top frame being 0.
   *
   * Value:
   * Range: 0..
   */
  index: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * The time in ticks to show this frame, overriding `frametime` above.
   *
   * Value:
   * Range: 1..
   */
  time?: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonTextureMeta = {
  animation?: {
    /**
     * If true, additional frames will be generated between frames with a frame time greater than 1 between them. Defaults to false.
     */
    interpolate?: boolean,
    /**
     * The width of the tile, as a direct ratio rather than in pixels. Can be used by resource packs to have frames that are not perfect squares.
     *
     * Value:
     * Range: 1..
     */
    width?: (NBTInt<{
      min: 1,
    }> | number),
    /**
     * The height of the tile, as a direct ratio rather than in pixels. Can be used by resource packs to have frames that are not perfect squares.
     *
     * Value:
     * Range: 1..
     */
    height?: (NBTInt<{
      min: 1,
    }> | number),
    /**
     * Sets the default time for each frame in increments of one game tick. Defaults to 1.
     *
     * Value:
     * Range: 1..
     */
    frametime?: (NBTInt<{
      min: 1,
    }> | number),
    /**
     * Defaults to displaying all the frames from top to bottom.
     */
    frames?: Array<({
      /**
       * A number corresponding to position of a frame from the top, with the top frame being 0.
       *
       * Value:
       * Range: 0..
       */
      index: (NBTInt<{
        min: 0,
      }> | number),
      /**
       * The time in ticks to show this frame, overriding `frametime` above.
       *
       * Value:
       * Range: 1..
       */
      time?: (NBTInt<{
        min: 1,
      }> | number),
    } | (NBTInt<{
      min: 0,
    }> | number))>,
  },
  gui?: {
    /**
     * Configures how the GUI texture should be scaled. Defaults to `stretch`.
     */
    scaling?: JsonGuiSpriteScaling,
  },
  /**
   * Only available for villager textures.
   */
  villager?: {
    /**
     * Determines whether the villager's 'profession' hat layer should allow the 'type' hat layer to render or not. \
     * Defaults to `none`.
     *
     * Value:
     *
     *  - None(`none`)
     *  - Parital(`partial`)
     *  - Full(`full`)
     */
    hat?: JsonVillagerHatType,
  },
  texture?: {
    /**
     * Causes the texture to blur when viewed from close up. Defaults to false.
     */
    blur?: boolean,
    /**
     * Causes the texture to stretch instead of tiling in cases where it otherwise would, such as on the shadow. Defaults to false.
     */
    clamp?: boolean,
    /**
     * Defaults to `auto`.
     *
     * Value:
     *
     *  - Auto(`auto`)
     *  - Mean(`mean`)
     *  - Cutout(`cutout`)
     *  - StrictCutout(`strict_cutout`)
     *  - DarkCutout(`dark_cutout`)
     */
    mipmap_strategy?: JsonMipmapStrategy,
    /**
     * The alpha bias for cutout textures. \
     * Positive values make the texture more opaque at distance.
     * Negative values make the texture more transparent at distance. \
     * Defaults to 0.0
     *
     * Value:
     * Range: -1..1
     */
    alpha_cutoff_bias?: (NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
    }> | number),
  },
  /**
   * Required for armor trim textures.
   */
  palette?: {
    base_palette: JsonPaletteRef,
  },
}

export type JsonTileScaling = {
  /**
   * Value:
   * Range: 1..
   */
  width: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Range: 1..
   */
  height: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonVillagerHatType = ('none' | 'partial' | 'full')

export type JsonVillagerTextureMeta = {
  /**
   * Determines whether the villager's 'profession' hat layer should allow the 'type' hat layer to render or not. \
   * Defaults to `none`.
   *
   * Value:
   *
   *  - None(`none`)
   *  - Parital(`partial`)
   *  - Full(`full`)
   */
  hat?: JsonVillagerHatType,
}
type JsonGuiSpriteScalingDispatcherMap = {
  'nine_slice': JsonGuiSpriteScalingNineSlice,
  'minecraft:nine_slice': JsonGuiSpriteScalingNineSlice,
  'stretch': JsonGuiSpriteScalingStretch,
  'minecraft:stretch': JsonGuiSpriteScalingStretch,
  'tile': JsonGuiSpriteScalingTile,
  'minecraft:tile': JsonGuiSpriteScalingTile,
}
type JsonGuiSpriteScalingKeys = keyof JsonGuiSpriteScalingDispatcherMap
type JsonGuiSpriteScalingFallback = (
  | JsonGuiSpriteScalingNineSlice
  | JsonGuiSpriteScalingStretch
  | JsonGuiSpriteScalingTile)
type JsonGuiSpriteScalingNineSlice = JsonNineSlice
type JsonGuiSpriteScalingStretch = Record<string, never>
type JsonGuiSpriteScalingTile = JsonTileScaling
export type JsonSymbolGuiSpriteScaling<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonGuiSpriteScalingDispatcherMap
  : CASE extends 'keys' ? JsonGuiSpriteScalingKeys : CASE extends '%fallback' ? JsonGuiSpriteScalingFallback : never
