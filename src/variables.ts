// eslint-disable-next-line @typescript-eslint/no-var-requires
require('module-alias')(__dirname)
// eslint-disable-next-line import/first
import { datapack } from './_internals'

export {
  absolute as abs, relative as rel, local as loc,
} from './_internals'

export * from './_internals/variables/Coordinates'
export * from './_internals/variables/parsers'
export * from './_internals/variables/PlayerScore'
export { SelectorClass } from './_internals/variables/Selector'
export * from './_internals/variables/Objective'
export * from './_internals/variables/JsonTextComponentClass'

export const {
  createObjective,
  Selector,
} = datapack
