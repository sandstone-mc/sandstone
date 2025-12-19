import type { LootFunction } from 'sandstone/generated/data/loot'

export type ItemModifier = (LootFunction | Array<LootFunction>)
