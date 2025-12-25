import type { BlockAttachedEntity } from 'sandstone/arguments/generated/world/entity'
import type { ItemStack } from 'sandstone/arguments/generated/world/item'
import type { NBTByte, NBTFloat } from 'sandstone'

export type Facing = (0 | 1 | 2 | 3 | 4 | 5)

export type ItemFrame = (BlockAttachedEntity & {
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
  Facing?: Facing
  Item?: ItemStack
  /**
     * Chance the item has to drop.
     */
  ItemDropChance?: NBTFloat
  /**
     * Rotation of the item.
     *
     * Value:
     * Range: 0..7
     */
  ItemRotation?: NBTByte<{
    min: 0
    max: 7
  }>
  /**
     * Whether the item frame should be invisible.
     * The item inside the frame is not effected.
     */
  Invisible?: boolean
  /**
     * Whether the item frame should not be able to be broken and should disallow the item to be moved.
     */
  Fixed?: boolean
})
