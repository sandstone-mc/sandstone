import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWOLF_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONWOLF_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONWOLF_VARIANTS_SET>}`)

export const JSONWOLF_VARIANTS_SET = new Set([
  'ashen',
  'black',
  'chestnut',
  'pale',
  'rusty',
  'snowy',
  'spotted',
  'striped',
  'woods',
] as const)
