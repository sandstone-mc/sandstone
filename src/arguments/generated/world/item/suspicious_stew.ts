import type { EffectId } from 'sandstone/generated/util/effect'
import type { ItemBase } from 'sandstone/generated/world/item'
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
