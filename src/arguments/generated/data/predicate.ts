import type { LootCondition } from 'sandstone/arguments/generated/data/loot/condition.ts'

export type Predicate = (LootCondition | Array<LootCondition>)

export type PredicateListRef = Array<LootCondition>

export type PredicateRef = Predicate
