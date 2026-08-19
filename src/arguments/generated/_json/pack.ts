import type { JsonInclusiveRange } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonNBTList, NBTInt, NonEmptyString } from 'sandstone'

export type JsonBlockPattern = {
  namespace?: NonEmptyString | RegExp,
  path?: NonEmptyString | RegExp,
}

export type JsonFeatureFlag = (
  | 'vanilla'
  | 'update_1_20'
  | 'bundle'
  | 'trade_rebalance'
  | 'update_1_21'
  | 'redstone_experiments'
  | 'minecart_improvements'
  | 'winter_drop')

export type JsonPack = {
  pack: {
    description: JsonText,
    /**
     * Optional since 1.21.9. Define it if you want older versions to recognize your pack with
     * a “made for a newer version” warning message.
     *
     * Because of backwards compatibility, only the main pack format can
     * be used here. Minor formats can only be specified in min and max format.
     */
    pack_format?: (NBTInt | number),
    /**
     * Must not be specified in case min_format indicates a format version for 1.21.9 and
     * later.
     */
    supported_formats?: JsonInclusiveRange<(NBTInt | number)>,
    /**
     * The minimun format that is supported. To specify a minor version, use a list of two
     * integers.
     */
    min_format?: JsonPackFormat,
    /**
     * The maximum format that is supported. To specify a minor version, use a list of two
     * integers.
     */
    max_format?: JsonPackFormat,
  },
  filter?: JsonPackFilter,
  features?: JsonPackFeatures,
  overlays?: JsonPackOverlays,
}

export type JsonPackBase = {
  description: JsonText,
  /**
   * Optional since 1.21.9. Define it if you want older versions to recognize your pack with
   * a “made for a newer version” warning message.
   *
   * Because of backwards compatibility, only the main pack format can
   * be used here. Minor formats can only be specified in min and max format.
   */
  pack_format?: (NBTInt | number),
  /**
   * Must not be specified in case min_format indicates a format version for 1.21.9 and
   * later.
   */
  supported_formats?: JsonInclusiveRange<(NBTInt | number)>,
  /**
   * The minimun format that is supported. To specify a minor version, use a list of two
   * integers.
   */
  min_format?: JsonPackFormat,
  /**
   * The maximum format that is supported. To specify a minor version, use a list of two
   * integers.
   */
  max_format?: JsonPackFormat,
}

export type JsonPackFeatures = {
  enabled: Array<(JsonFeatureFlag | `minecraft:${JsonFeatureFlag}`)>,
}

export type JsonPackFilter = {
  block: Array<JsonBlockPattern>,
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
export type JsonPackFormat = ((NBTInt | number) | JsonNBTList<(NBTInt | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 1,
  max: 1,
}> | [
  (NBTInt | number),
  (NBTInt<{
    min: 0,
  }> | number)
])

export type JsonPackOverlay = {
  /**
   * Value:
   * String length range: 1..
   */
  directory: NonEmptyString,
  formats?: JsonInclusiveRange<(NBTInt | number)>,
  min_format?: JsonPackFormat,
  max_format?: JsonPackFormat,
}

export type JsonPackOverlays = {
  entries: Array<JsonPackOverlay>,
}
