import type { ItemModifier } from 'sandstone/arguments/generated/data/item_modifier.js'
import type { Predicate } from 'sandstone/arguments/generated/data/predicate.js'
import type { NumberProvider } from 'sandstone/arguments/generated/data/util.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { ItemStack, TradeCost } from 'sandstone/arguments/generated/world/item.js'
import type { TagClass } from 'sandstone'

export type VillagerTrade = {
    /**
     * Price item required by the merchant, count is modified depending on demand & per-player context.
     */
    wants: TradeCost
    /**
     * Second item required by the merchant, count does not change.
     */
    additional_wants?: TradeCost
    /**
     * Item being offered by the merchant.
     */
    gives: ItemStack
    /**
     * Modifiers applied to the `gives` item. \
     * Does **not** support `reference` item modifier. \
     * Can affect the count of `wants` with the `additional_trade_cost` component. \
     * After modifying the cost, the `additional_trade_cost` component is removed. \
     */
    given_item_modifiers?: Array<ItemModifier>
    /**
     * Maximum number of uses of this trade before the villager has to restock. Defaults to `4`. \
     * Clamps to an integer of at least `1`.
     */
    max_uses?: NumberProvider
    /**
     * How much demand & reputation each affect the count of `wants`, is serialized as `priceMultiplier`. Defaults to `0.0`. \
     * Clamps to a positive float.
     */
    reputation_discount?: NumberProvider
    /**
     * Amount to increase the merchant's XP score by that determines their trade tier. Defaults to `1`. \
     * Clamps to a positive integer.
     */
    xp?: NumberProvider
    /**
     * Check whether the trade should be offered by the merchant. \
     * Does **not** support the `reference` predicate.
     */
    merchant_predicate?: Predicate
    /**
     * Doubles the `additional_trade_cost` value if the resulting item of `given_item_modifiers`:
     * 1. has `additional_trade_cost` component, and
     * 2. has the specified enchantments.
     */
    double_trade_price_enchantments?: ((
        | Registry['minecraft:enchantment'] | `#${Registry['minecraft:tag/enchantment']}` | TagClass<'enchantment'>)
        | Registry['minecraft:enchantment'])
}
