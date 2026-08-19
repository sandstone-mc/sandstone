import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTRIM_PATTERNS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTRIM_PATTERNS_SET>>
  | `minecraft:${SetType<typeof JSONTRIM_PATTERNS_SET>}`)

export const JSONTRIM_PATTERNS_SET = new Set([
  'bolt',
  'coast',
  'dune',
  'eye',
  'flow',
  'host',
  'raiser',
  'rib',
  'sentry',
  'shaper',
  'silence',
  'snout',
  'spire',
  'tide',
  'vex',
  'ward',
  'wayfinder',
  'wild',
] as const)
