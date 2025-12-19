import type { BlockEntity } from 'sandstone/generated/world/block'
import type { ItemStack } from 'sandstone/generated/world/item'
import type { NBTLong } from 'sandstone'

export type Jukebox = (BlockEntity & {
    RecordItem?: ItemStack
    ticks_since_song_started?: NBTLong
})
