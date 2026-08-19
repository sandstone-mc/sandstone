import type {
  JsonBlockPredicate,
  JsonItemPredicate,
} from 'sandstone/arguments/generated/_json/data/advancement/predicate.ts'
import type { JsonDamageType } from 'sandstone/arguments/generated/_json/data/damage_type.ts'
import type { JsonResolvableNumber } from 'sandstone/arguments/generated/_json/data/number_provider.ts'
import type { JsonTrimMaterial, JsonTrimPattern } from 'sandstone/arguments/generated/_json/data/trim.ts'
import type { JsonSoundEventRef } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonInstrument } from 'sandstone/arguments/generated/_json/data/variants/instrument.ts'
import type {
  JsonBlockStateProvider,
} from 'sandstone/arguments/generated/_json/data/worldgen/feature/block_state_provider.ts'
import type {
  JsonSymbolMcdocBlockItemStates,
  JsonSymbolMcdocBlockStateKeys,
} from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonAttributeOperation } from 'sandstone/arguments/generated/_json/util/attribute.ts'
import type { JsonProfile } from 'sandstone/arguments/generated/_json/util/avatar.ts'
import type { JsonDyeColor, JSONRGB } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonDirection } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonMobEffectInstance } from 'sandstone/arguments/generated/_json/util/effect.ts'
import type { JsonFilterable, JsonGlobalPos } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonEquipmentSlot, JsonEquipmentSlotGroup } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonBannerPatternLayer } from 'sandstone/arguments/generated/_json/world/block/banner.ts'
import type { JsonBlockEntityData } from 'sandstone/arguments/generated/_json/world/block.ts'
import type {
  JsonContainerLoot,
  JsonContainerSlot,
  JsonOccupant,
  JsonPotDecorations,
  JsonSignText,
} from 'sandstone/arguments/generated/_json/world/component/block.ts'
import type {
  JsonAxolotlVariant,
  JsonFoxType,
  JsonHorseVariant,
  JsonLlamaVariant,
  JsonMooshroomType,
  JsonParrotVariant,
  JsonRabbitVariant,
  JsonSalmonType,
  JsonTropicalFishPattern,
} from 'sandstone/arguments/generated/_json/world/component/entity.ts'
import type { JsonCustomData } from 'sandstone/arguments/generated/_json/world/component.ts'
import type { JsonAnyEntity } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonItemStackTemplate } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { TextureType } from 'sandstone/arguments'
import type {
  BannerPatternClass,
  DamageTypeClass,
  DecoratedPotPatternClass,
  EquipmentClass,
  InstrumentClass,
  ItemModelDefinitionClass,
  JsonNBTList,
  JukeboxSongClass,
  LootTableClass,
  NamespacedString,
  NBTByte,
  NBTClass,
  NBTDouble,
  NBTFloat,
  NBTInt,
  NBTLong,
  NonEmptyString,
  RecipeClass,
  TagClass,
  TextureClass,
  TrimMaterialClass,
  TrimPatternClass,
  VariantClass,
} from 'sandstone'

/**
 * *either*
 *
 * List length range: 1..
 *
 * *or*
 *
 * *item 1*
 */
export type JsonAdventureModePredicate = (JsonNBTList<JsonBlockPredicate, {
  leftExclusive: false,
  min: 1,
}> | JsonBlockPredicate)

export type JsonApplyEffectsConsumeEffect = {
  effects: Array<JsonMobEffectInstance>,
  /**
   * Chance the effects will be applied once consumed.
   *
   * Value:
   * Range: 0..1
   */
  probability?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonAttackRange = {
  /**
   * Minimum distance to the target to be considered valid.
   * Defaults to 0.0
   *
   * Value:
   * Range: 0..64
   */
  min_reach?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Maximum distance to the target to be considered valid.
   * Defaults to 3.0
   *
   * Value:
   * Range: 0..64
   */
  max_reach?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Minimum distance from the creative mode attacker to the target to be considered valid.
   * Defaults to 0.0
   *
   * Value:
   * Range: 0..64
   */
  min_creative_reach?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Maximum distance from the creative mode attacker to the target to be considered valid.
   * Defaults to 5.0
   *
   * Value:
   * Range: 0..64
   */
  max_creative_reach?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * The margin applied to the target bounding box when checking for valid hitbox collision.
   * Defaults to 0.3
   *
   * Value:
   * Range: 0..1
   */
  hitbox_margin?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * The multiplier applied to `min_reach` and `max_reach` when the user is a mob.
   *
   * Value:
   * Range: 0..2
   */
  mob_factor?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
}

export type JsonAttributeDisplay = NonNullable<({
  [S in Extract<Extract<JsonAttributeDisplayType, string>, string>]?: ({
    /**
     * Value:
     *
     *  - Default(`default`): Shows the calculated attribute modifier values on the tooltip.
     *  - Hidden(`hidden`): Does not show the attribute modifier entry in tooltips.
     *  - Override(`override`): Replaces the shown attribute modifier text.
     */
    type: S,
  } & (S extends keyof JsonSymbolAttributeDisplay ? JsonSymbolAttributeDisplay[S] : JsonRootNBT))
}[Extract<JsonAttributeDisplayType, string>])>

export type JsonAttributeDisplayTextOverride = {
  /**
   * The text contents to show for this attribute modifer entry.
   */
  value: JsonText,
}

export type JsonAttributeDisplayType = ('default' | 'hidden' | 'override')

export type JsonAttributeModifier = {
  type: JsonRegistry['minecraft:attribute'],
  /**
   * Used when equipping and unequipping the item to identify which modifier to add or remove from the entity.
   */
  id: NamespacedString,
  /**
   * Change in the attribute.
   */
  amount: (NBTDouble | number),
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
  operation: JsonAttributeOperation,
  /**
   * Slot or slot type the item must be in for the modifier to take effect. Defaults to `any`.
   *
   * Value:
   *
   *  - Mainhand(`mainhand`)
   *  - Offhand(`offhand`)
   *  - Head(`head`)
   *  - Chest(`chest`)
   *  - Legs(`legs`)
   *  - Feet(`feet`)
   *  - Hand(`hand`)
   *  - Armor(`armor`)
   *  - Any(`any`)
   *  - Body(`body`)
   *  - Saddle(`saddle`)
   */
  slot?: JsonEquipmentSlotGroup,
  /**
   * Controls how this modifier is shown in the item tooltip.
   */
  display?: JsonAttributeDisplay,
}

export type JsonAttributeModifiers = {
  modifiers: Array<JsonAttributeModifier>,
  show_in_tooltip?: boolean,
}

export type Jsonblocks_attacks = {
  /**
   * Number of seconds that right-click must be held before successfully blocking attacks.
   * Defaults to `0`.
   *
   * Value:
   * Range: 0..
   */
  block_delay_seconds?: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
  /**
   * Multiplier applied to the number of seconds that the item will be on cooldown for when attacked by a disabling attack (`disable_blocking_for_seconds` on the `weapon` component).
   * Defaults to `1`.
   * If `0`, this item can never be disabled by attacks.
   *
   * Value:
   * Range: 0..
   */
  disable_cooldown_scale?: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
  /**
   * Controls how much damage should be blocked in a given attack. If not specified, all damage is blocked.
   * Each entry in the list contributes an amount of damage to be blocked, optionally filtered by a damage type.
   * Each entry adds to blocked damage, determined by `clamp(base + factor * dealt_damage, 0, dealt_damage)`.
   * The final damage applied in the attack to the entity is determined by `dealt_damage - clamp(blocked_damage, 0, dealt_damage)`.
   */
  damage_reductions?: Array<JsonDamageReduction>,
  /**
   * Controls how much damage should be applied to the item from a given attack.
   * If not specified, a point of durability is removed for every point of damage dealt.
   * The final damage applied to the item is determined by `floor(base + factor * dealt_damage)`.
   * The final value may be negative, causing the item to be repaired.
   */
  item_damage?: JsonItemDamageFunction,
  /**
   * Sound played when an attack is successfully blocked.
   */
  block_sound?: JsonSoundEventRef,
  /**
   * Sound played when the item goes on its disabled cooldown due to an attack.
   */
  disabled_sound?: JsonSoundEventRef,
  /**
   * Damage types in this tag are bypassing the blocking
   */
  bypassed_by?: ((
        | JsonRegistry['minecraft:damage_type']
        | `#${JsonRegistry['minecraft:tag/damage_type']}`
        | TagClass<'damage_type'>
        | DamageTypeClass)
      | Array<(JsonRegistry['minecraft:damage_type'] | DamageTypeClass)>),
}

export type JsonBlockTransformDropStrategy = ('clicked_face' | 'from_middle')

export type JsonBlockTransformer = {
  /**
   * If the provider returns no result, the next transformer will be attempted.
   */
  block_state_provider: JsonBlockStateProvider,
  /**
   * Defaults to not playing sound.
   */
  sound?: JsonSoundEventRef,
  /**
   * Defaults to `none`.
   *
   * Value:
   *
   *  - None(`none`)
   *  - Scrape(`scrape`)
   *  - WaxOn(`wax_on`)
   *  - WaxOff(`wax_off`)
   */
  particle?: JsonBlockTransformParticle,
  /**
   * If a disallowed face is interacted with, the next transformer will be attempted. \
   * Defaults to empty (allowing all faces).
   */
  disallowed_faces?: Array<JsonDirection>,
  /**
   * The loot to drop on a successful transformation. \
   * Defaults to drop nothing.
   */
  loot?: (JsonRegistry['minecraft:loot_table'] | LootTableClass),
  /**
   * Where the `loot` should drop. \
   * Defaults to `from_middle`.
   *
   * Value:
   *
   *  - ClickedFace(`clicked_face`)
   *  - FromMiddle(`from_middle`)
   */
  drop_strategy?: JsonBlockTransformDropStrategy,
  /**
   * How nearby blocks are affected by the transformation. \
   * Defaults to `single_block`.
   *
   * Value:
   *
   *  - SingleBlock(`single_block`)
   *  - CopperChest(`copper_chest`): If the original block and the transformed block are both copper chests of any kind, the transform applies to the other half of the double chest.
   */
  transform_type?: JsonBlockTransformType,
  /**
   * Whether the transformed block should update based on neighboring blocks. \
   * Defaults to `true`.
   */
  update_from_neighbors?: boolean,
  /**
   * Only has effect on stackable items. \
   * Defaults to `true`.
   */
  consume_on_use?: boolean,
  /**
   * Only has effect on unstackable items. \
   * Defauls to 1.
   *
   * Value:
   * Range: 0..
   */
  item_damage_per_use?: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonBlockTransformParticle = ('none' | 'scrape' | 'wax_on' | 'wax_off')

export type JsonBlockTransformType = ('single_block' | 'copper_chest')

export type JsonBookGeneration = (0 | 1 | 2 | 3)

export type JsonBrewingFuel = {
  uses: JsonResolvableNumber,
  speed_multiplier: JsonResolvableNumber,
}

export type JsonBucketEntityData = {
  /**
   * Whether it should have an AI.
   */
  NoAI?: boolean,
  /**
   * Whether the entity should make any sound.
   */
  Silent?: boolean,
  /**
   * Whether the entity should be effected by gravity.
   */
  NoGravity?: boolean,
  /**
   * Whether the entity should glow.
   */
  Glowing?: boolean,
  /**
   * Whether the entity should take damage.
   */
  Invulnerable?: boolean,
  /**
   * Whether the entity should not despawn naturally.
   */
  PersistenceRequired?: boolean,
  Health?: (NBTFloat | number),
  /**
   * Turns into the expiry time of the memory module `has_hunting_cooldown` for axolotls.
   */
  HuntingCooldown?: (NBTLong | number),
  /**
   * The age for axolotl and tadpole.
   */
  Age?: (NBTInt | number),
  /**
   * The age locked state for axolotl and tadpole.
   */
  AgeLocked?: boolean,
  /**
   * The age for sulfur cube.
   */
  age?: (NBTInt | number),
  /**
   * The age locked state for sulfur cube.
   */
  age_locked?: boolean,
}

export type JsonCompostable = {
  layers: JsonResolvableNumber,
}

export type JsonConsumable = {
  /**
   * Time taken for a player to consume the item. Defaults to 1.6.
   *
   * Value:
   * Range: 0..
   */
  consume_seconds?: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
  /**
   * View model/arms animation used during consumption of the item. Defaults to `eat`.
   *
   * Value:
   *
   *  - None(`none`)
   *  - Eat(`eat`)
   *  - Drink(`drink`)
   *  - Block(`block`)
   *  - Bow(`bow`)
   *  - OldTrident(`spear`): Used for Tridents.
   *  - Trident(`trident`)
   *  - Spear(`spear`)
   *  - Crossbow(`crossbow`)
   *  - Spyglass(`spyglass`)
   *  - TootHorn(`toot_horn`): Used for Goat Horns.
   *  - Brush(`brush`)
   *  - Bundle(`bundle`)
   */
  animation?: JsonItemUseAnimation,
  /**
   * Sound played during and on completion of item consumption.
   */
  sound?: JsonSoundEventRef,
  /**
   * Whether the `item` particle is emitted while consuming the item. Defaults to `true`.
   */
  has_consume_particles?: boolean,
  /**
   * Side effects which take place after consuming the item.
   */
  on_consume_effects?: Array<JsonConsumeEffect>,
}

export type JsonConsumeEffect = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:consume_effect_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolConsumeEffect ? JsonSymbolConsumeEffect[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:consume_effect_type'], string>])>

export type JsonCookingFuel = {
  burn_time: JsonResolvableNumber,
  speed_multiplier: JsonResolvableNumber,
}

export type JsonCustomModelData = {
  floats?: Array<(NBTFloat | number)>,
  flags?: Array<boolean>,
  strings?: Array<string>,
  colors?: Array<JSONRGB>,
}

export type JsonDamageReduction = {
  /**
   * An optional damage type to filter this reduction by.
   * If not specified, any damage type is accepted for this reduction.
   */
  type?: ((
        | JsonRegistry['minecraft:damage_type']
        | `#${JsonRegistry['minecraft:tag/damage_type']}`
        | TagClass<'damage_type'>
        | DamageTypeClass)
      | Array<(JsonRegistry['minecraft:damage_type'] | DamageTypeClass)>),
  /**
   * Constant amount of damage to be blocked.
   */
  base: (NBTFloat | number),
  /**
   * Fraction of the dealt damage that should be blocked.
   */
  factor: (NBTFloat | number),
  /**
   * Maximum angle between facing direction and incoming attack direction for the blocking to be effective
   *
   * Value:
   * Range: 0<..
   * Minimum is exclusive; must be higher than 0
   */
  horizontal_blocking_angle?: (NBTFloat<{
    leftExclusive: true,
    min: 1,
  }> | number),
}

export type JsonDamageResistant = {
  /**
   * The damage types which the item is resistant to when in entity form.
   * Additionally, this also affects whether the equipped item will be damaged when the wearer is hurt by a specified damage type.
   */
  types: ((
        | JsonRegistry['minecraft:damage_type']
        | `#${JsonRegistry['minecraft:tag/damage_type']}`
        | TagClass<'damage_type'>
        | DamageTypeClass)
      | Array<(JsonRegistry['minecraft:damage_type'] | DamageTypeClass)>),
}

export type JsonDeathProtection = {
  /**
   * Effects applied when the item protects the holder.
   */
  death_effects?: Array<JsonConsumeEffect>,
}

export type JsonDebugStickState = ({
  [Key in Extract<JsonRegistry['minecraft:block'], string>]?: (Key extends keyof JsonSymbolMcdocBlockStateKeys
    ? JsonSymbolMcdocBlockStateKeys[Key]
    : JsonSymbolMcdocBlockStateKeys<'%unknown'>)
})

export type JsonDyedColor = {
  /**
   * Color of the armor.
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  rgb: (NBTInt | number),
  show_in_tooltip?: boolean,
}

export type JsonEnchantable = {
  /**
   * Value:
   * Range: 1..
   */
  value: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonEnchantmentLevels = ({
  [Key in Extract<JsonRegistry['minecraft:enchantment'], string>]?: (NBTInt<{
    min: 1,
  }> | number)
})

export type JsonEnchantments = {
  levels: JsonEnchantmentLevels,
  show_in_tooltip?: boolean,
}

export type JsonEquippable = {
  /**
   * Value:
   *
   *  - Mainhand(`mainhand`)
   *  - Offhand(`offhand`)
   *  - Head(`head`)
   *  - Chest(`chest`)
   *  - Legs(`legs`)
   *  - Feet(`feet`)
   *  - Body(`body`)
   *  - Saddle(`saddle`)
   */
  slot: JsonEquipmentSlot,
  /**
   * Sound event to play when the item is equipped.
   * If not specified, the default armor equip sound will be played.
   */
  equip_sound?: JsonSoundEventRef,
  asset_id?: (JsonRegistry['minecraft:equipment'] | EquipmentClass),
  /**
   * The overlay texture that should render in first person when equipped.
   */
  camera_overlay?: (JsonRegistry['minecraft:texture'] | TextureClass<TextureType>),
  /**
   * Limits which entities can equip this item.
   */
  allowed_entities?: ((
        | JsonRegistry['minecraft:entity_type']
        | `#${JsonRegistry['minecraft:tag/entity_type']}`
        | TagClass<'entity_type'>)
      | Array<JsonRegistry['minecraft:entity_type']>),
  /**
   * Whether the item can be equipped by using a dispenser. Defaults to `true`.
   */
  dispensable?: boolean,
  /**
   * Whether the item can be equipped by right-clicking. Defaults to `true`.
   */
  swappable?: boolean,
  /**
   * Whether the item will be damaged when the wearer is damaged. Defaults to `true`.
   */
  damage_on_hurt?: boolean,
  /**
   * Whether players can equip this item onto a target mob by right-clicking it (as long as this item can be equipped on the target at all).
   * The item will not be equipped if the target already has an item in the relevant slot.
   * Defaults to `false`.
   */
  equip_on_interact?: boolean,
  /**
   * Whether players can use shears to remove this item from a mob by right-clicking it (as long as other shearing conditions are satisfied).
   * Defaults to `false`.
   */
  can_be_sheared?: boolean,
  /**
   * Sound event to play when the item is sheared from a mob.
   * If not specified, the default shearing sound (`item.shears.snip`) will be played.
   */
  shearing_sound?: JsonSoundEventRef,
}

export type JsonExplosion = {
  /**
   * The shape of the explosion.
   *
   * Value:
   *
   *  - SmallBall(`small_ball`)
   *  - LargeBall(`large_ball`)
   *  - Star(`star`)
   *  - Creeper(`creeper`)
   *  - Burst(`burst`)
   */
  shape: JsonFireworkShape,
  /**
   * Colors of the initial particles of the explosion, randomly selected from.
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  colors?: Array<(NBTInt | number)>,
  /**
   * Colors of the fading particles of the explosion
   */
  fade_colors?: Array<(NBTInt | number)>,
  /**
   * Added to a firework star via Diamond.
   */
  has_trail?: boolean,
  /**
   * Added to a firework star via Glowstone Dust.
   */
  has_twinkle?: boolean,
}

export type JsonFireworks = {
  /**
   * Value:
   * List length range: 0..256
   */
  explosions?: JsonNBTList<JsonExplosion, {
    leftExclusive: false,
    rightExclusive: false,
  }>,
  flight_duration?: (NBTByte | number),
}

export type JsonFireworkShape = ('small_ball' | 'large_ball' | 'star' | 'creeper' | 'burst')

export type JsonFood = {
  /**
   * Food points/haunches restored when eaten (capped to 20.0).
   *
   * Value:
   * Range: 0..
   */
  nutrition: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Exact value added to the player's saturation level, capped at whatever the [new] food points value is.
   */
  saturation: (NBTFloat | number),
  /**
   * Whether the item can be eaten when the player's food points/haunches are full. Defaults to `false`
   */
  can_always_eat?: boolean,
}

export type JsonFoodEffect = {
  effect: JsonMobEffectInstance,
  /**
   * Chance for the effect to be applied. Defaults to 1.
   *
   * Value:
   * Range: 0..1
   */
  probability?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonItemDamageFunction = {
  /**
   * Minimum amount of damage dealt by the attack before this item damage is applied to the item.
   *
   * Value:
   * Range: 0..
   */
  threshold: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
  /**
   * Constant amount of damage applied to the item, if `threshold` is passed.
   */
  base: (NBTFloat | number),
  /**
   * Fraction of the dealt damage that should be applied to the item, if `threshold` is passed.
   */
  factor: (NBTFloat | number),
}

export type JsonItemUseAnimation = (
  | 'none'
  | 'eat'
  | 'drink'
  | 'block'
  | 'bow'
  | 'spear'
  | 'trident'
  | 'spear'
  | 'crossbow'
  | 'spyglass'
  | 'toot_horn'
  | 'brush'
  | 'bundle')

export type JsonJukeboxPlayable = {
  song: (JsonRegistry['minecraft:jukebox_song'] | JukeboxSongClass),
  show_in_tooltip?: boolean,
}

export type JsonKineticWeapon = {
  /**
   * The time in ticks required for charging.
   * Defaults to 0
   *
   * Value:
   * Range: 0..
   */
  delay_ticks?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * The cooldown in ticks after hitting, and loosing contact with an entity before being able to hit it again
   * Defaults to 10
   *
   * Value:
   * Range: 0..
   */
  contact_cooldown_ticks?: (NBTInt<{
    min: 0,
  }> | number),
  dismount_conditions?: JsonKineticWeaponEffectCondition,
  knockback_conditions?: JsonKineticWeaponEffectCondition,
  damage_conditions?: JsonKineticWeaponEffectCondition,
  /**
   * The distance the item moves out of hand during animation.
   * Defaults to 0.0
   */
  forward_movement?: (NBTFloat | number),
  /**
   * The multiplier for the final damage from the relative speed.
   * Defaults to 1.0
   */
  damage_multiplier?: (NBTFloat | number),
  /**
   * Sound to play when the weapon is engaged.
   */
  sound?: JsonSoundEventRef,
  /**
   * Sound to play when the weapon hits an entity.
   */
  hit_sound?: JsonSoundEventRef,
}

export type JsonKineticWeaponEffectCondition = {
  /**
   * The duration in ticks this condition can pass.
   * Starts counting after charged.
   */
  max_duration_ticks: (NBTInt | number),
  /**
   * The minimum attacker speed required.
   * Defaults to 0.0
   */
  min_speed?: (NBTFloat | number),
  /**
   * The minimum relative speed required.
   * Defaults to 0.0
   */
  min_relative_speed?: (NBTFloat | number),
}

export type JsonLodestoneTracker = {
  /**
   * Location of the lodestone. Optional. If not set, the compass will spin randomly.
   */
  target?: JsonGlobalPos,
  /**
   * When `true`, the component is removed when the lodestone is broken. When `false`, the component is kept. Defaults to true.
   */
  tracked?: boolean,
}

export type JsonMapDecoration = {
  /**
   * Decoration type.
   */
  type: JsonRegistry['minecraft:map_decoration_type'],
  /**
   * World x position.
   */
  x: (NBTDouble | number),
  /**
   * World z position.
   */
  z: (NBTDouble | number),
  /**
   * Rotation of the decoration, measured in degrees clockwise.
   */
  rotation: (NBTFloat | number),
}

export type JsonMapDecorations = ({
  [Key in NonEmptyString]?: JsonMapDecoration
})

export type JsonMobVisibility = {
  /**
   * Entities to match.
   */
  targeting_entity_types: ((
        | JsonRegistry['minecraft:entity_type']
        | `#${JsonRegistry['minecraft:tag/entity_type']}`
        | TagClass<'entity_type'>)
      | Array<JsonRegistry['minecraft:entity_type']>),
  /**
   * Visibility factor, with `0.0` reducing the range at which mobs detects the entity to `2`, while `10.0` increases the detection range tenfold.
   * While multiple items with this component stack, the maximum vision will still never exceed `10.0`.
   *
   * Value:
   * Range: 0..10
   */
  visibility: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
}

export type JsonPiercingWeapon = {
  /**
   * Whether the attack deals knockback.
   * Defaults to `true`.
   */
  deals_knockback?: boolean,
  /**
   * Whether the attack dismounts the target.
   * Defaults to `false`.
   */
  dismounts?: boolean,
  /**
   * Sound to play when using the weapon to attack.
   */
  sound?: JsonSoundEventRef,
  /**
   * Sound to play when the weapon hits an entity.
   */
  hit_sound?: JsonSoundEventRef,
}

export type JsonPlaySoundConsumeEffect = {
  sound: JsonSoundEventRef,
}

export type JsonPotionContents = {
  potion?: JsonRegistry['minecraft:potion'],
  /**
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  custom_color?: (NBTInt | number),
  /**
   * If present, is used to generate the item name using the translation key `item.minecraft.<potion_type>.effect.<custom_name>`.
   */
  custom_name?: string,
  custom_effects?: Array<JsonMobEffectInstance>,
}

export type JsonRarity = ('common' | 'uncommon' | 'rare' | 'epic')

export type JsonRemoveEffectsConsumeEffect = {
  effects: ((
      | JsonRegistry['minecraft:mob_effect'] | `#${string}:${string}` | TagClass<'mob_effect'>)
      | Array<JsonRegistry['minecraft:mob_effect']>),
}

export type JsonRepairable = {
  items: ((
      | JsonRegistry['minecraft:item'] | `#${JsonRegistry['minecraft:tag/item']}` | TagClass<'item'>)
      | Array<JsonRegistry['minecraft:item']>),
}

export type JsonSuspiciousStewEffect = {
  id: JsonRegistry['minecraft:mob_effect'],
  /**
   * Duration of the effect in ticks. Defaults to `160`; 8 seconds.
   *
   * Value:
   * Range: 1..
   */
  duration?: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonSwingAnimation = {
  /**
   * The animation type to play when attacking or interacting using this item.
   * Defaults to `whack`.
   *
   * Value:
   *
   *  - None(`none`)
   *  - Whack(`whack`)
   *  - Stab(`stab`)
   */
  type?: JsonSwingAnimationType,
  /**
   * The animation duration in ticks.
   * Defaults to 6
   *
   * Value:
   * Range: 1..
   */
  duration?: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonSwingAnimationType = ('none' | 'whack' | 'stab')

export type JsonTeleportRandomlyConsumeEffect = {
  /**
   * Defaults to 16.
   *
   * Value:
   * Range: 1..
   */
  diameter?: (NBTFloat<{
    leftExclusive: false,
    min: 1,
  }> | number),
}

export type JsonTool = {
  /**
   * Blocks that this tool has a special behavior with.
   */
  rules: Array<JsonToolRule>,
  /**
   * Used if no rules override it. Defaults to 1.0.
   */
  default_mining_speed?: (NBTFloat | number),
  /**
   * Amount of durability to remove each time a block is broken with this tool. Must be a non-negative integer.
   */
  damage_per_block?: (NBTInt | number),
  /**
   * If `false`, players cannot break blocks while holding this tool in creative mode. Defaults to `true`.
   */
  can_destroy_blocks_in_creative?: boolean,
}

export type JsonToolRule = {
  blocks: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
  /**
   * Overrides the default mining speed.
   */
  speed?: (NBTFloat | number),
  /**
   * Overrides whether or not this tool is considered correct to mine at its most efficient speed, and to drop items if the block's loot table requires it.
   */
  correct_for_drops?: boolean,
}

export type JsonTooltipDisplay = {
  /**
   * If `true`, the item will have no tooltip when hovered. Defaults to `false`.
   */
  hide_tooltip?: boolean,
  /**
   * List of components that should be hidden in the item tooltip.
   */
  hidden_components?: Array<JsonRegistry['minecraft:data_component_type']>,
}

export type JsonTrim = {
  /**
   * The trim material of this item..
   */
  material: ((JsonRegistry['minecraft:trim_material'] | TrimMaterialClass) | JsonTrimMaterial),
  /**
   * The trim pattern of this item.
   */
  pattern: ((JsonRegistry['minecraft:trim_pattern'] | TrimPatternClass) | JsonTrimPattern),
}

export type JsonUnbreakable = Record<string, never>

export type JsonUseCooldown = {
  /**
   * Time the cooldown will last.
   *
   * Value:
   * Range: 0<..
   * Minimum is exclusive; must be higher than 0
   */
  seconds: (NBTFloat<{
    leftExclusive: true,
    min: 1,
  }> | number),
  /**
   * If present, this item will be part of a cooldown group and no longer share cooldowns with its base item type.
   * Instead, cooldowns applied to this item will only be shared with any other items that are part of the same cooldown group.
   *
   * Value:
   *
   * Value: Defines a `cooldown_group` id.
   */
  cooldown_group?: NamespacedString,
}

export type JsonUseEffects = {
  /**
   * Whether the player can sprint while using this item.
   * Defaults to `false`.
   */
  can_sprint?: boolean,
  /**
   * The speed multiplier applied to the player while using this item.
   * Defaults to 0.2
   *
   * Value:
   * Range: 0..1
   */
  speed_multiplier?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Whether using this item emits game events (`item_interact_start` and `item_interact_finish`).
   * Defaults to `true`.
   */
  interact_vibrations?: boolean,
}

export type JsonVillagerFood = {
  /**
   * How much hunger the item satiates in the Villager once eaten.
   *
   * Value:
   * Range: 1..
   */
  nutrition: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonWeapon = {
  /**
   * The amount to damage to the weapon item for each attack performed. Defaults to `1`.
   *
   * Value:
   * Range: 0..
   */
  item_damage_per_attack?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * If non-zero, will disable a blocking shield on successful attack for the specified amount of seconds.
   *
   * Value:
   * Range: 0..
   */
  disable_blocking_for_seconds?: (NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number),
}

export type JsonWritableBookContent = {
  pages: Array<JsonFilterable<string>>,
}

export type JsonWrittenBookContent = {
  pages?: Array<JsonFilterable<JsonText>>,
  title: JsonFilterable<NonEmptyString>,
  author: string,
  /**
   * Number of times this written book has been copied. Defaults to 0. If the value is greater than 1, the book cannot be copied.
   *
   * Value:
   *
   *  - Original(`0`)
   *  - Copy(`1`)
   *  - CopyOfCopy(`2`)
   *  - Tattered(`3`)
   */
  generation?: JsonBookGeneration,
  /**
   * Whether the dynamic content on the pages has been resolved.
   */
  resolved?: boolean,
}
type JsonAttributeDisplayDispatcherMap = {
  'default': JsonAttributeDisplayDefault,
  'minecraft:default': JsonAttributeDisplayDefault,
  'hidden': JsonAttributeDisplayHidden,
  'minecraft:hidden': JsonAttributeDisplayHidden,
  'override': JsonAttributeDisplayOverride,
  'minecraft:override': JsonAttributeDisplayOverride,
}
type JsonAttributeDisplayKeys = keyof JsonAttributeDisplayDispatcherMap
type JsonAttributeDisplayFallback = (
  | JsonAttributeDisplayDefault
  | JsonAttributeDisplayHidden
  | JsonAttributeDisplayOverride)
type JsonAttributeDisplayDefault = Record<string, never>
type JsonAttributeDisplayHidden = Record<string, never>
type JsonAttributeDisplayOverride = JsonAttributeDisplayTextOverride
export type JsonSymbolAttributeDisplay<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonAttributeDisplayDispatcherMap
  : CASE extends 'keys' ? JsonAttributeDisplayKeys : CASE extends '%fallback' ? JsonAttributeDisplayFallback : never
type JsonConsumeEffectDispatcherMap = {
  'apply_effects': JsonConsumeEffectApplyEffects,
  'minecraft:apply_effects': JsonConsumeEffectApplyEffects,
  'clear_all_effects': JsonConsumeEffectClearAllEffects,
  'minecraft:clear_all_effects': JsonConsumeEffectClearAllEffects,
  'play_sound': JsonConsumeEffectPlaySound,
  'minecraft:play_sound': JsonConsumeEffectPlaySound,
  'remove_effects': JsonConsumeEffectRemoveEffects,
  'minecraft:remove_effects': JsonConsumeEffectRemoveEffects,
  'teleport_randomly': JsonConsumeEffectTeleportRandomly,
  'minecraft:teleport_randomly': JsonConsumeEffectTeleportRandomly,
}
type JsonConsumeEffectKeys = keyof JsonConsumeEffectDispatcherMap
type JsonConsumeEffectFallback = (
  | JsonConsumeEffectApplyEffects
  | JsonConsumeEffectClearAllEffects
  | JsonConsumeEffectPlaySound
  | JsonConsumeEffectRemoveEffects
  | JsonConsumeEffectTeleportRandomly)
type JsonConsumeEffectApplyEffects = JsonApplyEffectsConsumeEffect
type JsonConsumeEffectClearAllEffects = Record<string, never>
type JsonConsumeEffectPlaySound = JsonPlaySoundConsumeEffect
type JsonConsumeEffectRemoveEffects = JsonRemoveEffectsConsumeEffect
type JsonConsumeEffectTeleportRandomly = JsonTeleportRandomlyConsumeEffect
export type JsonSymbolConsumeEffect<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonConsumeEffectDispatcherMap
  : CASE extends 'keys' ? JsonConsumeEffectKeys : CASE extends '%fallback' ? JsonConsumeEffectFallback : never
type JsonDataComponentDispatcherMap = {
  'additional_trade_cost': JsonDataComponentAdditionalTradeCost,
  'minecraft:additional_trade_cost': JsonDataComponentAdditionalTradeCost,
  'attack_animation': JsonDataComponentAttackAnimation,
  'minecraft:attack_animation': JsonDataComponentAttackAnimation,
  'attack_range': JsonDataComponentAttackRange,
  'minecraft:attack_range': JsonDataComponentAttackRange,
  'attribute_modifiers': JsonDataComponentAttributeModifiers,
  'minecraft:attribute_modifiers': JsonDataComponentAttributeModifiers,
  'axolotl/variant': JsonDataComponentAxolotlVariant,
  'minecraft:axolotl/variant': JsonDataComponentAxolotlVariant,
  'banner_patterns': JsonDataComponentBannerPatterns,
  'minecraft:banner_patterns': JsonDataComponentBannerPatterns,
  'base_color': JsonDataComponentBaseColor,
  'minecraft:base_color': JsonDataComponentBaseColor,
  'bees': JsonDataComponentBees,
  'minecraft:bees': JsonDataComponentBees,
  'block_entity_data': JsonDataComponentBlockEntityData,
  'minecraft:block_entity_data': JsonDataComponentBlockEntityData,
  'block_state': JsonDataComponentBlockState,
  'minecraft:block_state': JsonDataComponentBlockState,
  'block_transformer': JsonDataComponentBlockTransformer,
  'minecraft:block_transformer': JsonDataComponentBlockTransformer,
  'blocks_attacks': JsonDataComponentBlocksAttacks,
  'minecraft:blocks_attacks': JsonDataComponentBlocksAttacks,
  'break_sound': JsonDataComponentBreakSound,
  'minecraft:break_sound': JsonDataComponentBreakSound,
  'brewing_fuel': JsonDataComponentBrewingFuel,
  'minecraft:brewing_fuel': JsonDataComponentBrewingFuel,
  'bucket_entity_data': JsonDataComponentBucketEntityData,
  'minecraft:bucket_entity_data': JsonDataComponentBucketEntityData,
  'bundle_contents': JsonDataComponentBundleContents,
  'minecraft:bundle_contents': JsonDataComponentBundleContents,
  'can_break': JsonDataComponentCanBreak,
  'minecraft:can_break': JsonDataComponentCanBreak,
  'can_place_on': JsonDataComponentCanPlaceOn,
  'minecraft:can_place_on': JsonDataComponentCanPlaceOn,
  'cat/collar': JsonDataComponentCatCollar,
  'minecraft:cat/collar': JsonDataComponentCatCollar,
  'cat/sound_variant': JsonDataComponentCatSoundVariant,
  'minecraft:cat/sound_variant': JsonDataComponentCatSoundVariant,
  'cat/variant': JsonDataComponentCatVariant,
  'minecraft:cat/variant': JsonDataComponentCatVariant,
  'charged_projectiles': JsonDataComponentChargedProjectiles,
  'minecraft:charged_projectiles': JsonDataComponentChargedProjectiles,
  'chicken/sound_variant': JsonDataComponentChickenSoundVariant,
  'minecraft:chicken/sound_variant': JsonDataComponentChickenSoundVariant,
  'chicken/variant': JsonDataComponentChickenVariant,
  'minecraft:chicken/variant': JsonDataComponentChickenVariant,
  'compostable': JsonDataComponentCompostable,
  'minecraft:compostable': JsonDataComponentCompostable,
  'consumable': JsonDataComponentConsumable,
  'minecraft:consumable': JsonDataComponentConsumable,
  'container': JsonDataComponentContainer,
  'minecraft:container': JsonDataComponentContainer,
  'container_loot': JsonDataComponentContainerLoot,
  'minecraft:container_loot': JsonDataComponentContainerLoot,
  'cooking_fuel': JsonDataComponentCookingFuel,
  'minecraft:cooking_fuel': JsonDataComponentCookingFuel,
  'cow/sound_variant': JsonDataComponentCowSoundVariant,
  'minecraft:cow/sound_variant': JsonDataComponentCowSoundVariant,
  'cow/variant': JsonDataComponentCowVariant,
  'minecraft:cow/variant': JsonDataComponentCowVariant,
  'creative_slot_lock': JsonDataComponentCreativeSlotLock,
  'minecraft:creative_slot_lock': JsonDataComponentCreativeSlotLock,
  'cushion/color': JsonDataComponentCushionColor,
  'minecraft:cushion/color': JsonDataComponentCushionColor,
  'custom_data': JsonDataComponentCustomData,
  'minecraft:custom_data': JsonDataComponentCustomData,
  'custom_model_data': JsonDataComponentCustomModelData,
  'minecraft:custom_model_data': JsonDataComponentCustomModelData,
  'custom_name': JsonDataComponentCustomName,
  'minecraft:custom_name': JsonDataComponentCustomName,
  'damage': JsonDataComponentDamage,
  'minecraft:damage': JsonDataComponentDamage,
  'damage_resistant': JsonDataComponentDamageResistant,
  'minecraft:damage_resistant': JsonDataComponentDamageResistant,
  'damage_type': JsonDataComponentDamageType,
  'minecraft:damage_type': JsonDataComponentDamageType,
  'death_protection': JsonDataComponentDeathProtection,
  'minecraft:death_protection': JsonDataComponentDeathProtection,
  'debug_stick_state': JsonDataComponentDebugStickState,
  'minecraft:debug_stick_state': JsonDataComponentDebugStickState,
  'dye': JsonDataComponentDye,
  'minecraft:dye': JsonDataComponentDye,
  'dyed_color': JsonDataComponentDyedColor,
  'minecraft:dyed_color': JsonDataComponentDyedColor,
  'enchantable': JsonDataComponentEnchantable,
  'minecraft:enchantable': JsonDataComponentEnchantable,
  'enchantment_glint_override': JsonDataComponentEnchantmentGlintOverride,
  'minecraft:enchantment_glint_override': JsonDataComponentEnchantmentGlintOverride,
  'enchantments': JsonDataComponentEnchantments,
  'minecraft:enchantments': JsonDataComponentEnchantments,
  'entity_data': JsonDataComponentEntityData,
  'minecraft:entity_data': JsonDataComponentEntityData,
  'equippable': JsonDataComponentEquippable,
  'minecraft:equippable': JsonDataComponentEquippable,
  'firework_explosion': JsonDataComponentFireworkExplosion,
  'minecraft:firework_explosion': JsonDataComponentFireworkExplosion,
  'fireworks': JsonDataComponentFireworks,
  'minecraft:fireworks': JsonDataComponentFireworks,
  'food': JsonDataComponentFood,
  'minecraft:food': JsonDataComponentFood,
  'fox/variant': JsonDataComponentFoxVariant,
  'minecraft:fox/variant': JsonDataComponentFoxVariant,
  'frog/variant': JsonDataComponentFrogVariant,
  'minecraft:frog/variant': JsonDataComponentFrogVariant,
  'glider': JsonDataComponentGlider,
  'minecraft:glider': JsonDataComponentGlider,
  'horse/variant': JsonDataComponentHorseVariant,
  'minecraft:horse/variant': JsonDataComponentHorseVariant,
  'instrument': JsonDataComponentInstrument,
  'minecraft:instrument': JsonDataComponentInstrument,
  'intangible_projectile': JsonDataComponentIntangibleProjectile,
  'minecraft:intangible_projectile': JsonDataComponentIntangibleProjectile,
  'interact_animation': JsonDataComponentInteractAnimation,
  'minecraft:interact_animation': JsonDataComponentInteractAnimation,
  'item_model': JsonDataComponentItemModel,
  'minecraft:item_model': JsonDataComponentItemModel,
  'item_name': JsonDataComponentItemName,
  'minecraft:item_name': JsonDataComponentItemName,
  'jukebox_playable': JsonDataComponentJukeboxPlayable,
  'minecraft:jukebox_playable': JsonDataComponentJukeboxPlayable,
  'kinetic_weapon': JsonDataComponentKineticWeapon,
  'minecraft:kinetic_weapon': JsonDataComponentKineticWeapon,
  'llama/variant': JsonDataComponentLlamaVariant,
  'minecraft:llama/variant': JsonDataComponentLlamaVariant,
  'lock': JsonDataComponentLock,
  'minecraft:lock': JsonDataComponentLock,
  'lodestone_tracker': JsonDataComponentLodestoneTracker,
  'minecraft:lodestone_tracker': JsonDataComponentLodestoneTracker,
  'lore': JsonDataComponentLore,
  'minecraft:lore': JsonDataComponentLore,
  'map_decorations': JsonDataComponentMapDecorations,
  'minecraft:map_decorations': JsonDataComponentMapDecorations,
  'map_id': JsonDataComponentMapId,
  'minecraft:map_id': JsonDataComponentMapId,
  'map_post_processing': JsonDataComponentMapPostProcessing,
  'minecraft:map_post_processing': JsonDataComponentMapPostProcessing,
  'max_damage': JsonDataComponentMaxDamage,
  'minecraft:max_damage': JsonDataComponentMaxDamage,
  'max_stack_size': JsonDataComponentMaxStackSize,
  'minecraft:max_stack_size': JsonDataComponentMaxStackSize,
  'minimum_attack_charge': JsonDataComponentMinimumAttackCharge,
  'minecraft:minimum_attack_charge': JsonDataComponentMinimumAttackCharge,
  'mob_visibility': JsonDataComponentMobVisibility,
  'minecraft:mob_visibility': JsonDataComponentMobVisibility,
  'mooshroom/variant': JsonDataComponentMooshroomVariant,
  'minecraft:mooshroom/variant': JsonDataComponentMooshroomVariant,
  'note_block_sound': JsonDataComponentNoteBlockSound,
  'minecraft:note_block_sound': JsonDataComponentNoteBlockSound,
  'ominous_bottle_amplifier': JsonDataComponentOminousBottleAmplifier,
  'minecraft:ominous_bottle_amplifier': JsonDataComponentOminousBottleAmplifier,
  'painting/variant': JsonDataComponentPaintingVariant,
  'minecraft:painting/variant': JsonDataComponentPaintingVariant,
  'parrot/variant': JsonDataComponentParrotVariant,
  'minecraft:parrot/variant': JsonDataComponentParrotVariant,
  'piercing_weapon': JsonDataComponentPiercingWeapon,
  'minecraft:piercing_weapon': JsonDataComponentPiercingWeapon,
  'pig/sound_variant': JsonDataComponentPigSoundVariant,
  'minecraft:pig/sound_variant': JsonDataComponentPigSoundVariant,
  'pig/variant': JsonDataComponentPigVariant,
  'minecraft:pig/variant': JsonDataComponentPigVariant,
  'pot_decorations': JsonDataComponentPotDecorations,
  'minecraft:pot_decorations': JsonDataComponentPotDecorations,
  'potion_contents': JsonDataComponentPotionContents,
  'minecraft:potion_contents': JsonDataComponentPotionContents,
  'potion_duration_scale': JsonDataComponentPotionDurationScale,
  'minecraft:potion_duration_scale': JsonDataComponentPotionDurationScale,
  'profile': JsonDataComponentProfile,
  'minecraft:profile': JsonDataComponentProfile,
  'provides_banner_patterns': JsonDataComponentProvidesBannerPatterns,
  'minecraft:provides_banner_patterns': JsonDataComponentProvidesBannerPatterns,
  'provides_pottery_pattern': JsonDataComponentProvidesPotteryPattern,
  'minecraft:provides_pottery_pattern': JsonDataComponentProvidesPotteryPattern,
  'provides_trim_material': JsonDataComponentProvidesTrimMaterial,
  'minecraft:provides_trim_material': JsonDataComponentProvidesTrimMaterial,
  'rabbit/variant': JsonDataComponentRabbitVariant,
  'minecraft:rabbit/variant': JsonDataComponentRabbitVariant,
  'rarity': JsonDataComponentRarity,
  'minecraft:rarity': JsonDataComponentRarity,
  'recipes': JsonDataComponentRecipes,
  'minecraft:recipes': JsonDataComponentRecipes,
  'repair_cost': JsonDataComponentRepairCost,
  'minecraft:repair_cost': JsonDataComponentRepairCost,
  'repairable': JsonDataComponentRepairable,
  'minecraft:repairable': JsonDataComponentRepairable,
  'salmon/size': JsonDataComponentSalmonSize,
  'minecraft:salmon/size': JsonDataComponentSalmonSize,
  'sheep/color': JsonDataComponentSheepColor,
  'minecraft:sheep/color': JsonDataComponentSheepColor,
  'shulker/color': JsonDataComponentShulkerColor,
  'minecraft:shulker/color': JsonDataComponentShulkerColor,
  'sign_text_back': JsonDataComponentSignTextBack,
  'minecraft:sign_text_back': JsonDataComponentSignTextBack,
  'sign_text_front': JsonDataComponentSignTextFront,
  'minecraft:sign_text_front': JsonDataComponentSignTextFront,
  'stored_enchantments': JsonDataComponentStoredEnchantments,
  'minecraft:stored_enchantments': JsonDataComponentStoredEnchantments,
  'sulfur_cube_content': JsonDataComponentSulfurCubeContent,
  'minecraft:sulfur_cube_content': JsonDataComponentSulfurCubeContent,
  'suspicious_stew_effects': JsonDataComponentSuspiciousStewEffects,
  'minecraft:suspicious_stew_effects': JsonDataComponentSuspiciousStewEffects,
  'tool': JsonDataComponentTool,
  'minecraft:tool': JsonDataComponentTool,
  'tooltip_display': JsonDataComponentTooltipDisplay,
  'minecraft:tooltip_display': JsonDataComponentTooltipDisplay,
  'tooltip_style': JsonDataComponentTooltipStyle,
  'minecraft:tooltip_style': JsonDataComponentTooltipStyle,
  'trim': JsonDataComponentTrim,
  'minecraft:trim': JsonDataComponentTrim,
  'tropical_fish/base_color': JsonDataComponentTropicalFishBaseColor,
  'minecraft:tropical_fish/base_color': JsonDataComponentTropicalFishBaseColor,
  'tropical_fish/pattern': JsonDataComponentTropicalFishPattern,
  'minecraft:tropical_fish/pattern': JsonDataComponentTropicalFishPattern,
  'tropical_fish/pattern_color': JsonDataComponentTropicalFishPatternColor,
  'minecraft:tropical_fish/pattern_color': JsonDataComponentTropicalFishPatternColor,
  'unbreakable': JsonDataComponentUnbreakable,
  'minecraft:unbreakable': JsonDataComponentUnbreakable,
  'use_cooldown': JsonDataComponentUseCooldown,
  'minecraft:use_cooldown': JsonDataComponentUseCooldown,
  'use_effects': JsonDataComponentUseEffects,
  'minecraft:use_effects': JsonDataComponentUseEffects,
  'use_remainder': JsonDataComponentUseRemainder,
  'minecraft:use_remainder': JsonDataComponentUseRemainder,
  'villager/variant': JsonDataComponentVillagerVariant,
  'minecraft:villager/variant': JsonDataComponentVillagerVariant,
  'villager_food': JsonDataComponentVillagerFood,
  'minecraft:villager_food': JsonDataComponentVillagerFood,
  'waxed': JsonDataComponentWaxed,
  'minecraft:waxed': JsonDataComponentWaxed,
  'weapon': JsonDataComponentWeapon,
  'minecraft:weapon': JsonDataComponentWeapon,
  'wolf/collar': JsonDataComponentWolfCollar,
  'minecraft:wolf/collar': JsonDataComponentWolfCollar,
  'wolf/sound_variant': JsonDataComponentWolfSoundVariant,
  'minecraft:wolf/sound_variant': JsonDataComponentWolfSoundVariant,
  'wolf/variant': JsonDataComponentWolfVariant,
  'minecraft:wolf/variant': JsonDataComponentWolfVariant,
  'writable_book_content': JsonDataComponentWritableBookContent,
  'minecraft:writable_book_content': JsonDataComponentWritableBookContent,
  'written_book_content': JsonDataComponentWrittenBookContent,
  'minecraft:written_book_content': JsonDataComponentWrittenBookContent,
  'zombie_nautilus/variant': JsonDataComponentZombieNautilusVariant,
  'minecraft:zombie_nautilus/variant': JsonDataComponentZombieNautilusVariant,
}
type JsonDataComponentKeys = keyof JsonDataComponentDispatcherMap
type JsonDataComponentFallback = (
  | JsonDataComponentAdditionalTradeCost
  | JsonDataComponentAttackAnimation
  | JsonDataComponentAttackRange
  | JsonDataComponentAttributeModifiers
  | JsonDataComponentAxolotlVariant
  | JsonDataComponentBannerPatterns
  | JsonDataComponentBaseColor
  | JsonDataComponentBees
  | JsonDataComponentBlockEntityData
  | JsonDataComponentBlockState
  | JsonDataComponentBlockTransformer
  | JsonDataComponentBlocksAttacks
  | JsonDataComponentBreakSound
  | JsonDataComponentBrewingFuel
  | JsonDataComponentBucketEntityData
  | JsonDataComponentBundleContents
  | JsonDataComponentCanBreak
  | JsonDataComponentCanPlaceOn
  | JsonDataComponentCatCollar
  | JsonDataComponentCatSoundVariant
  | JsonDataComponentCatVariant
  | JsonDataComponentChargedProjectiles
  | JsonDataComponentChickenSoundVariant
  | JsonDataComponentChickenVariant
  | JsonDataComponentCompostable
  | JsonDataComponentConsumable
  | JsonDataComponentContainer
  | JsonDataComponentContainerLoot
  | JsonDataComponentCookingFuel
  | JsonDataComponentCowSoundVariant
  | JsonDataComponentCowVariant
  | JsonDataComponentCreativeSlotLock
  | JsonDataComponentCushionColor
  | JsonDataComponentCustomData
  | JsonDataComponentCustomModelData
  | JsonDataComponentCustomName
  | JsonDataComponentDamage
  | JsonDataComponentDamageResistant
  | JsonDataComponentDamageType
  | JsonDataComponentDeathProtection
  | JsonDataComponentDebugStickState
  | JsonDataComponentDye
  | JsonDataComponentDyedColor
  | JsonDataComponentEnchantable
  | JsonDataComponentEnchantmentGlintOverride
  | JsonDataComponentEnchantments
  | JsonDataComponentEntityData
  | JsonDataComponentEquippable
  | JsonDataComponentFireworkExplosion
  | JsonDataComponentFireworks
  | JsonDataComponentFood
  | JsonDataComponentFoxVariant
  | JsonDataComponentFrogVariant
  | JsonDataComponentGlider
  | JsonDataComponentHorseVariant
  | JsonDataComponentInstrument
  | JsonDataComponentIntangibleProjectile
  | JsonDataComponentInteractAnimation
  | JsonDataComponentItemModel
  | JsonDataComponentItemName
  | JsonDataComponentJukeboxPlayable
  | JsonDataComponentKineticWeapon
  | JsonDataComponentLlamaVariant
  | JsonDataComponentLock
  | JsonDataComponentLodestoneTracker
  | JsonDataComponentLore
  | JsonDataComponentMapDecorations
  | JsonDataComponentMapId
  | JsonDataComponentMapPostProcessing
  | JsonDataComponentMaxDamage
  | JsonDataComponentMaxStackSize
  | JsonDataComponentMinimumAttackCharge
  | JsonDataComponentMobVisibility
  | JsonDataComponentMooshroomVariant
  | JsonDataComponentNoteBlockSound
  | JsonDataComponentOminousBottleAmplifier
  | JsonDataComponentPaintingVariant
  | JsonDataComponentParrotVariant
  | JsonDataComponentPiercingWeapon
  | JsonDataComponentPigSoundVariant
  | JsonDataComponentPigVariant
  | JsonDataComponentPotDecorations
  | JsonDataComponentPotionContents
  | JsonDataComponentPotionDurationScale
  | JsonDataComponentProfile
  | JsonDataComponentProvidesBannerPatterns
  | JsonDataComponentProvidesPotteryPattern
  | JsonDataComponentProvidesTrimMaterial
  | JsonDataComponentRabbitVariant
  | JsonDataComponentRarity
  | JsonDataComponentRecipes
  | JsonDataComponentRepairCost
  | JsonDataComponentRepairable
  | JsonDataComponentSalmonSize
  | JsonDataComponentSheepColor
  | JsonDataComponentShulkerColor
  | JsonDataComponentSignTextBack
  | JsonDataComponentSignTextFront
  | JsonDataComponentStoredEnchantments
  | JsonDataComponentSulfurCubeContent
  | JsonDataComponentSuspiciousStewEffects
  | JsonDataComponentTool
  | JsonDataComponentTooltipDisplay
  | JsonDataComponentTooltipStyle
  | JsonDataComponentTrim
  | JsonDataComponentTropicalFishBaseColor
  | JsonDataComponentTropicalFishPattern
  | JsonDataComponentTropicalFishPatternColor
  | JsonDataComponentUnbreakable
  | JsonDataComponentUseCooldown
  | JsonDataComponentUseEffects
  | JsonDataComponentUseRemainder
  | JsonDataComponentVillagerVariant
  | JsonDataComponentVillagerFood
  | JsonDataComponentWaxed
  | JsonDataComponentWeapon
  | JsonDataComponentWolfCollar
  | JsonDataComponentWolfSoundVariant
  | JsonDataComponentWolfVariant
  | JsonDataComponentWritableBookContent
  | JsonDataComponentWrittenBookContent
  | JsonDataComponentZombieNautilusVariant)
type JsonDataComponentAdditionalTradeCost = (NBTInt | number)
type JsonDataComponentAttackAnimation = JsonSwingAnimation
type JsonDataComponentAttackRange = JsonAttackRange
type JsonDataComponentAttributeModifiers = Array<JsonAttributeModifier>
type JsonDataComponentAxolotlVariant = JsonAxolotlVariant
type JsonDataComponentBannerPatterns = Array<JsonBannerPatternLayer>
type JsonDataComponentBaseColor = JsonDyeColor
type JsonDataComponentBees = Array<JsonOccupant>
type JsonDataComponentBlockEntityData = (JsonBlockEntityData | (NonEmptyString | NBTClass))
type JsonDataComponentBlockState = JsonSymbolMcdocBlockItemStates<'%fallback'>
type JsonDataComponentBlockTransformer = JsonNBTList<JsonBlockTransformer, {
  leftExclusive: false,
  rightExclusive: false,
}>
type JsonDataComponentBlocksAttacks = Jsonblocks_attacks
type JsonDataComponentBreakSound = JsonSoundEventRef
type JsonDataComponentBrewingFuel = JsonBrewingFuel
type JsonDataComponentBucketEntityData = (JsonBucketEntityData | (NonEmptyString | NBTClass))
type JsonDataComponentBundleContents = Array<JsonItemStackTemplate>
type JsonDataComponentCanBreak = JsonAdventureModePredicate
type JsonDataComponentCanPlaceOn = JsonAdventureModePredicate
type JsonDataComponentCatCollar = JsonDyeColor
type JsonDataComponentCatSoundVariant = (JsonRegistry['minecraft:cat_sound_variant'] | VariantClass<'cat_sound'>)
type JsonDataComponentCatVariant = (JsonRegistry['minecraft:cat_variant'] | VariantClass<'cat'>)
type JsonDataComponentChargedProjectiles = Array<JsonItemStackTemplate>
type JsonDataComponentChickenSoundVariant = (
  | JsonRegistry['minecraft:chicken_sound_variant']
  | VariantClass<'chicken_sound'>)
type JsonDataComponentChickenVariant = (JsonRegistry['minecraft:chicken_variant'] | VariantClass<'chicken'>)
type JsonDataComponentCompostable = JsonCompostable
type JsonDataComponentConsumable = JsonConsumable
type JsonDataComponentContainer = JsonNBTList<JsonContainerSlot, {
  rightExclusive: false,
}>
type JsonDataComponentContainerLoot = JsonContainerLoot
type JsonDataComponentCookingFuel = JsonCookingFuel
type JsonDataComponentCowSoundVariant = (JsonRegistry['minecraft:cow_sound_variant'] | VariantClass<'cow_sound'>)
type JsonDataComponentCowVariant = (JsonRegistry['minecraft:cow_variant'] | VariantClass<'cow'>)
type JsonDataComponentCreativeSlotLock = Record<string, never>
type JsonDataComponentCushionColor = JsonDyeColor
type JsonDataComponentCustomData = JsonCustomData
type JsonDataComponentCustomModelData = JsonCustomModelData
type JsonDataComponentCustomName = JsonText
type JsonDataComponentDamage = (NBTInt<{
  min: 0,
}> | number)
type JsonDataComponentDamageResistant = JsonDamageResistant
type JsonDataComponentDamageType = ((JsonRegistry['minecraft:damage_type'] | DamageTypeClass) | JsonDamageType)
type JsonDataComponentDeathProtection = JsonDeathProtection
type JsonDataComponentDebugStickState = JsonDebugStickState
type JsonDataComponentDye = JsonDyeColor
type JsonDataComponentDyedColor = JSONRGB
type JsonDataComponentEnchantable = JsonEnchantable
type JsonDataComponentEnchantmentGlintOverride = boolean
type JsonDataComponentEnchantments = JsonEnchantmentLevels
type JsonDataComponentEntityData = (JsonAnyEntity | (NonEmptyString | NBTClass))
type JsonDataComponentEquippable = JsonEquippable
type JsonDataComponentFireworkExplosion = JsonExplosion
type JsonDataComponentFireworks = JsonFireworks
type JsonDataComponentFood = JsonFood
type JsonDataComponentFoxVariant = JsonFoxType
type JsonDataComponentFrogVariant = (JsonRegistry['minecraft:frog_variant'] | VariantClass<'frog'>)
type JsonDataComponentGlider = Record<string, never>
type JsonDataComponentHorseVariant = JsonHorseVariant
type JsonDataComponentInstrument = ((JsonRegistry['minecraft:instrument'] | InstrumentClass) | JsonInstrument)
type JsonDataComponentIntangibleProjectile = Record<string, never>
type JsonDataComponentInteractAnimation = JsonSwingAnimation
type JsonDataComponentItemModel = (JsonRegistry['minecraft:item_definition'] | ItemModelDefinitionClass)
type JsonDataComponentItemName = JsonText
type JsonDataComponentJukeboxPlayable = (JsonRegistry['minecraft:jukebox_song'] | JukeboxSongClass)
type JsonDataComponentKineticWeapon = JsonKineticWeapon
type JsonDataComponentLlamaVariant = JsonLlamaVariant
type JsonDataComponentLock = JsonItemPredicate
type JsonDataComponentLodestoneTracker = JsonLodestoneTracker
type JsonDataComponentLore = Array<JsonText>
type JsonDataComponentMapDecorations = JsonMapDecorations
type JsonDataComponentMapId = (NBTInt | number)
type JsonDataComponentMapPostProcessing = Record<string, never>
type JsonDataComponentMaxDamage = (NBTInt<{
  min: 1,
}> | number)
type JsonDataComponentMaxStackSize = (NBTInt<{
  min: 1,
  max: 99,
}> | number)
type JsonDataComponentMinimumAttackCharge = (NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}> | number)
type JsonDataComponentMobVisibility = JsonMobVisibility
type JsonDataComponentMooshroomVariant = JsonMooshroomType
type JsonDataComponentNoteBlockSound = NamespacedString
type JsonDataComponentOminousBottleAmplifier = (NBTInt<{
  min: 0,
  max: 4,
}> | number)
type JsonDataComponentPaintingVariant = (JsonRegistry['minecraft:painting_variant'] | VariantClass<'painting'>)
type JsonDataComponentParrotVariant = JsonParrotVariant
type JsonDataComponentPiercingWeapon = JsonPiercingWeapon
type JsonDataComponentPigSoundVariant = (JsonRegistry['minecraft:pig_sound_variant'] | VariantClass<'pig_sound'>)
type JsonDataComponentPigVariant = (JsonRegistry['minecraft:pig_variant'] | VariantClass<'pig'>)
type JsonDataComponentPotDecorations = JsonPotDecorations
type JsonDataComponentPotionContents = (JsonPotionContents | JsonRegistry['minecraft:potion'])
type JsonDataComponentPotionDurationScale = (NBTFloat<{
  leftExclusive: false,
  min: 0,
}> | number)
type JsonDataComponentProfile = JsonProfile
type JsonDataComponentProvidesBannerPatterns = ((
    | JsonRegistry['minecraft:banner_pattern']
    | `#${JsonRegistry['minecraft:tag/banner_pattern']}`
    | TagClass<'banner_pattern'>
    | BannerPatternClass)
  | Array<(JsonRegistry['minecraft:banner_pattern'] | BannerPatternClass)>)
type JsonDataComponentProvidesPotteryPattern = (
  | JsonRegistry['minecraft:decorated_pot_pattern']
  | DecoratedPotPatternClass)
type JsonDataComponentProvidesTrimMaterial = (JsonRegistry['minecraft:trim_material'] | TrimMaterialClass)
type JsonDataComponentRabbitVariant = JsonRabbitVariant
type JsonDataComponentRarity = JsonRarity
type JsonDataComponentRecipes = Array<(JsonRegistry['minecraft:recipe'] | RecipeClass)>
type JsonDataComponentRepairCost = (NBTInt<{
  min: 0,
}> | number)
type JsonDataComponentRepairable = JsonRepairable
type JsonDataComponentSalmonSize = JsonSalmonType
type JsonDataComponentSheepColor = JsonDyeColor
type JsonDataComponentShulkerColor = JsonDyeColor
type JsonDataComponentSignTextBack = JsonSignText
type JsonDataComponentSignTextFront = JsonSignText
type JsonDataComponentStoredEnchantments = JsonEnchantmentLevels
type JsonDataComponentSulfurCubeContent = JsonItemStackTemplate
type JsonDataComponentSuspiciousStewEffects = Array<JsonSuspiciousStewEffect>
type JsonDataComponentTool = JsonTool
type JsonDataComponentTooltipDisplay = JsonTooltipDisplay
type JsonDataComponentTooltipStyle = NamespacedString
type JsonDataComponentTrim = JsonTrim
type JsonDataComponentTropicalFishBaseColor = JsonDyeColor
type JsonDataComponentTropicalFishPattern = JsonTropicalFishPattern
type JsonDataComponentTropicalFishPatternColor = JsonDyeColor
type JsonDataComponentUnbreakable = JsonUnbreakable
type JsonDataComponentUseCooldown = JsonUseCooldown
type JsonDataComponentUseEffects = JsonUseEffects
type JsonDataComponentUseRemainder = JsonItemStackTemplate
type JsonDataComponentVillagerVariant = JsonRegistry['minecraft:villager_type']
type JsonDataComponentVillagerFood = JsonVillagerFood
type JsonDataComponentWaxed = Record<string, never>
type JsonDataComponentWeapon = JsonWeapon
type JsonDataComponentWolfCollar = JsonDyeColor
type JsonDataComponentWolfSoundVariant = (JsonRegistry['minecraft:wolf_sound_variant'] | VariantClass<'wolf_sound'>)
type JsonDataComponentWolfVariant = (JsonRegistry['minecraft:wolf_variant'] | VariantClass<'wolf'>)
type JsonDataComponentWritableBookContent = JsonWritableBookContent
type JsonDataComponentWrittenBookContent = JsonWrittenBookContent
type JsonDataComponentZombieNautilusVariant = (
  | JsonRegistry['minecraft:zombie_nautilus_variant']
  | VariantClass<'zombie_nautilus'>)
export type JsonSymbolDataComponent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonDataComponentDispatcherMap
  : CASE extends 'keys' ? JsonDataComponentKeys : CASE extends '%fallback' ? JsonDataComponentFallback : never
