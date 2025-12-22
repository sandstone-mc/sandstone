import type {
  AttributeEffect,
  EntityEffect,
  LocationBasedEffect,
  ValueEffect,
} from 'sandstone/arguments/generated/data/enchantment/effect.js'
import type { LootCondition } from 'sandstone/arguments/generated/data/loot.js'
import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.js'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'

export type AmmoUseEnchantmentEffect = {
  /**
     * Predicate context: Item Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of ammunition being used up.
     */
  effect: ValueEffect
}

export type AttackTarget = ('attacker' | 'damaging_entity' | 'victim')

export type BlockExperienceEnchantmentEffect = {
  /**
     * Predicate context: Item Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of experience awarded.
     */
  effect: ValueEffect
}

export type CrossbowChargeSoundsEnchantmentEffect = {
  /**
     * Start of charging.
     */
  start?: SoundEventRef
  /**
     * Middle of charging.
     */
  mid?: SoundEventRef
  /**
     * End of charging.
     */
  end?: SoundEventRef
}

export type DamageEnchantmentEffect = {
  /**
     * Predicate context: Damage Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Determines armor effectiveness; `0.0` for no effect, `1.0` for full effect.
     */
  effect: ValueEffect
}

export type DamageImmunityEnchantmentEffect = {
  /**
     * Predicate context: Damage Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Dummy value; this is a boolean effect.
     */
  effect: Record<string, never>
}

export type DamageProtectionEnchantmentEffect = {
  /**
     * Predicate context: Damage Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of damage being absorbed; as "fake armor".
     */
  effect: ValueEffect
}

export type EnchantmentEffectComponentMap = ({
  [Key in Extract<Registry['minecraft:enchantment_effect_component_type'], string>]?: (Key extends keyof Dispatcher<'minecraft:effect_component'>
    ? Dispatcher<'minecraft:effect_component'>[Key]
    : Record<string, unknown>);
})

export type EquipmentDropsEnchantmentEffect = {
  /**
     * Predicate context: Damage Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Chance between `0.0` and `1.0` of an equipped piece dropping.
     */
  effect: ValueEffect
  /**
     * Which subject needs to be enchanted for the effect to apply.
     */
  enchanted: ('attacker' | 'victim')
}

export type FishingLuckBonusEnchantmentEffect = {
  /**
     * Predicate context: Entity Parameters.
     *
     * `this` is the player fishing.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of luck being added.
     */
  effect: ValueEffect
}

export type FishingTimeReductionEnchantmentEffect = {
  /**
     * Predicate context: Entity Parameters.
     *
     * `this` is the player fishing.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Time reduction in seconds (higher values mean less time until a fish bites).
     */
  effect: ValueEffect
}

export type HitBlockEnchantmentEffect = {
  /**
     * Predicate context: Entity Parameters.
     *
     * `this` is the entity hitting the Block, unless during a projectile attack, then, `this` is the projectile.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * On the entity hitting the Block
     */
  effect: EntityEffect
}

export type ItemDamageEnchantmentEffect = {
  /**
     * Predicate context: Item Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of damage being dealt to the item.
     */
  effect: ValueEffect
}

export type KnockbackEnchantmentEffect = {
  /**
     * Predicate context: Damage Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of knockback being applied.
     */
  effect: ValueEffect
}

export type LocationChangedEnchantmentEffect = {
  /**
     * Predicate context: Location Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * On the entity changing location.
     */
  effect: LocationBasedEffect
}

export type MobExperienceEnchantmentEffect = {
  /**
     * Predicate context: Entity Parameters.
     *
     * `this` is the killed mob.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of experience awarded.
     */
  effect: ValueEffect
}

export type PostAttackEnchantmentEffect = {
  /**
     * Predicate context: Damage Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Examples:
     * - A Fire Aspect Enchant would specify that when the attacker is enchanted, the ignite effect is applied, and the affected party is the victim.
     * - Thorns would specify that when the victim is enchanted, the damage_entity effect is applied, and the affected party is the attacker.
     */
  effect: EntityEffect
  /**
     * Value:
     *
     *  - Attacker(`attacker`)
     *  - DamagingEntity(`damaging_entity`)
     *  - Victim(`victim`)
     */
  enchanted: AttackTarget
  /**
     * Value:
     *
     *  - Attacker(`attacker`)
     *  - DamagingEntity(`damaging_entity`)
     *  - Victim(`victim`)
     */
  affected: AttackTarget
}

export type PostPiercingAttackEnchantmentEffect = {
  /**
     * Predicate context: Damage Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * The effect to apply on attacker.
     */
  effect: EntityEffect
}

export type ProjectileCountEnchantmentEffect = {
  /**
     * Predicate context: Entity Parameters.
     *
     * `this` is the entity drawing the weapon.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of projectiles being loaded/drawn.
     */
  effect: ValueEffect
}

export type ProjectilePiercingEnchantmentEffect = {
  /**
     * Predicate context: Item Parameters.
     *
     * Tool is the ammunition item.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of entities the projectile will pierce through before despawning.
     */
  effect: ValueEffect
}

export type ProjectileSpawnedEnchantmentEffect = {
  /**
     * Predicate context: Entity Parameters.
     *
     * `this` is the newly spawned projectile.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * On the newly spawned projectile.
     */
  effect: EntityEffect
}

export type ProjectileSpreadEnchantmentEffect = {
  /**
     * Predicate context: Entity Parameters.
     *
     * `this` is the entity shooting the projectile.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Maximum spread of projectiles measured in degrees from the aim line.
     */
  effect: ValueEffect
}

export type RepairWithXpEnchantmentEffect = {
  /**
     * Predicate context: Item Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of durability increase per experience point, `mending` uses 2x.
     */
  effect: ValueEffect
}

export type SmashDamagePerBlockFallenEnchantmentEffect = {
  /**
     * Predicate context: Damage Parameters.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of damage dealt per block fallen.
     */
  effect: ValueEffect
}

export type TickEnchantmentEffect = {
  /**
     * Predicate context: Entity Parameters.
     *
     * `this` is the entity with the Enchanted Item.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * On every tick. Performance recommendation: don't use with `run_function` unless necessary.
     */
  effect: EntityEffect
}

export type TridentReturnAccelerationEnchantmentEffect = {
  /**
     * Predicate context: Entity Parameters.
     *
     * `this` is the trident entity.
     */
  requirements?: (LootCondition | Array<LootCondition>)
  /**
     * Amount of acceleration applied to the returning trident.
     */
  effect: ValueEffect
}
type EffectComponentDispatcherMap = {
  'ammo_use': EffectComponentAmmoUse
  'minecraft:ammo_use': EffectComponentAmmoUse
  'armor_effectiveness': EffectComponentArmorEffectiveness
  'minecraft:armor_effectiveness': EffectComponentArmorEffectiveness
  'attributes': EffectComponentAttributes
  'minecraft:attributes': EffectComponentAttributes
  'block_experience': EffectComponentBlockExperience
  'minecraft:block_experience': EffectComponentBlockExperience
  'crossbow_charge_sounds': EffectComponentCrossbowChargeSounds
  'minecraft:crossbow_charge_sounds': EffectComponentCrossbowChargeSounds
  'crossbow_charge_time': EffectComponentCrossbowChargeTime
  'minecraft:crossbow_charge_time': EffectComponentCrossbowChargeTime
  'damage': EffectComponentDamage
  'minecraft:damage': EffectComponentDamage
  'damage_immunity': EffectComponentDamageImmunity
  'minecraft:damage_immunity': EffectComponentDamageImmunity
  'damage_protection': EffectComponentDamageProtection
  'minecraft:damage_protection': EffectComponentDamageProtection
  'equipment_drops': EffectComponentEquipmentDrops
  'minecraft:equipment_drops': EffectComponentEquipmentDrops
  'fishing_luck_bonus': EffectComponentFishingLuckBonus
  'minecraft:fishing_luck_bonus': EffectComponentFishingLuckBonus
  'fishing_time_reduction': EffectComponentFishingTimeReduction
  'minecraft:fishing_time_reduction': EffectComponentFishingTimeReduction
  'hit_block': EffectComponentHitBlock
  'minecraft:hit_block': EffectComponentHitBlock
  'item_damage': EffectComponentItemDamage
  'minecraft:item_damage': EffectComponentItemDamage
  'knockback': EffectComponentKnockback
  'minecraft:knockback': EffectComponentKnockback
  'location_changed': EffectComponentLocationChanged
  'minecraft:location_changed': EffectComponentLocationChanged
  'mob_experience': EffectComponentMobExperience
  'minecraft:mob_experience': EffectComponentMobExperience
  'post_attack': EffectComponentPostAttack
  'minecraft:post_attack': EffectComponentPostAttack
  'post_piercing_attack': EffectComponentPostPiercingAttack
  'minecraft:post_piercing_attack': EffectComponentPostPiercingAttack
  'prevent_armor_change': EffectComponentPreventArmorChange
  'minecraft:prevent_armor_change': EffectComponentPreventArmorChange
  'prevent_equipment_drop': EffectComponentPreventEquipmentDrop
  'minecraft:prevent_equipment_drop': EffectComponentPreventEquipmentDrop
  'projectile_count': EffectComponentProjectileCount
  'minecraft:projectile_count': EffectComponentProjectileCount
  'projectile_piercing': EffectComponentProjectilePiercing
  'minecraft:projectile_piercing': EffectComponentProjectilePiercing
  'projectile_spawned': EffectComponentProjectileSpawned
  'minecraft:projectile_spawned': EffectComponentProjectileSpawned
  'projectile_spread': EffectComponentProjectileSpread
  'minecraft:projectile_spread': EffectComponentProjectileSpread
  'repair_with_xp': EffectComponentRepairWithXp
  'minecraft:repair_with_xp': EffectComponentRepairWithXp
  'smash_damage_per_block_fallen': EffectComponentSmashDamagePerBlockFallen
  'minecraft:smash_damage_per_block_fallen': EffectComponentSmashDamagePerBlockFallen
  'tick': EffectComponentTick
  'minecraft:tick': EffectComponentTick
  'trident_return_acceleration': EffectComponentTridentReturnAcceleration
  'minecraft:trident_return_acceleration': EffectComponentTridentReturnAcceleration
  'trident_sound': EffectComponentTridentSound
  'minecraft:trident_sound': EffectComponentTridentSound
  'trident_spin_attack_strength': EffectComponentTridentSpinAttackStrength
  'minecraft:trident_spin_attack_strength': EffectComponentTridentSpinAttackStrength
}
type EffectComponentKeys = keyof EffectComponentDispatcherMap
type EffectComponentFallback = (
  | EffectComponentAmmoUse
  | EffectComponentArmorEffectiveness
  | EffectComponentAttributes
  | EffectComponentBlockExperience
  | EffectComponentCrossbowChargeSounds
  | EffectComponentCrossbowChargeTime
  | EffectComponentDamage
  | EffectComponentDamageImmunity
  | EffectComponentDamageProtection
  | EffectComponentEquipmentDrops
  | EffectComponentFishingLuckBonus
  | EffectComponentFishingTimeReduction
  | EffectComponentHitBlock
  | EffectComponentItemDamage
  | EffectComponentKnockback
  | EffectComponentLocationChanged
  | EffectComponentMobExperience
  | EffectComponentPostAttack
  | EffectComponentPostPiercingAttack
  | EffectComponentPreventArmorChange
  | EffectComponentPreventEquipmentDrop
  | EffectComponentProjectileCount
  | EffectComponentProjectilePiercing
  | EffectComponentProjectileSpawned
  | EffectComponentProjectileSpread
  | EffectComponentRepairWithXp
  | EffectComponentSmashDamagePerBlockFallen
  | EffectComponentTick
  | EffectComponentTridentReturnAcceleration
  | EffectComponentTridentSound
  | EffectComponentTridentSpinAttackStrength)
type EffectComponentAmmoUse = Array<AmmoUseEnchantmentEffect>
type EffectComponentArmorEffectiveness = Array<DamageEnchantmentEffect>
type EffectComponentAttributes = Array<AttributeEffect>
type EffectComponentBlockExperience = Array<BlockExperienceEnchantmentEffect>
type EffectComponentCrossbowChargeSounds = Array<CrossbowChargeSoundsEnchantmentEffect>
type EffectComponentCrossbowChargeTime = ValueEffect
type EffectComponentDamage = Array<DamageEnchantmentEffect>
type EffectComponentDamageImmunity = Array<DamageImmunityEnchantmentEffect>
type EffectComponentDamageProtection = Array<DamageProtectionEnchantmentEffect>
type EffectComponentEquipmentDrops = Array<EquipmentDropsEnchantmentEffect>
type EffectComponentFishingLuckBonus = Array<FishingLuckBonusEnchantmentEffect>
type EffectComponentFishingTimeReduction = Array<FishingTimeReductionEnchantmentEffect>
type EffectComponentHitBlock = Array<HitBlockEnchantmentEffect>
type EffectComponentItemDamage = Array<ItemDamageEnchantmentEffect>
type EffectComponentKnockback = Array<KnockbackEnchantmentEffect>
type EffectComponentLocationChanged = Array<LocationChangedEnchantmentEffect>
type EffectComponentMobExperience = Array<MobExperienceEnchantmentEffect>
type EffectComponentPostAttack = Array<PostAttackEnchantmentEffect>
type EffectComponentPostPiercingAttack = Array<PostPiercingAttackEnchantmentEffect>
type EffectComponentPreventArmorChange = Record<string, never>
type EffectComponentPreventEquipmentDrop = Record<string, never>
type EffectComponentProjectileCount = Array<ProjectileCountEnchantmentEffect>
type EffectComponentProjectilePiercing = Array<ProjectilePiercingEnchantmentEffect>
type EffectComponentProjectileSpawned = Array<ProjectileSpawnedEnchantmentEffect>
type EffectComponentProjectileSpread = Array<ProjectileSpreadEnchantmentEffect>
type EffectComponentRepairWithXp = Array<RepairWithXpEnchantmentEffect>
type EffectComponentSmashDamagePerBlockFallen = Array<SmashDamagePerBlockFallenEnchantmentEffect>
type EffectComponentTick = Array<TickEnchantmentEffect>
type EffectComponentTridentReturnAcceleration = Array<TridentReturnAccelerationEnchantmentEffect>
type EffectComponentTridentSound = Array<SoundEventRef>
type EffectComponentTridentSpinAttackStrength = ValueEffect
export type SymbolEffectComponent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? EffectComponentDispatcherMap
  : CASE extends 'keys' ? EffectComponentKeys : CASE extends '%fallback' ? EffectComponentFallback : never
