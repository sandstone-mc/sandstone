import type { Direction } from 'sandstone/generated/util/direction'
import type { BlockEntity } from 'sandstone/generated/world/block'
import type { NBTInt, NBTList } from 'sandstone'

export type ChargeCursor = {
    /**
     * Value:
     * List length range: 3
     */
    pos: NBTList<NBTInt, {
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
    /**
     * Value:
     * Range: 0..1000
     */
    charge?: NBTInt<{
        min: 0
    }>
    /**
     * Value:
     * Range: 0..1
     */
    decay_delay?: NBTInt<{
        min: 0
        max: 1
    }>
    /**
     * Value:
     * Range: 0..
     */
    update_delay?: NBTInt<{
        min: 0
    }>
    facings?: Array<Direction>
}

export type SculkCatalyst = (BlockEntity & {
    cursors?: Array<ChargeCursor>
})
