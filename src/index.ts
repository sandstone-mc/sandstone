import { dataPack } from './init'

// CORE
export const {
  save: savePack, BasePath, sleep,
} = dataPack

export const {
  MCFunction, Advancement, Predicate, Tag, LootTable, Recipe, ItemModifier,
} = dataPack.basePath

export { _ } from './init'

// COMMANDS
export * from './commandsOnly'

// VARIABLES
export {
  absolute as abs,
  local as loc,
  relative as rel,
} from './variables'
export * from './variables/Coordinates'
export * from './variables/JSONTextComponentParser'
export * from './variables/nbt/NBTs'
export * from './variables/Objective'
export * from './variables/parsers'
export * from './variables/Score'
export { SelectorClass } from './variables/Selector'

export const {
  Objective,
  Selector,
  Data,
  Variable,
  CustomResource,
} = dataPack

// TYPES
export * from './arguments'
export * from './datapack/BasePath'
export * from './datapack/Datapack'
export type { LiteralUnion } from './generalTypes'
export type {
  AdvancementInstance, ItemModifierInstance,
  LootTableInstance, MCFunctionOptions, PredicateInstance, RecipeInstance, ResourceInstance, TagInstance,
} from './resources'
