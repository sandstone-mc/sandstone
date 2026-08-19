import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { NamespacedString, NBTInt } from 'sandstone'

export type JsonPaintingVariant = {
  /**
   * Value:
   *
   * Value: A texture ID within a path root of `(namespace)/textures/painting/`
   */
  asset_id: NamespacedString,
  /**
   * Dimension in blocks.
   *
   * Value:
   * Range: 1..16
   */
  width: (NBTInt<{
    min: 1,
    max: 16,
  }> | number),
  /**
   * Dimension in blocks.
   *
   * Value:
   * Range: 1..16
   */
  height: (NBTInt<{
    min: 1,
    max: 16,
  }> | number),
  title?: JsonText,
  author?: JsonText,
}
