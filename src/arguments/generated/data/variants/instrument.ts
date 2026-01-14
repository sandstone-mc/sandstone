import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { NBTFloat } from 'sandstone'

export type Instrument = {
  sound_event: SoundEventRef
  /**
     * Maximum range in blocks that the sound can be heard
     *
     * Value:
     * Range: 0<..
     * Minimum is exclusive; must be higher than 0
     */
  range: NBTFloat<{
    leftExclusive: true
    min: 1
  }>
  /**
     * Duration of use in seconds, used as item cooldown
     *
     * Value:
     * Range: 0<..
     * Minimum is exclusive; must be higher than 0
     */
  use_duration: NBTFloat<{
    leftExclusive: true
    min: 1
  }>
  description: Text
}
