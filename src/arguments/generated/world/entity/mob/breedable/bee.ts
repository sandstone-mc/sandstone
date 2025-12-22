import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'
import type { NeutralMob } from 'sandstone/arguments/generated/world/entity/mob.js'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type Bee = (Breedable & NeutralMob & {
  /**
     * Value:
     * Array length range: 3
     */
  hive_pos?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Position of the flower the bee is circling
     *
     * Value:
     * Array length range: 3
     */
  flower_pos?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Whether the bee has nectar.
     */
  HasNectar?: boolean
  /**
     * Whether the bee has stung an entity.
     */
  HasStung?: boolean
  /**
     * Ticks since the bee has pollinated a crop.
     */
  TicksSincePollination?: NBTInt
  /**
     * Ticks until the bee can enter its hive.
     */
  CannotEnterHiveTicks?: NBTInt
  /**
     * Crops grown since the bee has gathered nectar.
     */
  CropsGrownSincePollination?: NBTInt
  /**
     * Ticks the bee will be angry for.
     */
  Anger?: NBTInt
  /**
     * Player that has attacked the bee.
     *
     * Value:
     * Array length range: 4
     */
  HurtBy?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
})

export type FlowerPos = {
  X?: NBTInt
  Y?: NBTInt
  Z?: NBTInt
}

export type HivePos = {
  X?: NBTInt
  Y?: NBTInt
  Z?: NBTInt
}
