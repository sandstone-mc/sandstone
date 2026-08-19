import type { JsonVibrationListener } from 'sandstone/arguments/generated/_json/util/game_event.ts'
import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type JsonAngerManagement = {
  /**
   * Suspects that have angered the warden.
   */
  suspects?: Array<JsonSuspect>,
}

export type JsonSuspect = {
  /**
   * Level of anger that will decrease by 1 every second.
   *
   * Value:
   * Range: 1..150
   */
  anger?: (NBTInt<{
    min: 1,
  }> | number),
  /**
   * Value:
   * Array length range: 4
   */
  uuid?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
}

export type JsonWarden = (JsonMobBase & {
  /**
   * Anger management
   */
  anger?: JsonAngerManagement,
  /**
   * Vibration listener
   */
  listener?: JsonVibrationListener,
})
