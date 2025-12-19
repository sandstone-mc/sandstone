import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.js'

export type DragonPhase = (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)

export type EnderDragon = (MobBase & {
    /**
     * Fighting phase it is in.
     *
     * Value:
     *
     *  - Circling(`0`)
     *  - Strafing(`1`)
     *  - FlyingToPortal(`2`)
     *  - Landing(`3`)
     *  - TakingOff(`4`)
     *  - BreathAttack(`5`)
     *  - Landed(`6`)
     *  - Roar(`7`)
     *  - Charging(`8`)
     *  - Dying(`9`)
     *  - Hovering(`10`)
     */
    DragonPhase?: DragonPhase
})
