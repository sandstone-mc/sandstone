import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTInt } from 'sandstone'

export type JsonLectern = (JsonBlockEntity & {
  Book?: JsonItemStack,
  /**
   * Current page the book is on.
   */
  Page?: (NBTInt | number),
})
