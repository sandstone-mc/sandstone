import { commandsRoot, dataPack } from './_internals'

// COMMANDS
export const {
  advancement,
  attribute,
  bossbar,
  clear,
  clone,
  comment,
  data,
  datapack,
  debug,
  defaultgamemode,
  difficulty,
  effect,
  enchant,
  execute,
  experience,
  fill,
  functionCmd,
  forceload,
  gamemode,
  gamerule,
  give,
  help,
  kill,
  list,
  locate,
  locatebiome,
  loot,
  me,
  msg,
  particle,
  playsound,
  raw,
  recipe,
  reload,
  replaceitem,
  say,
  schedule,
  scoreboard,
  seed,
  setblock,
  setidletimeout,
  setworldspawn,
  spawnpoint,
  spectate,
  spreadplayers,
  stopsound,
  summon,
  tag,
  team,
  teammessage,
  teleport,
  tellraw,
  time,
  title,
  trigger,
  w,
  weather,
  worldborder,
} = commandsRoot

// CORE
export { SandstoneConfig } from './_internals/datapack/Datapack'

export const {
  save: savePack, BasePath, sleep,
} = dataPack

export const {
  MCFunction, Advancement, Predicate, Tag, LootTable, Recipe,
} = dataPack.basePath

export { _ } from './_internals'

// VARIABLES
export {
  absolute as abs, local as loc,
  relative as rel,
} from './_internals'
export * from './_internals/variables/Coordinates'
export * from './_internals/variables/JsonTextComponentClass'
export * from './_internals/variables/NBTs'
export * from './_internals/variables/Objective'
export * from './_internals/variables/parsers'
export * from './_internals/variables/PlayerScore'
export { SelectorClass } from './_internals/variables/Selector'

export const {
  createObjective,
  Selector,
  Variable,
} = dataPack

// TYPES
export * from './_internals/arguments'
export type { BasePathClass, BasePathOptions } from './_internals/datapack/BasePath'
export type { MCFunctionInstance } from './_internals/datapack/Datapack'
export type { LiteralUnion } from './_internals/generalTypes'
export type {
  AdvancementInstance, LootTableInstance, MCFunctionOptions, PredicateInstance, RecipeInstance, ResourceInstance, TagInstance,
} from './_internals/resources'
