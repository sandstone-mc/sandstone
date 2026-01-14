import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTInt } from 'sandstone'

export type Lectern = (BlockEntity & {
  Book?: ItemStack
  /**
     * Current page the book is on.
     */
  Page?: NBTInt
})
