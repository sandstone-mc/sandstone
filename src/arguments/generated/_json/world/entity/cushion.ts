import type { JsonDyeColor } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonBlockAttachedEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'

export type JsonCushion = (JsonBlockAttachedEntity & {
  /**
   * Value:
   *
   *  - White(`white`)
   *  - Orange(`orange`)
   *  - Magenta(`magenta`)
   *  - LightBlue(`light_blue`)
   *  - Yellow(`yellow`)
   *  - Lime(`lime`)
   *  - Pink(`pink`)
   *  - Gray(`gray`)
   *  - LightGray(`light_gray`)
   *  - Cyan(`cyan`)
   *  - Purple(`purple`)
   *  - Blue(`blue`)
   *  - Brown(`brown`)
   *  - Green(`green`)
   *  - Red(`red`)
   *  - Black(`black`)
   */
  color?: JsonDyeColor,
})
