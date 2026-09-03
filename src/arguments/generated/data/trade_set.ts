import type { IntNumberProvider } from 'sandstone/arguments/generated/data/number_provider.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NamespacedString, TagClass, VillagerTradeClass } from 'sandstone'

export type TradeSet = {
  /**
   * Possible trade generators.
   */
  trades: ((
        | Registry['minecraft:villager_trade']
        | `#${Registry['minecraft:tag/villager_trade']}`
        | TagClass<'villager_trade'>
        | VillagerTradeClass)
      | Array<(Registry['minecraft:villager_trade'] | VillagerTradeClass)>),
  /**
   * Amount of trades to be generated.
   */
  amount: IntNumberProvider,
  /**
   * Whether the trade set can use the same generator multiple times and generate duplicate trades.
   * Defaults to `false`.
   */
  allow_duplicates?: boolean,
  /**
   * Value:
   *
   * Value: Defines a `random_sequence` id.
   */
  random_sequence?: NamespacedString,
}
