import { dataPack } from './init'

// CORE
export { SandstoneConfig } from './datapack/Datapack'

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
export * from './variables/JsonTextComponentClass'
export * from './variables/NBTs'
export * from './variables/Objective'
export * from './variables/parsers'
export * from './variables/PlayerScore'
export { SelectorClass } from './variables/Selector'

export const {
  createObjective,
  Selector,
  Variable,
} = dataPack

// TYPES
export * from './arguments'
export type { BasePathClass, BasePathOptions } from './datapack/BasePath'
export type { MCFunctionInstance } from './datapack/Datapack'
export type { LiteralUnion } from './generalTypes'
export type {
  AdvancementInstance, LootTableInstance, MCFunctionOptions, PredicateInstance, RecipeInstance, ResourceInstance, TagInstance,
} from './resources'
