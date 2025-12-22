import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type POINT_OF_INTEREST_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof POINT_OF_INTEREST_TYPES_SET>>
  | `minecraft:${SetType<typeof POINT_OF_INTEREST_TYPES_SET>}`)

export const POINT_OF_INTEREST_TYPES_SET = new Set([
  'armorer',
  'bee_nest',
  'beehive',
  'butcher',
  'cartographer',
  'cleric',
  'farmer',
  'fisherman',
  'fletcher',
  'home',
  'leatherworker',
  'librarian',
  'lightning_rod',
  'lodestone',
  'mason',
  'meeting',
  'nether_portal',
  'shepherd',
  'test_instance',
  'toolsmith',
  'weaponsmith',
] as const)
