import type { BlockEntity } from 'sandstone/arguments/generated/world/block.js'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.js'
import type { NBTInt } from 'sandstone'

export type Lectern = (BlockEntity & {
    Book?: ItemStack
    /**
     * Current page the book is on.
     */
    Page?: NBTInt
})
