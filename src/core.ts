// eslint-disable-next-line @typescript-eslint/no-var-requires
require('module-alias')(__dirname)
// eslint-disable-next-line import/first
import { datapack } from './_internals'

export const {
  mcfunction, save: saveDatapack, Advancement, Predicate,
} = datapack

export { _ } from './_internals'
