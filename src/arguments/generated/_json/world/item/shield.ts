import type { JsonDyeColorInt } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonBannerPatternLayer } from 'sandstone/arguments/generated/_json/world/block/banner.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'

export type JsonBlockEntityTag = {
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
  Base?: JsonDyeColorInt,
  Patterns?: Array<JsonBannerPatternLayer>,
}

export type JsonShield = (JsonItemBase & {
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
    Base?: JsonDyeColorInt,
    Patterns?: Array<JsonBannerPatternLayer>,
  },
})
