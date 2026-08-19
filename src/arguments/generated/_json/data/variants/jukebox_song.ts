import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { NBTFloat, NBTInt } from 'sandstone'

export type JsonJukeboxSong = {
  /**
   * Displayed in the HUD actionbar & item tooltip.
   */
  description: JsonText,
  /**
   * Value:
   * Range: 0..15
   */
  comparator_output: (NBTInt<{
    min: 0,
    max: 15,
  }> | number),
  /**
   * Value:
   * Range: 0<..
   * Minimum is exclusive; must be higher than 0
   */
  length_in_seconds: (NBTFloat<{
    leftExclusive: true,
    min: 1,
  }> | number),
  sound_event: JsonSoundEventRef,
}
