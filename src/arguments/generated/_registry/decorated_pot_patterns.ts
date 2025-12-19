import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type DECORATED_POT_PATTERNS = (
    | NamespacedLiteralUnion<SetType<typeof DECORATED_POT_PATTERNS_SET>>
    | `minecraft:${SetType<typeof DECORATED_POT_PATTERNS_SET>}`)

export const DECORATED_POT_PATTERNS_SET = new Set([
    'angler',
    'archer',
    'arms_up',
    'blade',
    'blank',
    'brewer',
    'burn',
    'danger',
    'explorer',
    'flow',
    'friend',
    'guster',
    'heart',
    'heartbreak',
    'howl',
    'miner',
    'mourner',
    'plenty',
    'prize',
    'scrape',
    'sheaf',
    'shelter',
    'skull',
    'snort',
] as const)
