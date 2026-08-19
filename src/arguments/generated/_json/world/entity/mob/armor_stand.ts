import type { JsonEntityEquipment, JsonLivingEntity } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { JsonNBTList, NBTFloat, NBTInt } from 'sandstone'

export type JsonArmorStand = (JsonLivingEntity & {
  /**
   * The equipment items of the armor stand.
   */
  equipment?: JsonEntityEquipment,
  /**
   * Whether it should be invisible.
   */
  Invisible?: boolean,
  /**
   * Whether it has no hitbox.
   */
  Marker?: boolean,
  /**
   * Whether it should have a no base plate.
   */
  NoBasePlate?: boolean,
  /**
   * Whether it should show its arms.
   */
  ShowArms?: boolean,
  /**
   * Whether it is small.
   */
  Small?: boolean,
  /**
   * A bitfield of the slots that cannot be used.
   */
  DisabledSlots?: (NBTInt | number),
  /**
   * Body part rotations.
   */
  Pose?: JsonPose,
})

export type JsonDisabledSlots = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18)

export type JsonPose = {
  /**
   * Value:
   * List length range: 3
   */
  Body?: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  LeftArm?: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  RightArm?: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  LeftLeg?: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  RightLeg?: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * List length range: 3
   */
  Head?: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
}
