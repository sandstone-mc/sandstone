import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type CONTEXT_FLOAT_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof CONTEXT_FLOAT_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof CONTEXT_FLOAT_PROVIDER_TYPES_SET>}`)

export const CONTEXT_FLOAT_PROVIDER_TYPES_SET = new Set([
  'abs',
  'add',
  'avg',
  'ceil',
  'conditional',
  'constant',
  'cos',
  'div',
  'enchantment_level',
  'environment_attribute',
  'floor',
  'from_int',
  'length',
  'max',
  'min',
  'mod',
  'mul',
  'negate',
  'number_dispatcher',
  'pow',
  'round',
  'sin',
  'sqrt',
  'storage',
  'sub',
  'truncate',
  'uniform',
  'weighted_list',
] as const)
