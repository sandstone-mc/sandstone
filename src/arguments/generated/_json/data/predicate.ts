import type { JsonLootCondition } from 'sandstone/arguments/generated/_json/data/loot/condition.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { PredicateClass, TagClass } from 'sandstone'

export type JsonPredicate = JsonLootCondition

export type JsonPredicateListRef = (
  | JsonLootCondition | (
  JsonRegistry['minecraft:predicate'] | `#${string}:${string}` | TagClass<'predicate'> | PredicateClass)
  | Array<((JsonRegistry['minecraft:predicate'] | PredicateClass) | JsonLootCondition)>)

export type JsonPredicateRef = (JsonPredicate | (JsonRegistry['minecraft:predicate'] | PredicateClass))
