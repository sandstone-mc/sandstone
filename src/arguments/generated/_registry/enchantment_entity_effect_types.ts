import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ENCHANTMENT_ENTITY_EFFECT_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof ENCHANTMENT_ENTITY_EFFECT_TYPES_SET>>
    | `minecraft:${SetType<typeof ENCHANTMENT_ENTITY_EFFECT_TYPES_SET>}`)

export const ENCHANTMENT_ENTITY_EFFECT_TYPES_SET = new Set([
    'all_of',
    'apply_exhaustion',
    'apply_impulse',
    'apply_mob_effect',
    'change_item_damage',
    'damage_entity',
    'explode',
    'ignite',
    'play_sound',
    'replace_block',
    'replace_disk',
    'run_function',
    'set_block_properties',
    'spawn_particles',
    'summon_entity',
] as const)
