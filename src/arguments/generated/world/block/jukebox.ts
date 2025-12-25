import type { BlockEntity } from 'sandstone/arguments/generated/world/block'
import type { ItemStack } from 'sandstone/arguments/generated/world/item'
import type { NBTLong } from 'sandstone'

export type Jukebox = (BlockEntity & {
  RecordItem?: ItemStack
  ticks_since_song_started?: NBTLong
})
