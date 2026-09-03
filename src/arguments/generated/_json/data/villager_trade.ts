import type { JsonItemModifier } from 'sandstone/arguments/generated/_json/data/item_modifier.ts'
import type {
  JsonFloatNumberProvider,
  JsonIntNumberProvider,
} from 'sandstone/arguments/generated/_json/data/number_provider.ts'
import type { JsonPredicate } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonDataComponentExactPredicate } from 'sandstone/arguments/generated/_json/world/component.ts'
import type {
  JsonItemStackTemplate,
  JsonSingleItemOfComponent,
} from 'sandstone/arguments/generated/_json/world/item.ts'
import type { EnchantmentClass, TagClass } from 'sandstone'

export type JsonTradeCost = (JsonSingleItemOfComponent<JsonDataComponentExactPredicate> & {
  /**
   * Defaults to `1`.
   */
  count?: JsonIntNumberProvider,
})

export type JsonVillagerTrade = {
  /**
   * Price item required by the merchant. \
   * The count is affected by various factors, including offered item, demand and player reputation.
   */
  wants: JsonTradeCost,
  /**
   * Second item required by the merchant. \
   * The count is not affected by any factors.
   */
  additional_wants?: JsonTradeCost,
  /**
   * Item being offered by the merchant.
   */
  gives: JsonItemStackTemplate,
  /**
   * Modifiers applied to the `gives` item. \
   * Does **not** support `reference` item modifier. \
   * Some modifiers can affect the price through the `additional_trade_cost` transient component. \
   * The `additional_trade_cost` component is not saved on the offered item.
   *
   * ID reference is not allowed here.
   */
  given_item_modifier?: JsonItemModifier,
  /**
   * Maximum number of uses of this trade before the villager has to restock. Defaults to `4`.
   */
  max_uses?: JsonIntNumberProvider,
  /**
   * How much demand & reputation each affect the price, is serialized as `priceMultiplier`. Defaults to `0.0`.
   */
  reputation_discount?: JsonFloatNumberProvider,
  /**
   * Amount to increase the merchant's XP score by that determines their trade tier. Defaults to `1`.
   */
  xp?: JsonIntNumberProvider,
  /**
   * Check whether the trade should be offered by the merchant. \
   * Does **not** support the `reference` predicate.
   */
  merchant_predicate?: JsonPredicate,
  /**
   * If the offered enchanted book has the specified enchantments, the price will be affected by doubling the `additional_trade_cost` transient component.
   */
  double_trade_price_enchantments?: ((
        | JsonRegistry['minecraft:enchantment']
        | `#${JsonRegistry['minecraft:tag/enchantment']}`
        | TagClass<'enchantment'>
        | EnchantmentClass)
      | Array<(JsonRegistry['minecraft:enchantment'] | EnchantmentClass)>),
}
