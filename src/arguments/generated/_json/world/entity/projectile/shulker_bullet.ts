import type { JsonDirectionByte } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonProjectileBase } from 'sandstone/arguments/generated/_json/world/entity/projectile.ts'
import type { NBTDouble, NBTInt, NBTIntArray } from 'sandstone'

export type JsonBulletTarget = {
  /**
   * Value:
   * Array length range: 4
   */
  UUID?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * X block coordinate of the it.
   */
  X?: (NBTInt | number),
  /**
   * Y block coordinate of the it.
   */
  Y?: (NBTInt | number),
  /**
   * Z block coordinate of the it.
   */
  Z?: (NBTInt | number),
}

export type JsonShulkerBullet = (JsonProjectileBase & {
  /**
   * Steps it takes to reach the target
   */
  Steps?: (NBTInt | number),
  Target?: JsonBulletTarget,
  /**
   * Value:
   *
   *  - Down(`0`)
   *  - Up(`1`)
   *  - North(`2`)
   *  - South(`3`)
   *  - West(`4`)
   *  - East(`5`)
   */
  Dir?: JsonDirectionByte,
  /**
   * X offset to move based on the target's location.
   */
  TXD?: (NBTDouble | number),
  /**
   * Y offset to move based on the target's location.
   */
  TYD?: (NBTDouble | number),
  /**
   * Z offset to move based on the target's location.
   */
  TZD?: (NBTDouble | number),
})
