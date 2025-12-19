import type { LootCondition } from 'sandstone/generated/data/loot'

export type Predicate = (LootCondition | Array<LootCondition>)
