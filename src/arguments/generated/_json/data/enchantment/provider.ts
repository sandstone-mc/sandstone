import type { JsonIntProvider } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { EnchantmentClass, JsonNBTList, NBTInt, TagClass } from 'sandstone'

export type JsonByCostEnchantmentProvider = {
  enchantments: JsonEnchantmentsType,
  /**
   * Cost to use for the Enchanting process.
   */
  cost: JsonIntProvider<(NBTInt | number)>,
}

export type JsonByCostWithDifficultyEnchantmentProvider = {
  enchantments: JsonEnchantmentsType,
  /**
   * Positive integer representing the minimum possible cost
   *
   * Value:
   * Range: 0..
   */
  min_cost: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Span of the cost randomization when the special factor is at its maximum.
   *
   * Value:
   * Range: 0..
   */
  max_cost_span: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonEnchantmentProvider = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:enchantment_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolEnchantmentProvider ? JsonSymbolEnchantmentProvider[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:enchantment_provider_type'], string>])>

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 1..
 */
export type JsonEnchantmentsType = ((
  | JsonRegistry['minecraft:enchantment']
  | `#${JsonRegistry['minecraft:tag/enchantment']}`
  | TagClass<'enchantment'>
  | EnchantmentClass) | JsonNBTList<(JsonRegistry['minecraft:enchantment'] | EnchantmentClass), {
    leftExclusive: false,
    min: 1,
  }>)

export type JsonSingleProvider = {
  enchantment: (JsonRegistry['minecraft:enchantment'] | EnchantmentClass),
  level: JsonIntProvider<(NBTInt | number)>,
}
type JsonEnchantmentProviderDispatcherMap = {
  'by_cost': JsonEnchantmentProviderByCost,
  'minecraft:by_cost': JsonEnchantmentProviderByCost,
  'by_cost_with_difficulty': JsonEnchantmentProviderByCostWithDifficulty,
  'minecraft:by_cost_with_difficulty': JsonEnchantmentProviderByCostWithDifficulty,
  'single': JsonEnchantmentProviderSingle,
  'minecraft:single': JsonEnchantmentProviderSingle,
}
type JsonEnchantmentProviderKeys = keyof JsonEnchantmentProviderDispatcherMap
type JsonEnchantmentProviderFallback = (
  | JsonEnchantmentProviderByCost
  | JsonEnchantmentProviderByCostWithDifficulty
  | JsonEnchantmentProviderSingle)
type JsonEnchantmentProviderByCost = JsonByCostEnchantmentProvider
type JsonEnchantmentProviderByCostWithDifficulty = JsonByCostWithDifficultyEnchantmentProvider
type JsonEnchantmentProviderSingle = JsonSingleProvider
export type JsonSymbolEnchantmentProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonEnchantmentProviderDispatcherMap
  : CASE extends 'keys'
    ? JsonEnchantmentProviderKeys
    : CASE extends '%fallback' ? JsonEnchantmentProviderFallback : never
