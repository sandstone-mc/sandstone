import type { ItemBase } from 'sandstone/generated/world/item'
import type { NBTByte, NBTIntArray } from 'sandstone'

export type Explosion = {
    /**
     * Whether the explosion should flicker.
     */
    Flicker?: boolean
    /**
     * Whether the explosion should have a trail.
     */
    Trail?: boolean
    /**
     * Value:
     *
     *  - SmallBall(`0`)
     *  - LargeBall(`1`)
     *  - Star(`2`)
     *  - Creeper(`3`)
     *  - Burst(`4`)
     */
    Type?: ExplosionType
    /**
     * Colors of the explosion.
     * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
     */
    Colors?: NBTIntArray
    /**
     * Colors of the explosion fade.
     * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
     */
    FadeColors?: NBTIntArray
}

export type ExplosionType = (0 | 1 | 2 | 3 | 4)

export type FireworkRocket = (ItemBase & {
    Fireworks?: Fireworks
})

export type Fireworks = {
    /**
     * Duration of flight.
     */
    Flight?: NBTByte
    Explosions?: Array<Explosion>
}

export type FireworkStar = (ItemBase & {
    Explosion?: Explosion
})
