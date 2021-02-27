import { dataPack } from './_internals'

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
