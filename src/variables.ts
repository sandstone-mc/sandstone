import { datapack } from './_internals'

export {
  absolute, relative, local,
  absolute as abs, relative as rel, local as loc,
} from './_internals'

export const {
  createObjective,
  Selector,
} = datapack

export const self = Selector('@s')
