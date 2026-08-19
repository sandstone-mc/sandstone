import type {
  JsonAttributeEffect,
  JsonEntityEffect,
  JsonLocationBasedEffect,
  JsonValueEffect,
} from 'sandstone/arguments/generated/_json/data/enchantment/effect.ts'
import type { JsonPredicate } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'

export type JsonAmmoUseEnchantmentEffect = {
  /**
   * Predicate context: Item Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of ammunition being used up. \
   * `0` has a side effect of applying `intangible_projectile` component to the projectile item.
   */
  effect: JsonValueEffect,
}

export type JsonArmorEffectivenessEnchantmentEffect = {
  /**
   * Predicate context: Damage Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Determines armor effectiveness; `0.0` for no effect, `1.0` for full effect.
   */
  effect: JsonValueEffect,
}

export type JsonAttackTarget = ('attacker' | 'damaging_entity' | 'victim')

export type JsonBlockExperienceEnchantmentEffect = {
  /**
   * Predicate context: Item Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of experience awarded.
   */
  effect: JsonValueEffect,
}

export type JsonCrossbowChargeSoundsEnchantmentEffect = {
  /**
   * Start of charging.
   */
  start?: JsonSoundEventRef,
  /**
   * Middle of charging.
   */
  mid?: JsonSoundEventRef,
  /**
   * End of charging.
   */
  end?: JsonSoundEventRef,
}

export type JsonDamageEnchantmentEffect = {
  /**
   * Predicate context: Damage Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Damage dealt by the weapon.
   */
  effect: JsonValueEffect,
}

export type JsonDamageImmunityEnchantmentEffect = {
  /**
   * Predicate context: Damage Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Dummy value; this is a boolean effect.
   */
  effect: Record<string, never>,
}

export type JsonDamageProtectionEnchantmentEffect = {
  /**
   * Predicate context: Damage Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Damage reduction factor. \
   * Provides `factor * 4%` of damage reduction, capped at 80%.
   */
  effect: JsonValueEffect,
}

export type JsonEnchantmentEffectComponentMap = ({
  [Key in Extract<keyof JsonSymbolEffectComponent, string>]?: JsonSymbolEffectComponent[Key]
})

export type JsonEquipmentDropsEnchantmentEffect = {
  /**
   * Predicate context: Damage Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Chance between `0.0` and `1.0` of an equipped piece dropping. \
   * If the drop chance on mob is 0, the chance will not be affected by this effect.
   */
  effect: JsonValueEffect,
  /**
   * Which subject needs to be enchanted for the effect to apply.
   */
  enchanted: ('attacker' | 'victim'),
}

export type JsonFishingLuckBonusEnchantmentEffect = {
  /**
   * Predicate context: Entity Parameters.
   *
   * `this` is the player fishing.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of luck being added.
   */
  effect: JsonValueEffect,
}

export type JsonFishingTimeReductionEnchantmentEffect = {
  /**
   * Predicate context: Entity Parameters.
   *
   * `this` is the player fishing.
   */
  requirements?: JsonPredicate,
  /**
   * Time reduction in seconds (higher values mean less time until a fish bites).
   */
  effect: JsonValueEffect,
}

export type JsonHitBlockEnchantmentEffect = {
  /**
   * Predicate context: Entity Parameters.
   *
   * `this` is the entity hitting the Block, unless during a projectile attack, then, `this` is the projectile.
   */
  requirements?: JsonPredicate,
  /**
   * On the entity hitting the Block
   */
  effect: JsonEntityEffect,
}

export type JsonItemDamageEnchantmentEffect = {
  /**
   * Predicate context: Item Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of damage being dealt to the item.
   */
  effect: JsonValueEffect,
}

export type JsonKnockbackEnchantmentEffect = {
  /**
   * Predicate context: Damage Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of knockback being applied.
   */
  effect: JsonValueEffect,
}

export type JsonLocationChangedEnchantmentEffect = {
  /**
   * Predicate context: Location Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * On the entity changing location.
   */
  effect: JsonLocationBasedEffect,
}

export type JsonMobExperienceEnchantmentEffect = {
  /**
   * Predicate context: Entity Parameters.
   *
   * `this` is the killed mob.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of experience awarded.
   */
  effect: JsonValueEffect,
}

export type JsonPostAttackEnchantmentEffect = {
  /**
   * Predicate context: Damage Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Examples:
   * - A Fire Aspect Enchant would specify that when the attacker is enchanted, the `ignite` effect is applied, and the affected party is the victim.
   * - Thorns would specify that when the victim is enchanted, the `damage_entity` effect is applied, and the affected party is the attacker.
   */
  effect: JsonEntityEffect,
  /**
   * When set to `attacker`, this effect only works on enchanted weapon, regardless of the `slots` field.
   *
   * Value:
   *
   *  - Attacker(`attacker`)
   *  - DamagingEntity(`damaging_entity`)
   *  - Victim(`victim`)
   */
  enchanted: JsonAttackTarget,
  /**
   * Value:
   *
   *  - Attacker(`attacker`)
   *  - DamagingEntity(`damaging_entity`)
   *  - Victim(`victim`)
   */
  affected: JsonAttackTarget,
}

export type JsonPostPiercingAttackEnchantmentEffect = {
  /**
   * Predicate context: Damage Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * The effect to apply on attacker.
   */
  effect: JsonEntityEffect,
}

export type JsonProjectileCountEnchantmentEffect = {
  /**
   * Predicate context: Entity Parameters.
   *
   * `this` is the entity drawing the weapon.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of projectiles being loaded/drawn. \
   * All projectile items except the first one will have `intangible_projectile` component applied.
   */
  effect: JsonValueEffect,
}

export type JsonProjectilePiercingEnchantmentEffect = {
  /**
   * Predicate context: Item Parameters.
   *
   * Tool is the ammunition item.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of entities the projectile will pierce through before despawning.
   */
  effect: JsonValueEffect,
}

export type JsonProjectileSpawnedEnchantmentEffect = {
  /**
   * Predicate context: Entity Parameters.
   *
   * `this` is the newly spawned projectile.
   */
  requirements?: JsonPredicate,
  /**
   * On the newly spawned projectile.
   */
  effect: JsonEntityEffect,
}

export type JsonProjectileSpreadEnchantmentEffect = {
  /**
   * Predicate context: Entity Parameters.
   *
   * `this` is the entity shooting the projectile.
   */
  requirements?: JsonPredicate,
  /**
   * Maximum spread of projectiles measured in degrees from the aim line.
   */
  effect: JsonValueEffect,
}

export type JsonRepairWithXpEnchantmentEffect = {
  /**
   * Predicate context: Item Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of durability increase per experience point, `mending` uses 2x.
   */
  effect: JsonValueEffect,
}

export type JsonSmashDamagePerBlockFallenEnchantmentEffect = {
  /**
   * Predicate context: Damage Parameters.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of damage dealt per block fallen.
   */
  effect: JsonValueEffect,
}

export type JsonTickEnchantmentEffect = {
  /**
   * Predicate context: Entity Parameters.
   *
   * `this` is the entity with the Enchanted Item.
   */
  requirements?: JsonPredicate,
  /**
   * On every tick. Performance recommendation: don't use with `run_function` unless necessary.
   */
  effect: JsonEntityEffect,
}

export type JsonTridentReturnAccelerationEnchantmentEffect = {
  /**
   * Predicate context: Entity Parameters.
   *
   * `this` is the trident entity.
   */
  requirements?: JsonPredicate,
  /**
   * Amount of acceleration applied to the returning trident.
   */
  effect: JsonValueEffect,
}
type JsonEffectComponentDispatcherMap = {
  'ammo_use': JsonEffectComponentAmmoUse,
  'minecraft:ammo_use': JsonEffectComponentAmmoUse,
  'armor_effectiveness': JsonEffectComponentArmorEffectiveness,
  'minecraft:armor_effectiveness': JsonEffectComponentArmorEffectiveness,
  'attributes': JsonEffectComponentAttributes,
  'minecraft:attributes': JsonEffectComponentAttributes,
  'block_experience': JsonEffectComponentBlockExperience,
  'minecraft:block_experience': JsonEffectComponentBlockExperience,
  'crossbow_charge_time': JsonEffectComponentCrossbowChargeTime,
  'minecraft:crossbow_charge_time': JsonEffectComponentCrossbowChargeTime,
  'crossbow_charging_sounds': JsonEffectComponentCrossbowChargingSounds,
  'minecraft:crossbow_charging_sounds': JsonEffectComponentCrossbowChargingSounds,
  'damage': JsonEffectComponentDamage,
  'minecraft:damage': JsonEffectComponentDamage,
  'damage_immunity': JsonEffectComponentDamageImmunity,
  'minecraft:damage_immunity': JsonEffectComponentDamageImmunity,
  'damage_protection': JsonEffectComponentDamageProtection,
  'minecraft:damage_protection': JsonEffectComponentDamageProtection,
  'equipment_drops': JsonEffectComponentEquipmentDrops,
  'minecraft:equipment_drops': JsonEffectComponentEquipmentDrops,
  'fishing_luck_bonus': JsonEffectComponentFishingLuckBonus,
  'minecraft:fishing_luck_bonus': JsonEffectComponentFishingLuckBonus,
  'fishing_time_reduction': JsonEffectComponentFishingTimeReduction,
  'minecraft:fishing_time_reduction': JsonEffectComponentFishingTimeReduction,
  'hit_block': JsonEffectComponentHitBlock,
  'minecraft:hit_block': JsonEffectComponentHitBlock,
  'item_damage': JsonEffectComponentItemDamage,
  'minecraft:item_damage': JsonEffectComponentItemDamage,
  'knockback': JsonEffectComponentKnockback,
  'minecraft:knockback': JsonEffectComponentKnockback,
  'location_changed': JsonEffectComponentLocationChanged,
  'minecraft:location_changed': JsonEffectComponentLocationChanged,
  'mob_experience': JsonEffectComponentMobExperience,
  'minecraft:mob_experience': JsonEffectComponentMobExperience,
  'post_attack': JsonEffectComponentPostAttack,
  'minecraft:post_attack': JsonEffectComponentPostAttack,
  'post_piercing_attack': JsonEffectComponentPostPiercingAttack,
  'minecraft:post_piercing_attack': JsonEffectComponentPostPiercingAttack,
  'prevent_armor_change': JsonEffectComponentPreventArmorChange,
  'minecraft:prevent_armor_change': JsonEffectComponentPreventArmorChange,
  'prevent_equipment_drop': JsonEffectComponentPreventEquipmentDrop,
  'minecraft:prevent_equipment_drop': JsonEffectComponentPreventEquipmentDrop,
  'projectile_count': JsonEffectComponentProjectileCount,
  'minecraft:projectile_count': JsonEffectComponentProjectileCount,
  'projectile_piercing': JsonEffectComponentProjectilePiercing,
  'minecraft:projectile_piercing': JsonEffectComponentProjectilePiercing,
  'projectile_spawned': JsonEffectComponentProjectileSpawned,
  'minecraft:projectile_spawned': JsonEffectComponentProjectileSpawned,
  'projectile_spread': JsonEffectComponentProjectileSpread,
  'minecraft:projectile_spread': JsonEffectComponentProjectileSpread,
  'repair_with_xp': JsonEffectComponentRepairWithXp,
  'minecraft:repair_with_xp': JsonEffectComponentRepairWithXp,
  'smash_damage_per_block_fallen': JsonEffectComponentSmashDamagePerBlockFallen,
  'minecraft:smash_damage_per_block_fallen': JsonEffectComponentSmashDamagePerBlockFallen,
  'tick': JsonEffectComponentTick,
  'minecraft:tick': JsonEffectComponentTick,
  'trident_return_acceleration': JsonEffectComponentTridentReturnAcceleration,
  'minecraft:trident_return_acceleration': JsonEffectComponentTridentReturnAcceleration,
  'trident_sound': JsonEffectComponentTridentSound,
  'minecraft:trident_sound': JsonEffectComponentTridentSound,
  'trident_spin_attack_strength': JsonEffectComponentTridentSpinAttackStrength,
  'minecraft:trident_spin_attack_strength': JsonEffectComponentTridentSpinAttackStrength,
}
type JsonEffectComponentKeys = keyof JsonEffectComponentDispatcherMap
type JsonEffectComponentFallback = (
  | JsonEffectComponentAmmoUse
  | JsonEffectComponentArmorEffectiveness
  | JsonEffectComponentAttributes
  | JsonEffectComponentBlockExperience
  | JsonEffectComponentCrossbowChargeTime
  | JsonEffectComponentCrossbowChargingSounds
  | JsonEffectComponentDamage
  | JsonEffectComponentDamageImmunity
  | JsonEffectComponentDamageProtection
  | JsonEffectComponentEquipmentDrops
  | JsonEffectComponentFishingLuckBonus
  | JsonEffectComponentFishingTimeReduction
  | JsonEffectComponentHitBlock
  | JsonEffectComponentItemDamage
  | JsonEffectComponentKnockback
  | JsonEffectComponentLocationChanged
  | JsonEffectComponentMobExperience
  | JsonEffectComponentPostAttack
  | JsonEffectComponentPostPiercingAttack
  | JsonEffectComponentPreventArmorChange
  | JsonEffectComponentPreventEquipmentDrop
  | JsonEffectComponentProjectileCount
  | JsonEffectComponentProjectilePiercing
  | JsonEffectComponentProjectileSpawned
  | JsonEffectComponentProjectileSpread
  | JsonEffectComponentRepairWithXp
  | JsonEffectComponentSmashDamagePerBlockFallen
  | JsonEffectComponentTick
  | JsonEffectComponentTridentReturnAcceleration
  | JsonEffectComponentTridentSound
  | JsonEffectComponentTridentSpinAttackStrength)
type JsonEffectComponentAmmoUse = Array<JsonAmmoUseEnchantmentEffect>
type JsonEffectComponentArmorEffectiveness = Array<JsonArmorEffectivenessEnchantmentEffect>
type JsonEffectComponentAttributes = Array<JsonAttributeEffect>
type JsonEffectComponentBlockExperience = Array<JsonBlockExperienceEnchantmentEffect>
type JsonEffectComponentCrossbowChargeTime = JsonValueEffect
type JsonEffectComponentCrossbowChargingSounds = Array<JsonCrossbowChargeSoundsEnchantmentEffect>
type JsonEffectComponentDamage = Array<JsonDamageEnchantmentEffect>
type JsonEffectComponentDamageImmunity = Array<JsonDamageImmunityEnchantmentEffect>
type JsonEffectComponentDamageProtection = Array<JsonDamageProtectionEnchantmentEffect>
type JsonEffectComponentEquipmentDrops = Array<JsonEquipmentDropsEnchantmentEffect>
type JsonEffectComponentFishingLuckBonus = Array<JsonFishingLuckBonusEnchantmentEffect>
type JsonEffectComponentFishingTimeReduction = Array<JsonFishingTimeReductionEnchantmentEffect>
type JsonEffectComponentHitBlock = Array<JsonHitBlockEnchantmentEffect>
type JsonEffectComponentItemDamage = Array<JsonItemDamageEnchantmentEffect>
type JsonEffectComponentKnockback = Array<JsonKnockbackEnchantmentEffect>
type JsonEffectComponentLocationChanged = Array<JsonLocationChangedEnchantmentEffect>
type JsonEffectComponentMobExperience = Array<JsonMobExperienceEnchantmentEffect>
type JsonEffectComponentPostAttack = Array<JsonPostAttackEnchantmentEffect>
type JsonEffectComponentPostPiercingAttack = Array<JsonPostPiercingAttackEnchantmentEffect>
type JsonEffectComponentPreventArmorChange = Record<string, never>
type JsonEffectComponentPreventEquipmentDrop = Record<string, never>
type JsonEffectComponentProjectileCount = Array<JsonProjectileCountEnchantmentEffect>
type JsonEffectComponentProjectilePiercing = Array<JsonProjectilePiercingEnchantmentEffect>
type JsonEffectComponentProjectileSpawned = Array<JsonProjectileSpawnedEnchantmentEffect>
type JsonEffectComponentProjectileSpread = Array<JsonProjectileSpreadEnchantmentEffect>
type JsonEffectComponentRepairWithXp = Array<JsonRepairWithXpEnchantmentEffect>
type JsonEffectComponentSmashDamagePerBlockFallen = Array<JsonSmashDamagePerBlockFallenEnchantmentEffect>
type JsonEffectComponentTick = Array<JsonTickEnchantmentEffect>
type JsonEffectComponentTridentReturnAcceleration = Array<JsonTridentReturnAccelerationEnchantmentEffect>
type JsonEffectComponentTridentSound = Array<JsonSoundEventRef>
type JsonEffectComponentTridentSpinAttackStrength = JsonValueEffect
export type JsonSymbolEffectComponent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonEffectComponentDispatcherMap
  : CASE extends 'keys' ? JsonEffectComponentKeys : CASE extends '%fallback' ? JsonEffectComponentFallback : never
