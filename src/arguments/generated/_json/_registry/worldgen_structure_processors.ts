import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_STRUCTURE_PROCESSORS = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_STRUCTURE_PROCESSORS_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_STRUCTURE_PROCESSORS_SET>}`)

export const JSONWORLDGEN_STRUCTURE_PROCESSORS_SET = new Set([
  'blackstone_replace',
  'block_age',
  'block_ignore',
  'block_rot',
  'capped',
  'gravity',
  'jigsaw_replacement',
  'lava_submerged_block',
  'nop',
  'protected_blocks',
  'rule',
] as const)
