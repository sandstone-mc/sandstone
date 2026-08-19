import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { JsonNeutralMob } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type JsonBee = (JsonBreedable & JsonNeutralMob & {
  /**
   * Value:
   * Array length range: 3
   */
  hive_pos?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Position of the flower the bee is circling
   *
   * Value:
   * Array length range: 3
   */
  flower_pos?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Whether the bee has nectar.
   */
  HasNectar?: boolean,
  /**
   * Whether the bee has stung an entity.
   */
  HasStung?: boolean,
  /**
   * Ticks since the bee has pollinated a crop.
   */
  TicksSincePollination?: (NBTInt | number),
  /**
   * Ticks until the bee can enter its hive.
   */
  CannotEnterHiveTicks?: (NBTInt | number),
  /**
   * Crops grown since the bee has gathered nectar.
   */
  CropsGrownSincePollination?: (NBTInt | number),
  /**
   * Ticks the bee will be angry for.
   */
  Anger?: (NBTInt | number),
  /**
   * Player that has attacked the bee.
   *
   * Value:
   * Array length range: 4
   */
  HurtBy?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
})

export type JsonFlowerPos = {
  X?: (NBTInt | number),
  Y?: (NBTInt | number),
  Z?: (NBTInt | number),
}

export type JsonHivePos = {
  X?: (NBTInt | number),
  Y?: (NBTInt | number),
  Z?: (NBTInt | number),
}
