import type { LevelBasedValue } from 'sandstone/arguments/generated/data/enchantment/level_based_value.js'
import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.js'
import type { BlockPredicate } from 'sandstone/arguments/generated/data/worldgen/feature/block_predicate.js'
import type { BlockStateProvider } from 'sandstone/arguments/generated/data/worldgen/feature/block_state_provider.js'
import type { FloatProvider } from 'sandstone/arguments/generated/data/worldgen.js'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { AttributeOperation } from 'sandstone/arguments/generated/util/attribute.js'
import type { Particle } from 'sandstone/arguments/generated/util/particle.js'
import type { _RawFunctionClass, NBTDouble, NBTFloat, NBTInt, NBTList, TagClass } from 'sandstone'

export type AddEffectValue = {
    value: LevelBasedValue
}

export type AllOfEffectValue = {
    /**
     * Value:
     * List length range: 1..
     */
    effects: NBTList<ValueEffect, {
        leftExclusive: false
        min: 1
    }>
}

export type AllOfEntityEffect = {
    /**
     * Value:
     * List length range: 1..
     */
    effects: NBTList<EntityEffect, {
        leftExclusive: false
        min: 1
    }>
}

export type AllOfLocationBasedEffect = {
    /**
     * Value:
     * List length range: 1..
     */
    effects: NBTList<LocationBasedEffect, {
        leftExclusive: false
        min: 1
    }>
}

export type ApplyExhaustionEntityEffect = {
    /**
     * The amount of exhaustion to apply to player.
     */
    amount: LevelBasedValue
}

export type ApplyImpulseEntityEffect = {
    /**
     * Impulse direction in local coordinates (the same used by `tp @s ^ ^ ^`).
     * `[left, upward, forward]`
     *
     * Value:
     * List length range: 3
     */
    direction: NBTList<NBTFloat, {
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
    /**
     * The multipler to apply to the computed impulse direction.
     * `[x, y, z]`
     *
     * Value:
     * List length range: 3
     */
    coordinate_scale: NBTList<NBTFloat, {
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
    /**
     * The scale of the impulse.
     */
    magnitude: LevelBasedValue
}

export type ApplyMobEffectEntityEffect = {
    /**
     * If multiple mob effects are specified, a random effect is selected.
     */
    to_apply: ((
      | Registry['minecraft:mob_effect'] | `#${string}:${string}` | TagClass<'mob_effect'>)
      | Array<Registry['minecraft:mob_effect']>)
    min_duration: LevelBasedValue
    max_duration: LevelBasedValue
    min_amplifier: LevelBasedValue
    max_amplifier: LevelBasedValue
}

export type AttributeEffect = {
    attribute: Registry['minecraft:attribute']
    /**
     * Used when equipping and unequipping the item to identify which modifier to add or remove from the entity.
     *
     * Postfixed with the slot name when the enchanted item is equipped.
     */
    id: `${string}:${string}`
    /**
     * Change in the attribute.
     */
    amount: LevelBasedValue
    /**
     * The attribute operation to use.
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
    operation: AttributeOperation
}

export type BlockInteraction = ('none' | 'block' | 'mob' | 'tnt' | 'trigger')

export type ChangeItemDamageEffect = {
    /**
     * Damage to apply to the enchanted item. Negative values will repair the item.
     * The change is not applied to items held by players in creative mode.
     */
    amount: LevelBasedValue
}

export type DamageEntityEffect = {
    damage_type: Registry['minecraft:damage_type']
    /**
     * Amount of damage is randomized within the given min/max span.
     */
    min_damage: LevelBasedValue
    max_damage: LevelBasedValue
}

export type DamageItemEffect = {
    /**
     * Damage to apply to the enchanted item.
     * The damage is not applied to items held by players in creative mode.
     */
    amount: LevelBasedValue
}

export type EntityEffect = ({
    [S in Extract<Registry['minecraft:enchantment_entity_effect_type'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:entity_effect'>
        ? Dispatcher<'minecraft:entity_effect'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:enchantment_entity_effect_type']])

export type ExplodeEntityEffect = {
    /**
     * Whether the explosion should be attributed to the user of the enchanted tool.
     */
    attribute_to_user?: boolean
    /**
     * If omitted, no damage is dealt by the explosion.
     */
    damage_type?: Registry['minecraft:damage_type']
    /**
     * List of Blocks or hash-prefixed Block Tag specifying which blocks fully block the explosion.
     */
    immune_blocks?: ((
      | Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<Registry['minecraft:block']>)
    /**
     * If omitted, the default explosion knockback is applied.
     */
    knockback_multiplier?: LevelBasedValue
    /**
     * Relative coordinates to offset the explosion by. Defaults to `[0, 0, 0]`.
     *
     * Value:
     * List length range: 3
     */
    offset?: NBTList<(NBTDouble | number), {
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
    radius: LevelBasedValue
    /**
     * Whether fire is placed within the explosion radius.
     */
    create_fire?: boolean
    /**
     * Whether the explosion has special effects on blocks.
     *
     * Value:
     *
     *  - None(`none`): No item drops or special behavior.
     *  - Block(`block`): Drops items as if a block caused the explosion; `blockExplosionDropDecay` game rule applies.
     *  - Mob(`mob`): Drops items as if a mob caused the explosion; `mobExplosionDropDecay` game rule applies.
     *  - TNT(`tnt`): Drops items as if TNT caused the explosion; `tntExplosionDropDecay` game rule applies.
     *  - Trigger(`trigger`): Triggers redstone-activated blocks.
     */
    block_interaction: BlockInteraction
    small_particle: Particle
    large_particle: Particle
    block_particles?: Array<ExplosionParticleInfo>
    sound: SoundEventRef
}

export type ExplosionParticleInfo = {
    /**
     * Value:
     * Range: 1..
     */
    weight: NBTInt<{
        min: 1
    }>
    particle: Particle
    /**
     * Defaults to 1.0. Scaling of the distance between the center of the explosion and the block
     */
    scaling?: NBTFloat
    /**
     * Defaults to 1.0. Scaling of the speed of the particle
     */
    speed?: NBTFloat
}

export type ExponentialEffectValue = {
    base: LevelBasedValue
    exponent: LevelBasedValue
}

export type IgniteEntityEffect = {
    /**
     * Seconds the fire should last.
     */
    duration: LevelBasedValue
}

export type LocationBasedEffect = ({
    [S in Extract<Registry['minecraft:enchantment_location_based_effect_type'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:location_based_effect'>
        ? Dispatcher<'minecraft:location_based_effect'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:enchantment_location_based_effect_type']])

export type MultiplyEffectValue = {
    /**
     * Level-Based Value determining the factor to multiply in
     */
    factor: LevelBasedValue
}

export type ParticlePosition = {
    type: ('entity_position' | 'in_bounding_box')
    /**
     * Defaults to 0.
     */
    offset?: NBTFloat
    /**
     * Defaults to 1.
     */
    scale?: NBTFloat
}

export type ParticleVelocity = {
    /**
     * Defaults to 0.
     */
    base?: NBTFloat
    /**
     * Scale factor applied to the given axis (`1` adds the velocity of the entity to the spawned particles). Defaults to 0.
     */
    movement_scale?: NBTFloat
}

export type PlaySoundEntityEffect = {
    /**
     * Value:
     * *either*
     *
     * *item 0*
     *
     * *or*
     *
     * List length range: ..255
     */
    sound: (SoundEventRef | NBTList<SoundEventRef, {
        rightExclusive: false
    }>)
    volume: FloatProvider<NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
    }>>
    pitch: FloatProvider<NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
    }>>
}

export type ReduceBinomialEffectValue = {
    /**
     * Chance that an input value is dropped by 1.
     *
     * The span is 0 to 1, with 0 being no chance to drop an input value and 1 dropping all input values.
     */
    chance: LevelBasedValue
}

export type ReplaceBlockEntityEffect = {
    block_state: BlockStateProvider
    /**
     * Relative coordinates to offset the placed block by. Defaults to `[0, 0, 0]`.
     *
     * Value:
     * List length range: 3
     */
    offset?: NBTList<NBTInt, {
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
    /**
     * If omitted, all block types are replaced.
     */
    predicate?: BlockPredicate
    /**
     * Defaults to no game event dispatched.
     */
    trigger_game_event?: Registry['minecraft:game_event']
}

export type ReplaceDiskEntityEffect = (ReplaceBlockEntityEffect & {
    /**
     * Relative coordinates to offset the center of the cylinder by. Defaults to `[0, 0, 0]`.
     *
     * Value:
     * List length range: 3
     */
    offset?: NBTList<NBTInt, {
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
    radius: LevelBasedValue
    height: LevelBasedValue
})

export type RunFunctionEntityEffect = {
    function: (`${string}:${string}` | _RawFunctionClass)
}

export type SetBlockPropertiesEntityEffect = {
    properties: Dispatcher<'minecraft:data_component'>['block_state']
    /**
     * Relative coordinates to offset the block by. Defaults to `[0, 0, 0]`.
     *
     * Value:
     * List length range: 3
     */
    offset?: NBTList<NBTInt, {
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
    /**
     * Defaults to no game event dispatched.
     */
    trigger_game_event?: Registry['minecraft:game_event']
}

export type SetEffectValue = {
    value: LevelBasedValue
}

export type SpawnParticlesEntityEffect = {
    particle: Particle
    horizontal_position: ParticlePosition
    vertical_position: ParticlePosition
    horizontal_velocity: ParticleVelocity
    vertical_velocity: ParticleVelocity
    speed?: NBTFloat
}

export type SummonEntityEffect = {
    /**
     * If multiple entity types are specified, a random entity type is selected.
     */
    entity: ((
      | Registry['minecraft:entity_type'] | `#${Registry['minecraft:tag/entity_type']}` | TagClass<'entity_type'>)
      | Array<Registry['minecraft:entity_type']>)
    /**
     * Whether the summoned entity should join the team of the owner of the Enchanted Item.
     */
    join_team?: boolean
}

export type ValueEffect = ({
    [S in Extract<Registry['minecraft:enchantment_value_effect_type'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:value_effect'>
        ? Dispatcher<'minecraft:value_effect'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:enchantment_value_effect_type']])
type EntityEffectDispatcherMap = {
    'all_of': EntityEffectAllOf
    'minecraft:all_of': EntityEffectAllOf
    'apply_exhaustion': EntityEffectApplyExhaustion
    'minecraft:apply_exhaustion': EntityEffectApplyExhaustion
    'apply_impulse': EntityEffectApplyImpulse
    'minecraft:apply_impulse': EntityEffectApplyImpulse
    'apply_mob_effect': EntityEffectApplyMobEffect
    'minecraft:apply_mob_effect': EntityEffectApplyMobEffect
    'change_item_damage': EntityEffectChangeItemDamage
    'minecraft:change_item_damage': EntityEffectChangeItemDamage
    'damage_entity': EntityEffectDamageEntity
    'minecraft:damage_entity': EntityEffectDamageEntity
    'damage_item': EntityEffectDamageItem
    'minecraft:damage_item': EntityEffectDamageItem
    'explode': EntityEffectExplode
    'minecraft:explode': EntityEffectExplode
    'ignite': EntityEffectIgnite
    'minecraft:ignite': EntityEffectIgnite
    'play_sound': EntityEffectPlaySound
    'minecraft:play_sound': EntityEffectPlaySound
    'replace_block': EntityEffectReplaceBlock
    'minecraft:replace_block': EntityEffectReplaceBlock
    'replace_disk': EntityEffectReplaceDisk
    'minecraft:replace_disk': EntityEffectReplaceDisk
    'run_function': EntityEffectRunFunction
    'minecraft:run_function': EntityEffectRunFunction
    'set_block_properties': EntityEffectSetBlockProperties
    'minecraft:set_block_properties': EntityEffectSetBlockProperties
    'spawn_particles': EntityEffectSpawnParticles
    'minecraft:spawn_particles': EntityEffectSpawnParticles
    'summon_entity': EntityEffectSummonEntity
    'minecraft:summon_entity': EntityEffectSummonEntity
}
type EntityEffectKeys = keyof EntityEffectDispatcherMap
type EntityEffectFallback = (
  | EntityEffectAllOf
  | EntityEffectApplyExhaustion
  | EntityEffectApplyImpulse
  | EntityEffectApplyMobEffect
  | EntityEffectChangeItemDamage
  | EntityEffectDamageEntity
  | EntityEffectDamageItem
  | EntityEffectExplode
  | EntityEffectIgnite
  | EntityEffectPlaySound
  | EntityEffectReplaceBlock
  | EntityEffectReplaceDisk
  | EntityEffectRunFunction
  | EntityEffectSetBlockProperties
  | EntityEffectSpawnParticles
  | EntityEffectSummonEntity)
type EntityEffectAllOf = AllOfEntityEffect
type EntityEffectApplyExhaustion = ApplyExhaustionEntityEffect
type EntityEffectApplyImpulse = ApplyImpulseEntityEffect
type EntityEffectApplyMobEffect = ApplyMobEffectEntityEffect
type EntityEffectChangeItemDamage = ChangeItemDamageEffect
type EntityEffectDamageEntity = DamageEntityEffect
type EntityEffectDamageItem = DamageItemEffect
type EntityEffectExplode = ExplodeEntityEffect
type EntityEffectIgnite = IgniteEntityEffect
type EntityEffectPlaySound = PlaySoundEntityEffect
type EntityEffectReplaceBlock = ReplaceBlockEntityEffect
type EntityEffectReplaceDisk = ReplaceDiskEntityEffect
type EntityEffectRunFunction = RunFunctionEntityEffect
type EntityEffectSetBlockProperties = SetBlockPropertiesEntityEffect
type EntityEffectSpawnParticles = SpawnParticlesEntityEffect
type EntityEffectSummonEntity = SummonEntityEffect
export type SymbolEntityEffect<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? EntityEffectDispatcherMap
    : CASE extends 'keys' ? EntityEffectKeys : CASE extends '%fallback' ? EntityEffectFallback : never
type LocationBasedEffectDispatcherMap = {
    'all_of': LocationBasedEffectAllOf
    'minecraft:all_of': LocationBasedEffectAllOf
    'apply_exhaustion': LocationBasedEffectApplyExhaustion
    'minecraft:apply_exhaustion': LocationBasedEffectApplyExhaustion
    'apply_impulse': LocationBasedEffectApplyImpulse
    'minecraft:apply_impulse': LocationBasedEffectApplyImpulse
    'apply_mob_effect': LocationBasedEffectApplyMobEffect
    'minecraft:apply_mob_effect': LocationBasedEffectApplyMobEffect
    'attribute': LocationBasedEffectAttribute
    'minecraft:attribute': LocationBasedEffectAttribute
    'change_item_damage': LocationBasedEffectChangeItemDamage
    'minecraft:change_item_damage': LocationBasedEffectChangeItemDamage
    'damage_entity': LocationBasedEffectDamageEntity
    'minecraft:damage_entity': LocationBasedEffectDamageEntity
    'damage_item': LocationBasedEffectDamageItem
    'minecraft:damage_item': LocationBasedEffectDamageItem
    'explode': LocationBasedEffectExplode
    'minecraft:explode': LocationBasedEffectExplode
    'ignite': LocationBasedEffectIgnite
    'minecraft:ignite': LocationBasedEffectIgnite
    'play_sound': LocationBasedEffectPlaySound
    'minecraft:play_sound': LocationBasedEffectPlaySound
    'replace_block': LocationBasedEffectReplaceBlock
    'minecraft:replace_block': LocationBasedEffectReplaceBlock
    'replace_disk': LocationBasedEffectReplaceDisk
    'minecraft:replace_disk': LocationBasedEffectReplaceDisk
    'run_function': LocationBasedEffectRunFunction
    'minecraft:run_function': LocationBasedEffectRunFunction
    'set_block_properties': LocationBasedEffectSetBlockProperties
    'minecraft:set_block_properties': LocationBasedEffectSetBlockProperties
    'spawn_particles': LocationBasedEffectSpawnParticles
    'minecraft:spawn_particles': LocationBasedEffectSpawnParticles
    'summon_entity': LocationBasedEffectSummonEntity
    'minecraft:summon_entity': LocationBasedEffectSummonEntity
}
type LocationBasedEffectKeys = keyof LocationBasedEffectDispatcherMap
type LocationBasedEffectFallback = (
  | LocationBasedEffectAllOf
  | LocationBasedEffectApplyExhaustion
  | LocationBasedEffectApplyImpulse
  | LocationBasedEffectApplyMobEffect
  | LocationBasedEffectAttribute
  | LocationBasedEffectChangeItemDamage
  | LocationBasedEffectDamageEntity
  | LocationBasedEffectDamageItem
  | LocationBasedEffectExplode
  | LocationBasedEffectIgnite
  | LocationBasedEffectPlaySound
  | LocationBasedEffectReplaceBlock
  | LocationBasedEffectReplaceDisk
  | LocationBasedEffectRunFunction
  | LocationBasedEffectSetBlockProperties
  | LocationBasedEffectSpawnParticles
  | LocationBasedEffectSummonEntity)
type LocationBasedEffectAllOf = AllOfLocationBasedEffect
type LocationBasedEffectApplyExhaustion = ApplyExhaustionEntityEffect
type LocationBasedEffectApplyImpulse = ApplyImpulseEntityEffect
type LocationBasedEffectApplyMobEffect = ApplyMobEffectEntityEffect
type LocationBasedEffectAttribute = AttributeEffect
type LocationBasedEffectChangeItemDamage = ChangeItemDamageEffect
type LocationBasedEffectDamageEntity = DamageEntityEffect
type LocationBasedEffectDamageItem = DamageItemEffect
type LocationBasedEffectExplode = ExplodeEntityEffect
type LocationBasedEffectIgnite = IgniteEntityEffect
type LocationBasedEffectPlaySound = PlaySoundEntityEffect
type LocationBasedEffectReplaceBlock = ReplaceBlockEntityEffect
type LocationBasedEffectReplaceDisk = ReplaceDiskEntityEffect
type LocationBasedEffectRunFunction = RunFunctionEntityEffect
type LocationBasedEffectSetBlockProperties = SetBlockPropertiesEntityEffect
type LocationBasedEffectSpawnParticles = SpawnParticlesEntityEffect
type LocationBasedEffectSummonEntity = SummonEntityEffect
export type SymbolLocationBasedEffect<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? LocationBasedEffectDispatcherMap
    : CASE extends 'keys' ? LocationBasedEffectKeys : CASE extends '%fallback' ? LocationBasedEffectFallback : never
type ValueEffectDispatcherMap = {
    'add': ValueEffectAdd
    'minecraft:add': ValueEffectAdd
    'all_of': ValueEffectAllOf
    'minecraft:all_of': ValueEffectAllOf
    'exponential': ValueEffectExponential
    'minecraft:exponential': ValueEffectExponential
    'multiply': ValueEffectMultiply
    'minecraft:multiply': ValueEffectMultiply
    'remove_binomial': ValueEffectRemoveBinomial
    'minecraft:remove_binomial': ValueEffectRemoveBinomial
    'set': ValueEffectSet
    'minecraft:set': ValueEffectSet
}
type ValueEffectKeys = keyof ValueEffectDispatcherMap
type ValueEffectFallback = (
  | ValueEffectAdd
  | ValueEffectAllOf
  | ValueEffectExponential
  | ValueEffectMultiply
  | ValueEffectRemoveBinomial
  | ValueEffectSet)
type ValueEffectAdd = AddEffectValue
type ValueEffectAllOf = AllOfEffectValue
type ValueEffectExponential = ExponentialEffectValue
type ValueEffectMultiply = MultiplyEffectValue
type ValueEffectRemoveBinomial = ReduceBinomialEffectValue
type ValueEffectSet = SetEffectValue
export type SymbolValueEffect<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? ValueEffectDispatcherMap
    : CASE extends 'keys' ? ValueEffectKeys : CASE extends '%fallback' ? ValueEffectFallback : never
