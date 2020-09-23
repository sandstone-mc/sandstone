// eslint-disable-next-line @typescript-eslint/no-var-requires
require('module-alias/register')(__dirname)

// eslint-disable-next-line import/first
import { datapack } from './_internals'

export const {
  mcfunction, save: saveDatapack, Advancement, Predicate, setDefaultNamespace,
} = datapack

export { _ } from './_internals'
