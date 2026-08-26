import type { InclusiveRange } from 'sandstone/arguments/generated/util.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { NBTInt, NBTList, NonEmptyString } from 'sandstone'

export type BlockPattern = {
  namespace?: NonEmptyString | RegExp,
  path?: NonEmptyString | RegExp,
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
    description: Text,
    /**
     * Optional since 1.21.9. Define it if you want older versions to recognize your pack with
     * a “made for a newer version” warning message.
     *
     * Because of backwards compatibility, only the main pack format can
     * be used here. Minor formats can only be specified in min and max format.
     */
    pack_format?: NBTInt,
    /**
     * Must not be specified in case min_format indicates a format version for 1.21.9 and
     * later.
     */
    supported_formats?: InclusiveRange<NBTInt>,
    /**
     * The minimun format that is supported. To specify a minor version, use a list of two
     * integers.
     */
    min_format?: PackFormat,
    /**
     * The maximum format that is supported. To specify a minor version, use a list of two
     * integers.
     */
    max_format?: PackFormat,
  },
  filter?: PackFilter,
  features?: PackFeatures,
  overlays?: PackOverlays,
}

export type PackBase = {
  description: Text,
  /**
   * Optional since 1.21.9. Define it if you want older versions to recognize your pack with
   * a “made for a newer version” warning message.
   *
   * Because of backwards compatibility, only the main pack format can
   * be used here. Minor formats can only be specified in min and max format.
   */
  pack_format?: NBTInt,
  /**
   * Must not be specified in case min_format indicates a format version for 1.21.9 and
   * later.
   */
  supported_formats?: InclusiveRange<NBTInt>,
  /**
   * The minimun format that is supported. To specify a minor version, use a list of two
   * integers.
   */
  min_format?: PackFormat,
  /**
   * The maximum format that is supported. To specify a minor version, use a list of two
   * integers.
   */
  max_format?: PackFormat,
}

export type PackFeatures = {
  enabled: Array<(FeatureFlag | `minecraft:${FeatureFlag}`)>,
}

export type PackFilter = {
  block: Array<BlockPattern>,
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
  leftExclusive: false,
  rightExclusive: false,
  min: 1,
  max: 1,
}> | [
  NBTInt,
  NBTInt<{
    min: 0,
  }>,
])

export type PackOverlay = {
  /**
   * Value:
   * String length range: 1..
   */
  directory: NonEmptyString,
  formats?: InclusiveRange<NBTInt>,
  min_format?: PackFormat,
  max_format?: PackFormat,
}

export type PackOverlays = {
  entries: Array<PackOverlay>,
}
