import type { ItemModifier } from 'sandstone/arguments/generated/data/item_modifier.ts'
import type { Predicate } from 'sandstone/arguments/generated/data/predicate.ts'
import type { NumberProvider } from 'sandstone/arguments/generated/data/util.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { ItemStack, TradeCost } from 'sandstone/arguments/generated/world/item.ts'
import type { TagClass } from 'sandstone'

export type VillagerTrade = {
  /**
   * Price item required by the merchant. \
   * The count is affected by various factors, including offered item, demand and player reputation.
   */
  wants: TradeCost,
  /**
   * Second item required by the merchant. \
   * The count is not affected by any factors.
   */
  additional_wants?: TradeCost,
  /**
   * Item being offered by the merchant.
   */
  gives: ItemStack,
  /**
   * Modifiers applied to the `gives` item. \
   * Does **not** support `reference` item modifier. \
   * Some modifiers can affect the price through the `additional_trade_cost` transient component. \
   * The `additional_trade_cost` component is not saved on the offered item.
   */
  given_item_modifiers?: Array<ItemModifier>,
  /**
   * Maximum number of uses of this trade before the villager has to restock. Defaults to `4`. \
   * Clamps to a positive integer.
   */
  max_uses?: NumberProvider,
  /**
   * How much demand & reputation each affect the price, is serialized as `priceMultiplier`. Defaults to `0.0`. \
   * Clamps to a non-negative float.
   */
  reputation_discount?: NumberProvider,
  /**
   * Amount to increase the merchant's XP score by that determines their trade tier. Defaults to `1`. \
   * Clamps to a non-negative integer.
   */
  xp?: NumberProvider,
  /**
   * Check whether the trade should be offered by the merchant. \
   * Does **not** support the `reference` predicate.
   */
  merchant_predicate?: Predicate,
  /**
   * If the offered enchanted book has the specified enchantments, the price will be affected by doubling the `additional_trade_cost` transient component.
   */
  double_trade_price_enchantments?: ((
      | Registry['minecraft:enchantment'] | `#${Registry['minecraft:tag/enchantment']}` | TagClass<'enchantment'>)
      | Array<Registry['minecraft:enchantment']>),
}
