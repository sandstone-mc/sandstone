import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TRIM_PATTERNS = (
  | NamespacedLiteralUnion<SetType<typeof TRIM_PATTERNS_SET>>
  | `minecraft:${SetType<typeof TRIM_PATTERNS_SET>}`)

export const TRIM_PATTERNS_SET = new Set([
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
