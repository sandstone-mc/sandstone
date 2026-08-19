import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_TREE_DECORATOR_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_TREE_DECORATOR_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_TREE_DECORATOR_TYPES_SET>}`)

export const JSONWORLDGEN_TREE_DECORATOR_TYPES_SET = new Set([
  'alter_ground',
  'attached_to_leaves',
  'attached_to_logs',
  'beehive',
  'cocoa',
  'creaking_heart',
  'leave_vine',
  'pale_moss',
  'place_on_ground',
  'shelf_mushroom',
  'trunk_vine',
] as const)
