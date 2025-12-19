import type { NumberProvider } from 'sandstone/arguments/generated/data/util.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { TagClass } from 'sandstone'

export type TradeSet = {
    /**
     * Possible trade generators.
     */
    trades: ((
        | Registry['minecraft:villager_trade']
        | `#${Registry['minecraft:tag/villager_trade']}`
        | TagClass<'villager_trade'>)
      | Array<Registry['minecraft:villager_trade']>)
    /**
     * Amount of trades to be generated. \
     * Clamps to an integer of at least `1`.
     */
    amount: NumberProvider
    /**
     * Whether the trade set can use the same generator multiple times and generate duplicate trades.
     * Defaults to `false`.
     */
    allow_duplicates?: boolean
    /**
     * Value:
     *
     * Value: Defines a `minecraft:random_sequence` id.
     */
    random_sequence?: `${string}:${string}`
}
