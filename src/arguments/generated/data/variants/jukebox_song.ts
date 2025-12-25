import type { SoundEventRef } from 'sandstone/arguments/generated/data/util'
import type { Text } from 'sandstone/arguments/generated/util/text'
import type { NBTFloat, NBTInt } from 'sandstone'

export type JukeboxSong = {
  /**
     * Displayed in the HUD actionbar & item tooltip.
     */
  description: Text
  /**
     * Value:
     * Range: 0..15
     */
  comparator_output: NBTInt<{
    min: 0
    max: 15
  }>
  /**
     * Value:
     * Range: 0<..
     * Minimum is exclusive; must be higher than 0
     */
  length_in_seconds: NBTFloat<{
    leftExclusive: true
    min: 1
  }>
  sound_event: SoundEventRef
}
