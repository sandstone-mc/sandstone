import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONVILLAGER_PROFESSIONS = (
  | NamespacedLiteralUnion<SetType<typeof JSONVILLAGER_PROFESSIONS_SET>>
  | `minecraft:${SetType<typeof JSONVILLAGER_PROFESSIONS_SET>}`)

export const JSONVILLAGER_PROFESSIONS_SET = new Set([
  'armorer',
  'butcher',
  'cartographer',
  'cleric',
  'farmer',
  'fisherman',
  'fletcher',
  'leatherworker',
  'librarian',
  'mason',
  'nitwit',
  'none',
  'shepherd',
  'toolsmith',
  'weaponsmith',
] as const)
