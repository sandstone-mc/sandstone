type JsonDataComponentExistencePredicateDispatcherMap = {
  'enchantments': JsonDataComponentExistencePredicateEnchantments,
  'minecraft:enchantments': JsonDataComponentExistencePredicateEnchantments,
  'potion_contents': JsonDataComponentExistencePredicatePotionContents,
  'minecraft:potion_contents': JsonDataComponentExistencePredicatePotionContents,
  'stored_enchantments': JsonDataComponentExistencePredicateStoredEnchantments,
  'minecraft:stored_enchantments': JsonDataComponentExistencePredicateStoredEnchantments,
  'villager/variant': JsonDataComponentExistencePredicateVillagerVariant,
  'minecraft:villager/variant': JsonDataComponentExistencePredicateVillagerVariant,
}
type JsonDataComponentExistencePredicateKeys = keyof JsonDataComponentExistencePredicateDispatcherMap
type JsonDataComponentExistencePredicateFallback = (
  | JsonDataComponentExistencePredicateEnchantments
  | JsonDataComponentExistencePredicatePotionContents
  | JsonDataComponentExistencePredicateStoredEnchantments
  | JsonDataComponentExistencePredicateVillagerVariant
  | JsonDataComponentExistencePredicateFallbackType)
export type JsonDataComponentExistencePredicateFallbackType = Record<string, never>
type JsonDataComponentExistencePredicateEnchantments = never
type JsonDataComponentExistencePredicatePotionContents = never
type JsonDataComponentExistencePredicateStoredEnchantments = never
type JsonDataComponentExistencePredicateVillagerVariant = never
export type JsonSymbolDataComponentExistencePredicate<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonDataComponentExistencePredicateDispatcherMap
  : CASE extends 'keys'
    ? JsonDataComponentExistencePredicateKeys
    : CASE extends '%fallback'
      ? JsonDataComponentExistencePredicateFallback
      : CASE extends '%unknown' ? JsonDataComponentExistencePredicateFallbackType : never
