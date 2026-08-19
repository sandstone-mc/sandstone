import type { JsonEffectId } from 'sandstone/arguments/generated/_json/util/effect.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTInt } from 'sandstone'

export type JsonEffect = {
  EffectId?: JsonEffectId,
  /**
   * Duration in ticks.
   *
   * Value:
   * Range: 1..
   */
  EffectDuration?: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonSuspiciousStew = (JsonItemBase & {
  /**
   * Effects this stew will give.
   */
  Effects?: Array<JsonEffect>,
})
