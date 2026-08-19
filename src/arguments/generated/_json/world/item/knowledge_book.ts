import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { RecipeClass } from 'sandstone'

export type JsonKnowledgeBook = (JsonItemBase & {
  Recipes?: Array<(JsonRegistry['minecraft:recipe'] | RecipeClass)>,
})
