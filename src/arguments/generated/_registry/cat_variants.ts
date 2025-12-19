import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type CAT_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof CAT_VARIANTS_SET>>
  | `minecraft:${SetType<typeof CAT_VARIANTS_SET>}`)

export const CAT_VARIANTS_SET = new Set([
    'all_black',
    'black',
    'british_shorthair',
    'calico',
    'jellie',
    'persian',
    'ragdoll',
    'red',
    'siamese',
    'tabby',
    'white',
] as const)
