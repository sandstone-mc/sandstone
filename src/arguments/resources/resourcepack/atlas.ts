export type AtlasDefinition = {
  sources: AtlasSpriteSource[],
}

export type SPRITE_SOURCES = 'single' | 'directory' | 'filter' | 'paletted_permutations' | 'unstitch'

export type SpriteSource<Type extends SPRITE_SOURCES, Source extends Record<string, unknown> | unknown | null> = { type: Type } & Source

export type AtlasSpriteSource = (
  SpriteSource<'single', {
    resource: string
    sprite?: string
  }> | SpriteSource<'directory', {
    source: string
    prefix: string
  }> | SpriteSource<'filter', {
    pattern: {
      /** A RegExp */
      namespace?: string,
      /** A RegExp */
      path?: string,
    }
  }> | SpriteSource<'paletted_permutations', {
    textures: string[]
    palette_key: string
    permutations: {
      [key: string]: string
    }
  }> | SpriteSource<'unstitch', {
    sprite: string
    /** A double */
    x: number
    /** A double */
    y: number
    /** A double */
    width: number
  }>
)
