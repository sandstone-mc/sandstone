import type { BlockState } from 'sandstone/generated/util/block_state'
import type { EntityBase } from 'sandstone/generated/world/entity'
import type { NBTFloat, NBTIntArray, NBTShort } from 'sandstone'

export type Tnt = (EntityBase & {
    /**
     * Ticks until it explodes.
     */
    fuse?: NBTShort
    /**
     * Defaults to tnt.
     */
    block_state?: BlockState
    /**
     * Value:
     * Range: 0..128
     */
    explosion_power?: NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
    }>
    /**
     * The entity that primed this TNT.
     *
     * Value:
     * Array length range: 4
     */
    owner?: NBTIntArray<{
        leftExclusive: false
        rightExclusive: false
        min: 4
        max: 4
    }>
})
