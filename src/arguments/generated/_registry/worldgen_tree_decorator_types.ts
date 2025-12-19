import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_TREE_DECORATOR_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_TREE_DECORATOR_TYPES_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_TREE_DECORATOR_TYPES_SET>}`)

export const WORLDGEN_TREE_DECORATOR_TYPES_SET = new Set([
    'alter_ground',
    'attached_to_leaves',
    'attached_to_logs',
    'beehive',
    'cocoa',
    'creaking_heart',
    'leave_vine',
    'pale_moss',
    'place_on_ground',
    'trunk_vine',
] as const)
