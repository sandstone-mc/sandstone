import type { ItemPredicate } from 'sandstone/arguments/generated/data/advancement/predicate.ts'
import type {
  BlockEntityTarget,
  EntityTarget,
  ItemStackTarget,
  LootCondition,
  LootFunction,
  LootPoolEntry,
} from 'sandstone/arguments/generated/data/loot.ts'
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
import type { DataPointClass, NBTClass, NBTFloat, NBTInt, NBTLong, TagClass } from 'sandstone'
import type { RootNBT, NBTObject } from 'sandstone/arguments/nbt.ts'

export type ApplyBonus = ({
  [S in Extract<ApplyBonusFormula, string>]?: ({
    enchantment: Registry['minecraft:enchantment']
    /**
         * Value:
         *
         *  - OreDrops(`ore_drops`)
         *  - UniformBonusCount(`uniform_bonus_count`)
         *  - BinomialWithBonusCount(`binomial_with_bonus_count`)
         */
    formula: (S | `minecraft:${S}`)
  } & (S extends keyof SymbolApplyBonusFormula ? SymbolApplyBonusFormula[S] : RootNBT) & Conditions);
}[ApplyBonusFormula])

export type ApplyBonusFormula = ('ore_drops' | 'uniform_bonus_count' | 'binomial_with_bonus_count')

export type AttributeModifier = ({
  /**
     * Attribute type to modify.
     */
  attribute: Registry['minecraft:attribute']
  amount: NumberProvider
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
  operation: AttributeOperation
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
  slot: (EquipmentSlotGroup | Array<EquipmentSlotGroup>)
} & {
  /**
     * The unique identifier of this attribute modifier.
     */
  id: `${string}:${string}`
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
  pattern: Registry['minecraft:banner_pattern']
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
  color: DyeColor
}

export type BinomialWithBonusCountFormula = {
  parameters: {
    extra: NBTInt
    /**
         * Value:
         * Range: 0..1
         */
    probability: NBTFloat<{
      leftExclusive: false
      rightExclusive: false
      min: 0
      max: 1
    }>
  }
}

export type Conditions = {
  conditions?: Array<LootCondition>
}

export type ContainerComponents = ('container' | 'bundle_contents' | 'charged_projectiles')

export type CopyComponents = ({
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
  source: (BlockEntityTarget | EntityTarget | ItemStackTarget)
  /**
     * If omitted, all components present are included
     */
  include?: Array<Registry['minecraft:data_component_type']>
  /**
     * Defaults to none.
     */
  exclude?: Array<Registry['minecraft:data_component_type']>
} & Conditions)

export type CopyName = ({
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
  source: (EntityTarget | BlockEntityTarget)
} & Conditions)

export type CopyNameSource = (
  | 'this'
  | 'killer'
  | 'attacking_entity'
  | 'killer_player'
  | 'last_damage_player'
  | 'block_entity')

export type CopyNbt = ({
  source: NbtProvider
  ops: Array<{
    source: `${any}${string}` | DataPointClass
    target: `${any}${string}` | DataPointClass
    /**
         * Value:
         *
         *  - Replace(`replace`): Replace any existing contents of the target.
         *  - Append(`append`): Append to a list.
         *  - Merge(`merge`): Merge into a compound tag.
         */
    op: CopyNbtStrategy
  }>
} & Conditions)

export type CopyNbtStrategy = ('replace' | 'append' | 'merge')

export type CopyState = ({
  [S in Extract<Registry['minecraft:block'], string>]?: ({
    block: S
    properties: Array<(S extends undefined
      ? SymbolMcdocBlockStateKeys<'%none'> :
      (S extends keyof SymbolMcdocBlockStateKeys ? SymbolMcdocBlockStateKeys[S] : NBTObject))>
  } & Conditions);
}[Registry['minecraft:block']])

export type EnchantedCountBase = {
  /**
     * If the number is fractional the result is rounded *after* the number was multiplied by the looting level.
     */
  count: NumberProvider
  /**
     * Limits the count of the item to a range.
     */
  limit?: NBTInt
}

export type EnchantedCountIncrease = (EnchantedCountBase & {
  /**
     * Enchantment that increases yields.
     */
  enchantment: Registry['minecraft:enchantment']
} & Conditions)

export type EnchantRandomly = ({
  /**
     * The allowed enchantments. If omitted, all enchantments applicable to the item are possible.
     */
  options?: ((
      | Registry['minecraft:enchantment'] | `#${Registry['minecraft:tag/enchantment']}` | TagClass<'enchantment'>)
      | Array<Registry['minecraft:enchantment']>)
  /**
     * Whether to only enchant with item-compatible enchantments. Defaults to `true`.
     *
     * Note: Books are considered compatible with all Enchantments.
     */
  only_compatible?: boolean
  /**
     * Whether to add `additional_trade_cost` component to the enchanted item.
     * Additional cost value is determined by the enchantment level, with the formula `2 + random(0, 5 + level * 10) + 3 * level`.
     * Defaults to `false`.
     */
  include_additional_cost_component?: boolean
} & Conditions)

export type EnchantWithLevels = ({
  /**
     * The levels to enchant this item with.
     */
  levels: NumberProvider
  /**
     * The allowed enchantments. If omitted, all enchantments applicable to the item are possible.
     */
  options?: ((
      | Registry['minecraft:enchantment'] | `#${Registry['minecraft:tag/enchantment']}` | TagClass<'enchantment'>)
      | Array<Registry['minecraft:enchantment']>)
  /**
     * Whether to add `additional_trade_cost` component to the enchanted item.
     * Additional cost value is equal to the level cost determined by `levels`.
     * Defaults to `false`.
     */
  include_additional_cost_component?: boolean
} & Conditions)

export type ExplorationMap = ({
  /**
     * Generated structure to locate. Accepts any of the structure types used by the `/locate` command. Defaults to buried treasure.
     */
  destination?: (Registry['minecraft:tag/worldgen/structure'])
  /**
     * The icon used to mark the destination on the map. Accepts any of the map icon text IDs (case insensitive).
     * If `mansion` or `monument` is used, the color of the lines on the item texture changes to match the corresponding explorer map.
     */
  decoration?: Registry['minecraft:map_decoration_type']
  /**
     * Defaults to 2.
     */
  zoom?: NBTInt
  /**
     * The size, in chunks, of the area to search for structures.
     * The area checked is square, not circular.
     * Radius `0` causes only the current chunk to be searched, radius `1` causes the current chunk and eight adjacent chunks to be searched, and so on.
     * Defaults to `50`.
     */
  search_radius?: NBTInt
  /**
     * Whether to not search in chunks that have already been generated. Defaults to `true`.
     */
  skip_existing_chunks?: boolean
} & Conditions)

export type FillPlayerHead = ({
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
  entity: EntityTarget
} & Conditions)

export type Filtered = ({
  /**
     * Item predicate to select items to modify.
     */
  item_filter: ItemPredicate
  /**
     * Loot function to apply to the item when `item_filter` passes.
     */
  on_pass?: (LootFunction | Array<LootFunction>)
  /**
     * Loot function to apply to the item when `item_filter` fails.
     */
  on_fail?: (LootFunction | Array<LootFunction>)
} & Conditions)

export type InsertListOperation = {
  /**
     * The offset in the list to insert into. Defaults to 0.
     *
     * Value:
     * Range: 0..
     */
  offset?: NBTInt<{
    min: 0
  }>
}

export type LimitCount = ({
  /**
     * Limits the count of the item to a range.
     */
  limit: IntRange
} & Conditions)

export type ListOperation = ({
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
    mode: S
  } & (S extends keyof SymbolListOperation ? SymbolListOperation[S] : RootNBT));
}[ListOperationMode])

export type ListOperationMode = ('append' | 'insert' | 'replace_all' | 'replace_section')

export type LootingEnchant = (EnchantedCountBase & Conditions)

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

export type ModifyContents = ({
  /**
     * Describes target component's items to modify.
     *
     * Value:
     *
     *  - Container(`container`)
     *  - BundleContents(`bundle_contents`)
     *  - ChargedProjectiles(`charged_projectiles`)
     */
  component: (ContainerComponents | `minecraft:${ContainerComponents}`)
  /**
     * Applied to every item inside container.
     */
  modifier: (LootFunction | Array<LootFunction>)
} & Conditions)

export type Reference = ({
  /**
     * Item modifier to reference.
     */
  name: `${string}:${string}`
} & Conditions)

export type ReplaceSectionListOperation = {
  /**
     * The offset of the section to replace. Defaults to 0.
     *
     * Value:
     * Range: 0..
     */
  offset?: NBTInt<{
    min: 0
  }>
  /**
     * The size of the section to replace. Defaults to size of the new list.
     *
     * Value:
     * Range: 0..
     */
  size?: NBTInt<{
    min: 0
  }>
}

export type Sequence = {
  /**
     * List of functions to apply to this item.
     */
  functions: Array<LootFunction>
}

export type SetAttributes = ({
  /**
     * List of attribute modifiers to apply to this item.
     */
  modifiers: Array<AttributeModifier>
  /**
     * Whether to replace existing attributes (otherwise append to existing). Defaults to `true`.
     */
  replace?: boolean
} & Conditions)

export type SetBannerPattern = ({
  /**
     * List of banner pattern layers.
     */
  patterns: Array<BannerPatternLayer>
  /**
     * Whether to add to the banner pattern list.
     */
  append: boolean
} & Conditions)

export type SetBookCover = ({
  /**
     * If omitted, the original title is kept (or an empty string is used if there was no component)
     */
  title?: Filterable<`${any}${string}`>
  /**
     * If omitted, the original author is kept (or an empty string is used if there was no component)
     */
  author?: string
  /**
     * If omitted, the original generation is kept (or 0 is used if there was no component)
     *
     * Value:
     * Range: 0..3
     */
  generation?: NBTInt<{
    min: 0
    max: 3
  }>
} & Conditions)

export type SetComponents = ({
  components: DataComponentPatch
} & Conditions)

export type SetContents = ({
  /**
     * Describes target component to be filled with items.
     *
     * Value:
     *
     *  - Container(`container`)
     *  - BundleContents(`bundle_contents`)
     *  - ChargedProjectiles(`charged_projectiles`)
     */
  component: (ContainerComponents | `minecraft:${ContainerComponents}`)
  entries: Array<LootPoolEntry>
} & Conditions)

export type SetCount = ({
  count: NumberProvider
  /**
     * Whether to add to the existing count. Defaults to `false`.
     */
  add?: boolean
} & Conditions)

export type SetCustomData = ({
  tag: CustomData
} & Conditions)

export type SetCustomModelData = ({
  floats?: ({
    values: Array<NumberProvider>
  } & ListOperation)
  flags?: ({
    values: Array<boolean>
  } & ListOperation)
  strings?: ({
    values: Array<string>
  } & ListOperation)
  colors?: ({
    values: Array<(NumberProvider | RGB)>
  } & ListOperation)
} & Conditions)

export type SetDamage = ({
  /**
     * Decimal percentage. Can be negative when used in combination with `add`. \
     * Clamps to a float between `-1` & `1` (inclusive).
     */
  damage: NumberProvider
  /**
     * Whether to add to the existing damage of the item. Defaults to `false`.
     */
  add?: boolean
} & Conditions)

export type SetEnchantments = ({
  /**
     * A map of enchantments to levels. Setting an enchantment to `0` removes it from the item. \
     * Each level is clamped to a positive integer.
     */
  enchantments: ({
    [Key in Extract<Registry['minecraft:enchantment'], string>]?: NumberProvider;
  })
  /**
     * Whether to add to the level of each enchantment. Defaults to `false`.
     */
  add?: boolean
} & Conditions)

export type SetFireworkExplosion = ({
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
  shape?: FireworkShape
  /**
     * If omitted, the original colors are kept (or `[]` is used if there was no component).
     * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
     */
  colors?: Array<NBTInt>
  /**
     * If omitted, the original fade colors are kept (or `[]` is used if there was no component).
     * Calculated as `RED << 16 | GREEN << 8 | BLUE`. Each of these fields must be between 0 and 255, inclusive.
     */
  fade_colors?: Array<NBTInt>
  /**
     * If omitted, the original `has_trail` value is kept (or `false` is used if there was no component).
     */
  trail?: boolean
  /**
     * If omitted, the original `has_twinkle` value is kept (or `false` is used if there was no component).
     */
  twinkle?: boolean
} & Conditions)

export type SetFireworks = ({
  /**
     * If omitted, the flight duration of the item is left untouched - or set to 0 if the component did not exist before.
     *
     * Value:
     * Range: 0..255
     */
  flight_duration?: NBTInt<{
    min: 0
  }>
  explosions?: ({
    values: Array<SymbolDataComponent['firework_explosion']>
  } & ListOperation)
} & Conditions)

export type SetInstrument = ({
  /**
     * Sets the instrument tag for a goat horn.
     */
  options: (`#${Registry['minecraft:tag/instrument']}` | TagClass<'instrument'>)
} & Conditions)

export type SetItem = ({
  item: Registry['minecraft:item']
} & Conditions)

export type SetLootTable = ({
  /**
     * The block entity type of the container.
     */
  type: Registry['minecraft:block_entity_type']
  /**
     * The loot table to set to the container block item.
     */
  name: Registry['minecraft:loot_table']
  /**
     * The container seed to use. Defaults to a random seed.
     */
  seed?: NBTLong
} & Conditions)

export type SetLore = ({
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
  entity?: EntityTarget
  lore: Array<Text>
} & ListOperation & Conditions)

export type SetName = ({
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
  entity?: EntityTarget
  name: Text
  /**
     * Which name component to set. Defaults to `custom_name`.
     *
     * Value:
     *
     *  - ItemName(`item_name`)
     *  - CustomName(`custom_name`)
     */
  target?: SetNameTarget
} & Conditions)

export type SetNameTarget = ('item_name' | 'custom_name')

export type SetNbt = ({
  tag: `${any}${string}` | NBTClass
} & Conditions)

export type SetOminousBottleAmplifier = ({
  amplifier: NumberProvider
} & Conditions)

export type SetPotion = ({
  /**
     * The potion identifier.
     */
  id: Registry['minecraft:potion']
} & Conditions)

export type SetRandomDyes = ({
  /**
     * Applies specified number of random dyes to the item.
     * For example, one possible outcome of `"number_of_dyes": 2` is `#2C3065`, which is the combination of a blue dye and a black dye.
     * The same dye color can be selected multiple times.
     * Only has effect on `#dyeable` items.
     */
  number_of_dyes: NumberProvider
} & Conditions)

export type SetRandomPotion = ({
  /**
     * Possible potions to select from.
     * Defaults to all potions.
     */
  options?: ((
      | Registry['minecraft:potion'] | `#${Registry['minecraft:tag/potion']}` | TagClass<'potion'>)
      | Registry['minecraft:potion'])
} & Conditions)

export type SetStewEffect = ({
  /**
     * Sets the status effects for suspicious stew.
     */
  effects?: Array<StewEffect>
} & Conditions)

export type SetWriteableBookPages = ({
  /**
     * Sets the pages of a book and quill.
     */
  pages: Array<Filterable<string>>
} & ListOperation & Conditions)

export type SetWrittenBookPages = ({
  /**
     * Sets the pages of a written book.
     */
  pages: Array<Filterable<Text>>
} & ListOperation & Conditions)

export type StewEffect = {
  /**
     * The status effect of this stew effect.
     */
  type: Registry['minecraft:mob_effect']
  /**
     * The duration of this stew effect, in seconds.
     */
  duration: NumberProvider
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

export type ToggleTooltips = ({
  /**
     * Toggles which tooltips are shown.
     */
  toggles: ({
    [Key in Extract<Registry['minecraft:data_component_type'], string>]?: boolean;
  })
} & Conditions)

export type UniformBonusFormula = {
  parameters: {
    bonusMultiplier: NBTInt
  }
}
type ApplyBonusFormulaDispatcherMap = {
  'binomial_with_bonus_count': ApplyBonusFormulaBinomialWithBonusCount
  'minecraft:binomial_with_bonus_count': ApplyBonusFormulaBinomialWithBonusCount
  'ore_drops': ApplyBonusFormulaOreDrops
  'minecraft:ore_drops': ApplyBonusFormulaOreDrops
  'uniform_bonus_count': ApplyBonusFormulaUniformBonusCount
  'minecraft:uniform_bonus_count': ApplyBonusFormulaUniformBonusCount
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
  | '%none' = 'map'> = CASE extends 'map'
  ? ApplyBonusFormulaDispatcherMap
  : CASE extends 'keys' ? ApplyBonusFormulaKeys : CASE extends '%fallback' ? ApplyBonusFormulaFallback : never
type ListOperationDispatcherMap = {
  'append': ListOperationAppend
  'minecraft:append': ListOperationAppend
  'insert': ListOperationInsert
  'minecraft:insert': ListOperationInsert
  'replace_all': ListOperationReplaceAll
  'minecraft:replace_all': ListOperationReplaceAll
  'replace_section': ListOperationReplaceSection
  'minecraft:replace_section': ListOperationReplaceSection
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
  | '%none' = 'map'> = CASE extends 'map'
  ? ListOperationDispatcherMap
  : CASE extends 'keys' ? ListOperationKeys : CASE extends '%fallback' ? ListOperationFallback : never
type LootFunctionDispatcherMap = {
  'apply_bonus': LootFunctionApplyBonus
  'minecraft:apply_bonus': LootFunctionApplyBonus
  'copy_components': LootFunctionCopyComponents
  'minecraft:copy_components': LootFunctionCopyComponents
  'copy_custom_data': LootFunctionCopyCustomData
  'minecraft:copy_custom_data': LootFunctionCopyCustomData
  'copy_name': LootFunctionCopyName
  'minecraft:copy_name': LootFunctionCopyName
  'copy_nbt': LootFunctionCopyNbt
  'minecraft:copy_nbt': LootFunctionCopyNbt
  'copy_state': LootFunctionCopyState
  'minecraft:copy_state': LootFunctionCopyState
  'discard': LootFunctionDiscard
  'minecraft:discard': LootFunctionDiscard
  'enchant_randomly': LootFunctionEnchantRandomly
  'minecraft:enchant_randomly': LootFunctionEnchantRandomly
  'enchant_with_levels': LootFunctionEnchantWithLevels
  'minecraft:enchant_with_levels': LootFunctionEnchantWithLevels
  'enchanted_count_increase': LootFunctionEnchantedCountIncrease
  'minecraft:enchanted_count_increase': LootFunctionEnchantedCountIncrease
  'exploration_map': LootFunctionExplorationMap
  'minecraft:exploration_map': LootFunctionExplorationMap
  'explosion_decay': LootFunctionExplosionDecay
  'minecraft:explosion_decay': LootFunctionExplosionDecay
  'fill_player_head': LootFunctionFillPlayerHead
  'minecraft:fill_player_head': LootFunctionFillPlayerHead
  'filtered': LootFunctionFiltered
  'minecraft:filtered': LootFunctionFiltered
  'furnace_smelt': LootFunctionFurnaceSmelt
  'minecraft:furnace_smelt': LootFunctionFurnaceSmelt
  'limit_count': LootFunctionLimitCount
  'minecraft:limit_count': LootFunctionLimitCount
  'looting_enchant': LootFunctionLootingEnchant
  'minecraft:looting_enchant': LootFunctionLootingEnchant
  'modify_contents': LootFunctionModifyContents
  'minecraft:modify_contents': LootFunctionModifyContents
  'reference': LootFunctionReference
  'minecraft:reference': LootFunctionReference
  'sequence': LootFunctionSequence
  'minecraft:sequence': LootFunctionSequence
  'set_attributes': LootFunctionSetAttributes
  'minecraft:set_attributes': LootFunctionSetAttributes
  'set_banner_pattern': LootFunctionSetBannerPattern
  'minecraft:set_banner_pattern': LootFunctionSetBannerPattern
  'set_book_cover': LootFunctionSetBookCover
  'minecraft:set_book_cover': LootFunctionSetBookCover
  'set_components': LootFunctionSetComponents
  'minecraft:set_components': LootFunctionSetComponents
  'set_contents': LootFunctionSetContents
  'minecraft:set_contents': LootFunctionSetContents
  'set_count': LootFunctionSetCount
  'minecraft:set_count': LootFunctionSetCount
  'set_custom_data': LootFunctionSetCustomData
  'minecraft:set_custom_data': LootFunctionSetCustomData
  'set_custom_model_data': LootFunctionSetCustomModelData
  'minecraft:set_custom_model_data': LootFunctionSetCustomModelData
  'set_damage': LootFunctionSetDamage
  'minecraft:set_damage': LootFunctionSetDamage
  'set_enchantments': LootFunctionSetEnchantments
  'minecraft:set_enchantments': LootFunctionSetEnchantments
  'set_firework_explosion': LootFunctionSetFireworkExplosion
  'minecraft:set_firework_explosion': LootFunctionSetFireworkExplosion
  'set_fireworks': LootFunctionSetFireworks
  'minecraft:set_fireworks': LootFunctionSetFireworks
  'set_instrument': LootFunctionSetInstrument
  'minecraft:set_instrument': LootFunctionSetInstrument
  'set_item': LootFunctionSetItem
  'minecraft:set_item': LootFunctionSetItem
  'set_loot_table': LootFunctionSetLootTable
  'minecraft:set_loot_table': LootFunctionSetLootTable
  'set_lore': LootFunctionSetLore
  'minecraft:set_lore': LootFunctionSetLore
  'set_name': LootFunctionSetName
  'minecraft:set_name': LootFunctionSetName
  'set_nbt': LootFunctionSetNbt
  'minecraft:set_nbt': LootFunctionSetNbt
  'set_ominous_bottle_amplifier': LootFunctionSetOminousBottleAmplifier
  'minecraft:set_ominous_bottle_amplifier': LootFunctionSetOminousBottleAmplifier
  'set_potion': LootFunctionSetPotion
  'minecraft:set_potion': LootFunctionSetPotion
  'set_random_dyes': LootFunctionSetRandomDyes
  'minecraft:set_random_dyes': LootFunctionSetRandomDyes
  'set_random_potion': LootFunctionSetRandomPotion
  'minecraft:set_random_potion': LootFunctionSetRandomPotion
  'set_stew_effect': LootFunctionSetStewEffect
  'minecraft:set_stew_effect': LootFunctionSetStewEffect
  'set_writable_book_pages': LootFunctionSetWritableBookPages
  'minecraft:set_writable_book_pages': LootFunctionSetWritableBookPages
  'set_written_book_pages': LootFunctionSetWrittenBookPages
  'minecraft:set_written_book_pages': LootFunctionSetWrittenBookPages
  'toggle_tooltips': LootFunctionToggleTooltips
  'minecraft:toggle_tooltips': LootFunctionToggleTooltips
}
type LootFunctionKeys = keyof LootFunctionDispatcherMap
type LootFunctionFallback = (
  | LootFunctionApplyBonus
  | LootFunctionCopyComponents
  | LootFunctionCopyCustomData
  | LootFunctionCopyName
  | LootFunctionCopyNbt
  | LootFunctionCopyState
  | LootFunctionDiscard
  | LootFunctionEnchantRandomly
  | LootFunctionEnchantWithLevels
  | LootFunctionEnchantedCountIncrease
  | LootFunctionExplorationMap
  | LootFunctionExplosionDecay
  | LootFunctionFillPlayerHead
  | LootFunctionFiltered
  | LootFunctionFurnaceSmelt
  | LootFunctionLimitCount
  | LootFunctionLootingEnchant
  | LootFunctionModifyContents
  | LootFunctionReference
  | LootFunctionSequence
  | LootFunctionSetAttributes
  | LootFunctionSetBannerPattern
  | LootFunctionSetBookCover
  | LootFunctionSetComponents
  | LootFunctionSetContents
  | LootFunctionSetCount
  | LootFunctionSetCustomData
  | LootFunctionSetCustomModelData
  | LootFunctionSetDamage
  | LootFunctionSetEnchantments
  | LootFunctionSetFireworkExplosion
  | LootFunctionSetFireworks
  | LootFunctionSetInstrument
  | LootFunctionSetItem
  | LootFunctionSetLootTable
  | LootFunctionSetLore
  | LootFunctionSetName
  | LootFunctionSetNbt
  | LootFunctionSetOminousBottleAmplifier
  | LootFunctionSetPotion
  | LootFunctionSetRandomDyes
  | LootFunctionSetRandomPotion
  | LootFunctionSetStewEffect
  | LootFunctionSetWritableBookPages
  | LootFunctionSetWrittenBookPages
  | LootFunctionToggleTooltips)
type LootFunctionApplyBonus = ApplyBonus
type LootFunctionCopyComponents = CopyComponents
type LootFunctionCopyCustomData = CopyNbt
type LootFunctionCopyName = CopyName
type LootFunctionCopyNbt = CopyNbt
type LootFunctionCopyState = CopyState
type LootFunctionDiscard = Conditions
type LootFunctionEnchantRandomly = EnchantRandomly
type LootFunctionEnchantWithLevels = EnchantWithLevels
type LootFunctionEnchantedCountIncrease = EnchantedCountIncrease
type LootFunctionExplorationMap = ExplorationMap
type LootFunctionExplosionDecay = Conditions
type LootFunctionFillPlayerHead = FillPlayerHead
type LootFunctionFiltered = Filtered
type LootFunctionFurnaceSmelt = Conditions
type LootFunctionLimitCount = LimitCount
type LootFunctionLootingEnchant = LootingEnchant
type LootFunctionModifyContents = ModifyContents
type LootFunctionReference = Reference
type LootFunctionSequence = Sequence
type LootFunctionSetAttributes = SetAttributes
type LootFunctionSetBannerPattern = SetBannerPattern
type LootFunctionSetBookCover = SetBookCover
type LootFunctionSetComponents = SetComponents
type LootFunctionSetContents = SetContents
type LootFunctionSetCount = SetCount
type LootFunctionSetCustomData = SetCustomData
type LootFunctionSetCustomModelData = SetCustomModelData
type LootFunctionSetDamage = SetDamage
type LootFunctionSetEnchantments = SetEnchantments
type LootFunctionSetFireworkExplosion = SetFireworkExplosion
type LootFunctionSetFireworks = SetFireworks
type LootFunctionSetInstrument = SetInstrument
type LootFunctionSetItem = SetItem
type LootFunctionSetLootTable = SetLootTable
type LootFunctionSetLore = SetLore
type LootFunctionSetName = SetName
type LootFunctionSetNbt = SetNbt
type LootFunctionSetOminousBottleAmplifier = SetOminousBottleAmplifier
type LootFunctionSetPotion = SetPotion
type LootFunctionSetRandomDyes = SetRandomDyes
type LootFunctionSetRandomPotion = SetRandomPotion
type LootFunctionSetStewEffect = SetStewEffect
type LootFunctionSetWritableBookPages = SetWriteableBookPages
type LootFunctionSetWrittenBookPages = SetWrittenBookPages
type LootFunctionToggleTooltips = ToggleTooltips
export type SymbolLootFunction<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? LootFunctionDispatcherMap
  : CASE extends 'keys' ? LootFunctionKeys : CASE extends '%fallback' ? LootFunctionFallback : never
