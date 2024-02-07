import type { ENTITY_TYPES } from '../../generated/entity_type.js'
import type { LiteralUnion } from 'sandstone/utils'

export type TextureAnimation = {
  animation: {
    /** Optional. If true, additional frames will be generated between frames with a frame time greater than 1 between them. Defaults to false. */
    interpolate?: boolean
    /** Optional. An integer. The width of the tile, as a direct ratio rather than in pixels. Can be used by resource packs to have frames that are not perfect squares. */
    width?: number
    /** Optional. An integer. The height of the tile, as a direct ratio rather than in pixels. Can be used by resource packs to have frames that are not perfect squares. */
    height?: number
    /** Optional. An integer. Sets the default time for each frame in increments of one game tick. Defaults to 1. */
    frametime?: number
    /** Optional. Defaults to displaying all the frames from top to bottom. */
    frames?: ({
      /** A number corresponding to position of a frame from the top, with the top frame being 0. */
      index: number
      /** The time in ticks to show this frame, overriding `frametime` above. */
      time: number
    } | number)[]
  }
}

export type TextureVillager = {
  villager: {
    /** Determines whether the villager's 'profession' hat layer should allow the 'type' hat layer to render or not. If this mcmeta is undefined the default is used. */
    hat?: 'full' | 'partial'
  }
}

export type TextureColormap = {
  texture: {
    /** Optional. Causes the texture to blur when viewed from close up. Defaults to false. */
    blur?: boolean
    /** Optional. Causes the texture to stretch instead of tiling in cases where it otherwise would, such as on the shadow. Defaults to false. */
    clamp?: boolean
    /** Optional. An integer array. Custom mipmap values for the texture. */
    mipmaps?: number[]
  }
}

// eslint-disable-next-line max-len
export type TEXTURE_TYPES = 'block' | 'colormap' | 'effect' | `entity/${ENTITY_TYPES}` | 'environment' | 'font' | 'gui' | 'item' | 'map' | 'misc' | 'mob_effect' | 'models/armor' | 'painting' | 'particle' | 'trims'

// TODO: Find which texture types actually support animations.
export type TextureMeta<Type extends LiteralUnion<TEXTURE_TYPES>> = (
  TextureAnimation
  & (Type extends 'entity/villager' ? TextureVillager : unknown)
  & (Type extends 'colormap' ? TextureColormap : unknown)
)
