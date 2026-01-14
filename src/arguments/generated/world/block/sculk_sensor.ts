import type { VibrationListener } from 'sandstone/arguments/generated/util/game_event.ts'
import type { NBTInt } from 'sandstone'

export type SculkSensor = {
  /**
   * Value:
   * Range: 1..15
   */
  last_vibration_frequency?: NBTInt<{
    min: 1
    max: 15
  }>
  /**
   * Vibration listener
   */
  listener?: VibrationListener
}
