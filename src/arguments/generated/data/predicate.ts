import type { LootCondition, NonReferenceLootCondition } from 'sandstone/arguments/generated/data/loot.ts'

export type NonReferencePredicate = (NonReferenceLootCondition | Array<NonReferenceLootCondition>)

export type Predicate = (LootCondition | Array<LootCondition>)
