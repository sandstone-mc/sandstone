import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockAttachedEntity } from 'sandstone/arguments/generated/world/entity.ts'

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
