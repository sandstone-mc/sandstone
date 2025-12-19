import type { Registry } from 'sandstone/generated/registry'
import type { ItemBase } from 'sandstone/generated/world/item'

export type KnowledgeBook = (ItemBase & {
    Recipes?: Array<Registry['minecraft:recipe']>
})
