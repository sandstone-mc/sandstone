import type { LootCondition } from 'sandstone/arguments/generated/data/loot.ts'

export type Predicate = (LootCondition | Array<LootCondition>)
