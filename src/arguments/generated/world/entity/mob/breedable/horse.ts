import type { SlottedItem } from 'sandstone/arguments/generated/util/slot.ts'
import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'
import type { NBTByte, NBTInt, NBTIntArray, NBTList, NBTLong } from 'sandstone'

export type Camel = (HorseBase & {
  /**
   * Whether it is sitting.
   */
  IsSitting?: boolean
  /**
   * The tick when it started changing its pose.
   */
  LastPoseTick?: NBTLong
})

export type ChestedHorse = (HorseBase & {
  /**
   * Whether it has a chest.
   */
  ChestedHorse?: boolean
  /**
   * Slots from 0 to 14.
   *
   * Value:
   * List length range: 0..15
   */
  Items?: NBTList<(SlottedItem<NBTByte<{
    min: 0
    max: 14
  }>> | Record<string, never>), {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 15
  }>
})

export type Horse = (HorseBase & {
  /**
   * Variant of the horse. Stored as `baseColor | (markings << 8)`.
   *
   * Value:
   *
   *  - White(`0`)
   *  - Creamy(`1`)
   *  - Chestnut(`2`)
   *  - Brown(`3`)
   *  - Black(`4`)
   *  - Gray(`5`)
   *  - DarkBrown(`6`)
   *  - White_With_WhiteStockings(`256`)
   *  - Creamy_With_WhiteStockings(`257`)
   *  - Chestnut_With_WhiteStockings(`258`)
   *  - Brown_With_WhiteStockings(`259`)
   *  - Black_With_WhiteStockings(`260`)
   *  - Gray_With_WhiteStockings(`261`)
   *  - DarkBrown_With_WhiteStockings(`262`)
   *  - White_With_WhiteField(`512`)
   *  - Creamy_With_WhiteField(`513`)
   *  - Chestnut_With_WhiteField(`514`)
   *  - Brown_With_WhiteField(`515`)
   *  - Black_With_WhiteField(`516`)
   *  - Gray_With_WhiteField(`517`)
   *  - DarkBrown_With_WhiteField(`518`)
   *  - White_With_WhiteDots(`768`)
   *  - Creamy_With_WhiteDots(`769`)
   *  - Chestnut_With_WhiteDots(`770`)
   *  - Brown_With_WhiteDots(`771`)
   *  - Black_With_WhiteDots(`772`)
   *  - Gray_With_WhiteDots(`773`)
   *  - DarkBrown_With_WhiteDots(`774`)
   *  - White_With_Black_Dots(`1024`)
   *  - Creamy_With_Black_Dots(`1025`)
   *  - Chestnut_With_Black_Dots(`1026`)
   *  - Brown_With_Black_Dots(`1027`)
   *  - Black_With_Black_Dots(`1028`)
   *  - Gray_With_Black_Dots(`1029`)
   *  - DarkBrown_With_Black_Dots(`1030`)
   */
  Variant?: HorseVariantAndMarkings
})

export type HorseBase = (Breedable & {
  /**
   * Unknown use.
   * Remains `0` even if it was bred.
   */
  Bred?: boolean
  /**
   * Whether it is eating a haystack.
   */
  EatingHaystack?: boolean
  /**
   * Whether it has been tamed.
   */
  Tame?: boolean
  /**
   * Higher values make it easier to tame. Increases with feeding.
   *
   * Value:
   * Range: 0..100
   */
  Temper?: NBTInt<{
    min: 0
    max: 100
  }>
  /**
   * Player who tamed it.
   *
   * Value:
   * Array length range: 4
   */
  Owner?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
})

export type HorseVariantAndMarkings = (
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 256
  | 257
  | 258
  | 259
  | 260
  | 261
  | 262
  | 512
  | 513
  | 514
  | 515
  | 516
  | 517
  | 518
  | 768
  | 769
  | 770
  | 771
  | 772
  | 773
  | 774
  | 1024
  | 1025
  | 1026
  | 1027
  | 1028
  | 1029
  | 1030)

export type Llama = (ChestedHorse & {
  /**
   * Determines both the number of items it can carry and how likely it is for wolves to run away.
   *
   * Value:
   * Range: 1..5
   */
  Strength?: NBTInt<{
    min: 1
    max: 5
  }>
  /**
   * The variant of this llama.
   *
   * Value:
   *
   *  - Creamy(`0`)
   *  - White(`1`)
   *  - Brown(`2`)
   *  - Gray(`3`)
   */
  Variant?: LlamaVariantInt
})

export type LlamaVariantInt = (0 | 1 | 2 | 3)

export type SkeletonHorse = (HorseBase & {
  /**
   * Whether it was spawned by a trap.
   */
  SkeletonTrap?: boolean
  /**
   * Ticks it has existed.
   */
  SkeletonTrapTime?: NBTInt
})

export type TraderLlama = (Llama & {
  /**
   * When it will despawn.
   */
  DespawnDelay?: NBTInt
})
