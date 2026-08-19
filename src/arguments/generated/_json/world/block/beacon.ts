import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockEntity, JsonLockable, JsonNameable } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { NBTInt } from 'sandstone'

export type JsonBeacon = (JsonBlockEntity & JsonNameable & JsonLockable & {
  /**
   * Number of levels from the pyramid.
   */
  Levels?: (NBTInt | number),
  primary_effect?: JsonRegistry['minecraft:mob_effect'],
  secondary_effect?: JsonRegistry['minecraft:mob_effect'],
})

export type JsonNoneId = -1
