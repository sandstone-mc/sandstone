import type { JsonDirectionByte } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonBlockAttachedEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTByte, NBTFloat } from 'sandstone'

export type JsonItemFrame = (JsonBlockAttachedEntity & {
  /**
   * Direction it is facing.
   *
   * Value:
   *
   *  - Down(`0`)
   *  - Up(`1`)
   *  - North(`2`)
   *  - South(`3`)
   *  - West(`4`)
   *  - East(`5`)
   */
  Facing?: JsonDirectionByte,
  Item?: JsonItemStack,
  /**
   * Chance the item has to drop.
   */
  ItemDropChance?: (NBTFloat | number),
  /**
   * Rotation of the item.
   *
   * Value:
   * Range: 0..7
   */
  ItemRotation?: (NBTByte<{
    min: 0,
    max: 7,
  }> | number),
  /**
   * Whether the item frame should be invisible.
   * The item inside the frame is not effected.
   */
  Invisible?: boolean,
  /**
   * Whether the item frame should not be able to be broken and should disallow the item to be moved.
   */
  Fixed?: boolean,
})
