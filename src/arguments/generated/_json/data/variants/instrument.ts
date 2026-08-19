import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { NBTFloat, NBTInt } from 'sandstone'

export type JsonInstrument = {
  sound_event: JsonSoundEventRef,
  /**
   * Maximum range in blocks that the sound can be heard
   *
   * Value:
   * Range: 0<..
   * Minimum is exclusive; must be higher than 0
   */
  range: (NBTFloat<{
    leftExclusive: true,
    min: 1,
  }> | number),
  /**
   * Duration of use in seconds, used as item cooldown
   *
   * Value:
   * Range: 0..
   */
  use_duration: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..
   */
  durability_damage?: (NBTInt<{
    min: 0,
  }> | number),
  description: JsonText,
}
