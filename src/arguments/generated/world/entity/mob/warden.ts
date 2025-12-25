import type { VibrationListener } from 'sandstone/arguments/generated/util/game_event'
import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type AngerManagement = {
  /**
     * Suspects that have angered the warden.
     */
  suspects?: Array<Suspect>
}

export type Suspect = {
  /**
     * Level of anger that will decrease by 1 every second.
     *
     * Value:
     * Range: 1..150
     */
  anger?: NBTInt<{
    min: 1
  }>
  /**
     * Value:
     * Array length range: 4
     */
  uuid?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
}

export type Warden = (MobBase & {
  /**
     * Anger management
     */
  anger?: AngerManagement
  /**
     * Vibration listener
     */
  listener?: VibrationListener
})
