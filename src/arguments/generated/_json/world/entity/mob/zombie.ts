import type {
  JsonOffers,
  JsonPlayerReputationPart,
  JsonVillagerData,
} from 'sandstone/arguments/generated/_json/world/entity/mob/breedable/villager.ts'
import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type JsonZombie = (JsonMobBase & {
  /**
   * Whether it is a baby.
   */
  IsBaby?: boolean,
  /**
   * Whether it can break doors.
   */
  CanBreakDoors?: boolean,
  /**
   * Ticks until it converts.
   */
  DrownedConversionTime?: (NBTInt | number),
  /**
   * Ticks it has been in the water.
   */
  InWaterTime?: (NBTInt | number),
})

export type JsonZombieVillager = (JsonZombie & {
  /**
   * Villager's skin data
   */
  VillagerData?: JsonVillagerData,
  VillagerDataFinalized?: boolean,
  /**
   * Villager's gossips
   */
  Gossips?: Array<JsonPlayerReputationPart>,
  /**
   * Villager's offers
   */
  Offers?: JsonOffers,
  /**
   * Ticks until the it is converted.
   */
  ConversionTime?: (NBTInt | number),
  /**
   * Player who triggered the conversion.
   *
   * Value:
   * Array length range: 4
   */
  ConversionPlayer?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
})
