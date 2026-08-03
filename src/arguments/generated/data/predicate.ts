import type { LootCondition } from 'sandstone/arguments/generated/data/loot/condition.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { PredicateClass, TagClass } from 'sandstone'

export type Predicate = LootCondition

export type PredicateListRef = (
  | LootCondition | (
  Registry['minecraft:predicate'] | `#${string}:${string}` | TagClass<'predicate'> | PredicateClass)
  | Array<((Registry['minecraft:predicate'] | PredicateClass) | LootCondition)>)

export type PredicateRef = (Predicate | (Registry['minecraft:predicate'] | PredicateClass))
