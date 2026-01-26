import type { Display, ItemBase } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTDouble, NBTFloat, NBTInt } from 'sandstone'

export type Decoration = {
  /**
   * Decoration type.
   *
   * Value:
   *
   *  - Player(`0`): White pentagon.
   *  - Frame(`1`): Green pentagon.
   *  - RedMarker(`2`): Red pentagon.
   *  - BlueMarker(`3`): Blue pentagon.
   *  - TargetX(`4`): White x.
   *  - TargetPoint(`5`): Red triangle.
   *  - PlayerOffMap(`6`): Large white dot.
   *  - PlayerOffLimits(`7`): Small white dot.
   *  - Mansion(`8`): Woodland mansion.
   *  - Monument(`9`): Ocean monument.
   *  - WhiteBanner(`10`)
   *  - OrangeBanner(`11`)
   *  - MagentaBanner(`12`)
   *  - LightBlueBanner(`13`)
   *  - YellowBanner(`14`)
   *  - LimeBanner(`15`)
   *  - PinkBanner(`16`)
   *  - GrayBanner(`17`)
   *  - LightGrayBanner(`18`)
   *  - CyanBanner(`19`)
   *  - PurpleBanner(`20`)
   *  - BlueBanner(`21`)
   *  - BrownBanner(`22`)
   *  - GreenBanner(`23`)
   *  - RedBanner(`24`)
   *  - BlackBanner(`25`)
   *  - RedX(`26`)
   */
  type: IconByteId,
  /**
   * World x position.
   */
  x: (NBTDouble | number),
  /**
   * World z position.
   */
  z: (NBTDouble | number),
  /**
   * Rotation of the decoration, measured in degrees clockwise.
   */
  rot: NBTFloat,
}

export type FilledMap = (ItemBase & {
  /**
   * Map number, representing the shared state holding map contents and markers.
   */
  map?: NBTInt,
  /**
   * Amount to increase the current map scale by when crafting.
   *
   * Value:
   * Range: 1..
   */
  map_scale_direction?: NBTInt<{
    min: 1,
  }>,
  /**
   * Whether the map should be locked after being taken out of the cartography table.
   */
  map_to_lock?: boolean,
  /**
   * Decorations on the map.
   */
  Decorations?: Array<(Decoration & {
    /**
     * An arbitrary unique string identifying the decoration.
     */
    id: string,
  })>,
  /**
   * Display for the item.
   */
  display?: (Display & {
    /**
     * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
     */
    MapColor?: NBTInt,
  }),
})

export type IconByteId = (
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26)
