import type { DirectionByte } from 'sandstone/arguments/generated/util/direction'
import type { ProjectileBase } from 'sandstone/arguments/generated/world/entity/projectile'
import type { NBTDouble, NBTInt, NBTIntArray } from 'sandstone'

export type BulletTarget = {
  /**
     * Value:
     * Array length range: 4
     */
  UUID?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
  /**
     * X block coordinate of the it.
     */
  X?: NBTInt
  /**
     * Y block coordinate of the it.
     */
  Y?: NBTInt
  /**
     * Z block coordinate of the it.
     */
  Z?: NBTInt
}

export type ShulkerBullet = (ProjectileBase & {
  /**
     * Steps it takes to reach the target
     */
  Steps?: NBTInt
  Target?: BulletTarget
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
  Dir?: DirectionByte
  /**
     * X offset to move based on the target's location.
     */
  TXD?: (NBTDouble | number)
  /**
     * Y offset to move based on the target's location.
     */
  TYD?: (NBTDouble | number)
  /**
     * Z offset to move based on the target's location.
     */
  TZD?: (NBTDouble | number)
})
