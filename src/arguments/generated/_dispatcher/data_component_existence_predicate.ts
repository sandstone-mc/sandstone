type DataComponentExistencePredicateDispatcherMap = {
  'enchantments': DataComponentExistencePredicateEnchantments,
  'minecraft:enchantments': DataComponentExistencePredicateEnchantments,
  'potion_contents': DataComponentExistencePredicatePotionContents,
  'minecraft:potion_contents': DataComponentExistencePredicatePotionContents,
  'stored_enchantments': DataComponentExistencePredicateStoredEnchantments,
  'minecraft:stored_enchantments': DataComponentExistencePredicateStoredEnchantments,
  'villager/variant': DataComponentExistencePredicateVillagerVariant,
  'minecraft:villager/variant': DataComponentExistencePredicateVillagerVariant,
}
type DataComponentExistencePredicateKeys = keyof DataComponentExistencePredicateDispatcherMap
type DataComponentExistencePredicateFallback = (
  | DataComponentExistencePredicateEnchantments
  | DataComponentExistencePredicatePotionContents
  | DataComponentExistencePredicateStoredEnchantments
  | DataComponentExistencePredicateVillagerVariant
  | DataComponentExistencePredicateFallbackType)
export type DataComponentExistencePredicateFallbackType = Record<string, never>
type DataComponentExistencePredicateEnchantments = never
type DataComponentExistencePredicatePotionContents = never
type DataComponentExistencePredicateStoredEnchantments = never
type DataComponentExistencePredicateVillagerVariant = never
export type SymbolDataComponentExistencePredicate<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? DataComponentExistencePredicateDispatcherMap
  : CASE extends 'keys'
    ? DataComponentExistencePredicateKeys
    : CASE extends '%fallback'
      ? DataComponentExistencePredicateFallback
      : CASE extends '%unknown' ? DataComponentExistencePredicateFallbackType : never
