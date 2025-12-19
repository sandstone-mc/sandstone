import type { DyeColorByte } from 'sandstone/generated/util/color'
import type { Breedable } from 'sandstone/generated/world/entity/mob/breedable'

export type Sheep = (Breedable & {
    /**
     * Whether it has been shorn.
     */
    Sheared?: boolean
    /**
     * Value:
     *
     *  - White(`0`)
     *  - Orange(`1`)
     *  - Magenta(`2`)
     *  - LightBlue(`3`)
     *  - Yellow(`4`)
     *  - Lime(`5`)
     *  - Pink(`6`)
     *  - Gray(`7`)
     *  - LightGray(`8`)
     *  - Cyan(`9`)
     *  - Purple(`10`)
     *  - Blue(`11`)
     *  - Brown(`12`)
     *  - Green(`13`)
     *  - Red(`14`)
     *  - Black(`15`)
     */
    Color?: DyeColorByte
})
