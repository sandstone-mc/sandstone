import type { EffectId } from 'sandstone/arguments/generated/util/effect.ts'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTInt } from 'sandstone'

export type Effect = {
  EffectId?: EffectId
  /**
   * Duration in ticks.
   *
   * Value:
   * Range: 1..
   */
  EffectDuration?: NBTInt<{
    min: 1
  }>
}

export type SuspiciousStew = (ItemBase & {
  /**
   * Effects this stew will give.
   */
  Effects?: Array<Effect>
})
