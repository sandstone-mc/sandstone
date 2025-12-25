import type { Registry } from 'sandstone/arguments/generated/registry'
import type { AttributeOperation } from 'sandstone/arguments/generated/util/attribute'
import type { RGB } from 'sandstone/arguments/generated/util/color'
import type { MobEffectInstance } from 'sandstone/arguments/generated/util/effect'
import type { Memories } from 'sandstone/arguments/generated/util/memory'
import type { EquipmentSlot } from 'sandstone/arguments/generated/util/slot'
import type { EntityBase } from 'sandstone/arguments/generated/world/entity'
import type { ItemStack } from 'sandstone/arguments/generated/world/item'
import type { NBTDouble, NBTFloat, NBTInt, NBTIntArray, NBTLong, NBTShort } from 'sandstone'

export type AgeableMob = {
  /**
     * The age of the mob in ticks. When negative, the mob is a baby. When 0 or above, the mob is an adult.
     * If this mob is breedable, when 0 or above, represents the number of ticks before it can breed again.
     */
  Age?: NBTInt
  /**
     * A value of age assigned to this mob when it grows up.
     * Incremented when a baby mob is fed.
     */
  ForcedAge?: NBTInt
}

export type Attribute = {
  id?: Registry['minecraft:attribute']
  base?: (NBTDouble | number)
  modifiers?: Array<AttributeModifier>
}

export type AttributeModifier = {
  id?: `${string}:${string}`
  amount?: (NBTDouble | number)
  /**
     * Value:
     *
     *  - AddValue(`add_value`): Adds all of the modifiers' amounts to the current value of the attribute.
     *  - AddMultipliedBase(`add_multiplied_base`):
     *    Multiplies the current value of the attribute by `(1 + x)`,
     *    where `x` is the sum of the modifiers' amounts.
     *  - AddMultipliedTotal(`add_multiplied_total`):
     *    For every modifier, multiplies the current value of the attribute by `(1 + x)`,
     *    where `x` is the amount of the particular modifier.
     */
  operation?: AttributeOperation
}

export type BlockLeash = {
  /**
     * X coordiante of leash knot.
     */
  X?: NBTInt
  /**
     * Y coordiante of leash knot.
     */
  Y?: NBTInt
  /**
     * Z coordiante of leash knot.
     */
  Z?: NBTInt
}

export type DropChances = ({
  [Key in Extract<EquipmentSlot, string>]?: NBTFloat<{
    leftExclusive: false
    min: 0
  }>;
})

export type EntityEquipment = ({
  [Key in Extract<EquipmentSlot, string>]?: ItemStack;
})

export type LivingEntity = (EntityBase & {
  Health?: NBTFloat
  /**
     * How much absorption health it has.
     */
  AbsorptionAmount?: NBTFloat
  /**
     * Timer since it has been damaged. Counts down to zero.
     */
  HurtTime?: NBTShort
  /**
     * Ticks since it was last damaged, from its creation.
     */
  HurtByTimestamp?: NBTInt
  /**
     * Timer since it was marked as dead. Counts down to zero.
     */
  DeathTime?: NBTShort
  /**
     * Whether it will glide when it falls.
     */
  FallFlying?: boolean
  /**
     * Value:
     * Array length range: 3
     */
  sleeping_pos?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  Brain?: {
    memories?: Memories
  }
  attributes?: Array<Attribute>
  active_effects?: Array<MobEffectInstance>
  /**
     * Team to join when it is spawned.
     */
  Team?: `${any}${string}`
  /**
     * The UUID of the player that last hurt this entity. Stored for 100 ticks.
     *
     * Value:
     * Array length range: 4
     */
  last_hurt_by_player?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
  /**
     * Amount of ticks that this entity will remember the player that last hurt this entity.
     * Counts down from 100 to 0.
     *
     * Value:
     * Range: 0..100
     */
  last_hurt_by_player_memory_time?: NBTInt<{
    min: 0
    max: 100
  }>
  /**
     * The UUID of the mob that last hurt this entity. Stored for 100 ticks.
     *
     * Value:
     * Array length range: 4
     */
  last_hurt_by_mob?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
  /**
     * Amount of ticks since this entity was last hurt by a mob.
     * Counts up from 0 to 100.
     *
     * Value:
     * Range: 0..100
     */
  ticks_since_last_hurt_by_mob?: NBTInt<{
    min: 0
    max: 100
  }>
  locator_bar_icon?: WaypointIcon
})

export type MobBase = (LivingEntity & {
  /**
     * The equipment items of the mob, such as armor or weapons.
     */
  equipment?: EntityEquipment
  /**
     * Chances of the mob dropping an equipment slot on death.
     */
  drop_chances?: DropChances
} & {
  /**
     * Loot table that is dropped when the mob dies.
     */
  DeathLootTable?: (Registry['minecraft:loot_table'] | '')
  /**
     * Seed for generating the death loot table.
     */
  DeathLootTableSeed?: NBTLong
  /**
     * Whether it can pick up loot.
     */
  CanPickUpLoot?: boolean
  /**
     * Whether it should not despawn naturally.
     */
  PersistenceRequired?: boolean
  /**
     * Whether it is left handed.
     */
  LeftHanded?: boolean
  /**
     * Whether it should have an AI.
     */
  NoAI?: boolean
  /**
     * What the leash is attached to.
     *
     * Value:
     * *either*
     *
     * Array length range: 3
     *
     * *or*
     *
     * *item 1*
     */
  leash?: (NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }> | {
    /**
         * Value:
         * Array length range: 4
         */
    UUID?: NBTIntArray<{
      leftExclusive: false
      rightExclusive: false
      min: 4
      max: 4
    }>
  })
  /**
     * Defaults to -1, which represents "no home".
     */
  home_radius?: NBTInt
  /**
     * This field will be discarded if `home_radius` is less than 0.
     *
     * Value:
     * Array length range: 3
     */
  home_pos?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
})

export type NeutralMob = {
  /**
     * The time anger ends.
     */
  anger_end_time?: NBTLong
  /**
     * Value:
     * Array length range: 4
     */
  angry_at?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
}

export type Squid = (MobBase & AgeableMob)

export type UUIDLeash = {
  /**
     * Upper bits of the other entity's UUID.
     */
  UUIDMost?: NBTLong
  /**
     * Lower bits of the other entity's UUID.
     */
  UUIDLeast?: NBTLong
}

export type WaypointIcon = {
  style: `${string}:${string}`
  color?: RGB
}
