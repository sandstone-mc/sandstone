import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Direction } from 'sandstone/arguments/generated/util/direction.ts'
import type { ModelClass, NBTFloat, NBTInt, NBTList, TextureClass } from 'sandstone'

export type Axis = ('x' | 'y' | 'z')

export type CustomizableItemDisplayContext = (
  | 'firstperson_righthand'
  | 'firstperson_lefthand'
  | 'thirdperson_righthand'
  | 'thirdperson_lefthand'
  | 'gui'
  | 'head'
  | 'ground'
  | 'fixed'
  | 'on_shelf')

export type ItemDisplayContext = (
  | 'none'
  | 'firstperson_righthand'
  | 'firstperson_lefthand'
  | 'thirdperson_righthand'
  | 'thirdperson_lefthand'
  | 'gui'
  | 'head'
  | 'ground'
  | 'fixed'
  | 'on_shelf')

export type Model = {
  parent?: (Registry['minecraft:model'] | ModelClass),
  ambientocclusion?: boolean,
  gui_light?: ('front' | 'side'),
  textures?: ({
    [Key in `${any}${string}`]?: ((`${any}${string}` | `#${string}` | TextureClass) | TextureMaterial)
  }),
  elements?: Array<ModelElement>,
  display?: ({
    [Key in Extract<CustomizableItemDisplayContext, string>]?: {
      /**
       * Value:
       * List length range: 3
       */
      rotation?: NBTList<NBTFloat, {
        leftExclusive: false,
        rightExclusive: false,
        min: 3,
        max: 3,
      }>,
      /**
       * Value:
       * List length range: 3
       */
      translation?: NBTList<NBTFloat<{
        leftExclusive: false,
        rightExclusive: false,
      }>, {
        leftExclusive: false,
        rightExclusive: false,
        min: 3,
        max: 3,
      }>,
      /**
       * Value:
       * List length range: 3
       */
      scale?: NBTList<NBTFloat<{
        leftExclusive: false,
        rightExclusive: false,
      }>, {
        leftExclusive: false,
        rightExclusive: false,
        min: 3,
        max: 3,
      }>,
    }
  }),
}

export type ModelElement = {
  /**
   * Value:
   * List length range: 3
   */
  from: NBTList<NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  to: NBTList<NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  faces: ({
    [Key in Extract<Direction, string>]?: {
      texture: `#${string}`,
      /**
       * Value:
       * List length range: 4
       */
      uv?: NBTList<NBTFloat, {
        leftExclusive: false,
        rightExclusive: false,
        min: 4,
        max: 4,
      }>,
      /**
       * Value:
       *
       *  - Down(`down`)
       *  - Up(`up`)
       *  - North(`north`)
       *  - East(`east`)
       *  - South(`south`)
       *  - West(`west`)
       */
      cullface?: Direction,
      rotation?: (0 | 90 | 180 | 270),
      tintindex?: NBTInt,
    }
  }),
  rotation?: ModelElementRotation,
  shade?: boolean,
  /**
   * Value:
   * Range: 0..15
   */
  light_emission?: NBTInt<{
    min: 0,
    max: 15,
  }>,
}

export type ModelElementFace = {
  texture: `#${string}`,
  /**
   * Value:
   * List length range: 4
   */
  uv?: NBTList<NBTFloat, {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * Value:
   *
   *  - Down(`down`)
   *  - Up(`up`)
   *  - North(`north`)
   *  - East(`east`)
   *  - South(`south`)
   *  - West(`west`)
   */
  cullface?: Direction,
  rotation?: (0 | 90 | 180 | 270),
  tintindex?: NBTInt,
}

export type ModelElementRotation = (ModelElementRotationBase & ({
  [Key in Extract<Axis, string>]?: NBTFloat
}))

export type ModelElementRotationBase = {
  /**
   * Value:
   * List length range: 3
   */
  origin: NBTList<NBTFloat, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Defaults to `false`.
   */
  rescale?: boolean,
}

export type ModelOverride = {
  predicate: ({
    [Key in Extract<Predicates, string>]?: NBTFloat
  }),
  model: ModelRef,
}

export type ModelRef = (Registry['minecraft:model'] | ModelClass)

export type Predicates = (
  | 'angle'
  | 'blocking'
  | 'broken'
  | 'cast'
  | 'charged'
  | 'cooldown'
  | 'custom_model_data'
  | 'damage'
  | 'damaged'
  | 'firework'
  | 'honey_level'
  | 'lefthanded'
  | 'level'
  | 'pull'
  | 'pulling'
  | 'throwing'
  | 'time'
  | 'tooting'
  | 'trim_type')

export type TextureMaterial = {
  sprite: (Registry['minecraft:texture'] | TextureClass),
  /**
   * Whether the texture should be forced into the translucent render pass. \
   * Textures without any translucent pixels are not assigned to the translucent pass by default. \
   * Defaults to `false`.
   */
  force_translucent?: boolean,
}
