import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCONTEXT_INT_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONCONTEXT_INT_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONCONTEXT_INT_PROVIDER_TYPES_SET>}`)

export const JSONCONTEXT_INT_PROVIDER_TYPES_SET = new Set([
  'abs',
  'add',
  'avg',
  'binomial',
  'conditional',
  'constant',
  'div',
  'environment_attribute',
  'floor_div',
  'floor_mod',
  'from_float',
  'max',
  'min',
  'mod',
  'mul',
  'negate',
  'number_dispatcher',
  'pow',
  'score',
  'storage',
  'sub',
  'uniform',
  'weighted_list',
] as const)
