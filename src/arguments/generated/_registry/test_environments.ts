import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TEST_ENVIRONMENTS = (
    | NamespacedLiteralUnion<SetType<typeof TEST_ENVIRONMENTS_SET>>
    | `minecraft:${SetType<typeof TEST_ENVIRONMENTS_SET>}`)

export const TEST_ENVIRONMENTS_SET = new Set([
    'default',
] as const)
