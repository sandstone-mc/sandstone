import type { ItemModifier } from 'sandstone/arguments/generated/data/item_modifier.ts'
import type { FloatNumberProvider, IntNumberProvider } from 'sandstone/arguments/generated/data/number_provider.ts'
import type { Predicate } from 'sandstone/arguments/generated/data/predicate.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { DataComponentExactPredicate } from 'sandstone/arguments/generated/world/component.ts'
import type { ItemStackTemplate, SingleItemOfComponent } from 'sandstone/arguments/generated/world/item.ts'
import type { EnchantmentClass, TagClass } from 'sandstone'

export type TradeCost = (SingleItemOfComponent<DataComponentExactPredicate> & {
  /**
   * Defaults to `1`.
   */
  count?: IntNumberProvider,
})

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
  gives: ItemStackTemplate,
  /**
   * Modifiers applied to the `gives` item. \
   * Does **not** support `reference` item modifier. \
   * Some modifiers can affect the price through the `additional_trade_cost` transient component. \
   * The `additional_trade_cost` component is not saved on the offered item.
   *
   * ID reference is not allowed here.
   */
  given_item_modifier?: ItemModifier,
  /**
   * Maximum number of uses of this trade before the villager has to restock. Defaults to `4`.
   */
  max_uses?: IntNumberProvider,
  /**
   * How much demand & reputation each affect the price, is serialized as `priceMultiplier`. Defaults to `0.0`.
   */
  reputation_discount?: FloatNumberProvider,
  /**
   * Amount to increase the merchant's XP score by that determines their trade tier. Defaults to `1`.
   */
  xp?: IntNumberProvider,
  /**
   * Check whether the trade should be offered by the merchant. \
   * Does **not** support the `reference` predicate.
   */
  merchant_predicate?: Predicate,
  /**
   * If the offered enchanted book has the specified enchantments, the price will be affected by doubling the `additional_trade_cost` transient component.
   */
  double_trade_price_enchantments?: ((
        | Registry['minecraft:enchantment']
        | `#${Registry['minecraft:tag/enchantment']}`
        | TagClass<'enchantment'>
        | EnchantmentClass)
      | Array<(Registry['minecraft:enchantment'] | EnchantmentClass)>),
}
