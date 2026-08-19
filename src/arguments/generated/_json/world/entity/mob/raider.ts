import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { JsonNBTList, NBTInt, NBTIntArray } from 'sandstone'

export type JsonPatrolTarget = {
  X?: (NBTInt | number),
  Y?: (NBTInt | number),
  Z?: (NBTInt | number),
}

export type JsonPillager = (JsonRaiderBase & {
  /**
   * Value:
   * List length range: 0..5
   */
  Inventory?: JsonNBTList<JsonItemStack, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 5,
  }>,
})

export type JsonRaiderBase = (JsonMobBase & {
  /**
   * Whether the raider is patrolling.
   */
  Patrolling?: boolean,
  /**
   * Whether the raider is leading the patrol.
   */
  PatrolLeader?: boolean,
  /**
   * Where the raider is heading towards.
   *
   * Value:
   * Array length range: 3
   */
  patrol_target?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Whether the raider can join raids and count towards the progress bar.
   */
  CanJoinRaid?: boolean,
  /**
   * Id of the raid that the raider is in.
   */
  RaidId?: (NBTInt | number),
  /**
   * Wave that the raider is in.
   *
   * Value:
   * Range: 0..8
   */
  Wave?: (NBTInt<{
    min: 0,
    max: 8,
  }> | number),
})

export type JsonRavager = (JsonRaiderBase & {
  /**
   * Ticks until it can attack.
   */
  AttackTick?: (NBTInt | number),
  /**
   * Ticks until it can roar.
   */
  RoarTick?: (NBTInt | number),
  /**
   * Ticks it is stunned for.
   */
  StunTick?: (NBTInt | number),
})

export type JsonSpellcaster = (JsonRaiderBase & {
  /**
   * Ticks until the raider can cast its spell.
   */
  SpellTicks?: (NBTInt | number),
})

export type JsonVindicator = (JsonRaiderBase & {
  /**
   * Whether it should try to attack most other mobs.
   */
  Johnny?: boolean,
})
