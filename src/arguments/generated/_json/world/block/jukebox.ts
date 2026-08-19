import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTLong } from 'sandstone'

export type JsonJukebox = (JsonBlockEntity & {
  RecordItem?: JsonItemStack,
  ticks_since_song_started?: (NBTLong | number),
})
