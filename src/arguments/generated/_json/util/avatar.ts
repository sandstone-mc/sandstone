import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { TextureType } from 'sandstone/arguments'
import type { JsonNBTList, NBTIntArray, NonEmptyString, TextureClass } from 'sandstone'

export type JsonHumanoidArm = ('left' | 'right')

export type JsonPlayerModelPart = (
  | 'cape'
  | 'jacket'
  | 'left_sleeve'
  | 'right_sleeve'
  | 'left_pants_leg'
  | 'right_pants_leg'
  | 'hat')

export type JsonPlayerModelType = ('wide' | 'slim')

export type JsonProfile = ({
  /**
   * Username of a player profile.
   * If `id` doesn't exist, this field is used to fetch the current skin of the profile.
   */
  name?: string,
  /**
   * UUID of the player profile.
   * If `name` doesn't exist, this field is used to fetch the current skin of the profile.
   *
   * Value:
   * Array length range: 4
   */
  id?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * Resolved textures hosted on the minecraft CDN.
   *
   * Value:
   * *either*
   *
   * List length range: 0..16
   *
   * *or*
   *
   * *item 1*
   */
  properties?: (JsonNBTList<JsonProfileProperty, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 16,
  }> | JsonProfilePropertyMap),
  /**
   * Skin texture override.
   */
  texture?: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  /**
   * Cape texture override.
   */
  cape?: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  /**
   * Elytra texture override.
   * If this texture is not present either as override or in player profile, the cape texture is used.
   * If the cape texture is also not present, the default elytra texture is used.
   */
  elytra?: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  /**
   * Model type override.
   *
   * Value:
   *
   *  - Wide(`wide`)
   *  - Slim(`slim`)
   */
  model?: JsonPlayerModelType,
} | string)

export type JsonProfileProperty = {
  /**
   * Usually `textures`.
   */
  name: string,
  /**
   * Base64 encoded JSON value of the texture index.
   */
  value: string,
  /**
   * Verifies the hash of the resulting texture.
   */
  signature?: string,
}

export type JsonProfilePropertyMap = ({
  [Key in NonEmptyString]?: Array<string>
})
