import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonAttributeOperation } from 'sandstone/arguments/generated/_json/util/attribute.ts'
import type { JSONRGB } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonMobEffectInstance } from 'sandstone/arguments/generated/_json/util/effect.ts'
import type { JsonMemories } from 'sandstone/arguments/generated/_json/util/memory.ts'
import type { JsonEquipmentSlot } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type {
  JsonNBTList,
  LootTableClass,
  NamespacedString,
  NBTDouble,
  NBTFloat,
  NBTInt,
  NBTIntArray,
  NBTLong,
  NBTShort,
  WaypointStyleClass,
} from 'sandstone'

export type JsonAgeableMob = {
  /**
   * The age of the mob in ticks. When negative, the mob is a baby. When 0 or above, the mob is an adult.
   * If this mob is breedable, when 0 or above, represents the number of ticks before it can breed again.
   */
  Age?: (NBTInt | number),
  /**
   * A value of age assigned to this mob when it grows up.
   * Incremented when a baby mob is fed.
   */
  ForcedAge?: (NBTInt | number),
  AgeLocked?: boolean,
}

export type JsonAttribute = {
  id?: JsonRegistry['minecraft:attribute'],
  base?: (NBTDouble | number),
  modifiers?: Array<JsonAttributeModifier>,
}

export type JsonAttributeModifier = {
  /**
   * The unique identifier of this attribute modifier.
   */
  id: NamespacedString,
  /**
   * Change in the attribute.
   */
  amount: (NBTDouble | number),
  /**
   * The operation used for this modifier.
   *
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
  operation: JsonAttributeOperation,
}

export type JsonBlockLeash = {
  /**
   * X coordiante of leash knot.
   */
  X?: (NBTInt | number),
  /**
   * Y coordiante of leash knot.
   */
  Y?: (NBTInt | number),
  /**
   * Z coordiante of leash knot.
   */
  Z?: (NBTInt | number),
}

export type JsonBrain = {
  memories?: JsonMemories,
}

export type JsonDropChances = ({
  [Key in Extract<JsonEquipmentSlot, string>]?: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number)
})

export type JsonEntityEquipment = ({
  [Key in Extract<JsonEquipmentSlot, string>]?: JsonItemStack
})

export type JsonFallDamageLogicData = ({
  /**
   * Added mid-air after being hit by an explosion.
   *
   * Value:
   * List length range: 3
   */
  current_explosion_impact_pos?: JsonNBTList<(NBTDouble | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
} & {
  /**
   * Used by fall damage logic. Decreases by 1 every tick.
   *
   * Value:
   * Range: 0..
   */
  current_impulse_context_reset_grace_time?: (NBTInt<{
    min: 0,
  }> | number),
})

export type JsonLeashOwner = {
  /**
   * Value:
   * Array length range: 4
   */
  UUID?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
}

export type JsonLivingEntity = (JsonEntityBase & {
  Health?: (NBTFloat | number),
  /**
   * How much absorption health it has.
   */
  AbsorptionAmount?: (NBTFloat | number),
  /**
   * Timer since it has been damaged. Counts down to zero.
   */
  HurtTime?: (NBTShort | number),
  /**
   * Timer since it was marked as dead. Counts down to zero.
   */
  DeathTime?: (NBTShort | number),
  /**
   * Whether it will glide when it falls.
   */
  FallFlying?: boolean,
  /**
   * Value:
   * Array length range: 3
   */
  sleeping_pos?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  Brain?: {
    memories?: JsonMemories,
  },
  attributes?: Array<JsonAttribute>,
  active_effects?: Array<JsonMobEffectInstance>,
  /**
   * The UUID of the player that last hurt this entity. Stored for 100 ticks.
   *
   * Value:
   * Array length range: 4
   */
  last_hurt_by_player?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * Amount of ticks that this entity will remember the player that last hurt this entity.
   * Counts down from 100 to 0.
   *
   * Value:
   * Range: 0..100
   */
  last_hurt_by_player_memory_time?: (NBTInt<{
    min: 0,
    max: 100,
  }> | number),
  /**
   * The UUID of the mob that last hurt this entity. Stored for 100 ticks.
   *
   * Value:
   * Array length range: 4
   */
  last_hurt_by_mob?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * Amount of ticks since this entity was last hurt by a mob.
   * Counts up from 0 to 100.
   *
   * Value:
   * Range: 0..100
   */
  ticks_since_last_hurt_by_mob?: (NBTInt<{
    min: 0,
    max: 100,
  }> | number),
  locator_bar_icon?: JsonWaypointIcon,
} & JsonFallDamageLogicData)

export type JsonMobBase = (JsonLivingEntity & {
  /**
   * The equipment items of the mob, such as armor or weapons.
   */
  equipment?: JsonEntityEquipment,
  /**
   * Chances of the mob dropping an equipment slot on death.
   */
  drop_chances?: JsonDropChances,
} & {
  /**
   * Loot table that is dropped when the mob dies.
   */
  DeathLootTable?: (JsonRegistry['minecraft:loot_table'] | '' | LootTableClass),
  /**
   * Seed for generating the death loot table.
   */
  DeathLootTableSeed?: (NBTLong | number),
  /**
   * Whether it can pick up loot.
   */
  CanPickUpLoot?: boolean,
  /**
   * Whether it should not despawn naturally.
   */
  PersistenceRequired?: boolean,
  /**
   * Whether it is left handed.
   */
  LeftHanded?: boolean,
  /**
   * Whether it should have an AI.
   */
  NoAI?: boolean,
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
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }> | {
    /**
     * Value:
     * Array length range: 4
     */
    UUID?: NBTIntArray<{
      leftExclusive: false,
      rightExclusive: false,
      min: 4,
      max: 4,
    }>,
  }),
  /**
   * Defaults to -1, which represents "no home".
   */
  home_radius?: (NBTInt | number),
  /**
   * This field will be discarded if `home_radius` is less than 0.
   *
   * Value:
   * Array length range: 3
   */
  home_pos?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
})

export type JsonModernAttributeModifier = {
  /**
   * The unique identifier of this attribute modifier.
   */
  id: NamespacedString,
  /**
   * Change in the attribute.
   */
  amount: (NBTDouble | number),
  /**
   * The operation used for this modifier.
   *
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
  operation: JsonAttributeOperation,
}

export type JsonNeutralMob = {
  /**
   * The time anger ends.
   */
  anger_end_time?: (NBTLong | number),
  /**
   * Value:
   * Array length range: 4
   */
  angry_at?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
}

export type JsonSquid = (JsonMobBase & JsonAgeableMob)

export type JsonUUIDLeash = {
  /**
   * Upper bits of the other entity's UUID.
   */
  UUIDMost?: (NBTLong | number),
  /**
   * Lower bits of the other entity's UUID.
   */
  UUIDLeast?: (NBTLong | number),
}

export type JsonWaypointIcon = {
  style: (NamespacedString | WaypointStyleClass),
  color?: JSONRGB,
}
