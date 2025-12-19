import type { Registry } from 'sandstone/generated/registry'
import type { BlockAttachedEntity } from 'sandstone/generated/world/entity'

export type Facing = (0 | 1 | 2 | 3)

export type Painting = (BlockAttachedEntity & {
    /**
     * Direction it is facing.
     *
     * Value:
     *
     *  - South(`0`)
     *  - West(`1`)
     *  - North(`2`)
     *  - East(`3`)
     */
    facing?: Facing
    /**
     * Type of painting.
     */
    variant?: Registry['minecraft:painting_variant']
})
