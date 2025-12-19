import type { AgeableMob, MobBase } from 'sandstone/generated/world/entity/mob'
import type { NBTInt } from 'sandstone'

export type GlowSquid = (MobBase & AgeableMob & {
    /**
     * Ticks that it will wait before glowing.
     */
    DarkTicksRemaining?: NBTInt
})
