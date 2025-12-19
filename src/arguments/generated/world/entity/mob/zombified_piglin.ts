import type { MobBase, NeutralMob } from 'sandstone/arguments/generated/world/entity/mob.js'

export type ZombiePigman = (MobBase & NeutralMob & {
    /**
     * Whether it is a baby.
     */
    IsBaby?: boolean
    /**
     * Last player to hit a zombie pigman in this zombie pigman's detection range.
     */
    HurtBy?: `${any}${string}`
})
