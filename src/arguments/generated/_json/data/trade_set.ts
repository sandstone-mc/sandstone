import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { NamespacedString, TagClass, VillagerTradeClass } from 'sandstone'

export type JsonTradeSet = {
  /**
   * Possible trade generators.
   */
  trades: ((
        | JsonRegistry['minecraft:villager_trade']
        | `#${JsonRegistry['minecraft:tag/villager_trade']}`
        | TagClass<'villager_trade'>
        | VillagerTradeClass)
      | Array<(JsonRegistry['minecraft:villager_trade'] | VillagerTradeClass)>),
  /**
   * Amount of trades to be generated.
   */
  amount: JsonSymbolResource['context_int_provider'],
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
