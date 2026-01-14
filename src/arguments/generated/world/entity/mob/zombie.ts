import type {
  Offers,
  PlayerReputationPart,
  VillagerData,
} from 'sandstone/arguments/generated/world/entity/mob/breedable/villager.ts'
import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type Zombie = (MobBase & {
  /**
   * Whether it is a baby.
   */
  IsBaby?: boolean
  /**
   * Whether it can break doors.
   */
  CanBreakDoors?: boolean
  /**
   * Ticks until it converts.
   */
  DrownedConversionTime?: NBTInt
  /**
   * Ticks it has been in the water.
   */
  InWaterTime?: NBTInt
})

export type ZombieVillager = (Zombie & {
  /**
   * Villager's skin data
   */
  VillagerData?: VillagerData
  /**
   * Villager's gossips
   */
  Gossips?: Array<PlayerReputationPart>
  /**
   * Villager's offers
   */
  Offers?: Offers
  /**
   * Ticks until the it is converted.
   */
  ConversionTime?: NBTInt
  /**
   * Player who triggered the conversion.
   *
   * Value:
   * Array length range: 4
   */
  ConversionPlayer?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
})
