import type { JsonItemPredicate } from 'sandstone/arguments/generated/_json/data/advancement/predicate.ts'
import type { JsonItemModifier } from 'sandstone/arguments/generated/_json/data/item_modifier.ts'
import type {
  JsonBlockEntityTarget,
  JsonEntityTarget,
  JsonItemStackTarget,
  JsonLootPoolEntry,
} from 'sandstone/arguments/generated/_json/data/loot.ts'
import type {
  JsonFloatNumberProviderRef,
  JsonIntNumberProviderRef,
} from 'sandstone/arguments/generated/_json/data/number_provider.ts'
import type { JsonPredicateRef } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonNbtProvider } from 'sandstone/arguments/generated/_json/data/util.ts'
import type {
  JsonSymbolDataComponent,
  JsonSymbolMcdocBlockStateKeys,
} from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonAttributeOperation } from 'sandstone/arguments/generated/_json/util/attribute.ts'
import type { JsonDyeColor, JSONRGB } from 'sandstone/arguments/generated/_json/util/color.ts'
import type { JsonFilterable } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonEquipmentSlotGroup } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonText } from 'sandstone/arguments/generated/_json/util/text.ts'
import type { JsonFireworkShape } from 'sandstone/arguments/generated/_json/world/component/item.ts'
import type { JsonCustomData, JsonDataComponentPatch } from 'sandstone/arguments/generated/_json/world/component.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  BannerPatternClass,
  DataPointClass,
  EnchantmentClass,
  InstrumentClass,
  ItemModifierClass,
  LootTableClass,
  NamespacedString,
  NBTClass,
  NBTFloat,
  NBTInt,
  NBTLong,
  NonEmptyString,
  TagClass,
} from 'sandstone'

export type JsonApplyBonus = NonNullable<({
  [S in Extract<Extract<JsonApplyBonusFormula, string>, string>]?: ({
    enchantment: (JsonRegistry['minecraft:enchantment'] | EnchantmentClass),
    /**
     * Value:
     *
     *  - OreDrops(`ore_drops`)
     *  - UniformBonusCount(`uniform_bonus_count`)
     *  - BinomialWithBonusCount(`binomial_with_bonus_count`)
     */
    formula: (S | `minecraft:${S}`),
  } & (S extends keyof JsonSymbolApplyBonusFormula ? JsonSymbolApplyBonusFormula[S] : JsonRootNBT) & JsonConditions)
}[Extract<JsonApplyBonusFormula, string>])>

export type JsonApplyBonusFormula = ('ore_drops' | 'uniform_bonus_count' | 'binomial_with_bonus_count')

export type JsonAttributeModifier = ({
  /**
   * Attribute type to modify.
   */
  attribute: JsonRegistry['minecraft:attribute'],
  amount: JsonFloatNumberProviderRef,
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
  slot: (JsonEquipmentSlotGroup | Array<JsonEquipmentSlotGroup>),
} & {
  /**
   * The unique identifier of this attribute modifier.
   */
  id: NamespacedString,
})

export type JsonBannerPattern = (
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

export type JsonBannerPatternLayer = {
  pattern: (JsonRegistry['minecraft:banner_pattern'] | BannerPatternClass),
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
  color: JsonDyeColor,
}

export type JsonBinomialWithBonusCountFormula = {
  parameters: {
    extra: (NBTInt | number),
    /**
     * Value:
     * Range: 0..1
     */
    probability: (NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
      min: 0,
      max: 1,
    }> | number),
  },
}

export type JsonConditions = {
  condition?: JsonPredicateRef,
}

export type JsonContainerComponents = ('container' | 'bundle_contents' | 'charged_projectiles')

export type JsonCopyComponents = ({
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
  source: (JsonBlockEntityTarget | JsonEntityTarget | JsonItemStackTarget),
  /**
   * If omitted, all components present are included
   */
  include?: Array<JsonRegistry['minecraft:data_component_type']>,
  /**
   * Defaults to none.
   */
  exclude?: Array<JsonRegistry['minecraft:data_component_type']>,
} & JsonConditions)

export type JsonCopyName = ({
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
  source: (JsonEntityTarget | JsonBlockEntityTarget),
} & JsonConditions)

export type JsonCopyNameSource = (
  | 'this'
  | 'killer'
  | 'attacking_entity'
  | 'killer_player'
  | 'last_damage_player'
  | 'block_entity')

export type JsonCopyNbt = ({
  source: JsonNbtProvider,
  ops: Array<{
    source: NonEmptyString | DataPointClass,
    target: NonEmptyString | DataPointClass,
    /**
     * Value:
     *
     *  - Replace(`replace`): Replace any existing contents of the target.
     *  - Append(`append`): Append to a list.
     *  - Merge(`merge`): Merge into a compound tag.
     */
    op: JsonCopyNbtStrategy,
  }>,
} & JsonConditions)

export type JsonCopyNbtOperation = {
  source: NonEmptyString | DataPointClass,
  target: NonEmptyString | DataPointClass,
  /**
   * Value:
   *
   *  - Replace(`replace`): Replace any existing contents of the target.
   *  - Append(`append`): Append to a list.
   *  - Merge(`merge`): Merge into a compound tag.
   */
  op: JsonCopyNbtStrategy,
}

export type JsonCopyNbtStrategy = ('replace' | 'append' | 'merge')

export type JsonCopyState = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:block'], string>, string>]?: ({
    block: S,
    properties: Array<(S extends undefined
      ? JsonSymbolMcdocBlockStateKeys<'%none'> :
      (S extends keyof JsonSymbolMcdocBlockStateKeys
        ? JsonSymbolMcdocBlockStateKeys[S]
        : JsonSymbolMcdocBlockStateKeys<'%unknown'>))>,
  } & JsonConditions)
}[Extract<JsonRegistry['minecraft:block'], string>])>

export type JsonCustomModelDataColors = ({
  values: Array<(JSONRGB | JsonIntNumberProviderRef)>,
} & JsonListOperation)

export type JsonCustomModelDataFlags = ({
  values: Array<boolean>,
} & JsonListOperation)

export type JsonCustomModelDataFloats = ({
  values: Array<JsonFloatNumberProviderRef>,
} & JsonListOperation)

export type JsonCustomModelDataStrings = ({
  values: Array<string>,
} & JsonListOperation)

export type JsonEnchantedCountBase = {
  /**
   * Rounded *after* the number was multiplied by the looting level.
   */
  count: JsonFloatNumberProviderRef,
  /**
   * Limits the count of the item to a range.
   */
  limit?: (NBTInt | number),
}

export type JsonEnchantedCountIncrease = (JsonEnchantedCountBase & {
  /**
   * Enchantment that increases yields.
   */
  enchantment: (JsonRegistry['minecraft:enchantment'] | EnchantmentClass),
} & JsonConditions)

export type JsonEnchantRandomly = ({
  /**
   * The allowed enchantments. If omitted, all enchantments applicable to the item are possible.
   */
  options?: ((
        | JsonRegistry['minecraft:enchantment']
        | `#${JsonRegistry['minecraft:tag/enchantment']}`
        | TagClass<'enchantment'>
        | EnchantmentClass)
      | Array<(JsonRegistry['minecraft:enchantment'] | EnchantmentClass)>),
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
} & JsonConditions)

export type JsonEnchantWithLevels = ({
  /**
   * The levels to enchant this item with.
   */
  levels: JsonIntNumberProviderRef,
  /**
   * The allowed enchantments. If omitted, all enchantments applicable to the item are possible.
   */
  options?: ((
        | JsonRegistry['minecraft:enchantment']
        | `#${JsonRegistry['minecraft:tag/enchantment']}`
        | TagClass<'enchantment'>
        | EnchantmentClass)
      | Array<(JsonRegistry['minecraft:enchantment'] | EnchantmentClass)>),
  /**
   * Whether to add `additional_trade_cost` component to the enchanted item.
   * Additional cost value is equal to the level cost determined by `levels`.
   * Defaults to `false`.
   */
  include_additional_cost_component?: boolean,
} & JsonConditions)

export type JsonExplorationMap = ({
  /**
   * Generated structure to locate. Accepts any of the structure types used by the `/locate` command.
   */
  destination: ((
        | JsonRegistry['minecraft:worldgen/structure']
        | `#${JsonRegistry['minecraft:tag/worldgen/structure']}`
        | TagClass<'worldgen/structure'>)
      | Array<JsonRegistry['minecraft:worldgen/structure']>),
} & {
  /**
   * The icon used to mark the destination on the map.
   */
  decoration?: JsonRegistry['minecraft:map_decoration_type'],
} & {
  /**
   * Defaults to 2.
   */
  zoom?: (NBTInt | number),
  /**
   * The size, in chunks, of the area to search for structures.
   * The area checked is square, not circular.
   * Radius `0` causes only the current chunk to be searched, radius `1` causes the current chunk and eight adjacent chunks to be searched, and so on.
   * Defaults to `50`.
   */
  search_radius?: (NBTInt | number),
  /**
   * Whether to not search in chunks that have already been generated. Defaults to `true`.
   */
  skip_existing_chunks?: boolean,
} & JsonConditions)

export type JsonFillPlayerHead = ({
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
  entity: JsonEntityTarget,
} & JsonConditions)

export type JsonFiltered = ({
  /**
   * Item predicate to select items to modify.
   */
  item_filter: JsonItemPredicate,
  /**
   * Loot function to apply to the item when `item_filter` passes.
   */
  on_pass?: JsonItemModifier,
  /**
   * Loot function to apply to the item when `item_filter` fails.
   */
  on_fail?: JsonItemModifier,
} & JsonConditions)

export type JsonFireworkExplosions = ({
  values: Array<JsonSymbolDataComponent['firework_explosion']>,
} & JsonListOperation)

export type JsonInsertListOperation = {
  /**
   * The offset in the list to insert into. Defaults to 0.
   *
   * Value:
   * Range: 0..
   */
  offset?: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonLegacyExplorationMapDestination = (
  | 'pillager_outpost'
  | 'mineshaft'
  | 'manshion'
  | 'jungle_pyramid'
  | 'desert_pyramid'
  | 'igloo'
  | 'ruined_portal'
  | 'shipwreck'
  | 'swamp_hut'
  | 'stronghold'
  | 'monument'
  | 'ocean_ruin'
  | 'fortress'
  | 'endcity'
  | 'buried_treasure'
  | 'village'
  | 'nether_fossil'
  | 'bastion_remnent')

export type JsonLimitCount = ({
  /**
   * Limits the count of the item to a range.
   */
  limit: {
    min?: JsonIntNumberProviderRef,
    max?: JsonIntNumberProviderRef,
  },
} & JsonConditions)

export type JsonListOperation = NonNullable<({
  [S in Extract<Extract<JsonListOperationMode, string>, string>]?: ({
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
  } & (S extends keyof JsonSymbolListOperation ? JsonSymbolListOperation[S] : JsonRootNBT))
}[Extract<JsonListOperationMode, string>])>

export type JsonListOperationMode = ('append' | 'insert' | 'replace_all' | 'replace_section')

export type JsonLootFunction = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:loot_function_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolLootFunction ? JsonSymbolLootFunction[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:loot_function_type'], string>])>

export type JsonLootingEnchant = (JsonEnchantedCountBase & JsonConditions)

export type JsonMapDecoration = (
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

export type JsonModifyContents = ({
  /**
   * Describes target component's items to modify.
   *
   * Value:
   *
   *  - Container(`container`)
   *  - BundleContents(`bundle_contents`)
   *  - ChargedProjectiles(`charged_projectiles`)
   */
  component: (JsonContainerComponents | `minecraft:${JsonContainerComponents}`),
  /**
   * Applied to every item inside container.
   */
  modifier: JsonItemModifier,
} & JsonConditions)

export type JsonReference = ({
  /**
   * Item modifier to reference.
   */
  name: (NamespacedString | ItemModifierClass),
} & JsonConditions)

export type JsonReplaceSectionListOperation = {
  /**
   * The offset of the section to replace. Defaults to 0.
   *
   * Value:
   * Range: 0..
   */
  offset?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * The size of the section to replace. Defaults to size of the new list.
   *
   * Value:
   * Range: 0..
   */
  size?: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonSequence = ({
  /**
   * List of functions to apply to this item.
   */
  functions: JsonItemModifier,
} & JsonConditions)

export type JsonSetAttributes = ({
  /**
   * List of attribute modifiers to apply to this item.
   */
  modifiers: Array<JsonAttributeModifier>,
  /**
   * Whether to replace existing attributes (otherwise append to existing). Defaults to `true`.
   */
  replace?: boolean,
} & JsonConditions)

export type JsonSetBannerPattern = ({
  /**
   * List of banner pattern layers.
   */
  patterns: Array<JsonBannerPatternLayer>,
  /**
   * Whether to add to the banner pattern list.
   */
  append: boolean,
} & JsonConditions)

export type JsonSetBookCover = ({
  /**
   * If omitted, the original title is kept (or an empty string is used if there was no component)
   */
  title?: JsonFilterable<NonEmptyString>,
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
  generation?: (NBTInt<{
    min: 0,
    max: 3,
  }> | number),
} & JsonConditions)

export type JsonSetComponents = ({
  components: JsonDataComponentPatch,
} & JsonConditions)

export type JsonSetContents = ({
  /**
   * Describes target component to be filled with items.
   *
   * Value:
   *
   *  - Container(`container`)
   *  - BundleContents(`bundle_contents`)
   *  - ChargedProjectiles(`charged_projectiles`)
   */
  component: (JsonContainerComponents | `minecraft:${JsonContainerComponents}`),
  entries: Array<JsonLootPoolEntry>,
} & JsonConditions)

export type JsonSetCount = ({
  count: JsonIntNumberProviderRef,
  /**
   * Whether to add to the existing count. Defaults to `false`.
   */
  add?: boolean,
} & JsonConditions)

export type JsonSetCustomData = ({
  tag: JsonCustomData,
} & JsonConditions)

export type JsonSetCustomModelData = ({
  floats?: ({
    values: Array<JsonFloatNumberProviderRef>,
  } & JsonListOperation),
  flags?: ({
    values: Array<boolean>,
  } & JsonListOperation),
  strings?: ({
    values: Array<string>,
  } & JsonListOperation),
  colors?: ({
    values: Array<(JSONRGB | JsonIntNumberProviderRef)>,
  } & JsonListOperation),
} & JsonConditions)

export type JsonSetDamage = ({
  /**
   * Decimal percentage. Can be negative when used in combination with `add`. \
   * Accepts a value between `-1` & `1` (inclusive).
   */
  damage: JsonFloatNumberProviderRef,
  /**
   * Whether to add to the existing damage of the item. Defaults to `false`.
   */
  add?: boolean,
} & JsonConditions)

export type JsonSetEnchantments = ({
  /**
   * A map of enchantments to levels. Setting an enchantment to `0` removes it from the item.
   */
  enchantments: ({
    [Key in Extract<JsonRegistry['minecraft:enchantment'], string>]?: JsonIntNumberProviderRef
  }),
  /**
   * Whether to add to the level of each enchantment. Defaults to `false`.
   */
  add?: boolean,
} & JsonConditions)

export type JsonSetFireworkExplosion = ({
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
  shape?: JsonFireworkShape,
  /**
   * If omitted, the original colors are kept (or `[]` is used if there was no component).
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  colors?: Array<(NBTInt | number)>,
  /**
   * If omitted, the original fade colors are kept (or `[]` is used if there was no component).
   * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
   */
  fade_colors?: Array<(NBTInt | number)>,
  /**
   * If omitted, the original `has_trail` value is kept (or `false` is used if there was no component).
   */
  trail?: boolean,
  /**
   * If omitted, the original `has_twinkle` value is kept (or `false` is used if there was no component).
   */
  twinkle?: boolean,
} & JsonConditions)

export type JsonSetFireworks = ({
  /**
   * If omitted, the flight duration of the item is left untouched - or set to 0 if the component did not exist before.
   *
   * Value:
   * Range: 0..255
   */
  flight_duration?: (NBTInt<{
    min: 0,
  }> | number),
  explosions?: ({
    values: Array<JsonSymbolDataComponent['firework_explosion']>,
  } & JsonListOperation),
} & JsonConditions)

export type JsonSetInstrument = ({
  /**
   * Sets the instrument tag for a goat horn.
   */
  options: ((
        | JsonRegistry['minecraft:instrument']
        | `#${JsonRegistry['minecraft:tag/instrument']}`
        | TagClass<'instrument'>
        | InstrumentClass)
      | Array<(JsonRegistry['minecraft:instrument'] | InstrumentClass)>),
} & JsonConditions)

export type JsonSetItem = ({
  item: JsonRegistry['minecraft:item'],
} & JsonConditions)

export type JsonSetLootTable = ({
  /**
   * The loot table to set to the container block item.
   */
  loot_table_id: (JsonRegistry['minecraft:loot_table'] | LootTableClass),
  /**
   * The container seed to use. Defaults to a random seed.
   */
  seed?: (NBTLong | number),
} & JsonConditions)

export type JsonSetLore = ({
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
  entity?: JsonEntityTarget,
  lore: Array<JsonText>,
} & JsonListOperation & JsonConditions)

export type JsonSetName = ({
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
  entity?: JsonEntityTarget,
  name: JsonText,
  /**
   * Which name component to set. Defaults to `custom_name`.
   *
   * Value:
   *
   *  - ItemName(`item_name`)
   *  - CustomName(`custom_name`)
   */
  target?: JsonSetNameTarget,
} & JsonConditions)

export type JsonSetNameTarget = ('item_name' | 'custom_name')

export type JsonSetNbt = ({
  tag: NonEmptyString | NBTClass,
} & JsonConditions)

export type JsonSetOminousBottleAmplifier = ({
  amplifier: JsonIntNumberProviderRef,
} & JsonConditions)

export type JsonSetPotion = ({
  /**
   * The potion identifier.
   */
  id: JsonRegistry['minecraft:potion'],
} & JsonConditions)

export type JsonSetRandomDyes = ({
  /**
   * Applies specified number of random dyes to the item. \
   * For example, one possible outcome of `"number_of_dyes": 2` is `#2C3065`, which is the combination of a blue dye and a black dye. \
   * The same dye color can be selected multiple times.
   */
  number_of_dyes: JsonIntNumberProviderRef,
} & JsonConditions)

export type JsonSetRandomPotion = ({
  /**
   * Possible potions to select from.
   * Defaults to all potions.
   */
  options?: ((
      | JsonRegistry['minecraft:potion'] | `#${JsonRegistry['minecraft:tag/potion']}` | TagClass<'potion'>)
      | Array<JsonRegistry['minecraft:potion']>),
} & JsonConditions)

export type JsonSetStewEffect = ({
  /**
   * Sets the status effects for suspicious stew.
   */
  effects?: Array<JsonStewEffect>,
} & JsonConditions)

export type JsonSetWriteableBookPages = ({
  /**
   * Sets the pages of a book and quill.
   */
  pages: Array<JsonFilterable<string>>,
} & JsonListOperation & JsonConditions)

export type JsonSetWrittenBookPages = ({
  /**
   * Sets the pages of a written book.
   */
  pages: Array<JsonFilterable<JsonText>>,
} & JsonListOperation & JsonConditions)

export type JsonStewEffect = {
  /**
   * The status effect of this stew effect.
   */
  type: JsonRegistry['minecraft:mob_effect'],
  /**
   * The duration of this stew effect, in seconds.
   */
  duration: JsonIntNumberProviderRef,
}

export type JsonToggleableDataComponent = (
  | 'attribute_modifiers'
  | 'can_break'
  | 'can_place_on'
  | 'dyed_color'
  | 'enchantments'
  | 'jukebox_playable'
  | 'stored_enchantments'
  | 'trim'
  | 'unbreakable')

export type JsonToggleTooltips = ({
  /**
   * Toggles which tooltips are shown.
   */
  toggles: ({
    [Key in Extract<JsonRegistry['minecraft:data_component_type'], string>]?: boolean
  }),
} & JsonConditions)

export type JsonUniformBonusFormula = {
  parameters: {
    bonusMultiplier: (NBTInt | number),
  },
}
type JsonApplyBonusFormulaDispatcherMap = {
  'binomial_with_bonus_count': JsonApplyBonusFormulaBinomialWithBonusCount,
  'minecraft:binomial_with_bonus_count': JsonApplyBonusFormulaBinomialWithBonusCount,
  'ore_drops': JsonApplyBonusFormulaOreDrops,
  'minecraft:ore_drops': JsonApplyBonusFormulaOreDrops,
  'uniform_bonus_count': JsonApplyBonusFormulaUniformBonusCount,
  'minecraft:uniform_bonus_count': JsonApplyBonusFormulaUniformBonusCount,
}
type JsonApplyBonusFormulaKeys = keyof JsonApplyBonusFormulaDispatcherMap
type JsonApplyBonusFormulaFallback = (
  | JsonApplyBonusFormulaBinomialWithBonusCount
  | JsonApplyBonusFormulaOreDrops
  | JsonApplyBonusFormulaUniformBonusCount)
type JsonApplyBonusFormulaBinomialWithBonusCount = JsonBinomialWithBonusCountFormula
type JsonApplyBonusFormulaOreDrops = Record<string, never>
type JsonApplyBonusFormulaUniformBonusCount = JsonUniformBonusFormula
export type JsonSymbolApplyBonusFormula<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonApplyBonusFormulaDispatcherMap
  : CASE extends 'keys' ? JsonApplyBonusFormulaKeys : CASE extends '%fallback' ? JsonApplyBonusFormulaFallback : never
type JsonListOperationDispatcherMap = {
  'append': JsonListOperationAppend,
  'minecraft:append': JsonListOperationAppend,
  'insert': JsonListOperationInsert,
  'minecraft:insert': JsonListOperationInsert,
  'replace_all': JsonListOperationReplaceAll,
  'minecraft:replace_all': JsonListOperationReplaceAll,
  'replace_section': JsonListOperationReplaceSection,
  'minecraft:replace_section': JsonListOperationReplaceSection,
}
type JsonListOperationKeys = keyof JsonListOperationDispatcherMap
type JsonListOperationFallback = (
  | JsonListOperationAppend
  | JsonListOperationInsert
  | JsonListOperationReplaceAll
  | JsonListOperationReplaceSection)
type JsonListOperationAppend = Record<string, never>
type JsonListOperationInsert = JsonInsertListOperation
type JsonListOperationReplaceAll = Record<string, never>
type JsonListOperationReplaceSection = JsonReplaceSectionListOperation
export type JsonSymbolListOperation<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonListOperationDispatcherMap
  : CASE extends 'keys' ? JsonListOperationKeys : CASE extends '%fallback' ? JsonListOperationFallback : never
type JsonLootFunctionDispatcherMap = {
  'apply_bonus': JsonLootFunctionApplyBonus,
  'minecraft:apply_bonus': JsonLootFunctionApplyBonus,
  'copy_components': JsonLootFunctionCopyComponents,
  'minecraft:copy_components': JsonLootFunctionCopyComponents,
  'copy_custom_data': JsonLootFunctionCopyCustomData,
  'minecraft:copy_custom_data': JsonLootFunctionCopyCustomData,
  'copy_name': JsonLootFunctionCopyName,
  'minecraft:copy_name': JsonLootFunctionCopyName,
  'copy_state': JsonLootFunctionCopyState,
  'minecraft:copy_state': JsonLootFunctionCopyState,
  'discard': JsonLootFunctionDiscard,
  'minecraft:discard': JsonLootFunctionDiscard,
  'enchant_randomly': JsonLootFunctionEnchantRandomly,
  'minecraft:enchant_randomly': JsonLootFunctionEnchantRandomly,
  'enchant_with_levels': JsonLootFunctionEnchantWithLevels,
  'minecraft:enchant_with_levels': JsonLootFunctionEnchantWithLevels,
  'enchanted_count_increase': JsonLootFunctionEnchantedCountIncrease,
  'minecraft:enchanted_count_increase': JsonLootFunctionEnchantedCountIncrease,
  'exploration_map': JsonLootFunctionExplorationMap,
  'minecraft:exploration_map': JsonLootFunctionExplorationMap,
  'explosion_decay': JsonLootFunctionExplosionDecay,
  'minecraft:explosion_decay': JsonLootFunctionExplosionDecay,
  'fill_player_head': JsonLootFunctionFillPlayerHead,
  'minecraft:fill_player_head': JsonLootFunctionFillPlayerHead,
  'filtered': JsonLootFunctionFiltered,
  'minecraft:filtered': JsonLootFunctionFiltered,
  'furnace_smelt': JsonLootFunctionFurnaceSmelt,
  'minecraft:furnace_smelt': JsonLootFunctionFurnaceSmelt,
  'limit_count': JsonLootFunctionLimitCount,
  'minecraft:limit_count': JsonLootFunctionLimitCount,
  'modify_contents': JsonLootFunctionModifyContents,
  'minecraft:modify_contents': JsonLootFunctionModifyContents,
  'sequence': JsonLootFunctionSequence,
  'minecraft:sequence': JsonLootFunctionSequence,
  'set_attributes': JsonLootFunctionSetAttributes,
  'minecraft:set_attributes': JsonLootFunctionSetAttributes,
  'set_banner_pattern': JsonLootFunctionSetBannerPattern,
  'minecraft:set_banner_pattern': JsonLootFunctionSetBannerPattern,
  'set_book_cover': JsonLootFunctionSetBookCover,
  'minecraft:set_book_cover': JsonLootFunctionSetBookCover,
  'set_components': JsonLootFunctionSetComponents,
  'minecraft:set_components': JsonLootFunctionSetComponents,
  'set_contents': JsonLootFunctionSetContents,
  'minecraft:set_contents': JsonLootFunctionSetContents,
  'set_count': JsonLootFunctionSetCount,
  'minecraft:set_count': JsonLootFunctionSetCount,
  'set_custom_data': JsonLootFunctionSetCustomData,
  'minecraft:set_custom_data': JsonLootFunctionSetCustomData,
  'set_custom_model_data': JsonLootFunctionSetCustomModelData,
  'minecraft:set_custom_model_data': JsonLootFunctionSetCustomModelData,
  'set_damage': JsonLootFunctionSetDamage,
  'minecraft:set_damage': JsonLootFunctionSetDamage,
  'set_enchantments': JsonLootFunctionSetEnchantments,
  'minecraft:set_enchantments': JsonLootFunctionSetEnchantments,
  'set_firework_explosion': JsonLootFunctionSetFireworkExplosion,
  'minecraft:set_firework_explosion': JsonLootFunctionSetFireworkExplosion,
  'set_fireworks': JsonLootFunctionSetFireworks,
  'minecraft:set_fireworks': JsonLootFunctionSetFireworks,
  'set_instrument': JsonLootFunctionSetInstrument,
  'minecraft:set_instrument': JsonLootFunctionSetInstrument,
  'set_item': JsonLootFunctionSetItem,
  'minecraft:set_item': JsonLootFunctionSetItem,
  'set_loot_table': JsonLootFunctionSetLootTable,
  'minecraft:set_loot_table': JsonLootFunctionSetLootTable,
  'set_lore': JsonLootFunctionSetLore,
  'minecraft:set_lore': JsonLootFunctionSetLore,
  'set_name': JsonLootFunctionSetName,
  'minecraft:set_name': JsonLootFunctionSetName,
  'set_ominous_bottle_amplifier': JsonLootFunctionSetOminousBottleAmplifier,
  'minecraft:set_ominous_bottle_amplifier': JsonLootFunctionSetOminousBottleAmplifier,
  'set_potion': JsonLootFunctionSetPotion,
  'minecraft:set_potion': JsonLootFunctionSetPotion,
  'set_random_dyes': JsonLootFunctionSetRandomDyes,
  'minecraft:set_random_dyes': JsonLootFunctionSetRandomDyes,
  'set_random_potion': JsonLootFunctionSetRandomPotion,
  'minecraft:set_random_potion': JsonLootFunctionSetRandomPotion,
  'set_stew_effect': JsonLootFunctionSetStewEffect,
  'minecraft:set_stew_effect': JsonLootFunctionSetStewEffect,
  'set_writable_book_pages': JsonLootFunctionSetWritableBookPages,
  'minecraft:set_writable_book_pages': JsonLootFunctionSetWritableBookPages,
  'set_written_book_pages': JsonLootFunctionSetWrittenBookPages,
  'minecraft:set_written_book_pages': JsonLootFunctionSetWrittenBookPages,
  'toggle_tooltips': JsonLootFunctionToggleTooltips,
  'minecraft:toggle_tooltips': JsonLootFunctionToggleTooltips,
}
type JsonLootFunctionKeys = keyof JsonLootFunctionDispatcherMap
type JsonLootFunctionFallback = (
  | JsonLootFunctionApplyBonus
  | JsonLootFunctionCopyComponents
  | JsonLootFunctionCopyCustomData
  | JsonLootFunctionCopyName
  | JsonLootFunctionCopyState
  | JsonLootFunctionDiscard
  | JsonLootFunctionEnchantRandomly
  | JsonLootFunctionEnchantWithLevels
  | JsonLootFunctionEnchantedCountIncrease
  | JsonLootFunctionExplorationMap
  | JsonLootFunctionExplosionDecay
  | JsonLootFunctionFillPlayerHead
  | JsonLootFunctionFiltered
  | JsonLootFunctionFurnaceSmelt
  | JsonLootFunctionLimitCount
  | JsonLootFunctionModifyContents
  | JsonLootFunctionSequence
  | JsonLootFunctionSetAttributes
  | JsonLootFunctionSetBannerPattern
  | JsonLootFunctionSetBookCover
  | JsonLootFunctionSetComponents
  | JsonLootFunctionSetContents
  | JsonLootFunctionSetCount
  | JsonLootFunctionSetCustomData
  | JsonLootFunctionSetCustomModelData
  | JsonLootFunctionSetDamage
  | JsonLootFunctionSetEnchantments
  | JsonLootFunctionSetFireworkExplosion
  | JsonLootFunctionSetFireworks
  | JsonLootFunctionSetInstrument
  | JsonLootFunctionSetItem
  | JsonLootFunctionSetLootTable
  | JsonLootFunctionSetLore
  | JsonLootFunctionSetName
  | JsonLootFunctionSetOminousBottleAmplifier
  | JsonLootFunctionSetPotion
  | JsonLootFunctionSetRandomDyes
  | JsonLootFunctionSetRandomPotion
  | JsonLootFunctionSetStewEffect
  | JsonLootFunctionSetWritableBookPages
  | JsonLootFunctionSetWrittenBookPages
  | JsonLootFunctionToggleTooltips)
type JsonLootFunctionApplyBonus = JsonApplyBonus
type JsonLootFunctionCopyComponents = JsonCopyComponents
type JsonLootFunctionCopyCustomData = JsonCopyNbt
type JsonLootFunctionCopyName = JsonCopyName
type JsonLootFunctionCopyState = JsonCopyState
type JsonLootFunctionDiscard = JsonConditions
type JsonLootFunctionEnchantRandomly = JsonEnchantRandomly
type JsonLootFunctionEnchantWithLevels = JsonEnchantWithLevels
type JsonLootFunctionEnchantedCountIncrease = JsonEnchantedCountIncrease
type JsonLootFunctionExplorationMap = JsonExplorationMap
type JsonLootFunctionExplosionDecay = JsonConditions
type JsonLootFunctionFillPlayerHead = JsonFillPlayerHead
type JsonLootFunctionFiltered = JsonFiltered
type JsonLootFunctionFurnaceSmelt = JsonConditions
type JsonLootFunctionLimitCount = JsonLimitCount
type JsonLootFunctionModifyContents = JsonModifyContents
type JsonLootFunctionSequence = JsonSequence
type JsonLootFunctionSetAttributes = JsonSetAttributes
type JsonLootFunctionSetBannerPattern = JsonSetBannerPattern
type JsonLootFunctionSetBookCover = JsonSetBookCover
type JsonLootFunctionSetComponents = JsonSetComponents
type JsonLootFunctionSetContents = JsonSetContents
type JsonLootFunctionSetCount = JsonSetCount
type JsonLootFunctionSetCustomData = JsonSetCustomData
type JsonLootFunctionSetCustomModelData = JsonSetCustomModelData
type JsonLootFunctionSetDamage = JsonSetDamage
type JsonLootFunctionSetEnchantments = JsonSetEnchantments
type JsonLootFunctionSetFireworkExplosion = JsonSetFireworkExplosion
type JsonLootFunctionSetFireworks = JsonSetFireworks
type JsonLootFunctionSetInstrument = JsonSetInstrument
type JsonLootFunctionSetItem = JsonSetItem
type JsonLootFunctionSetLootTable = JsonSetLootTable
type JsonLootFunctionSetLore = JsonSetLore
type JsonLootFunctionSetName = JsonSetName
type JsonLootFunctionSetOminousBottleAmplifier = JsonSetOminousBottleAmplifier
type JsonLootFunctionSetPotion = JsonSetPotion
type JsonLootFunctionSetRandomDyes = JsonSetRandomDyes
type JsonLootFunctionSetRandomPotion = JsonSetRandomPotion
type JsonLootFunctionSetStewEffect = JsonSetStewEffect
type JsonLootFunctionSetWritableBookPages = JsonSetWriteableBookPages
type JsonLootFunctionSetWrittenBookPages = JsonSetWrittenBookPages
type JsonLootFunctionToggleTooltips = JsonToggleTooltips
export type JsonSymbolLootFunction<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonLootFunctionDispatcherMap
  : CASE extends 'keys' ? JsonLootFunctionKeys : CASE extends '%fallback' ? JsonLootFunctionFallback : never
