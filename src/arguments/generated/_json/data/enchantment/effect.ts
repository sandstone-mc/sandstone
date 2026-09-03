import type { JsonLevelBasedValue } from 'sandstone/arguments/generated/_json/data/enchantment/level_based_value.ts'
import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonBlockPredicate } from 'sandstone/arguments/generated/_json/data/worldgen/feature/block_predicate.ts'
import type {
  JsonBlockStateProviderRef,
} from 'sandstone/arguments/generated/_json/data/worldgen/feature/block_state_provider.ts'
import type { JsonFloatProvider } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonSymbolDataComponent } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonAttributeOperation } from 'sandstone/arguments/generated/_json/util/attribute.ts'
import type { JsonParticle } from 'sandstone/arguments/generated/_json/util/particle.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  DamageTypeClass,
  JsonNBTList,
  LiteralUnion,
  MCFunctionClass,
  NamespacedString,
  NBTDouble,
  NBTFloat,
  NBTInt,
  TagClass,
} from 'sandstone'

export type JsonAddEffectValue = {
  value: JsonLevelBasedValue,
}

export type JsonAllOfEffectValue = {
  /**
   * Value:
   * List length range: 1..
   */
  effects: JsonNBTList<JsonValueEffect, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonAllOfEntityEffect = {
  /**
   * Value:
   * List length range: 1..
   */
  effects: JsonNBTList<JsonEntityEffect, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonAllOfLocationBasedEffect = {
  /**
   * Value:
   * List length range: 1..
   */
  effects: JsonNBTList<JsonLocationBasedEffect, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonApplyExhaustionEntityEffect = {
  /**
   * The amount of exhaustion to apply to player.
   */
  amount: JsonLevelBasedValue,
}

export type JsonApplyImpulseEntityEffect = {
  /**
   * Impulse direction in local coordinates (the same used by `tp @s ^ ^ ^`). \
   * `[left, upward, forward]`
   *
   * Value:
   * List length range: 3
   */
  direction: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * The multipler to apply to the computed impulse direction. \
   * `[x, y, z]`
   *
   * Value:
   * List length range: 3
   */
  coordinate_scale: JsonNBTList<(NBTFloat | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * The scale of the impulse.
   */
  magnitude: JsonLevelBasedValue,
}

export type JsonApplyMobEffectEntityEffect = {
  /**
   * If multiple mob effects are specified, a random effect is selected.
   */
  to_apply: ((
      | JsonRegistry['minecraft:mob_effect'] | `#${string}:${string}` | TagClass<'mob_effect'>)
      | Array<JsonRegistry['minecraft:mob_effect']>),
  min_duration: JsonLevelBasedValue,
  max_duration: JsonLevelBasedValue,
  min_amplifier: JsonLevelBasedValue,
  max_amplifier: JsonLevelBasedValue,
}

export type JsonAttributeEffect = {
  attribute: JsonRegistry['minecraft:attribute'],
  /**
   * Used when equipping and unequipping the item to identify which modifier to add or remove from the entity.
   *
   * Postfixed with the slot name when the enchanted item is equipped.
   */
  id: NamespacedString,
  /**
   * Change in the attribute.
   */
  amount: JsonLevelBasedValue,
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
  operation: JsonAttributeOperation,
}

export type JsonBlockInteraction = ('none' | 'block' | 'block' | 'mob' | 'mob' | 'tnt' | 'tnt' | 'trigger')

export type JsonChangeItemDamageEffect = {
  /**
   * Damage to apply to the enchanted item. Negative values will repair the item.
   * The change is not applied to items held by players in creative mode.
   */
  amount: JsonLevelBasedValue,
}

export type JsonDamageEntityEffect = {
  damage_type: (JsonRegistry['minecraft:damage_type'] | DamageTypeClass),
  /**
   * Amount of damage is randomized within the given min/max span.
   */
  min_damage: JsonLevelBasedValue,
  max_damage: JsonLevelBasedValue,
}

export type JsonDamageItemEffect = {
  /**
   * Damage to apply to the enchanted item.
   * The damage is not applied to items held by players in creative mode.
   */
  amount: JsonLevelBasedValue,
}

export type JsonEntityEffect = (({
  [S in Extract<LiteralUnion<keyof JsonSymbolEntityEffect>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolEntityEffect ? JsonSymbolEntityEffect[S] : JsonRootNBT))
})[LiteralUnion<keyof JsonSymbolEntityEffect>])

export type JsonExplodeEntityEffect = {
  /**
   * Whether the explosion should be attributed to the user of the enchanted tool.
   */
  attribute_to_user?: boolean,
  /**
   * If omitted, no damage is dealt by the explosion.
   */
  damage_type?: (JsonRegistry['minecraft:damage_type'] | DamageTypeClass),
  /**
   * List of Blocks or hash-prefixed Block Tag specifying which blocks fully block the explosion.
   */
  immune_blocks?: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
  /**
   * If omitted, constant value `1` is applied.
   */
  knockback_multiplier?: JsonLevelBasedValue,
  /**
   * Relative coordinates to offset the explosion by. Defaults to `[0, 0, 0]`.
   *
   * Value:
   * List length range: 3
   */
  offset?: JsonNBTList<(NBTDouble | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  radius: JsonLevelBasedValue,
  /**
   * Whether fire is placed within the explosion radius.
   */
  create_fire?: boolean,
  /**
   * Whether the explosion has special effects on blocks.
   *
   * Value:
   *
   *  - None(`none`): No item drops or special behavior.
   *  - BlockOldDoc(`block`): Drops items as if a block caused the explosion; `blockExplosionDropDecay` game rule applies.
   *  - Block(`block`): Drops items as if a block caused the explosion; `block_explosion_drop_decay` game rule applies.
   *  - MobOldDoc(`mob`): Drops items as if a mob caused the explosion; `mobExplosionDropDecay` game rule applies.
   *  - Mob(`mob`): Drops items as if a mob caused the explosion; `mob_explosion_drop_decay` game rule applies.
   *  - TNTOldDoc(`tnt`): Drops items as if TNT caused the explosion; `tntExplosionDropDecay` game rule applies.
   *  - TNT(`tnt`): Drops items as if TNT caused the explosion; `tnt_explosion_drop_decay` game rule applies.
   *  - Trigger(`trigger`): Triggers redstone-activated blocks.
   */
  block_interaction: JsonBlockInteraction,
  small_particle: JsonParticle,
  large_particle: JsonParticle,
  block_particles?: Array<JsonExplosionParticleInfo>,
  sound: JsonSoundEventRef,
}

export type JsonExplosionParticleInfo = {
  /**
   * Value:
   * Range: 1..
   */
  weight: (NBTInt<{
    min: 1,
  }> | number),
  particle: JsonParticle,
  /**
   * Defaults to 1.0. Scaling of the distance between the center of the explosion and the block
   */
  scaling?: (NBTFloat | number),
  /**
   * Defaults to 1.0. Scaling of the speed of the particle
   */
  speed?: (NBTFloat | number),
}

export type JsonExponentialEffectValue = {
  base: JsonLevelBasedValue,
  exponent: JsonLevelBasedValue,
}

export type JsonIgniteEntityEffect = {
  /**
   * Seconds the fire should last.
   */
  duration: JsonLevelBasedValue,
}

export type JsonLocationBasedEffect = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:enchantment_location_based_effect_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolLocationBasedEffect ? JsonSymbolLocationBasedEffect[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:enchantment_location_based_effect_type'], string>])>

export type JsonMultiplyEffectValue = {
  /**
   * Level-Based Value determining the factor to multiply in
   */
  factor: JsonLevelBasedValue,
}

export type JsonParticlePosition = {
  type: ('entity_position' | 'in_bounding_box'),
  /**
   * Defaults to 0.
   */
  offset?: (NBTFloat | number),
  /**
   * Defaults to 1.
   */
  scale?: (NBTFloat | number),
}

export type JsonParticleVelocity = {
  /**
   * Defaults to 0.
   */
  base?: (NBTFloat | number),
  /**
   * Scale factor applied to the given axis (`1` adds the velocity of the entity to the spawned particles). Defaults to 0.
   */
  movement_scale?: (NBTFloat | number),
}

export type JsonPlaySoundEntityEffect = {
  /**
   * Value:
   * *either*
   *
   * *item 0*
   *
   * *or*
   *
   * List length range: 1..255
   */
  sound: (JsonSoundEventRef | JsonNBTList<JsonSoundEventRef, {
    leftExclusive: false,
    rightExclusive: false,
  }>),
  volume: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number)>,
  pitch: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number)>,
}

export type JsonReduceBinomialEffectValue = {
  /**
   * Chance that an input value is dropped by 1.
   *
   * The span is 0 to 1, with 0 being no chance to drop an input value and 1 dropping all input values.
   */
  chance: JsonLevelBasedValue,
}

export type JsonReplaceBlockEntityEffect = {
  block_state: JsonBlockStateProviderRef,
  /**
   * Relative coordinates to offset the placed block by. Defaults to `[0, 0, 0]`.
   *
   * Value:
   * List length range: 3
   */
  offset?: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * If omitted, all block types are replaced.
   */
  predicate?: JsonBlockPredicate,
  /**
   * Defaults to no game event dispatched.
   */
  trigger_game_event?: JsonRegistry['minecraft:game_event'],
}

export type JsonReplaceDiskEntityEffect = (JsonReplaceBlockEntityEffect & {
  /**
   * Relative coordinates to offset the center of the cylinder by. Defaults to `[0, 0, 0]`.
   *
   * Value:
   * List length range: 3
   */
  offset?: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  radius: JsonLevelBasedValue,
  height: JsonLevelBasedValue,
})

export type JsonRunFunctionEntityEffect = {
  function: (NamespacedString | MCFunctionClass),
}

export type JsonSetBlockPropertiesEntityEffect = {
  properties: JsonSymbolDataComponent['block_state'],
  /**
   * Relative coordinates to offset the block by. Defaults to `[0, 0, 0]`.
   *
   * Value:
   * List length range: 3
   */
  offset?: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Defaults to no game event dispatched.
   */
  trigger_game_event?: JsonRegistry['minecraft:game_event'],
}

export type JsonSetEffectValue = {
  value: JsonLevelBasedValue,
}

export type JsonSpawnParticlesEntityEffect = {
  particle: JsonParticle,
  horizontal_position: JsonParticlePosition,
  vertical_position: JsonParticlePosition,
  horizontal_velocity: JsonParticleVelocity,
  vertical_velocity: JsonParticleVelocity,
  speed?: (NBTFloat | number),
}

export type JsonSummonEntityEffect = {
  /**
   * If multiple entity types are specified, a random entity type is selected.
   */
  entity: ((
        | JsonRegistry['minecraft:entity_type']
        | `#${JsonRegistry['minecraft:tag/entity_type']}`
        | TagClass<'entity_type'>)
      | Array<JsonRegistry['minecraft:entity_type']>),
  /**
   * Whether the summoned entity should join the team of the owner of the Enchanted Item.
   */
  join_team?: boolean,
}

export type JsonValueEffect = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:enchantment_value_effect_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolValueEffect ? JsonSymbolValueEffect[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:enchantment_value_effect_type'], string>])>
type JsonEntityEffectDispatcherMap = {
  'all_of': JsonEntityEffectAllOf,
  'minecraft:all_of': JsonEntityEffectAllOf,
  'apply_exhaustion': JsonEntityEffectApplyExhaustion,
  'minecraft:apply_exhaustion': JsonEntityEffectApplyExhaustion,
  'apply_impulse': JsonEntityEffectApplyImpulse,
  'minecraft:apply_impulse': JsonEntityEffectApplyImpulse,
  'apply_mob_effect': JsonEntityEffectApplyMobEffect,
  'minecraft:apply_mob_effect': JsonEntityEffectApplyMobEffect,
  'change_item_damage': JsonEntityEffectChangeItemDamage,
  'minecraft:change_item_damage': JsonEntityEffectChangeItemDamage,
  'damage_entity': JsonEntityEffectDamageEntity,
  'minecraft:damage_entity': JsonEntityEffectDamageEntity,
  'explode': JsonEntityEffectExplode,
  'minecraft:explode': JsonEntityEffectExplode,
  'ignite': JsonEntityEffectIgnite,
  'minecraft:ignite': JsonEntityEffectIgnite,
  'play_sound': JsonEntityEffectPlaySound,
  'minecraft:play_sound': JsonEntityEffectPlaySound,
  'replace_block': JsonEntityEffectReplaceBlock,
  'minecraft:replace_block': JsonEntityEffectReplaceBlock,
  'replace_disk': JsonEntityEffectReplaceDisk,
  'minecraft:replace_disk': JsonEntityEffectReplaceDisk,
  'run_function': JsonEntityEffectRunFunction,
  'minecraft:run_function': JsonEntityEffectRunFunction,
  'set_block_properties': JsonEntityEffectSetBlockProperties,
  'minecraft:set_block_properties': JsonEntityEffectSetBlockProperties,
  'spawn_particles': JsonEntityEffectSpawnParticles,
  'minecraft:spawn_particles': JsonEntityEffectSpawnParticles,
  'summon_entity': JsonEntityEffectSummonEntity,
  'minecraft:summon_entity': JsonEntityEffectSummonEntity,
}
type JsonEntityEffectKeys = keyof JsonEntityEffectDispatcherMap
type JsonEntityEffectFallback = (
  | JsonEntityEffectAllOf
  | JsonEntityEffectApplyExhaustion
  | JsonEntityEffectApplyImpulse
  | JsonEntityEffectApplyMobEffect
  | JsonEntityEffectChangeItemDamage
  | JsonEntityEffectDamageEntity
  | JsonEntityEffectExplode
  | JsonEntityEffectIgnite
  | JsonEntityEffectPlaySound
  | JsonEntityEffectReplaceBlock
  | JsonEntityEffectReplaceDisk
  | JsonEntityEffectRunFunction
  | JsonEntityEffectSetBlockProperties
  | JsonEntityEffectSpawnParticles
  | JsonEntityEffectSummonEntity)
type JsonEntityEffectAllOf = JsonAllOfEntityEffect
type JsonEntityEffectApplyExhaustion = JsonApplyExhaustionEntityEffect
type JsonEntityEffectApplyImpulse = JsonApplyImpulseEntityEffect
type JsonEntityEffectApplyMobEffect = JsonApplyMobEffectEntityEffect
type JsonEntityEffectChangeItemDamage = JsonChangeItemDamageEffect
type JsonEntityEffectDamageEntity = JsonDamageEntityEffect
type JsonEntityEffectExplode = JsonExplodeEntityEffect
type JsonEntityEffectIgnite = JsonIgniteEntityEffect
type JsonEntityEffectPlaySound = JsonPlaySoundEntityEffect
type JsonEntityEffectReplaceBlock = JsonReplaceBlockEntityEffect
type JsonEntityEffectReplaceDisk = JsonReplaceDiskEntityEffect
type JsonEntityEffectRunFunction = JsonRunFunctionEntityEffect
type JsonEntityEffectSetBlockProperties = JsonSetBlockPropertiesEntityEffect
type JsonEntityEffectSpawnParticles = JsonSpawnParticlesEntityEffect
type JsonEntityEffectSummonEntity = JsonSummonEntityEffect
export type JsonSymbolEntityEffect<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonEntityEffectDispatcherMap
  : CASE extends 'keys' ? JsonEntityEffectKeys : CASE extends '%fallback' ? JsonEntityEffectFallback : never
type JsonLocationBasedEffectDispatcherMap = {
  'all_of': JsonLocationBasedEffectAllOf,
  'minecraft:all_of': JsonLocationBasedEffectAllOf,
  'apply_exhaustion': JsonLocationBasedEffectApplyExhaustion,
  'minecraft:apply_exhaustion': JsonLocationBasedEffectApplyExhaustion,
  'apply_impulse': JsonLocationBasedEffectApplyImpulse,
  'minecraft:apply_impulse': JsonLocationBasedEffectApplyImpulse,
  'apply_mob_effect': JsonLocationBasedEffectApplyMobEffect,
  'minecraft:apply_mob_effect': JsonLocationBasedEffectApplyMobEffect,
  'attribute': JsonLocationBasedEffectAttribute,
  'minecraft:attribute': JsonLocationBasedEffectAttribute,
  'change_item_damage': JsonLocationBasedEffectChangeItemDamage,
  'minecraft:change_item_damage': JsonLocationBasedEffectChangeItemDamage,
  'damage_entity': JsonLocationBasedEffectDamageEntity,
  'minecraft:damage_entity': JsonLocationBasedEffectDamageEntity,
  'explode': JsonLocationBasedEffectExplode,
  'minecraft:explode': JsonLocationBasedEffectExplode,
  'ignite': JsonLocationBasedEffectIgnite,
  'minecraft:ignite': JsonLocationBasedEffectIgnite,
  'play_sound': JsonLocationBasedEffectPlaySound,
  'minecraft:play_sound': JsonLocationBasedEffectPlaySound,
  'replace_block': JsonLocationBasedEffectReplaceBlock,
  'minecraft:replace_block': JsonLocationBasedEffectReplaceBlock,
  'replace_disk': JsonLocationBasedEffectReplaceDisk,
  'minecraft:replace_disk': JsonLocationBasedEffectReplaceDisk,
  'run_function': JsonLocationBasedEffectRunFunction,
  'minecraft:run_function': JsonLocationBasedEffectRunFunction,
  'set_block_properties': JsonLocationBasedEffectSetBlockProperties,
  'minecraft:set_block_properties': JsonLocationBasedEffectSetBlockProperties,
  'spawn_particles': JsonLocationBasedEffectSpawnParticles,
  'minecraft:spawn_particles': JsonLocationBasedEffectSpawnParticles,
  'summon_entity': JsonLocationBasedEffectSummonEntity,
  'minecraft:summon_entity': JsonLocationBasedEffectSummonEntity,
}
type JsonLocationBasedEffectKeys = keyof JsonLocationBasedEffectDispatcherMap
type JsonLocationBasedEffectFallback = (
  | JsonLocationBasedEffectAllOf
  | JsonLocationBasedEffectApplyExhaustion
  | JsonLocationBasedEffectApplyImpulse
  | JsonLocationBasedEffectApplyMobEffect
  | JsonLocationBasedEffectAttribute
  | JsonLocationBasedEffectChangeItemDamage
  | JsonLocationBasedEffectDamageEntity
  | JsonLocationBasedEffectExplode
  | JsonLocationBasedEffectIgnite
  | JsonLocationBasedEffectPlaySound
  | JsonLocationBasedEffectReplaceBlock
  | JsonLocationBasedEffectReplaceDisk
  | JsonLocationBasedEffectRunFunction
  | JsonLocationBasedEffectSetBlockProperties
  | JsonLocationBasedEffectSpawnParticles
  | JsonLocationBasedEffectSummonEntity)
type JsonLocationBasedEffectAllOf = JsonAllOfLocationBasedEffect
type JsonLocationBasedEffectApplyExhaustion = JsonApplyExhaustionEntityEffect
type JsonLocationBasedEffectApplyImpulse = JsonApplyImpulseEntityEffect
type JsonLocationBasedEffectApplyMobEffect = JsonApplyMobEffectEntityEffect
type JsonLocationBasedEffectAttribute = JsonAttributeEffect
type JsonLocationBasedEffectChangeItemDamage = JsonChangeItemDamageEffect
type JsonLocationBasedEffectDamageEntity = JsonDamageEntityEffect
type JsonLocationBasedEffectExplode = JsonExplodeEntityEffect
type JsonLocationBasedEffectIgnite = JsonIgniteEntityEffect
type JsonLocationBasedEffectPlaySound = JsonPlaySoundEntityEffect
type JsonLocationBasedEffectReplaceBlock = JsonReplaceBlockEntityEffect
type JsonLocationBasedEffectReplaceDisk = JsonReplaceDiskEntityEffect
type JsonLocationBasedEffectRunFunction = JsonRunFunctionEntityEffect
type JsonLocationBasedEffectSetBlockProperties = JsonSetBlockPropertiesEntityEffect
type JsonLocationBasedEffectSpawnParticles = JsonSpawnParticlesEntityEffect
type JsonLocationBasedEffectSummonEntity = JsonSummonEntityEffect
export type JsonSymbolLocationBasedEffect<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonLocationBasedEffectDispatcherMap
  : CASE extends 'keys'
    ? JsonLocationBasedEffectKeys
    : CASE extends '%fallback' ? JsonLocationBasedEffectFallback : never
type JsonValueEffectDispatcherMap = {
  'add': JsonValueEffectAdd,
  'minecraft:add': JsonValueEffectAdd,
  'all_of': JsonValueEffectAllOf,
  'minecraft:all_of': JsonValueEffectAllOf,
  'exponential': JsonValueEffectExponential,
  'minecraft:exponential': JsonValueEffectExponential,
  'multiply': JsonValueEffectMultiply,
  'minecraft:multiply': JsonValueEffectMultiply,
  'remove_binomial': JsonValueEffectRemoveBinomial,
  'minecraft:remove_binomial': JsonValueEffectRemoveBinomial,
  'set': JsonValueEffectSet,
  'minecraft:set': JsonValueEffectSet,
}
type JsonValueEffectKeys = keyof JsonValueEffectDispatcherMap
type JsonValueEffectFallback = (
  | JsonValueEffectAdd
  | JsonValueEffectAllOf
  | JsonValueEffectExponential
  | JsonValueEffectMultiply
  | JsonValueEffectRemoveBinomial
  | JsonValueEffectSet)
type JsonValueEffectAdd = JsonAddEffectValue
type JsonValueEffectAllOf = JsonAllOfEffectValue
type JsonValueEffectExponential = JsonExponentialEffectValue
type JsonValueEffectMultiply = JsonMultiplyEffectValue
type JsonValueEffectRemoveBinomial = JsonReduceBinomialEffectValue
type JsonValueEffectSet = JsonSetEffectValue
export type JsonSymbolValueEffect<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonValueEffectDispatcherMap
  : CASE extends 'keys' ? JsonValueEffectKeys : CASE extends '%fallback' ? JsonValueEffectFallback : never
