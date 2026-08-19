import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTByte, NBTIntArray } from 'sandstone'

export type JsonExplosion = {
  /**
   * Whether the explosion should flicker.
   */
  Flicker?: boolean,
  /**
   * Whether the explosion should have a trail.
   */
  Trail?: boolean,
  /**
   * Value:
   *
   *  - SmallBall(`0`)
   *  - LargeBall(`1`)
   *  - Star(`2`)
   *  - Creeper(`3`)
   *  - Burst(`4`)
   */
  Type?: JsonExplosionType,
  /**
   * Colors of the explosion.
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  Colors?: NBTIntArray,
  /**
   * Colors of the explosion fade.
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  FadeColors?: NBTIntArray,
}

export type JsonExplosionType = (0 | 1 | 2 | 3 | 4)

export type JsonFireworkRocket = (JsonItemBase & {
  Fireworks?: JsonFireworks,
})

export type JsonFireworks = {
  /**
   * Duration of flight.
   */
  Flight?: (NBTByte | number),
  Explosions?: Array<JsonExplosion>,
}

export type JsonFireworkStar = (JsonItemBase & {
  Explosion?: JsonExplosion,
})
