import type { LootFunction } from 'sandstone/arguments/generated/data/loot.ts'

export type ItemModifier = (LootFunction | Array<LootFunction>)
