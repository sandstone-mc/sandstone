import type { IntProvider } from 'sandstone/arguments/generated/data/worldgen'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { NBTInt, NBTList, TagClass } from 'sandstone'

export type ByCostEnchantmentProvider = {
  enchantments: EnchantmentsType
  /**
     * Cost to use for the Enchanting process.
     */
  cost: IntProvider<NBTInt>
}

export type ByCostWithDifficultyEnchantmentProvider = {
  enchantments: EnchantmentsType
  /**
     * Positive integer representing the minimum possible cost
     *
     * Value:
     * Range: 0..
     */
  min_cost: NBTInt<{
    min: 0
  }>
  /**
     * Span of the cost randomization when the special factor is at its maximum.
     *
     * Value:
     * Range: 0..
     */
  max_cost_span: NBTInt<{
    min: 0
  }>
}

export type EnchantmentProvider = ({
  [S in Extract<Registry['minecraft:enchantment_provider_type'], string>]?: ({
    type: S
  } & (S extends keyof Dispatcher<'minecraft:enchantment_provider'>
    ? Dispatcher<'minecraft:enchantment_provider'>[S]
    : Record<string, unknown>));
}[Registry['minecraft:enchantment_provider_type']])

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 1..
 */
export type EnchantmentsType = ((
  | Registry['minecraft:enchantment']
  | `#${Registry['minecraft:tag/enchantment']}`
  | TagClass<'enchantment'>) | NBTList<Registry['minecraft:enchantment'], {
    leftExclusive: false
    min: 1
  }>)

export type SingleProvider = {
  enchantment: Registry['minecraft:enchantment']
  level: IntProvider<NBTInt>
}
type EnchantmentProviderDispatcherMap = {
  'by_cost': EnchantmentProviderByCost
  'minecraft:by_cost': EnchantmentProviderByCost
  'by_cost_with_difficulty': EnchantmentProviderByCostWithDifficulty
  'minecraft:by_cost_with_difficulty': EnchantmentProviderByCostWithDifficulty
  'single': EnchantmentProviderSingle
  'minecraft:single': EnchantmentProviderSingle
}
type EnchantmentProviderKeys = keyof EnchantmentProviderDispatcherMap
type EnchantmentProviderFallback = (
  | EnchantmentProviderByCost
  | EnchantmentProviderByCostWithDifficulty
  | EnchantmentProviderSingle)
type EnchantmentProviderByCost = ByCostEnchantmentProvider
type EnchantmentProviderByCostWithDifficulty = ByCostWithDifficultyEnchantmentProvider
type EnchantmentProviderSingle = SingleProvider
export type SymbolEnchantmentProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? EnchantmentProviderDispatcherMap
  : CASE extends 'keys' ? EnchantmentProviderKeys : CASE extends '%fallback' ? EnchantmentProviderFallback : never
