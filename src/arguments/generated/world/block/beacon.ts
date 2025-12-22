import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { BlockEntity, Lockable, Nameable } from 'sandstone/arguments/generated/world/block.js'
import type { NBTInt } from 'sandstone'

export type Beacon = (BlockEntity & Nameable & Lockable & {
  /**
     * Number of levels from the pyramid.
     */
  Levels?: NBTInt
  primary_effect?: Registry['minecraft:mob_effect']
  secondary_effect?: Registry['minecraft:mob_effect']
})

export type NoneId = -1
