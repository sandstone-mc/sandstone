import type { PaletteRef } from 'sandstone/arguments/generated/assets/atlas.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt } from 'sandstone'

export type ColormapTextureMeta = {
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
  mipmap_strategy?: MipmapStrategy,
  /**
   * The alpha bias for cutout textures. \
   * Positive values make the texture more opaque at distance.
   * Negative values make the texture more transparent at distance. \
   * Defaults to 0.0
   *
   * Value:
   * Range: -1..1
   */
  alpha_cutoff_bias?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }>,
}

export type GuiMeta = {
  /**
   * Configures how the GUI texture should be scaled. Defaults to `stretch`.
   */
  scaling?: GuiSpriteScaling,
}

export type GuiSpriteScaling = NonNullable<({
  [S in Extract<GuiSpriteScalingType, string>]?: ({
    /**
     * Value:
     *
     *  - Stretch(`stretch`)
     *  - Tile(`tile`)
     *  - NineSlice(`nine_slice`)
     */
    type: S,
  } & (S extends keyof SymbolGuiSpriteScaling ? SymbolGuiSpriteScaling[S] : RootNBT))
}[GuiSpriteScalingType])>

export type GuiSpriteScalingType = ('stretch' | 'tile' | 'nine_slice')

export type MipmapStrategy = ('auto' | 'mean' | 'cutout' | 'strict_cutout' | 'dark_cutout')

export type NineSlice = {
  /**
   * Value:
   * Range: 1..
   */
  width: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..
   */
  height: NBTInt<{
    min: 1,
  }>,
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
  border: (NBTInt<{
    min: 1,
  }> | NineSliceBorder),
  /**
   * Defaults to `false`.
   */
  stretch_inner?: boolean,
}

export type NineSliceBorder = {
  /**
   * Value:
   * Range: 1..
   */
  left: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..
   */
  top: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..
   */
  right: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..
   */
  bottom: NBTInt<{
    min: 1,
  }>,
}

export type PaletteMeta = {
  base_palette: PaletteRef,
}

export type TextureAnimation = {
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
  width?: NBTInt<{
    min: 1,
  }>,
  /**
   * The height of the tile, as a direct ratio rather than in pixels. Can be used by resource packs to have frames that are not perfect squares.
   *
   * Value:
   * Range: 1..
   */
  height?: NBTInt<{
    min: 1,
  }>,
  /**
   * Sets the default time for each frame in increments of one game tick. Defaults to 1.
   *
   * Value:
   * Range: 1..
   */
  frametime?: NBTInt<{
    min: 1,
  }>,
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
    index: NBTInt<{
      min: 0,
    }>,
    /**
     * The time in ticks to show this frame, overriding `frametime` above.
     *
     * Value:
     * Range: 1..
     */
    time?: NBTInt<{
      min: 1,
    }>,
  } | NBTInt<{
    min: 0,
  }>)>,
}

export type TextureAnimationFrame = {
  /**
   * A number corresponding to position of a frame from the top, with the top frame being 0.
   *
   * Value:
   * Range: 0..
   */
  index: NBTInt<{
    min: 0,
  }>,
  /**
   * The time in ticks to show this frame, overriding `frametime` above.
   *
   * Value:
   * Range: 1..
   */
  time?: NBTInt<{
    min: 1,
  }>,
}

export type TextureMeta = {
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
    width?: NBTInt<{
      min: 1,
    }>,
    /**
     * The height of the tile, as a direct ratio rather than in pixels. Can be used by resource packs to have frames that are not perfect squares.
     *
     * Value:
     * Range: 1..
     */
    height?: NBTInt<{
      min: 1,
    }>,
    /**
     * Sets the default time for each frame in increments of one game tick. Defaults to 1.
     *
     * Value:
     * Range: 1..
     */
    frametime?: NBTInt<{
      min: 1,
    }>,
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
      index: NBTInt<{
        min: 0,
      }>,
      /**
       * The time in ticks to show this frame, overriding `frametime` above.
       *
       * Value:
       * Range: 1..
       */
      time?: NBTInt<{
        min: 1,
      }>,
    } | NBTInt<{
      min: 0,
    }>)>,
  },
  gui?: {
    /**
     * Configures how the GUI texture should be scaled. Defaults to `stretch`.
     */
    scaling?: GuiSpriteScaling,
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
    hat?: VillagerHatType,
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
    mipmap_strategy?: MipmapStrategy,
    /**
     * The alpha bias for cutout textures. \
     * Positive values make the texture more opaque at distance.
     * Negative values make the texture more transparent at distance. \
     * Defaults to 0.0
     *
     * Value:
     * Range: -1..1
     */
    alpha_cutoff_bias?: NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
    }>,
  },
}

export type TileScaling = {
  /**
   * Value:
   * Range: 1..
   */
  width: NBTInt<{
    min: 1,
  }>,
  /**
   * Value:
   * Range: 1..
   */
  height: NBTInt<{
    min: 1,
  }>,
}

export type VillagerHatType = ('none' | 'partial' | 'full')

export type VillagerTextureMeta = {
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
  hat?: VillagerHatType,
}
type GuiSpriteScalingDispatcherMap = {
  'nine_slice': GuiSpriteScalingNineSlice,
  'minecraft:nine_slice': GuiSpriteScalingNineSlice,
  'stretch': GuiSpriteScalingStretch,
  'minecraft:stretch': GuiSpriteScalingStretch,
  'tile': GuiSpriteScalingTile,
  'minecraft:tile': GuiSpriteScalingTile,
}
type GuiSpriteScalingKeys = keyof GuiSpriteScalingDispatcherMap
type GuiSpriteScalingFallback = (GuiSpriteScalingNineSlice | GuiSpriteScalingStretch | GuiSpriteScalingTile)
type GuiSpriteScalingNineSlice = NineSlice
type GuiSpriteScalingStretch = Record<string, never>
type GuiSpriteScalingTile = TileScaling
export type SymbolGuiSpriteScaling<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? GuiSpriteScalingDispatcherMap
  : CASE extends 'keys' ? GuiSpriteScalingKeys : CASE extends '%fallback' ? GuiSpriteScalingFallback : never
