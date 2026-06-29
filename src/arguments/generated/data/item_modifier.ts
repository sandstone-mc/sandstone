import type { LootFunction, NonReferenceLootFunction } from 'sandstone/arguments/generated/data/loot.ts'

export type ItemModifier = (LootFunction | Array<LootFunction>)

export type NonReferenceItemModifier = (NonReferenceLootFunction | Array<NonReferenceLootFunction>)
