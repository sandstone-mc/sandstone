import type { DyeColorInt } from 'sandstone/arguments/generated/util/color.js'
import type { BannerPatternLayer } from 'sandstone/arguments/generated/world/block/banner.js'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.js'

export type Shield = (ItemBase & {
    /**
     * Banner Data.
     */
    BlockEntityTag?: {
        /**
         * Base color.
         *
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
        Base?: DyeColorInt
        Patterns?: Array<BannerPatternLayer>
    }
})
