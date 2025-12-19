import type { LootCondition } from 'sandstone/arguments/generated/data/loot.js'

export type Predicate = (LootCondition | Array<LootCondition>)
