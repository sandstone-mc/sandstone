import type { Text } from 'sandstone/arguments/generated/util/text.js'
import type { NBTInt } from 'sandstone'

export type PaintingVariant = {
    /**
     * Value:
     *
     * Value: A minecraft:texture ID within a path root of `(namespace)/textures/painting/`
     */
    asset_id: `${string}:${string}`
    /**
     * Dimension in blocks.
     *
     * Value:
     * Range: 1..16
     */
    width: NBTInt<{
        min: 1
        max: 16
    }>
    /**
     * Dimension in blocks.
     *
     * Value:
     * Range: 1..16
     */
    height: NBTInt<{
        min: 1
        max: 16
    }>
    title: Text
    author: Text
}
