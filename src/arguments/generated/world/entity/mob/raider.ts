import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.js'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.js'
import type { NBTInt, NBTIntArray, NBTList } from 'sandstone'

export type PatrolTarget = {
    X?: NBTInt
    Y?: NBTInt
    Z?: NBTInt
}

export type Pillager = (RaiderBase & {
    /**
     * Value:
     * List length range: 0..5
     */
    Inventory?: NBTList<ItemStack, {
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 5
    }>
})

export type RaiderBase = (MobBase & {
    /**
     * Whether the raider is patrolling.
     */
    Patrolling?: boolean
    /**
     * Whether the raider is leading the patrol.
     */
    PatrolLeader?: boolean
    /**
     * Where the raider is heading towards.
     *
     * Value:
     * Array length range: 3
     */
    patrol_target?: NBTIntArray<{
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
    /**
     * Whether the raider can join raids and count towards the progress bar.
     */
    CanJoinRaid?: boolean
    /**
     * Id of the raid that the raider is in.
     */
    RaidId?: NBTInt
    /**
     * Wave that the raider is in.
     *
     * Value:
     * Range: 0..8
     */
    Wave?: NBTInt<{
        min: 0
        max: 8
    }>
})

export type Ravager = (RaiderBase & {
    /**
     * Ticks until it can attack.
     */
    AttackTick?: NBTInt
    /**
     * Ticks until it can roar.
     */
    RoarTick?: NBTInt
    /**
     * Ticks it is stunned for.
     */
    StunTick?: NBTInt
})

export type Spellcaster = (RaiderBase & {
    /**
     * Ticks until the raider can cast its spell.
     */
    SpellTicks?: NBTInt
})

export type Vindicator = (RaiderBase & {
    /**
     * Whether it should try to attack most other mobs.
     */
    Johnny?: boolean
})
