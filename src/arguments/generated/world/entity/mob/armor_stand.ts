import type { EntityEquipment, LivingEntity } from 'sandstone/arguments/generated/world/entity/mob.js'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

export type ArmorStand = (LivingEntity & {
  /**
     * The equipment items of the armor stand.
     */
  equipment?: EntityEquipment
  /**
     * Whether it should be invisible.
     */
  Invisible?: boolean
  /**
     * Whether it has no hitbox.
     */
  Marker?: boolean
  /**
     * Whether it should have a no base plate.
     */
  NoBasePlate?: boolean
  /**
     * Whether it should show its arms.
     */
  ShowArms?: boolean
  /**
     * Whether it is small.
     */
  Small?: boolean
  /**
     * A bitfield of the slots that cannot be used.
     */
  DisabledSlots?: NBTInt
  /**
     * Body part rotations.
     */
  Pose?: Pose
})

export type DisabledSlots = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18)

export type Pose = {
  /**
     * Value:
     * List length range: 3
     */
  Body?: NBTList<NBTFloat, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Value:
     * List length range: 3
     */
  LeftArm?: NBTList<NBTFloat, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Value:
     * List length range: 3
     */
  RightArm?: NBTList<NBTFloat, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Value:
     * List length range: 3
     */
  LeftLeg?: NBTList<NBTFloat, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Value:
     * List length range: 3
     */
  RightLeg?: NBTList<NBTFloat, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Value:
     * List length range: 3
     */
  Head?: NBTList<NBTFloat, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
}
