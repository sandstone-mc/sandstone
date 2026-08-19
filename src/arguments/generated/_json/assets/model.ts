import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonAxis, JsonDirection } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { ModelType, TextureType } from 'sandstone/arguments'
import type { JsonNBTList, ModelClass, NBTFloat, NBTInt, NonEmptyString, TextureClass } from 'sandstone'

export type JsonCustomizableItemDisplayContext = (
  | 'firstperson_righthand'
  | 'firstperson_lefthand'
  | 'thirdperson_righthand'
  | 'thirdperson_lefthand'
  | 'gui'
  | 'head'
  | 'ground'
  | 'fixed'
  | 'on_shelf')

export type JsonItemDisplayContext = (
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

export type JsonItemTransform = {
  /**
   * Value:
   * List length range: 3
   */
  rotation?: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  translation?: JsonNBTList<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }> | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  scale?: JsonNBTList<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }> | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
}

export type JsonModel = {
  parent?: (JsonRegistry['minecraft:model'] | ModelClass<ModelType>),
  ambientocclusion?: boolean,
  gui_light?: ('front' | 'side'),
  textures?: ({
    [Key in NonEmptyString]?: ((NonEmptyString | `#${string}` | TextureClass<TextureType>) | JsonTextureMaterial)
  }),
  elements?: Array<JsonModelElement>,
  display?: ({
    [Key in Extract<JsonCustomizableItemDisplayContext, string>]?: {
      /**
       * Value:
       * List length range: 3
       */
      rotation?: JsonNBTList<(NBTFloat | number), {
        leftExclusive: false,
        rightExclusive: false,
        min: 3,
        max: 3,
      }>,
      /**
       * Value:
       * List length range: 3
       */
      translation?: JsonNBTList<(NBTFloat<{
        leftExclusive: false,
        rightExclusive: false,
      }> | number), {
        leftExclusive: false,
        rightExclusive: false,
        min: 3,
        max: 3,
      }>,
      /**
       * Value:
       * List length range: 3
       */
      scale?: JsonNBTList<(NBTFloat<{
        leftExclusive: false,
        rightExclusive: false,
      }> | number), {
        leftExclusive: false,
        rightExclusive: false,
        min: 3,
        max: 3,
      }>,
    }
  }),
}

export type JsonModelDisplay = ({
  [Key in Extract<JsonCustomizableItemDisplayContext, string>]?: {
    /**
     * Value:
     * List length range: 3
     */
    rotation?: JsonNBTList<(NBTFloat | number), {
      leftExclusive: false,
      rightExclusive: false,
      min: 3,
      max: 3,
    }>,
    /**
     * Value:
     * List length range: 3
     */
    translation?: JsonNBTList<(NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
    }> | number), {
      leftExclusive: false,
      rightExclusive: false,
      min: 3,
      max: 3,
    }>,
    /**
     * Value:
     * List length range: 3
     */
    scale?: JsonNBTList<(NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
    }> | number), {
      leftExclusive: false,
      rightExclusive: false,
      min: 3,
      max: 3,
    }>,
  }
})

export type JsonModelElement = {
  /**
   * Value:
   * List length range: 3
   */
  from: JsonNBTList<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }> | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  to: JsonNBTList<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }> | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  faces: ({
    [Key in Extract<JsonDirection, string>]?: {
      texture: `#${string}`,
      /**
       * Value:
       * List length range: 4
       */
      uv?: JsonNBTList<(NBTFloat | number), {
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
      cullface?: JsonDirection,
      rotation?: (0 | 90 | 180 | 270),
      tintindex?: (NBTInt | number),
    }
  }),
  rotation?: JsonModelElementRotation,
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
  shade_direction_override?: JsonDirection,
  /**
   * Value:
   * Range: 0..15
   */
  light_emission?: (NBTInt<{
    min: 0,
    max: 15,
  }> | number),
}

export type JsonModelElementFace = {
  texture: `#${string}`,
  /**
   * Value:
   * List length range: 4
   */
  uv?: JsonNBTList<(NBTFloat | number), {
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
  cullface?: JsonDirection,
  rotation?: (0 | 90 | 180 | 270),
  tintindex?: (NBTInt | number),
}

export type JsonModelElementFaceMap = ({
  [Key in Extract<JsonDirection, string>]?: {
    texture: `#${string}`,
    /**
     * Value:
     * List length range: 4
     */
    uv?: JsonNBTList<(NBTFloat | number), {
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
    cullface?: JsonDirection,
    rotation?: (0 | 90 | 180 | 270),
    tintindex?: (NBTInt | number),
  }
})

export type JsonModelElementRotation = (JsonModelElementRotationBase & ({
  [Key in Extract<JsonAxis, string>]?: (NBTFloat | number)
}))

export type JsonModelElementRotationBase = {
  /**
   * Value:
   * List length range: 3
   */
  origin: JsonNBTList<(NBTFloat | number), {
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

export type JsonModelOverride = {
  predicate: ({
    [Key in Extract<JsonPredicates, string>]?: (NBTFloat | number)
  }),
  model: JsonModelRef,
}

export type JsonModelOverridePredicates = ({
  [Key in Extract<JsonPredicates, string>]?: (NBTFloat | number)
})

export type JsonModelRef = (JsonRegistry['minecraft:model'] | ModelClass<ModelType>)

export type JsonModelTextures = ({
  [Key in NonEmptyString]?: ((NonEmptyString | `#${string}` | TextureClass<TextureType>) | JsonTextureMaterial)
})

export type JsonMultipleAxesModelElementRotation = (JsonModelElementRotationBase & ({
  [Key in Extract<JsonAxis, string>]?: (NBTFloat | number)
}))

export type JsonPredicates = (
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

export type JsonSingleAxisModelElementRotation = (JsonModelElementRotationBase & {
  /**
   * Value:
   *
   *  - X(`x`)
   *  - Y(`y`)
   *  - Z(`z`)
   */
  axis: JsonAxis,
  angle: (NBTFloat | number),
})

export type JsonTextureMaterial = {
  sprite: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  /**
   * Whether the texture should be forced into the translucent render pass. \
   * Textures without any translucent pixels are not assigned to the translucent pass by default. \
   * Defaults to `false`.
   */
  force_translucent?: boolean,
}
