import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.js'

export type KnowledgeBook = (ItemBase & {
    Recipes?: Array<Registry['minecraft:recipe']>
})
