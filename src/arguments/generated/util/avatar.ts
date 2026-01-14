import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NBTIntArray, NBTList } from 'sandstone'

export type HumanoidArm = ('left' | 'right')

export type PlayerModelPart = (
  | 'cape'
  | 'jacket'
  | 'left_sleeve'
  | 'right_sleeve'
  | 'left_pants_leg'
  | 'right_pants_leg'
  | 'hat')

export type PlayerModelType = ('wide' | 'slim')

export type Profile = ({
  /**
   * Username of a player profile.
   * If `id` doesn't exist, this field is used to fetch the current skin of the profile.
   */
  name?: string
  /**
   * UUID of the player profile.
   * If `name` doesn't exist, this field is used to fetch the current skin of the profile.
   *
   * Value:
   * Array length range: 4
   */
  id?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
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
  properties?: (NBTList<ProfileProperty, {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 16
  }> | ProfilePropertyMap)
  /**
   * Skin texture override.
   */
  texture?: Registry['minecraft:texture']
  /**
   * Cape texture override.
   */
  cape?: Registry['minecraft:texture']
  /**
   * Elytra texture override.
   * If this texture is not present either as override or in player profile, the cape texture is used.
   * If the cape texture is also not present, the default elytra texture is used.
   */
  elytra?: Registry['minecraft:texture']
  /**
   * Model type override.
   *
   * Value:
   *
   *  - Wide(`wide`)
   *  - Slim(`slim`)
   */
  model?: PlayerModelType
} | string)

export type ProfileProperty = {
  /**
   * Usually `textures`.
   */
  name: string
  /**
   * Base64 encoded JSON value of the texture index.
   */
  value: string
  /**
   * Verifies the hash of the resulting texture.
   */
  signature?: string
}

export type ProfilePropertyMap = ({
  [Key in `${any}${string}`]?: Array<string>;
})
