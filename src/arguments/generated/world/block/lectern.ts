import type { BlockEntity } from 'sandstone/generated/world/block'
import type { ItemStack } from 'sandstone/generated/world/item'
import type { NBTInt } from 'sandstone'

export type Lectern = (BlockEntity & {
    Book?: ItemStack
    /**
     * Current page the book is on.
     */
    Page?: NBTInt
})
