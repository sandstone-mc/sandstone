import type { JsonVibrationListener } from 'sandstone/arguments/generated/_json/util/game_event.ts'
import type { NBTInt } from 'sandstone'

export type JsonSculkSensor = {
  /**
   * Value:
   * Range: 1..15
   */
  last_vibration_frequency?: (NBTInt<{
    min: 1,
    max: 15,
  }> | number),
  /**
   * Vibration listener
   */
  listener?: JsonVibrationListener,
}
