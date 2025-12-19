import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ENCHANTMENT_PROVIDERS = (
  | NamespacedLiteralUnion<SetType<typeof ENCHANTMENT_PROVIDERS_SET>>
  | `minecraft:${SetType<typeof ENCHANTMENT_PROVIDERS_SET>}`)

export const ENCHANTMENT_PROVIDERS_SET = new Set([
    'enderman_loot_drop',
    'mob_spawn_equipment',
    'pillager_spawn_crossbow',
    'raid/pillager_post_wave_3',
    'raid/pillager_post_wave_5',
    'raid/vindicator',
    'raid/vindicator_post_wave_5',
] as const)
