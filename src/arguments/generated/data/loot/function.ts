import type { ItemPredicate } from 'sandstone/arguments/generated/data/advancement/predicate.ts'
import type {
  BlockEntityTarget,
  EntityTarget,
  ItemStackTarget,
  LootFunction,
  LootPoolEntry,
} from 'sandstone/arguments/generated/data/loot.ts'
import type { LootConditionOf } from 'sandstone/arguments/generated/data/loot/condition.ts'
import type { IntRange, NbtProvider, NumberProvider } from 'sandstone/arguments/generated/data/util.ts'
import type { SymbolDataComponent, SymbolMcdocBlockStateKeys } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { AttributeOperation } from 'sandstone/arguments/generated/util/attribute.ts'
import type { DyeColor, RGB } from 'sandstone/arguments/generated/util/color.ts'
import type { Filterable } from 'sandstone/arguments/generated/util.ts'
import type { EquipmentSlotGroup } from 'sandstone/arguments/generated/util/slot.ts'
import type { Text } from 'sandstone/arguments/generated/util/text.ts'
import type { CustomData, DataComponentPatch } from 'sandstone/arguments/generated/world/component.ts'
import type { FireworkShape } from 'sandstone/arguments/generated/world/component/item.ts'
import type { NBTObject, RootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  BannerPatternClass,
  DataPointClass,
  EnchantmentClass,
  InstrumentClass,
  ItemModifierClass,
  LootTableClass,
  NBTClass,
  NBTFloat,
  NBTInt,
  NBTLong,
  TagClass,
} from 'sandstone'

export type ApplyBonus<F extends NBTObject, C extends NBTObject> = NonNullable<({
  [S in Extract<ApplyBonusFormula, string>]?: ({
    enchantment: (Registry['minecraft:enchantment'] | EnchantmentClass),
    /**
     * Value:
     *
     *  - OreDrops(`ore_drops`)
     *  - UniformBonusCount(`uniform_bonus_count`)
     *  - BinomialWithBonusCount(`binomial_with_bonus_count`)
     */
    formula: (S | `minecraft:${S}`),
  } & (S extends keyof SymbolApplyBonusFormula ? SymbolApplyBonusFormula[S] : RootNBT) & Conditions<C>)
}[ApplyBonusFormula])>

export type ApplyBonusFormula = ('ore_drops' | 'uniform_bonus_count' | 'binomial_with_bonus_count')

export type AttributeModifier = ({
  /**
   * Attribute type to modify.
   */
  attribute: Registry['minecraft:attribute'],
  amount: NumberProvider,
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
  operation: AttributeOperation,
  /**
   * If a list, one of the listed slots will be chosen randomly.
   *
   * Value:
   * *either*
   *
   *
   *
   * *or*
   *
   * *item 1*
   */
  slot: (EquipmentSlotGroup | Array<EquipmentSlotGroup>),
} & {
  /**
   * The unique identifier of this attribute modifier.
   */
  id: `${string}:${string}`,
})

export type BannerPattern = (
  | 'base'
  | 'square_bottom_left'
  | 'square_bottom_right'
  | 'square_top_left'
  | 'square_top_right'
  | 'stripe_bottom'
  | 'stripe_top'
  | 'stripe_left'
  | 'stripe_right'
  | 'stripe_center'
  | 'stripe_middle'
  | 'stripe_downright'
  | 'stripe_downleft'
  | 'small_stripes'
  | 'cross'
  | 'straight_cross'
  | 'triangle_bottom'
  | 'triangle_top'
  | 'triangles_bottom'
  | 'triangles_top'
  | 'diagonal_left'
  | 'diagonal_up_right'
  | 'diagonal_up_left'
  | 'diagonal_right'
  | 'circle'
  | 'rhombus'
  | 'half_vertical'
  | 'half_horizontal'
  | 'half_vertical_right'
  | 'half_horizontal_bottom'
  | 'border'
  | 'curly_border'
  | 'gradient'
  | 'gradient_up'
  | 'bricks'
  | 'globe'
  | 'creeper'
  | 'skull'
  | 'flower'
  | 'mojang'
  | 'piglin')

export type BannerPatternLayer = {
  pattern: (Registry['minecraft:banner_pattern'] | BannerPatternClass),
  /**
   * Value:
   *
   *  - White(`white`)
   *  - Orange(`orange`)
   *  - Magenta(`magenta`)
   *  - LightBlue(`light_blue`)
   *  - Yellow(`yellow`)
   *  - Lime(`lime`)
   *  - Pink(`pink`)
   *  - Gray(`gray`)
   *  - LightGray(`light_gray`)
   *  - Cyan(`cyan`)
   *  - Purple(`purple`)
   *  - Blue(`blue`)
   *  - Brown(`brown`)
   *  - Green(`green`)
   *  - Red(`red`)
   *  - Black(`black`)
   */
  color: DyeColor,
}

export type BinomialWithBonusCountFormula = {
  parameters: {
    extra: NBTInt,
    /**
     * Value:
     * Range: 0..1
     */
    probability: NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
      min: 0,
      max: 1,
    }>,
  },
}

export type Conditions<C extends NBTObject> = {
  conditions?: Array<LootConditionOf<C>>,
}

export type ContainerComponents = ('container' | 'bundle_contents' | 'charged_projectiles')

export type CopyComponents<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Value:
   * *either*
   *
   * *item 0*
   *
   * *or*
   *
   *
   *
   * *or*
   *
   * *item 2*
   */
  source: (BlockEntityTarget | EntityTarget | ItemStackTarget),
  /**
   * If omitted, all components present are included
   */
  include?: Array<Registry['minecraft:data_component_type']>,
  /**
   * Defaults to none.
   */
  exclude?: Array<Registry['minecraft:data_component_type']>,
} & Conditions<C>)

export type CopyName<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Value:
   * *either*
   *
   *
   *
   * *or*
   *
   * *item 1*
   */
  source: (EntityTarget | BlockEntityTarget),
} & Conditions<C>)

export type CopyNameSource = (
  | 'this'
  | 'killer'
  | 'attacking_entity'
  | 'killer_player'
  | 'last_damage_player'
  | 'block_entity')

export type CopyNbt<C extends NBTObject> = ({
  source: NbtProvider,
  ops: Array<{
    source: `${any}${string}` | DataPointClass,
    target: `${any}${string}` | DataPointClass,
    /**
     * Value:
     *
     *  - Replace(`replace`): Replace any existing contents of the target.
     *  - Append(`append`): Append to a list.
     *  - Merge(`merge`): Merge into a compound tag.
     */
    op: CopyNbtStrategy,
  }>,
} & Conditions<C>)

export type CopyNbtOperation = {
  source: `${any}${string}` | DataPointClass,
  target: `${any}${string}` | DataPointClass,
  /**
   * Value:
   *
   *  - Replace(`replace`): Replace any existing contents of the target.
   *  - Append(`append`): Append to a list.
   *  - Merge(`merge`): Merge into a compound tag.
   */
  op: CopyNbtStrategy,
}

export type CopyNbtStrategy = ('replace' | 'append' | 'merge')

export type CopyState<F extends NBTObject, C extends NBTObject> = NonNullable<({
  [S in Extract<Registry['minecraft:block'], string>]?: ({
    block: S,
    properties: Array<(S extends undefined
      ? SymbolMcdocBlockStateKeys<'%none'> :
      (S extends keyof SymbolMcdocBlockStateKeys
        ? SymbolMcdocBlockStateKeys[S]
        : SymbolMcdocBlockStateKeys<'%unknown'>))>,
  } & Conditions<C>)
}[Registry['minecraft:block']])>

export type CustomModelDataColors = ({
  values: Array<(NumberProvider | RGB)>,
} & ListOperation)

export type CustomModelDataFlags = ({
  values: Array<boolean>,
} & ListOperation)

export type CustomModelDataFloats = ({
  values: Array<NumberProvider>,
} & ListOperation)

export type CustomModelDataStrings = ({
  values: Array<string>,
} & ListOperation)

export type EnchantedCountBase = {
  /**
   * If the number is fractional the result is rounded *after* the number was multiplied by the looting level.
   */
  count: NumberProvider,
  /**
   * Limits the count of the item to a range.
   */
  limit?: NBTInt,
}

export type EnchantedCountIncrease<F extends NBTObject, C extends NBTObject> = (EnchantedCountBase & {
  /**
   * Enchantment that increases yields.
   */
  enchantment: (Registry['minecraft:enchantment'] | EnchantmentClass),
} & Conditions<C>)

export type EnchantRandomly<F extends NBTObject, C extends NBTObject> = ({
  /**
   * The allowed enchantments. If omitted, all enchantments applicable to the item are possible.
   */
  options?: ((
        | Registry['minecraft:enchantment']
        | `#${Registry['minecraft:tag/enchantment']}`
        | TagClass<'enchantment'>
        | EnchantmentClass)
      | Array<(Registry['minecraft:enchantment'] | EnchantmentClass)>),
  /**
   * Whether to only enchant with item-compatible enchantments. Defaults to `true`.
   *
   * Note: Books are considered compatible with all Enchantments.
   */
  only_compatible?: boolean,
  /**
   * Whether to add `additional_trade_cost` component to the enchanted item.
   * Additional cost value is determined by the enchantment level, with the formula `2 + random(0, 5 + level * 10) + 3 * level`.
   * Defaults to `false`.
   */
  include_additional_cost_component?: boolean,
} & Conditions<C>)

export type EnchantWithLevels<F extends NBTObject, C extends NBTObject> = ({
  /**
   * The levels to enchant this item with.
   */
  levels: NumberProvider,
  /**
   * The allowed enchantments. If omitted, all enchantments applicable to the item are possible.
   */
  options?: ((
        | Registry['minecraft:enchantment']
        | `#${Registry['minecraft:tag/enchantment']}`
        | TagClass<'enchantment'>
        | EnchantmentClass)
      | Array<(Registry['minecraft:enchantment'] | EnchantmentClass)>),
  /**
   * Whether to add `additional_trade_cost` component to the enchanted item.
   * Additional cost value is equal to the level cost determined by `levels`.
   * Defaults to `false`.
   */
  include_additional_cost_component?: boolean,
} & Conditions<C>)

export type ExplorationMap<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Generated structure to locate. Accepts any of the structure types used by the `/locate` command. Defaults to buried treasure.
   */
  destination?: (Registry['minecraft:tag/worldgen/structure']),
  /**
   * The icon used to mark the destination on the map. Accepts any of the map icon text IDs (case insensitive).
   * If `mansion` or `monument` is used, the color of the lines on the item texture changes to match the corresponding explorer map.
   */
  decoration?: Registry['minecraft:map_decoration_type'],
  /**
   * Defaults to 2.
   */
  zoom?: NBTInt,
  /**
   * The size, in chunks, of the area to search for structures.
   * The area checked is square, not circular.
   * Radius `0` causes only the current chunk to be searched, radius `1` causes the current chunk and eight adjacent chunks to be searched, and so on.
   * Defaults to `50`.
   */
  search_radius?: NBTInt,
  /**
   * Whether to not search in chunks that have already been generated. Defaults to `true`.
   */
  skip_existing_chunks?: boolean,
} & Conditions<C>)

export type FillPlayerHead<F extends NBTObject, C extends NBTObject> = ({
  /**
   * `this` to use the entity that died or the player that gained the advancement, opened the container, or broke the block.
   *
   * Value:
   *
   *  - This(`this`)
   *  - Killer(`killer`)
   *  - Attacker(`attacker`)
   *  - DirectKiller(`direct_killer`)
   *  - DirectAttacker(`direct_attacker`)
   *  - KillerPlayer(`killer_player`)
   *  - AttackingPlayer(`attacking_player`)
   *  - TargetEntity(`target_entity`)
   *  - InteractingEntity(`interacting_entity`)
   */
  entity: EntityTarget,
} & Conditions<C>)

export type Filtered<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Item predicate to select items to modify.
   */
  item_filter: ItemPredicate,
  /**
   * Loot function to apply to the item when `item_filter` passes.
   */
  on_pass?: (LootFunctionOf<F, C> | Array<LootFunctionOf<F, C>>),
  /**
   * Loot function to apply to the item when `item_filter` fails.
   */
  on_fail?: (LootFunctionOf<F, C> | Array<LootFunctionOf<F, C>>),
} & Conditions<C>)

export type FireworkExplosions = ({
  values: Array<SymbolDataComponent['firework_explosion']>,
} & ListOperation)

export type InsertListOperation = {
  /**
   * The offset in the list to insert into. Defaults to 0.
   *
   * Value:
   * Range: 0..
   */
  offset?: NBTInt<{
    min: 0,
  }>,
}

export type LimitCount<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Limits the count of the item to a range.
   */
  limit: IntRange,
} & Conditions<C>)

export type ListOperation = NonNullable<({
  [S in Extract<ListOperationMode, string>]?: ({
    /**
     * Determines how the existing list should be modified.
     *
     * Value:
     *
     *  - Append(`append`)
     *  - Insert(`insert`)
     *  - ReplaceAll(`replace_all`)
     *  - ReplaceSection(`replace_section`)
     */
    mode: S,
  } & (S extends keyof SymbolListOperation ? SymbolListOperation[S] : RootNBT))
}[ListOperationMode])>

export type ListOperationMode = ('append' | 'insert' | 'replace_all' | 'replace_section')

// TODO: Make this actually work properly
export type LootFunctionOf<F extends NBTObject, C extends NBTObject> = LootFunction[]

export type LootingEnchant<F extends NBTObject, C extends NBTObject> = (EnchantedCountBase & Conditions<C>)

export type MapDecoration = (
  | 'mansion'
  | 'monument'
  | 'player'
  | 'frame'
  | 'red_marker'
  | 'blue_marker'
  | 'target_x'
  | 'target_point'
  | 'player_off_map'
  | 'player_off_limits'
  | 'red_x'
  | 'banner_white'
  | 'banner_orange'
  | 'banner_magenta'
  | 'banner_light_blue'
  | 'banner_yellow'
  | 'banner_lime'
  | 'banner_pink'
  | 'banner_gray'
  | 'banner_light_gray'
  | 'banner_cyan'
  | 'banner_purple'
  | 'banner_blue'
  | 'banner_brown'
  | 'banner_green'
  | 'banner_red'
  | 'banner_black')

export type ModifyContents<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Describes target component's items to modify.
   *
   * Value:
   *
   *  - Container(`container`)
   *  - BundleContents(`bundle_contents`)
   *  - ChargedProjectiles(`charged_projectiles`)
   */
  component: (ContainerComponents | `minecraft:${ContainerComponents}`),
  /**
   * Applied to every item inside container.
   */
  modifier: (LootFunctionOf<F, C> | Array<LootFunctionOf<F, C>>),
} & Conditions<C>)

export type Reference<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Item modifier to reference.
   */
  name: (`${string}:${string}` | ItemModifierClass),
} & Conditions<C>)

export type ReplaceSectionListOperation = {
  /**
   * The offset of the section to replace. Defaults to 0.
   *
   * Value:
   * Range: 0..
   */
  offset?: NBTInt<{
    min: 0,
  }>,
  /**
   * The size of the section to replace. Defaults to size of the new list.
   *
   * Value:
   * Range: 0..
   */
  size?: NBTInt<{
    min: 0,
  }>,
}

export type Sequence<F extends NBTObject, C extends NBTObject> = {
  /**
   * List of functions to apply to this item.
   */
  functions: Array<LootFunctionOf<F, C>>,
}

export type SetAttributes<F extends NBTObject, C extends NBTObject> = ({
  /**
   * List of attribute modifiers to apply to this item.
   */
  modifiers: Array<AttributeModifier>,
  /**
   * Whether to replace existing attributes (otherwise append to existing). Defaults to `true`.
   */
  replace?: boolean,
} & Conditions<C>)

export type SetBannerPattern<F extends NBTObject, C extends NBTObject> = ({
  /**
   * List of banner pattern layers.
   */
  patterns: Array<BannerPatternLayer>,
  /**
   * Whether to add to the banner pattern list.
   */
  append: boolean,
} & Conditions<C>)

export type SetBookCover<F extends NBTObject, C extends NBTObject> = ({
  /**
   * If omitted, the original title is kept (or an empty string is used if there was no component)
   */
  title?: Filterable<`${any}${string}`>,
  /**
   * If omitted, the original author is kept (or an empty string is used if there was no component)
   */
  author?: string,
  /**
   * If omitted, the original generation is kept (or 0 is used if there was no component)
   *
   * Value:
   * Range: 0..3
   */
  generation?: NBTInt<{
    min: 0,
    max: 3,
  }>,
} & Conditions<C>)

export type SetComponents<F extends NBTObject, C extends NBTObject> = ({
  components: DataComponentPatch,
} & Conditions<C>)

export type SetContents<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Describes target component to be filled with items.
   *
   * Value:
   *
   *  - Container(`container`)
   *  - BundleContents(`bundle_contents`)
   *  - ChargedProjectiles(`charged_projectiles`)
   */
  component: (ContainerComponents | `minecraft:${ContainerComponents}`),
  entries: Array<LootPoolEntry>,
} & Conditions<C>)

export type SetCount<F extends NBTObject, C extends NBTObject> = ({
  count: NumberProvider,
  /**
   * Whether to add to the existing count. Defaults to `false`.
   */
  add?: boolean,
} & Conditions<C>)

export type SetCustomData<F extends NBTObject, C extends NBTObject> = ({
  tag: CustomData,
} & Conditions<C>)

export type SetCustomModelData<F extends NBTObject, C extends NBTObject> = ({
  floats?: ({
    values: Array<NumberProvider>,
  } & ListOperation),
  flags?: ({
    values: Array<boolean>,
  } & ListOperation),
  strings?: ({
    values: Array<string>,
  } & ListOperation),
  colors?: ({
    values: Array<(NumberProvider | RGB)>,
  } & ListOperation),
} & Conditions<C>)

export type SetDamage<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Decimal percentage. Can be negative when used in combination with `add`. \
   * Clamps to a float between `-1` & `1` (inclusive).
   */
  damage: NumberProvider,
  /**
   * Whether to add to the existing damage of the item. Defaults to `false`.
   */
  add?: boolean,
} & Conditions<C>)

export type SetEnchantments<F extends NBTObject, C extends NBTObject> = ({
  /**
   * A map of enchantments to levels. Setting an enchantment to `0` removes it from the item. \
   * Each level is clamped to a positive integer.
   */
  enchantments: ({
    [Key in Extract<Registry['minecraft:enchantment'], string>]?: NumberProvider
  }),
  /**
   * Whether to add to the level of each enchantment. Defaults to `false`.
   */
  add?: boolean,
} & Conditions<C>)

export type SetFireworkExplosion<F extends NBTObject, C extends NBTObject> = ({
  /**
   * If omitted, the original shape is kept (or `small_ball` is used if there was no component).
   *
   * Value:
   *
   *  - SmallBall(`small_ball`)
   *  - LargeBall(`large_ball`)
   *  - Star(`star`)
   *  - Creeper(`creeper`)
   *  - Burst(`burst`)
   */
  shape?: FireworkShape,
  /**
   * If omitted, the original colors are kept (or `[]` is used if there was no component).
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  colors?: Array<NBTInt>,
  /**
   * If omitted, the original fade colors are kept (or `[]` is used if there was no component).
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  fade_colors?: Array<NBTInt>,
  /**
   * If omitted, the original `has_trail` value is kept (or `false` is used if there was no component).
   */
  trail?: boolean,
  /**
   * If omitted, the original `has_twinkle` value is kept (or `false` is used if there was no component).
   */
  twinkle?: boolean,
} & Conditions<C>)

export type SetFireworks<F extends NBTObject, C extends NBTObject> = ({
  /**
   * If omitted, the flight duration of the item is left untouched - or set to 0 if the component did not exist before.
   *
   * Value:
   * Range: 0..255
   */
  flight_duration?: NBTInt<{
    min: 0,
  }>,
  explosions?: ({
    values: Array<SymbolDataComponent['firework_explosion']>,
  } & ListOperation),
} & Conditions<C>)

export type SetInstrument<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Sets the instrument tag for a goat horn.
   */
  options: ((
        | Registry['minecraft:instrument']
        | `#${Registry['minecraft:tag/instrument']}`
        | TagClass<'instrument'>
        | InstrumentClass)
      | Array<(Registry['minecraft:instrument'] | InstrumentClass)>),
} & Conditions<C>)

export type SetItem<F extends NBTObject, C extends NBTObject> = ({
  item: Registry['minecraft:item'],
} & Conditions<C>)

export type SetLootTable<F extends NBTObject, C extends NBTObject> = ({
  /**
   * The block entity type of the container.
   */
  type: Registry['minecraft:block_entity_type'],
  /**
   * The loot table to set to the container block item.
   */
  name: (Registry['minecraft:loot_table'] | LootTableClass),
  /**
   * The container seed to use. Defaults to a random seed.
   */
  seed?: NBTLong,
} & Conditions<C>)

export type SetLore<F extends NBTObject, C extends NBTObject> = ({
  /**
   * The entity used to resolve the text components.
   *
   * Value:
   *
   *  - This(`this`)
   *  - Killer(`killer`)
   *  - Attacker(`attacker`)
   *  - DirectKiller(`direct_killer`)
   *  - DirectAttacker(`direct_attacker`)
   *  - KillerPlayer(`killer_player`)
   *  - AttackingPlayer(`attacking_player`)
   *  - TargetEntity(`target_entity`)
   *  - InteractingEntity(`interacting_entity`)
   */
  entity?: EntityTarget,
  lore: Array<Text>,
} & ListOperation & Conditions<C>)

export type SetName<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Specifies the entity to act as the target `@s` in the JSON text component.
   *
   * Value:
   *
   *  - This(`this`)
   *  - Killer(`killer`)
   *  - Attacker(`attacker`)
   *  - DirectKiller(`direct_killer`)
   *  - DirectAttacker(`direct_attacker`)
   *  - KillerPlayer(`killer_player`)
   *  - AttackingPlayer(`attacking_player`)
   *  - TargetEntity(`target_entity`)
   *  - InteractingEntity(`interacting_entity`)
   */
  entity?: EntityTarget,
  name: Text,
  /**
   * Which name component to set. Defaults to `custom_name`.
   *
   * Value:
   *
   *  - ItemName(`item_name`)
   *  - CustomName(`custom_name`)
   */
  target?: SetNameTarget,
} & Conditions<C>)

export type SetNameTarget = ('item_name' | 'custom_name')

export type SetNbt<F extends NBTObject, C extends NBTObject> = ({
  tag: `${any}${string}` | NBTClass,
} & Conditions<C>)

export type SetOminousBottleAmplifier<F extends NBTObject, C extends NBTObject> = ({
  amplifier: NumberProvider,
} & Conditions<C>)

export type SetPotion<F extends NBTObject, C extends NBTObject> = ({
  /**
   * The potion identifier.
   */
  id: Registry['minecraft:potion'],
} & Conditions<C>)

export type SetRandomDyes<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Applies specified number of random dyes to the item. \
   * For example, one possible outcome of `"number_of_dyes": 2` is `#2C3065`, which is the combination of a blue dye and a black dye. \
   * The same dye color can be selected multiple times.
   */
  number_of_dyes: NumberProvider,
} & Conditions<C>)

export type SetRandomPotion<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Possible potions to select from.
   * Defaults to all potions.
   */
  options?: ((
      | Registry['minecraft:potion'] | `#${Registry['minecraft:tag/potion']}` | TagClass<'potion'>)
      | Registry['minecraft:potion']),
} & Conditions<C>)

export type SetStewEffect<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Sets the status effects for suspicious stew.
   */
  effects?: Array<StewEffect>,
} & Conditions<C>)

export type SetWriteableBookPages<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Sets the pages of a book and quill.
   */
  pages: Array<Filterable<string>>,
} & ListOperation & Conditions<C>)

export type SetWrittenBookPages<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Sets the pages of a written book.
   */
  pages: Array<Filterable<Text>>,
} & ListOperation & Conditions<C>)

export type StewEffect = {
  /**
   * The status effect of this stew effect.
   */
  type: Registry['minecraft:mob_effect'],
  /**
   * The duration of this stew effect, in seconds.
   */
  duration: NumberProvider,
}

export type ToggleableDataComponent = (
  | 'attribute_modifiers'
  | 'can_break'
  | 'can_place_on'
  | 'dyed_color'
  | 'enchantments'
  | 'jukebox_playable'
  | 'stored_enchantments'
  | 'trim'
  | 'unbreakable')

export type ToggleTooltips<F extends NBTObject, C extends NBTObject> = ({
  /**
   * Toggles which tooltips are shown.
   */
  toggles: ({
    [Key in Extract<Registry['minecraft:data_component_type'], string>]?: boolean
  }),
} & Conditions<C>)

export type UniformBonusFormula = {
  parameters: {
    bonusMultiplier: NBTInt,
  },
}
type ApplyBonusFormulaDispatcherMap = {
  'binomial_with_bonus_count': ApplyBonusFormulaBinomialWithBonusCount,
  'minecraft:binomial_with_bonus_count': ApplyBonusFormulaBinomialWithBonusCount,
  'ore_drops': ApplyBonusFormulaOreDrops,
  'minecraft:ore_drops': ApplyBonusFormulaOreDrops,
  'uniform_bonus_count': ApplyBonusFormulaUniformBonusCount,
  'minecraft:uniform_bonus_count': ApplyBonusFormulaUniformBonusCount,
}
type ApplyBonusFormulaKeys = keyof ApplyBonusFormulaDispatcherMap
type ApplyBonusFormulaFallback = (
  | ApplyBonusFormulaBinomialWithBonusCount
  | ApplyBonusFormulaOreDrops
  | ApplyBonusFormulaUniformBonusCount)
type ApplyBonusFormulaBinomialWithBonusCount = BinomialWithBonusCountFormula
type ApplyBonusFormulaOreDrops = Record<string, never>
type ApplyBonusFormulaUniformBonusCount = UniformBonusFormula
export type SymbolApplyBonusFormula<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? ApplyBonusFormulaDispatcherMap
  : CASE extends 'keys' ? ApplyBonusFormulaKeys : CASE extends '%fallback' ? ApplyBonusFormulaFallback : never
type ListOperationDispatcherMap = {
  'append': ListOperationAppend,
  'minecraft:append': ListOperationAppend,
  'insert': ListOperationInsert,
  'minecraft:insert': ListOperationInsert,
  'replace_all': ListOperationReplaceAll,
  'minecraft:replace_all': ListOperationReplaceAll,
  'replace_section': ListOperationReplaceSection,
  'minecraft:replace_section': ListOperationReplaceSection,
}
type ListOperationKeys = keyof ListOperationDispatcherMap
type ListOperationFallback = (
  | ListOperationAppend
  | ListOperationInsert
  | ListOperationReplaceAll
  | ListOperationReplaceSection)
type ListOperationAppend = Record<string, never>
type ListOperationInsert = InsertListOperation
type ListOperationReplaceAll = Record<string, never>
type ListOperationReplaceSection = ReplaceSectionListOperation
export type SymbolListOperation<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? ListOperationDispatcherMap
  : CASE extends 'keys' ? ListOperationKeys : CASE extends '%fallback' ? ListOperationFallback : never
type LootFunctionDispatcherMap<F extends NBTObject, C extends NBTObject> = {
  'apply_bonus': LootFunctionApplyBonus<F, C>,
  'minecraft:apply_bonus': LootFunctionApplyBonus<F, C>,
  'copy_components': LootFunctionCopyComponents<F, C>,
  'minecraft:copy_components': LootFunctionCopyComponents<F, C>,
  'copy_custom_data': LootFunctionCopyCustomData<F, C>,
  'minecraft:copy_custom_data': LootFunctionCopyCustomData<F, C>,
  'copy_name': LootFunctionCopyName<F, C>,
  'minecraft:copy_name': LootFunctionCopyName<F, C>,
  'copy_nbt': LootFunctionCopyNbt<F, C>,
  'minecraft:copy_nbt': LootFunctionCopyNbt<F, C>,
  'copy_state': LootFunctionCopyState<F, C>,
  'minecraft:copy_state': LootFunctionCopyState<F, C>,
  'discard': LootFunctionDiscard<F, C>,
  'minecraft:discard': LootFunctionDiscard<F, C>,
  'enchant_randomly': LootFunctionEnchantRandomly<F, C>,
  'minecraft:enchant_randomly': LootFunctionEnchantRandomly<F, C>,
  'enchant_with_levels': LootFunctionEnchantWithLevels<F, C>,
  'minecraft:enchant_with_levels': LootFunctionEnchantWithLevels<F, C>,
  'enchanted_count_increase': LootFunctionEnchantedCountIncrease<F, C>,
  'minecraft:enchanted_count_increase': LootFunctionEnchantedCountIncrease<F, C>,
  'exploration_map': LootFunctionExplorationMap<F, C>,
  'minecraft:exploration_map': LootFunctionExplorationMap<F, C>,
  'explosion_decay': LootFunctionExplosionDecay<F, C>,
  'minecraft:explosion_decay': LootFunctionExplosionDecay<F, C>,
  'fill_player_head': LootFunctionFillPlayerHead<F, C>,
  'minecraft:fill_player_head': LootFunctionFillPlayerHead<F, C>,
  'filtered': LootFunctionFiltered<F, C>,
  'minecraft:filtered': LootFunctionFiltered<F, C>,
  'furnace_smelt': LootFunctionFurnaceSmelt<F, C>,
  'minecraft:furnace_smelt': LootFunctionFurnaceSmelt<F, C>,
  'limit_count': LootFunctionLimitCount<F, C>,
  'minecraft:limit_count': LootFunctionLimitCount<F, C>,
  'looting_enchant': LootFunctionLootingEnchant<F, C>,
  'minecraft:looting_enchant': LootFunctionLootingEnchant<F, C>,
  'modify_contents': LootFunctionModifyContents<F, C>,
  'minecraft:modify_contents': LootFunctionModifyContents<F, C>,
  'reference': LootFunctionReference<F, C>,
  'minecraft:reference': LootFunctionReference<F, C>,
  'sequence': LootFunctionSequence<F, C>,
  'minecraft:sequence': LootFunctionSequence<F, C>,
  'set_attributes': LootFunctionSetAttributes<F, C>,
  'minecraft:set_attributes': LootFunctionSetAttributes<F, C>,
  'set_banner_pattern': LootFunctionSetBannerPattern<F, C>,
  'minecraft:set_banner_pattern': LootFunctionSetBannerPattern<F, C>,
  'set_book_cover': LootFunctionSetBookCover<F, C>,
  'minecraft:set_book_cover': LootFunctionSetBookCover<F, C>,
  'set_components': LootFunctionSetComponents<F, C>,
  'minecraft:set_components': LootFunctionSetComponents<F, C>,
  'set_contents': LootFunctionSetContents<F, C>,
  'minecraft:set_contents': LootFunctionSetContents<F, C>,
  'set_count': LootFunctionSetCount<F, C>,
  'minecraft:set_count': LootFunctionSetCount<F, C>,
  'set_custom_data': LootFunctionSetCustomData<F, C>,
  'minecraft:set_custom_data': LootFunctionSetCustomData<F, C>,
  'set_custom_model_data': LootFunctionSetCustomModelData<F, C>,
  'minecraft:set_custom_model_data': LootFunctionSetCustomModelData<F, C>,
  'set_damage': LootFunctionSetDamage<F, C>,
  'minecraft:set_damage': LootFunctionSetDamage<F, C>,
  'set_enchantments': LootFunctionSetEnchantments<F, C>,
  'minecraft:set_enchantments': LootFunctionSetEnchantments<F, C>,
  'set_firework_explosion': LootFunctionSetFireworkExplosion<F, C>,
  'minecraft:set_firework_explosion': LootFunctionSetFireworkExplosion<F, C>,
  'set_fireworks': LootFunctionSetFireworks<F, C>,
  'minecraft:set_fireworks': LootFunctionSetFireworks<F, C>,
  'set_instrument': LootFunctionSetInstrument<F, C>,
  'minecraft:set_instrument': LootFunctionSetInstrument<F, C>,
  'set_item': LootFunctionSetItem<F, C>,
  'minecraft:set_item': LootFunctionSetItem<F, C>,
  'set_loot_table': LootFunctionSetLootTable<F, C>,
  'minecraft:set_loot_table': LootFunctionSetLootTable<F, C>,
  'set_lore': LootFunctionSetLore<F, C>,
  'minecraft:set_lore': LootFunctionSetLore<F, C>,
  'set_name': LootFunctionSetName<F, C>,
  'minecraft:set_name': LootFunctionSetName<F, C>,
  'set_nbt': LootFunctionSetNbt<F, C>,
  'minecraft:set_nbt': LootFunctionSetNbt<F, C>,
  'set_ominous_bottle_amplifier': LootFunctionSetOminousBottleAmplifier<F, C>,
  'minecraft:set_ominous_bottle_amplifier': LootFunctionSetOminousBottleAmplifier<F, C>,
  'set_potion': LootFunctionSetPotion<F, C>,
  'minecraft:set_potion': LootFunctionSetPotion<F, C>,
  'set_random_dyes': LootFunctionSetRandomDyes<F, C>,
  'minecraft:set_random_dyes': LootFunctionSetRandomDyes<F, C>,
  'set_random_potion': LootFunctionSetRandomPotion<F, C>,
  'minecraft:set_random_potion': LootFunctionSetRandomPotion<F, C>,
  'set_stew_effect': LootFunctionSetStewEffect<F, C>,
  'minecraft:set_stew_effect': LootFunctionSetStewEffect<F, C>,
  'set_writable_book_pages': LootFunctionSetWritableBookPages<F, C>,
  'minecraft:set_writable_book_pages': LootFunctionSetWritableBookPages<F, C>,
  'set_written_book_pages': LootFunctionSetWrittenBookPages<F, C>,
  'minecraft:set_written_book_pages': LootFunctionSetWrittenBookPages<F, C>,
  'toggle_tooltips': LootFunctionToggleTooltips<F, C>,
  'minecraft:toggle_tooltips': LootFunctionToggleTooltips<F, C>,
}
type LootFunctionKeys = keyof LootFunctionDispatcherMap<NBTObject, NBTObject>
type LootFunctionFallback<F extends NBTObject, C extends NBTObject> = (
  | LootFunctionApplyBonus<F, C>
  | LootFunctionCopyComponents<F, C>
  | LootFunctionCopyCustomData<F, C>
  | LootFunctionCopyName<F, C>
  | LootFunctionCopyNbt<F, C>
  | LootFunctionCopyState<F, C>
  | LootFunctionDiscard<F, C>
  | LootFunctionEnchantRandomly<F, C>
  | LootFunctionEnchantWithLevels<F, C>
  | LootFunctionEnchantedCountIncrease<F, C>
  | LootFunctionExplorationMap<F, C>
  | LootFunctionExplosionDecay<F, C>
  | LootFunctionFillPlayerHead<F, C>
  | LootFunctionFiltered<F, C>
  | LootFunctionFurnaceSmelt<F, C>
  | LootFunctionLimitCount<F, C>
  | LootFunctionLootingEnchant<F, C>
  | LootFunctionModifyContents<F, C>
  | LootFunctionReference<F, C>
  | LootFunctionSequence<F, C>
  | LootFunctionSetAttributes<F, C>
  | LootFunctionSetBannerPattern<F, C>
  | LootFunctionSetBookCover<F, C>
  | LootFunctionSetComponents<F, C>
  | LootFunctionSetContents<F, C>
  | LootFunctionSetCount<F, C>
  | LootFunctionSetCustomData<F, C>
  | LootFunctionSetCustomModelData<F, C>
  | LootFunctionSetDamage<F, C>
  | LootFunctionSetEnchantments<F, C>
  | LootFunctionSetFireworkExplosion<F, C>
  | LootFunctionSetFireworks<F, C>
  | LootFunctionSetInstrument<F, C>
  | LootFunctionSetItem<F, C>
  | LootFunctionSetLootTable<F, C>
  | LootFunctionSetLore<F, C>
  | LootFunctionSetName<F, C>
  | LootFunctionSetNbt<F, C>
  | LootFunctionSetOminousBottleAmplifier<F, C>
  | LootFunctionSetPotion<F, C>
  | LootFunctionSetRandomDyes<F, C>
  | LootFunctionSetRandomPotion<F, C>
  | LootFunctionSetStewEffect<F, C>
  | LootFunctionSetWritableBookPages<F, C>
  | LootFunctionSetWrittenBookPages<F, C>
  | LootFunctionToggleTooltips<F, C>)
export type LootFunctionApplyBonus<F extends NBTObject, C extends NBTObject> = ApplyBonus<F, C>

export type LootFunctionCopyComponents<F extends NBTObject, C extends NBTObject> = CopyComponents<F, C>

export type LootFunctionCopyCustomData<F extends NBTObject, C extends NBTObject> = CopyNbt<C>

export type LootFunctionCopyName<F extends NBTObject, C extends NBTObject> = CopyName<F, C>

export type LootFunctionCopyNbt<F extends NBTObject, C extends NBTObject> = CopyNbt<C>

export type LootFunctionCopyState<F extends NBTObject, C extends NBTObject> = CopyState<F, C>

export type LootFunctionDiscard<F extends NBTObject, C extends NBTObject> = Conditions<C>

export type LootFunctionEnchantRandomly<F extends NBTObject, C extends NBTObject> = EnchantRandomly<F, C>

export type LootFunctionEnchantWithLevels<F extends NBTObject, C extends NBTObject> = EnchantWithLevels<F, C>

export type LootFunctionEnchantedCountIncrease<F extends NBTObject, C extends NBTObject> = EnchantedCountIncrease<F, C>

export type LootFunctionExplorationMap<F extends NBTObject, C extends NBTObject> = ExplorationMap<F, C>

export type LootFunctionExplosionDecay<F extends NBTObject, C extends NBTObject> = Conditions<C>

export type LootFunctionFillPlayerHead<F extends NBTObject, C extends NBTObject> = FillPlayerHead<F, C>

export type LootFunctionFiltered<F extends NBTObject, C extends NBTObject> = Filtered<F, C>

export type LootFunctionFurnaceSmelt<F extends NBTObject, C extends NBTObject> = Conditions<C>

export type LootFunctionLimitCount<F extends NBTObject, C extends NBTObject> = LimitCount<F, C>

export type LootFunctionLootingEnchant<F extends NBTObject, C extends NBTObject> = LootingEnchant<F, C>

export type LootFunctionModifyContents<F extends NBTObject, C extends NBTObject> = ModifyContents<F, C>

export type LootFunctionReference<F extends NBTObject, C extends NBTObject> = Reference<F, C>

export type LootFunctionSequence<F extends NBTObject, C extends NBTObject> = Sequence<F, C>

export type LootFunctionSetAttributes<F extends NBTObject, C extends NBTObject> = SetAttributes<F, C>

export type LootFunctionSetBannerPattern<F extends NBTObject, C extends NBTObject> = SetBannerPattern<F, C>

export type LootFunctionSetBookCover<F extends NBTObject, C extends NBTObject> = SetBookCover<F, C>

export type LootFunctionSetComponents<F extends NBTObject, C extends NBTObject> = SetComponents<F, C>

export type LootFunctionSetContents<F extends NBTObject, C extends NBTObject> = SetContents<F, C>

export type LootFunctionSetCount<F extends NBTObject, C extends NBTObject> = SetCount<F, C>

export type LootFunctionSetCustomData<F extends NBTObject, C extends NBTObject> = SetCustomData<F, C>

export type LootFunctionSetCustomModelData<F extends NBTObject, C extends NBTObject> = SetCustomModelData<F, C>

export type LootFunctionSetDamage<F extends NBTObject, C extends NBTObject> = SetDamage<F, C>

export type LootFunctionSetEnchantments<F extends NBTObject, C extends NBTObject> = SetEnchantments<F, C>

export type LootFunctionSetFireworkExplosion<F extends NBTObject, C extends NBTObject> = SetFireworkExplosion<F, C>

export type LootFunctionSetFireworks<F extends NBTObject, C extends NBTObject> = SetFireworks<F, C>

export type LootFunctionSetInstrument<F extends NBTObject, C extends NBTObject> = SetInstrument<F, C>

export type LootFunctionSetItem<F extends NBTObject, C extends NBTObject> = SetItem<F, C>

export type LootFunctionSetLootTable<F extends NBTObject, C extends NBTObject> = SetLootTable<F, C>

export type LootFunctionSetLore<F extends NBTObject, C extends NBTObject> = SetLore<F, C>

export type LootFunctionSetName<F extends NBTObject, C extends NBTObject> = SetName<F, C>

export type LootFunctionSetNbt<F extends NBTObject, C extends NBTObject> = SetNbt<F, C>

export type LootFunctionSetOminousBottleAmplifier<F extends NBTObject, C extends NBTObject> = SetOminousBottleAmplifier<F, C>

export type LootFunctionSetPotion<F extends NBTObject, C extends NBTObject> = SetPotion<F, C>

export type LootFunctionSetRandomDyes<F extends NBTObject, C extends NBTObject> = SetRandomDyes<F, C>

export type LootFunctionSetRandomPotion<F extends NBTObject, C extends NBTObject> = SetRandomPotion<F, C>

export type LootFunctionSetStewEffect<F extends NBTObject, C extends NBTObject> = SetStewEffect<F, C>

export type LootFunctionSetWritableBookPages<F extends NBTObject, C extends NBTObject> = SetWriteableBookPages<F, C>

export type LootFunctionSetWrittenBookPages<F extends NBTObject, C extends NBTObject> = SetWrittenBookPages<F, C>

export type LootFunctionToggleTooltips<F extends NBTObject, C extends NBTObject> = ToggleTooltips<F, C>

export type SymbolLootFunction<F extends NBTObject, C extends NBTObject, CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? LootFunctionDispatcherMap<F, C>
  : CASE extends 'keys' ? LootFunctionKeys : CASE extends '%fallback' ? LootFunctionFallback<F, C> : never
