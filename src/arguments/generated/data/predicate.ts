import type { LootCondition } from 'sandstone/arguments/generated/data/loot'

export type Predicate = (LootCondition | Array<LootCondition>)
