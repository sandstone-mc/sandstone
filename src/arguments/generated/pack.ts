import type { InclusiveRange } from 'sandstone/arguments/generated/util.js'
import type { Text } from 'sandstone/arguments/generated/util/text.js'
import type { NBTInt, NBTList } from 'sandstone'

export type BlockPattern = {
  namespace?: `${any}${string}` | RegExp
  path?: `${any}${string}` | RegExp
}

export type FeatureFlag = (
  | 'vanilla'
  | 'update_1_20'
  | 'bundle'
  | 'trade_rebalance'
  | 'update_1_21'
  | 'redstone_experiments'
  | 'minecart_improvements'
  | 'winter_drop')

export type Pack = {
  pack: {
    description: Text
    pack_format?: NBTInt
    supported_formats?: InclusiveRange<NBTInt>
    min_format?: PackFormat
    max_format?: PackFormat
  }
  filter?: PackFilter
  features?: PackFeatures
  overlays?: PackOverlays
}

export type PackFeatures = {
  enabled: Array<(FeatureFlag | `minecraft:${FeatureFlag}`)>
}

export type PackFilter = {
  block: Array<BlockPattern>
}

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 1
 *
 * *or*
 *
 * *item 0*
 */
export type PackFormat = (NBTInt | NBTList<NBTInt, {
  leftExclusive: false
  rightExclusive: false
  min: 1
  max: 1
}> | [
  NBTInt,
  NBTInt<{
    min: 0
  }>,
])

export type PackOverlay = {
  /**
     * Value:
     * String length range: 1..
     */
  directory: `${any}${string}`
  formats?: InclusiveRange<NBTInt>
  min_format?: PackFormat
  max_format?: PackFormat
}

export type PackOverlays = {
  entries: Array<PackOverlay>
}
