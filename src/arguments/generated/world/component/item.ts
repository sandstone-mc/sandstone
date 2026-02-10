import type { BlockPredicate, ItemPredicate } from 'sandstone/arguments/generated/data/advancement/predicate.ts'
import type { DamageType } from 'sandstone/arguments/generated/data/damage_type.ts'
import type { TrimMaterial, TrimPattern } from 'sandstone/arguments/generated/data/trim.ts'
import type { SoundEventRef } from 'sandstone/arguments/generated/data/util.ts'
import type { Instrument } from 'sandstone/arguments/generated/data/variants/instrument.ts'
import type {
  SymbolMcdocBlockItemStates,
  SymbolMcdocBlockStateKeys,
} from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { AttributeOperation } from 'sandstone/arguments/generated/util/attribute.ts'
import type { Profile } from 'sandstone/arguments/generated/util/avatar.ts'
import type { DyeColor, RGB } from 'sandstone/arguments/generated/util/color.ts'
import type { MobEffectInstance } from 'sandstone/arguments/generated/util/effect.ts'
import type { Filterable, GlobalPos } from 'sandstone/arguments/generated/util.ts'
import type { EquipmentSlot, EquipmentSlotGroup } from 'sandstone/arguments/generated/util/slot.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { BannerPatternLayer } from 'sandstone/arguments/generated/world/block/banner.ts'
import type { BlockEntityData } from 'sandstone/arguments/generated/world/block.ts'
import type { Sherd } from 'sandstone/arguments/generated/world/block/decorated_pot.ts'
import type { ContainerLoot, ContainerSlot, Occupant } from 'sandstone/arguments/generated/world/component/block.ts'
import type { CustomData } from 'sandstone/arguments/generated/world/component.ts'
import type {
  AxolotlVariant,
  FoxType,
  HorseVariant,
  LlamaVariant,
  MooshroomType,
  ParrotVariant,
  RabbitVariant,
  SalmonType,
  TropicalFishPattern,
} from 'sandstone/arguments/generated/world/component/entity.ts'
import type { AnyEntity } from 'sandstone/arguments/generated/world/entity.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  DamageTypeClass,
  EquipmentClass,
  InstrumentClass,
  ItemModelDefinitionClass,
  JukeboxSongClass,
  NBTByte,
  NBTClass,
  NBTDouble,
  NBTFloat,
  NBTInt,
  NBTList,
  NBTLong,
  RecipeClass,
  TagClass,
  TextureClass,
  TrimMaterialClass,
  TrimPatternClass,
  VariantClass,
} from 'sandstone'

export type AdventureModePredicate = (Array<BlockPredicate> | BlockPredicate)

export type ApplyEffectsConsumeEffect = {
  effects: Array<MobEffectInstance>,
  /**
   * Chance the effects will be applied once consumed.
   *
   * Value:
   * Range: 0..1
   */
  probability?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type AttackRange = {
  /**
   * Minimum distance to the target to be considered valid.
   * Defaults to 0.0
   *
   * Value:
   * Range: 0..64
   */
  min_reach?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>,
  /**
   * Maximum distance to the target to be considered valid.
   * Defaults to 3.0
   *
   * Value:
   * Range: 0..64
   */
  max_reach?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>,
  /**
   * Minimum distance from the creative mode attacker to the target to be considered valid.
   * Defaults to 0.0
   *
   * Value:
   * Range: 0..64
   */
  min_creative_reach?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>,
  /**
   * Maximum distance from the creative mode attacker to the target to be considered valid.
   * Defaults to 5.0
   *
   * Value:
   * Range: 0..64
   */
  max_creative_reach?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>,
  /**
   * The margin applied to the target bounding box when checking for valid hitbox collision.
   * Defaults to 0.3
   *
   * Value:
   * Range: 0..1
   */
  hitbox_margin?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * The multiplier applied to `min_reach` and `max_reach` when the user is a mob.
   *
   * Value:
   * Range: 0..2
   */
  mob_factor?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }>,
}

export type AttributeDisplay = NonNullable<({
  [S in Extract<AttributeDisplayType, string>]?: ({
    /**
     * Value:
     *
     *  - Default(`default`): Shows the calculated attribute modifier values on the tooltip.
     *  - Hidden(`hidden`): Does not show the attribute modifier entry in tooltips.
     *  - Override(`override`): Replaces the shown attribute modifier text.
     */
    type: S,
  } & (S extends keyof SymbolAttributeDisplay ? SymbolAttributeDisplay[S] : RootNBT))
}[AttributeDisplayType])>

export type AttributeDisplayTextOverride = {
  /**
   * The text contents to show for this attribute modifer entry.
   */
  value: Text,
}

export type AttributeDisplayType = ('default' | 'hidden' | 'override')

export type AttributeModifier = {
  type: Registry['minecraft:attribute'],
  /**
   * Used when equipping and unequipping the item to identify which modifier to add or remove from the entity.
   */
  id: `${string}:${string}`,
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
  operation: AttributeOperation,
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
  slot?: EquipmentSlotGroup,
  /**
   * Controls how this modifier is shown in the item tooltip.
   */
  display?: AttributeDisplay,
}

export type AttributeModifiers = {
  modifiers: Array<AttributeModifier>,
  show_in_tooltip?: boolean,
}

export type blocks_attacks = {
  /**
   * Number of seconds that right-click must be held before successfully blocking attacks.
   * Defaults to `0`.
   *
   * Value:
   * Range: 0..
   */
  block_delay_seconds?: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
  /**
   * Multiplier applied to the number of seconds that the item will be on cooldown for when attacked by a disabling attack (`disable_blocking_for_seconds` on the `weapon` component).
   * Defaults to `1`.
   * If `0`, this item can never be disabled by attacks.
   *
   * Value:
   * Range: 0..
   */
  disable_cooldown_scale?: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
  /**
   * Controls how much damage should be blocked in a given attack. If not specified, all damage is blocked.
   * Each entry in the list contributes an amount of damage to be blocked, optionally filtered by a damage type.
   * Each entry adds to blocked damage, determined by `clamp(base + factor * dealt_damage, 0, dealt_damage)`.
   * The final damage applied in the attack to the entity is determined by `dealt_damage - clamp(blocked_damage, 0, dealt_damage)`.
   */
  damage_reductions?: Array<DamageReduction>,
  /**
   * Controls how much damage should be applied to the item from a given attack.
   * If not specified, a point of durability is removed for every point of damage dealt.
   * The final damage applied to the item is determined by `floor(base + factor * dealt_damage)`.
   * The final value may be negative, causing the item to be repaired.
   */
  item_damage?: ItemDamageFunction,
  /**
   * Sound played when an attack is successfully blocked.
   */
  block_sound?: SoundEventRef,
  /**
   * Sound played when the item goes on its disabled cooldown due to an attack.
   */
  disabled_sound?: SoundEventRef,
  /**
   * Damage types in this tag are bypassing the blocking
   */
  bypassed_by?: (`#${Registry['minecraft:tag/damage_type']}` | TagClass<'damage_type'>),
}

export type BookGeneration = (0 | 1 | 2 | 3)

export type BucketEntityData = (AnyEntity & {
  /**
   * Turns into the expiry time of the memory module `has_hunting_cooldown` for axolotls.
   */
  HuntingCooldown: NBTLong,
  /**
   * Turns into the `Variant` entity tag for tropical fish.
   */
  BucketVariantTag: NBTInt,
})

export type Consumable = {
  /**
   * Time taken for a player to consume the item. Defaults to 1.6.
   *
   * Value:
   * Range: 0..
   */
  consume_seconds?: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
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
  animation?: ItemUseAnimation,
  /**
   * Sound played during and on completion of item consumption.
   */
  sound?: SoundEventRef,
  /**
   * Whether the `item` particle is emitted while consuming the item. Defaults to `true`.
   */
  has_consume_particles?: boolean,
  /**
   * Side effects which take place after consuming the item.
   */
  on_consume_effects?: Array<ConsumeEffect>,
}

export type ConsumeEffect = NonNullable<({
  [S in Extract<Registry['minecraft:consume_effect_type'], string>]?: ({
    type: S,
  } & (S extends keyof SymbolConsumeEffect ? SymbolConsumeEffect[S] : RootNBT))
}[Registry['minecraft:consume_effect_type']])>

export type CustomModelData = {
  floats?: Array<NBTFloat>,
  flags?: Array<boolean>,
  strings?: Array<string>,
  colors?: Array<RGB>,
}

export type DamageReduction = {
  /**
   * An optional damage type to filter this reduction by.
   * If not specified, any damage type is accepted for this reduction.
   */
  type?: ((
        | Registry['minecraft:damage_type']
        | `#${Registry['minecraft:tag/damage_type']}`
        | TagClass<'damage_type'>
        | DamageTypeClass)
      | Array<(Registry['minecraft:damage_type'] | DamageTypeClass)>),
  /**
   * Constant amount of damage to be blocked.
   */
  base: NBTFloat,
  /**
   * Fraction of the dealt damage that should be blocked.
   */
  factor: NBTFloat,
  /**
   * Maximum angle between facing direction and incoming attack direction for the blocking to be effective
   *
   * Value:
   * Range: 0<..
   * Minimum is exclusive; must be higher than 0
   */
  horizontal_blocking_angle?: NBTFloat<{
    leftExclusive: true,
    min: 1,
  }>,
}

export type DamageResistant = {
  /**
   * The damage types which the item is resistant to when in entity form.
   * Additionally, this also affects whether the equipped item will be damaged when the wearer is hurt by a specified damage type.
   */
  types: (`#${Registry['minecraft:tag/damage_type']}` | TagClass<'damage_type'>),
}

export type DeathProtection = {
  /**
   * Effects applied when the item protects the holder.
   */
  death_effects?: Array<ConsumeEffect>,
}

export type DebugStickState = ({
  [Key in Extract<Registry['minecraft:block'], string>]?: (Key extends keyof SymbolMcdocBlockStateKeys
    ? SymbolMcdocBlockStateKeys[Key]
    : SymbolMcdocBlockStateKeys<'%unknown'>)
})

export type DyedColor = {
  /**
   * Color of the armor.
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  rgb: NBTInt,
  show_in_tooltip?: boolean,
}

export type Enchantable = {
  /**
   * Value:
   * Range: 1..
   */
  value: NBTInt<{
    min: 1,
  }>,
}

export type EnchantmentLevels = ({
  [Key in Extract<Registry['minecraft:enchantment'], string>]?: NBTInt<{
    min: 1,
  }>
})

export type Enchantments = {
  levels: EnchantmentLevels,
  show_in_tooltip?: boolean,
}

export type Equippable = {
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
  slot: EquipmentSlot,
  /**
   * Sound event to play when the item is equipped.
   * If not specified, the default armor equip sound will be played.
   */
  equip_sound?: SoundEventRef,
  asset_id?: (Registry['minecraft:equipment'] | EquipmentClass),
  /**
   * The overlay texture that should render in first person when equipped.
   */
  camera_overlay?: (Registry['minecraft:texture'] | TextureClass),
  /**
   * Limits which entities can equip this item.
   */
  allowed_entities?: ((
      | Registry['minecraft:entity_type'] | `#${Registry['minecraft:tag/entity_type']}` | TagClass<'entity_type'>)
      | Array<Registry['minecraft:entity_type']>),
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
  shearing_sound?: SoundEventRef,
}

export type Explosion = {
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
  shape: FireworkShape,
  /**
   * Colors of the initial particles of the explosion, randomly selected from.
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  colors?: Array<NBTInt>,
  /**
   * Colors of the fading particles of the explosion
   */
  fade_colors?: Array<NBTInt>,
  /**
   * Added to a firework star via Diamond.
   */
  has_trail?: boolean,
  /**
   * Added to a firework star via Glowstone Dust.
   */
  has_twinkle?: boolean,
}

export type Fireworks = {
  /**
   * Value:
   * List length range: 0..256
   */
  explosions?: NBTList<Explosion, {
    leftExclusive: false,
    rightExclusive: false,
  }>,
  flight_duration?: NBTByte,
}

export type FireworkShape = ('small_ball' | 'large_ball' | 'star' | 'creeper' | 'burst')

export type Food = {
  /**
   * Food points/haunches restored when eaten (capped to 20.0).
   *
   * Value:
   * Range: 0..
   */
  nutrition: NBTInt<{
    min: 0,
  }>,
  /**
   * Exact value added to the player's saturation level, capped at whatever the [new] food points value is.
   */
  saturation: NBTFloat,
  /**
   * Whether the item can be eaten when the player's food points/haunches are full. Defaults to `false`
   */
  can_always_eat?: boolean,
}

export type FoodEffect = {
  effect: MobEffectInstance,
  /**
   * Chance for the effect to be applied. Defaults to 1.
   *
   * Value:
   * Range: 0..1
   */
  probability?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type ItemDamageFunction = {
  /**
   * Minimum amount of damage dealt by the attack before this item damage is applied to the item.
   *
   * Value:
   * Range: 0..
   */
  threshold: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
  /**
   * Constant amount of damage applied to the item, if `threshold` is passed.
   */
  base: NBTFloat,
  /**
   * Fraction of the dealt damage that should be applied to the item, if `threshold` is passed.
   */
  factor: NBTFloat,
}

export type ItemUseAnimation = (
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

export type JukeboxPlayable = {
  song: (Registry['minecraft:jukebox_song'] | JukeboxSongClass),
  show_in_tooltip?: boolean,
}

export type KineticWeapon = {
  /**
   * The time in ticks required for charging.
   * Defaults to 0
   *
   * Value:
   * Range: 0..
   */
  delay_ticks?: NBTInt<{
    min: 0,
  }>,
  /**
   * The cooldown in ticks after hitting, and loosing contact with an entity before being able to hit it again
   * Defaults to 10
   *
   * Value:
   * Range: 0..
   */
  contact_cooldown_ticks?: NBTInt<{
    min: 0,
  }>,
  dismount_conditions?: KineticWeaponEffectCondition,
  knockback_conditions?: KineticWeaponEffectCondition,
  damage_conditions?: KineticWeaponEffectCondition,
  /**
   * The distance the item moves out of hand during animation.
   * Defaults to 0.0
   */
  forward_movement?: NBTFloat,
  /**
   * The multiplier for the final damage from the relative speed.
   * Defaults to 1.0
   */
  damage_multiplier?: NBTFloat,
  /**
   * Sound to play when the weapon is engaged.
   */
  sound?: SoundEventRef,
  /**
   * Sound to play when the weapon hits an entity.
   */
  hit_sound?: SoundEventRef,
}

export type KineticWeaponEffectCondition = {
  /**
   * The duration in ticks this condition can pass.
   * Starts counting after charged.
   */
  max_duration_ticks: NBTInt,
  /**
   * The minimum attacker speed required.
   * Defaults to 0.0
   */
  min_speed?: NBTFloat,
  /**
   * The minimum relative speed required.
   * Defaults to 0.0
   */
  min_relative_speed?: NBTFloat,
}

export type LodestoneTracker = {
  /**
   * Location of the lodestone. Optional. If not set, the compass will spin randomly.
   */
  target?: GlobalPos,
  /**
   * When `true`, the component is removed when the lodestone is broken. When `false`, the component is kept. Defaults to true.
   */
  tracked?: boolean,
}

export type MapDecoration = {
  /**
   * Decoration type.
   */
  type: Registry['minecraft:map_decoration_type'],
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
  rotation: NBTFloat,
}

export type MapDecorations = ({
  [Key in `${any}${string}`]?: MapDecoration
})

export type PiercingWeapon = {
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
  sound?: SoundEventRef,
  /**
   * Sound to play when the weapon hits an entity.
   */
  hit_sound?: SoundEventRef,
}

export type PlaySoundConsumeEffect = {
  sound: SoundEventRef,
}

export type PotionContents = {
  potion?: Registry['minecraft:potion'],
  /**
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  custom_color?: NBTInt,
  /**
   * If present, is used to generate the item name using the translation key `item.minecraft.<potion_type>.effect.<custom_name>`.
   */
  custom_name?: string,
  custom_effects?: Array<MobEffectInstance>,
}

export type Rarity = ('common' | 'uncommon' | 'rare' | 'epic')

export type RemoveEffectsConsumeEffect = {
  effects: ((
      | Registry['minecraft:mob_effect'] | `#${string}:${string}` | TagClass<'mob_effect'>)
      | Array<Registry['minecraft:mob_effect']>),
}

export type Repairable = {
  items: ((
      | Registry['minecraft:item'] | `#${Registry['minecraft:tag/item']}` | TagClass<'item'>)
      | Array<Registry['minecraft:item']>),
}

export type SuspiciousStewEffect = {
  id: Registry['minecraft:mob_effect'],
  /**
   * Duration of the effect in ticks. Defaults to `160`; 8 seconds.
   *
   * Value:
   * Range: 1..
   */
  duration?: NBTInt<{
    min: 1,
  }>,
}

export type SwingAnimation = {
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
  type?: SwingAnimationType,
  /**
   * The animation duration in ticks.
   * Defaults to 6
   *
   * Value:
   * Range: 1..
   */
  duration?: NBTInt<{
    min: 1,
  }>,
}

export type SwingAnimationType = ('none' | 'whack' | 'stab')

export type TeleportRandomlyConsumeEffect = {
  /**
   * Defaults to 16.
   *
   * Value:
   * Range: 1..
   */
  diameter?: NBTFloat<{
    leftExclusive: false,
    min: 1,
  }>,
}

export type Tool = {
  /**
   * Blocks that this tool has a special behavior with.
   */
  rules: Array<ToolRule>,
  /**
   * Used if no rules override it. Defaults to 1.0.
   */
  default_mining_speed?: NBTFloat,
  /**
   * Amount of durability to remove each time a block is broken with this tool. Must be a non-negative integer.
   */
  damage_per_block?: NBTInt,
  /**
   * If `false`, players cannot break blocks while holding this tool in creative mode. Defaults to `true`.
   */
  can_destroy_blocks_in_creative?: boolean,
}

export type ToolRule = {
  blocks: ((
      | Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<Registry['minecraft:block']>),
  /**
   * Overrides the default mining speed.
   */
  speed?: NBTFloat,
  /**
   * Overrides whether or not this tool is considered correct to mine at its most efficient speed, and to drop items if the block's loot table requires it.
   */
  correct_for_drops?: boolean,
}

export type TooltipDisplay = {
  /**
   * If `true`, the item will have no tooltip when hovered. Defaults to `false`.
   */
  hide_tooltip?: boolean,
  /**
   * List of components that should be hidden in the item tooltip.
   */
  hidden_components?: Array<Registry['minecraft:data_component_type']>,
}

export type Trim = {
  /**
   * The trim material of this item..
   */
  material: ((Registry['minecraft:trim_material'] | TrimMaterialClass) | TrimMaterial),
  /**
   * The trim pattern of this item.
   */
  pattern: ((Registry['minecraft:trim_pattern'] | TrimPatternClass) | TrimPattern),
}

export type Unbreakable = Record<string, never>

export type UseCooldown = {
  /**
   * Time the cooldown will last.
   *
   * Value:
   * Range: 0<..
   * Minimum is exclusive; must be higher than 0
   */
  seconds: NBTFloat<{
    leftExclusive: true,
    min: 1,
  }>,
  /**
   * If present, this item will be part of a cooldown group and no longer share cooldowns with its base item type.
   * Instead, cooldowns applied to this item will only be shared with any other items that are part of the same cooldown group.
   *
   * Value:
   *
   * Value: Defines a `minecraft:cooldown_group` id.
   */
  cooldown_group?: `${string}:${string}`,
}

export type UseEffects = {
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
  speed_multiplier?: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  /**
   * Whether using this item emits game events (`item_interact_start` and `item_interact_finish`).
   * Defaults to `true`.
   */
  interact_vibrations?: boolean,
}

export type Weapon = {
  /**
   * The amount to damage to the weapon item for each attack performed. Defaults to `1`.
   *
   * Value:
   * Range: 0..
   */
  item_damage_per_attack?: NBTInt<{
    min: 0,
  }>,
  /**
   * If non-zero, will disable a blocking shield on successful attack for the specified amount of seconds.
   *
   * Value:
   * Range: 0..
   */
  disable_blocking_for_seconds?: NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>,
}

export type WritableBookContent = {
  pages: Array<Filterable<string>>,
}

export type WrittenBookContent = {
  pages?: Array<Filterable<Text>>,
  title: Filterable<`${any}${string}`>,
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
  generation?: BookGeneration,
  /**
   * Whether the dynamic content on the pages has been resolved.
   */
  resolved?: boolean,
}
type AttributeDisplayDispatcherMap = {
  'default': AttributeDisplayDefault,
  'minecraft:default': AttributeDisplayDefault,
  'hidden': AttributeDisplayHidden,
  'minecraft:hidden': AttributeDisplayHidden,
  'override': AttributeDisplayOverride,
  'minecraft:override': AttributeDisplayOverride,
}
type AttributeDisplayKeys = keyof AttributeDisplayDispatcherMap
type AttributeDisplayFallback = (AttributeDisplayDefault | AttributeDisplayHidden | AttributeDisplayOverride)
type AttributeDisplayDefault = Record<string, never>
type AttributeDisplayHidden = Record<string, never>
type AttributeDisplayOverride = AttributeDisplayTextOverride
export type SymbolAttributeDisplay<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? AttributeDisplayDispatcherMap
  : CASE extends 'keys' ? AttributeDisplayKeys : CASE extends '%fallback' ? AttributeDisplayFallback : never
type ConsumeEffectDispatcherMap = {
  'apply_effects': ConsumeEffectApplyEffects,
  'minecraft:apply_effects': ConsumeEffectApplyEffects,
  'clear_all_effects': ConsumeEffectClearAllEffects,
  'minecraft:clear_all_effects': ConsumeEffectClearAllEffects,
  'play_sound': ConsumeEffectPlaySound,
  'minecraft:play_sound': ConsumeEffectPlaySound,
  'remove_effects': ConsumeEffectRemoveEffects,
  'minecraft:remove_effects': ConsumeEffectRemoveEffects,
  'teleport_randomly': ConsumeEffectTeleportRandomly,
  'minecraft:teleport_randomly': ConsumeEffectTeleportRandomly,
}
type ConsumeEffectKeys = keyof ConsumeEffectDispatcherMap
type ConsumeEffectFallback = (
  | ConsumeEffectApplyEffects
  | ConsumeEffectClearAllEffects
  | ConsumeEffectPlaySound
  | ConsumeEffectRemoveEffects
  | ConsumeEffectTeleportRandomly)
type ConsumeEffectApplyEffects = ApplyEffectsConsumeEffect
type ConsumeEffectClearAllEffects = Record<string, never>
type ConsumeEffectPlaySound = PlaySoundConsumeEffect
type ConsumeEffectRemoveEffects = RemoveEffectsConsumeEffect
type ConsumeEffectTeleportRandomly = TeleportRandomlyConsumeEffect
export type SymbolConsumeEffect<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? ConsumeEffectDispatcherMap
  : CASE extends 'keys' ? ConsumeEffectKeys : CASE extends '%fallback' ? ConsumeEffectFallback : never
type DataComponentDispatcherMap = {
  'additional_trade_cost': DataComponentAdditionalTradeCost,
  'minecraft:additional_trade_cost': DataComponentAdditionalTradeCost,
  'attack_range': DataComponentAttackRange,
  'minecraft:attack_range': DataComponentAttackRange,
  'attribute_modifiers': DataComponentAttributeModifiers,
  'minecraft:attribute_modifiers': DataComponentAttributeModifiers,
  'axolotl/variant': DataComponentAxolotlVariant,
  'minecraft:axolotl/variant': DataComponentAxolotlVariant,
  'banner_patterns': DataComponentBannerPatterns,
  'minecraft:banner_patterns': DataComponentBannerPatterns,
  'base_color': DataComponentBaseColor,
  'minecraft:base_color': DataComponentBaseColor,
  'bees': DataComponentBees,
  'minecraft:bees': DataComponentBees,
  'block_entity_data': DataComponentBlockEntityData,
  'minecraft:block_entity_data': DataComponentBlockEntityData,
  'block_state': DataComponentBlockState,
  'minecraft:block_state': DataComponentBlockState,
  'blocks_attacks': DataComponentBlocksAttacks,
  'minecraft:blocks_attacks': DataComponentBlocksAttacks,
  'break_sound': DataComponentBreakSound,
  'minecraft:break_sound': DataComponentBreakSound,
  'bucket_entity_data': DataComponentBucketEntityData,
  'minecraft:bucket_entity_data': DataComponentBucketEntityData,
  'bundle_contents': DataComponentBundleContents,
  'minecraft:bundle_contents': DataComponentBundleContents,
  'can_break': DataComponentCanBreak,
  'minecraft:can_break': DataComponentCanBreak,
  'can_place_on': DataComponentCanPlaceOn,
  'minecraft:can_place_on': DataComponentCanPlaceOn,
  'cat/collar': DataComponentCatCollar,
  'minecraft:cat/collar': DataComponentCatCollar,
  'cat/variant': DataComponentCatVariant,
  'minecraft:cat/variant': DataComponentCatVariant,
  'charged_projectiles': DataComponentChargedProjectiles,
  'minecraft:charged_projectiles': DataComponentChargedProjectiles,
  'chicken/variant': DataComponentChickenVariant,
  'minecraft:chicken/variant': DataComponentChickenVariant,
  'consumable': DataComponentConsumable,
  'minecraft:consumable': DataComponentConsumable,
  'container': DataComponentContainer,
  'minecraft:container': DataComponentContainer,
  'container_loot': DataComponentContainerLoot,
  'minecraft:container_loot': DataComponentContainerLoot,
  'cow/variant': DataComponentCowVariant,
  'minecraft:cow/variant': DataComponentCowVariant,
  'custom_data': DataComponentCustomData,
  'minecraft:custom_data': DataComponentCustomData,
  'custom_model_data': DataComponentCustomModelData,
  'minecraft:custom_model_data': DataComponentCustomModelData,
  'custom_name': DataComponentCustomName,
  'minecraft:custom_name': DataComponentCustomName,
  'damage': DataComponentDamage,
  'minecraft:damage': DataComponentDamage,
  'damage_resistant': DataComponentDamageResistant,
  'minecraft:damage_resistant': DataComponentDamageResistant,
  'damage_type': DataComponentDamageType,
  'minecraft:damage_type': DataComponentDamageType,
  'death_protection': DataComponentDeathProtection,
  'minecraft:death_protection': DataComponentDeathProtection,
  'debug_stick_state': DataComponentDebugStickState,
  'minecraft:debug_stick_state': DataComponentDebugStickState,
  'dye': DataComponentDye,
  'minecraft:dye': DataComponentDye,
  'dyed_color': DataComponentDyedColor,
  'minecraft:dyed_color': DataComponentDyedColor,
  'enchantable': DataComponentEnchantable,
  'minecraft:enchantable': DataComponentEnchantable,
  'enchantment_glint_override': DataComponentEnchantmentGlintOverride,
  'minecraft:enchantment_glint_override': DataComponentEnchantmentGlintOverride,
  'enchantments': DataComponentEnchantments,
  'minecraft:enchantments': DataComponentEnchantments,
  'entity_data': DataComponentEntityData,
  'minecraft:entity_data': DataComponentEntityData,
  'equippable': DataComponentEquippable,
  'minecraft:equippable': DataComponentEquippable,
  'fire_resistant': DataComponentFireResistant,
  'minecraft:fire_resistant': DataComponentFireResistant,
  'firework_explosion': DataComponentFireworkExplosion,
  'minecraft:firework_explosion': DataComponentFireworkExplosion,
  'fireworks': DataComponentFireworks,
  'minecraft:fireworks': DataComponentFireworks,
  'food': DataComponentFood,
  'minecraft:food': DataComponentFood,
  'fox/variant': DataComponentFoxVariant,
  'minecraft:fox/variant': DataComponentFoxVariant,
  'frog/variant': DataComponentFrogVariant,
  'minecraft:frog/variant': DataComponentFrogVariant,
  'glider': DataComponentGlider,
  'minecraft:glider': DataComponentGlider,
  'hide_additional_tooltip': DataComponentHideAdditionalTooltip,
  'minecraft:hide_additional_tooltip': DataComponentHideAdditionalTooltip,
  'hide_tooltip': DataComponentHideTooltip,
  'minecraft:hide_tooltip': DataComponentHideTooltip,
  'horse/variant': DataComponentHorseVariant,
  'minecraft:horse/variant': DataComponentHorseVariant,
  'instrument': DataComponentInstrument,
  'minecraft:instrument': DataComponentInstrument,
  'intangible_projectile': DataComponentIntangibleProjectile,
  'minecraft:intangible_projectile': DataComponentIntangibleProjectile,
  'item_model': DataComponentItemModel,
  'minecraft:item_model': DataComponentItemModel,
  'item_name': DataComponentItemName,
  'minecraft:item_name': DataComponentItemName,
  'jukebox_playable': DataComponentJukeboxPlayable,
  'minecraft:jukebox_playable': DataComponentJukeboxPlayable,
  'kinetic_weapon': DataComponentKineticWeapon,
  'minecraft:kinetic_weapon': DataComponentKineticWeapon,
  'llama/variant': DataComponentLlamaVariant,
  'minecraft:llama/variant': DataComponentLlamaVariant,
  'lock': DataComponentLock,
  'minecraft:lock': DataComponentLock,
  'lodestone_tracker': DataComponentLodestoneTracker,
  'minecraft:lodestone_tracker': DataComponentLodestoneTracker,
  'lore': DataComponentLore,
  'minecraft:lore': DataComponentLore,
  'map_color': DataComponentMapColor,
  'minecraft:map_color': DataComponentMapColor,
  'map_decorations': DataComponentMapDecorations,
  'minecraft:map_decorations': DataComponentMapDecorations,
  'map_id': DataComponentMapId,
  'minecraft:map_id': DataComponentMapId,
  'max_damage': DataComponentMaxDamage,
  'minecraft:max_damage': DataComponentMaxDamage,
  'max_stack_size': DataComponentMaxStackSize,
  'minecraft:max_stack_size': DataComponentMaxStackSize,
  'minimum_attack_charge': DataComponentMinimumAttackCharge,
  'minecraft:minimum_attack_charge': DataComponentMinimumAttackCharge,
  'mooshroom/variant': DataComponentMooshroomVariant,
  'minecraft:mooshroom/variant': DataComponentMooshroomVariant,
  'note_block_sound': DataComponentNoteBlockSound,
  'minecraft:note_block_sound': DataComponentNoteBlockSound,
  'ominous_bottle_amplifier': DataComponentOminousBottleAmplifier,
  'minecraft:ominous_bottle_amplifier': DataComponentOminousBottleAmplifier,
  'painting/variant': DataComponentPaintingVariant,
  'minecraft:painting/variant': DataComponentPaintingVariant,
  'parrot/variant': DataComponentParrotVariant,
  'minecraft:parrot/variant': DataComponentParrotVariant,
  'piercing_weapon': DataComponentPiercingWeapon,
  'minecraft:piercing_weapon': DataComponentPiercingWeapon,
  'pig/variant': DataComponentPigVariant,
  'minecraft:pig/variant': DataComponentPigVariant,
  'pot_decorations': DataComponentPotDecorations,
  'minecraft:pot_decorations': DataComponentPotDecorations,
  'potion_contents': DataComponentPotionContents,
  'minecraft:potion_contents': DataComponentPotionContents,
  'potion_duration_scale': DataComponentPotionDurationScale,
  'minecraft:potion_duration_scale': DataComponentPotionDurationScale,
  'profile': DataComponentProfile,
  'minecraft:profile': DataComponentProfile,
  'provides_banner_patterns': DataComponentProvidesBannerPatterns,
  'minecraft:provides_banner_patterns': DataComponentProvidesBannerPatterns,
  'provides_trim_material': DataComponentProvidesTrimMaterial,
  'minecraft:provides_trim_material': DataComponentProvidesTrimMaterial,
  'rabbit/variant': DataComponentRabbitVariant,
  'minecraft:rabbit/variant': DataComponentRabbitVariant,
  'rarity': DataComponentRarity,
  'minecraft:rarity': DataComponentRarity,
  'recipes': DataComponentRecipes,
  'minecraft:recipes': DataComponentRecipes,
  'repair_cost': DataComponentRepairCost,
  'minecraft:repair_cost': DataComponentRepairCost,
  'repairable': DataComponentRepairable,
  'minecraft:repairable': DataComponentRepairable,
  'salmon/size': DataComponentSalmonSize,
  'minecraft:salmon/size': DataComponentSalmonSize,
  'sheep/color': DataComponentSheepColor,
  'minecraft:sheep/color': DataComponentSheepColor,
  'shulker/color': DataComponentShulkerColor,
  'minecraft:shulker/color': DataComponentShulkerColor,
  'stored_enchantments': DataComponentStoredEnchantments,
  'minecraft:stored_enchantments': DataComponentStoredEnchantments,
  'suspicious_stew_effects': DataComponentSuspiciousStewEffects,
  'minecraft:suspicious_stew_effects': DataComponentSuspiciousStewEffects,
  'swing_animation': DataComponentSwingAnimation,
  'minecraft:swing_animation': DataComponentSwingAnimation,
  'tool': DataComponentTool,
  'minecraft:tool': DataComponentTool,
  'tooltip_display': DataComponentTooltipDisplay,
  'minecraft:tooltip_display': DataComponentTooltipDisplay,
  'tooltip_style': DataComponentTooltipStyle,
  'minecraft:tooltip_style': DataComponentTooltipStyle,
  'trim': DataComponentTrim,
  'minecraft:trim': DataComponentTrim,
  'tropical_fish/base_color': DataComponentTropicalFishBaseColor,
  'minecraft:tropical_fish/base_color': DataComponentTropicalFishBaseColor,
  'tropical_fish/pattern': DataComponentTropicalFishPattern,
  'minecraft:tropical_fish/pattern': DataComponentTropicalFishPattern,
  'tropical_fish/pattern_color': DataComponentTropicalFishPatternColor,
  'minecraft:tropical_fish/pattern_color': DataComponentTropicalFishPatternColor,
  'unbreakable': DataComponentUnbreakable,
  'minecraft:unbreakable': DataComponentUnbreakable,
  'use_cooldown': DataComponentUseCooldown,
  'minecraft:use_cooldown': DataComponentUseCooldown,
  'use_effects': DataComponentUseEffects,
  'minecraft:use_effects': DataComponentUseEffects,
  'use_remainder': DataComponentUseRemainder,
  'minecraft:use_remainder': DataComponentUseRemainder,
  'villager/variant': DataComponentVillagerVariant,
  'minecraft:villager/variant': DataComponentVillagerVariant,
  'weapon': DataComponentWeapon,
  'minecraft:weapon': DataComponentWeapon,
  'wolf/collar': DataComponentWolfCollar,
  'minecraft:wolf/collar': DataComponentWolfCollar,
  'wolf/sound_variant': DataComponentWolfSoundVariant,
  'minecraft:wolf/sound_variant': DataComponentWolfSoundVariant,
  'wolf/variant': DataComponentWolfVariant,
  'minecraft:wolf/variant': DataComponentWolfVariant,
  'writable_book_content': DataComponentWritableBookContent,
  'minecraft:writable_book_content': DataComponentWritableBookContent,
  'written_book_content': DataComponentWrittenBookContent,
  'minecraft:written_book_content': DataComponentWrittenBookContent,
}
type DataComponentKeys = keyof DataComponentDispatcherMap
type DataComponentFallback = (
  | DataComponentAdditionalTradeCost
  | DataComponentAttackRange
  | DataComponentAttributeModifiers
  | DataComponentAxolotlVariant
  | DataComponentBannerPatterns
  | DataComponentBaseColor
  | DataComponentBees
  | DataComponentBlockEntityData
  | DataComponentBlockState
  | DataComponentBlocksAttacks
  | DataComponentBreakSound
  | DataComponentBucketEntityData
  | DataComponentBundleContents
  | DataComponentCanBreak
  | DataComponentCanPlaceOn
  | DataComponentCatCollar
  | DataComponentCatVariant
  | DataComponentChargedProjectiles
  | DataComponentChickenVariant
  | DataComponentConsumable
  | DataComponentContainer
  | DataComponentContainerLoot
  | DataComponentCowVariant
  | DataComponentCustomData
  | DataComponentCustomModelData
  | DataComponentCustomName
  | DataComponentDamage
  | DataComponentDamageResistant
  | DataComponentDamageType
  | DataComponentDeathProtection
  | DataComponentDebugStickState
  | DataComponentDye
  | DataComponentDyedColor
  | DataComponentEnchantable
  | DataComponentEnchantmentGlintOverride
  | DataComponentEnchantments
  | DataComponentEntityData
  | DataComponentEquippable
  | DataComponentFireResistant
  | DataComponentFireworkExplosion
  | DataComponentFireworks
  | DataComponentFood
  | DataComponentFoxVariant
  | DataComponentFrogVariant
  | DataComponentGlider
  | DataComponentHideAdditionalTooltip
  | DataComponentHideTooltip
  | DataComponentHorseVariant
  | DataComponentInstrument
  | DataComponentIntangibleProjectile
  | DataComponentItemModel
  | DataComponentItemName
  | DataComponentJukeboxPlayable
  | DataComponentKineticWeapon
  | DataComponentLlamaVariant
  | DataComponentLock
  | DataComponentLodestoneTracker
  | DataComponentLore
  | DataComponentMapColor
  | DataComponentMapDecorations
  | DataComponentMapId
  | DataComponentMaxDamage
  | DataComponentMaxStackSize
  | DataComponentMinimumAttackCharge
  | DataComponentMooshroomVariant
  | DataComponentNoteBlockSound
  | DataComponentOminousBottleAmplifier
  | DataComponentPaintingVariant
  | DataComponentParrotVariant
  | DataComponentPiercingWeapon
  | DataComponentPigVariant
  | DataComponentPotDecorations
  | DataComponentPotionContents
  | DataComponentPotionDurationScale
  | DataComponentProfile
  | DataComponentProvidesBannerPatterns
  | DataComponentProvidesTrimMaterial
  | DataComponentRabbitVariant
  | DataComponentRarity
  | DataComponentRecipes
  | DataComponentRepairCost
  | DataComponentRepairable
  | DataComponentSalmonSize
  | DataComponentSheepColor
  | DataComponentShulkerColor
  | DataComponentStoredEnchantments
  | DataComponentSuspiciousStewEffects
  | DataComponentSwingAnimation
  | DataComponentTool
  | DataComponentTooltipDisplay
  | DataComponentTooltipStyle
  | DataComponentTrim
  | DataComponentTropicalFishBaseColor
  | DataComponentTropicalFishPattern
  | DataComponentTropicalFishPatternColor
  | DataComponentUnbreakable
  | DataComponentUseCooldown
  | DataComponentUseEffects
  | DataComponentUseRemainder
  | DataComponentVillagerVariant
  | DataComponentWeapon
  | DataComponentWolfCollar
  | DataComponentWolfSoundVariant
  | DataComponentWolfVariant
  | DataComponentWritableBookContent
  | DataComponentWrittenBookContent)
type DataComponentAdditionalTradeCost = NBTInt
type DataComponentAttackRange = AttackRange
type DataComponentAttributeModifiers = Array<AttributeModifier>
type DataComponentAxolotlVariant = AxolotlVariant
type DataComponentBannerPatterns = Array<BannerPatternLayer>
type DataComponentBaseColor = DyeColor
type DataComponentBees = Array<Occupant>
type DataComponentBlockEntityData = (BlockEntityData | (`${any}${string}` | NBTClass))
type DataComponentBlockState = SymbolMcdocBlockItemStates<'%fallback'>
type DataComponentBlocksAttacks = blocks_attacks
type DataComponentBreakSound = SoundEventRef
type DataComponentBucketEntityData = (BucketEntityData | (`${any}${string}` | NBTClass))
type DataComponentBundleContents = Array<ItemStack>
type DataComponentCanBreak = AdventureModePredicate
type DataComponentCanPlaceOn = AdventureModePredicate
type DataComponentCatCollar = DyeColor
type DataComponentCatVariant = (Registry['minecraft:cat_variant'] | VariantClass<'cat'>)
type DataComponentChargedProjectiles = Array<ItemStack>
type DataComponentChickenVariant = (Registry['minecraft:chicken_variant'] | VariantClass<'chicken'>)
type DataComponentConsumable = Consumable
type DataComponentContainer = NBTList<ContainerSlot, {
  rightExclusive: false,
}>
type DataComponentContainerLoot = ContainerLoot
type DataComponentCowVariant = (Registry['minecraft:cow_variant'] | VariantClass<'cow'>)
type DataComponentCustomData = CustomData
type DataComponentCustomModelData = CustomModelData
type DataComponentCustomName = Text
type DataComponentDamage = NBTInt<{
  min: 0,
}>
type DataComponentDamageResistant = DamageResistant
type DataComponentDamageType = ((Registry['minecraft:damage_type'] | DamageTypeClass) | DamageType)
type DataComponentDeathProtection = DeathProtection
type DataComponentDebugStickState = DebugStickState
type DataComponentDye = DyeColor
type DataComponentDyedColor = RGB
type DataComponentEnchantable = Enchantable
type DataComponentEnchantmentGlintOverride = boolean
type DataComponentEnchantments = EnchantmentLevels
type DataComponentEntityData = (AnyEntity | (`${any}${string}` | NBTClass))
type DataComponentEquippable = Equippable
type DataComponentFireResistant = Record<string, never>
type DataComponentFireworkExplosion = Explosion
type DataComponentFireworks = Fireworks
type DataComponentFood = Food
type DataComponentFoxVariant = FoxType
type DataComponentFrogVariant = (Registry['minecraft:frog_variant'] | VariantClass<'frog'>)
type DataComponentGlider = Record<string, never>
type DataComponentHideAdditionalTooltip = Record<string, never>
type DataComponentHideTooltip = Record<string, never>
type DataComponentHorseVariant = HorseVariant
type DataComponentInstrument = ((Registry['minecraft:instrument'] | InstrumentClass) | Instrument)
type DataComponentIntangibleProjectile = Record<string, never>
type DataComponentItemModel = (Registry['minecraft:item_definition'] | ItemModelDefinitionClass)
type DataComponentItemName = Text
type DataComponentJukeboxPlayable = (Registry['minecraft:jukebox_song'] | JukeboxSongClass)
type DataComponentKineticWeapon = KineticWeapon
type DataComponentLlamaVariant = LlamaVariant
type DataComponentLock = ItemPredicate
type DataComponentLodestoneTracker = LodestoneTracker
type DataComponentLore = Array<Text>
type DataComponentMapColor = NBTInt
type DataComponentMapDecorations = MapDecorations
type DataComponentMapId = NBTInt
type DataComponentMaxDamage = NBTInt<{
  min: 1,
}>
type DataComponentMaxStackSize = NBTInt<{
  min: 1,
  max: 99,
}>
type DataComponentMinimumAttackCharge = NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
  min: 0,
  max: 1,
}>
type DataComponentMooshroomVariant = MooshroomType
type DataComponentNoteBlockSound = `${string}:${string}`
type DataComponentOminousBottleAmplifier = NBTInt<{
  min: 0,
  max: 4,
}>
type DataComponentPaintingVariant = (Registry['minecraft:painting_variant'] | VariantClass<'painting'>)
type DataComponentParrotVariant = ParrotVariant
type DataComponentPiercingWeapon = PiercingWeapon
type DataComponentPigVariant = (Registry['minecraft:pig_variant'] | VariantClass<'pig'>)
type DataComponentPotDecorations = NBTList<(Sherd | `minecraft:${Sherd}`), {
  rightExclusive: false,
}>
type DataComponentPotionContents = (PotionContents | Registry['minecraft:potion'])
type DataComponentPotionDurationScale = NBTFloat<{
  leftExclusive: false,
  min: 0,
}>
type DataComponentProfile = Profile
type DataComponentProvidesBannerPatterns = (
  | `#${Registry['minecraft:tag/banner_pattern']}`
  | TagClass<'banner_pattern'>)
type DataComponentProvidesTrimMaterial = (Registry['minecraft:trim_material'] | TrimMaterialClass)
type DataComponentRabbitVariant = RabbitVariant
type DataComponentRarity = Rarity
type DataComponentRecipes = Array<(Registry['minecraft:recipe'] | RecipeClass)>
type DataComponentRepairCost = NBTInt<{
  min: 0,
}>
type DataComponentRepairable = Repairable
type DataComponentSalmonSize = SalmonType
type DataComponentSheepColor = DyeColor
type DataComponentShulkerColor = DyeColor
type DataComponentStoredEnchantments = EnchantmentLevels
type DataComponentSuspiciousStewEffects = Array<SuspiciousStewEffect>
type DataComponentSwingAnimation = SwingAnimation
type DataComponentTool = Tool
type DataComponentTooltipDisplay = TooltipDisplay
type DataComponentTooltipStyle = `${string}:${string}`
type DataComponentTrim = Trim
type DataComponentTropicalFishBaseColor = DyeColor
type DataComponentTropicalFishPattern = TropicalFishPattern
type DataComponentTropicalFishPatternColor = DyeColor
type DataComponentUnbreakable = Unbreakable
type DataComponentUseCooldown = UseCooldown
type DataComponentUseEffects = UseEffects
type DataComponentUseRemainder = ItemStack
type DataComponentVillagerVariant = Registry['minecraft:villager_type']
type DataComponentWeapon = Weapon
type DataComponentWolfCollar = DyeColor
type DataComponentWolfSoundVariant = (Registry['minecraft:wolf_sound_variant'] | VariantClass<'wolf_sound'>)
type DataComponentWolfVariant = (Registry['minecraft:wolf_variant'] | VariantClass<'wolf'>)
type DataComponentWritableBookContent = WritableBookContent
type DataComponentWrittenBookContent = WrittenBookContent
export type SymbolDataComponent<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? DataComponentDispatcherMap
  : CASE extends 'keys' ? DataComponentKeys : CASE extends '%fallback' ? DataComponentFallback : never
