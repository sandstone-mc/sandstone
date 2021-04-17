import { dataPack } from './init'

// CORE
export const {
  save: savePack, BasePath, sleep,
} = dataPack

export const {
  MCFunction, Advancement, Predicate, Tag, LootTable, Recipe,
} = dataPack.basePath

export { _ } from './init'

// COMMANDS
export * from './commandsOnly'

// VARIABLES
export {
  absolute as abs, local as loc,
  relative as rel,
} from '.'
export * from './variables/Coordinates'
export * from './variables/JSONTextComponentClass'
export * from './variables/NBTs'
export * from './variables/Objective'
export * from './variables/parsers'
export * from './variables/Score'
export { SelectorClass } from './variables/Selector'

export const {
  Objective,
  Selector,
  Data,
  Variable,
} = dataPack

// TYPES
export * from './arguments'
export * from './datapack/BasePath'
export * from './datapack/Datapack'
export type { LiteralUnion } from './generalTypes'
export type {
  AdvancementInstance, LootTableInstance, MCFunctionOptions, PredicateInstance, RecipeInstance, ResourceInstance, TagInstance,
} from './resources'
