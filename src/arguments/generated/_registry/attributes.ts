import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ATTRIBUTES = (
    | NamespacedLiteralUnion<SetType<typeof ATTRIBUTES_SET>>
    | `minecraft:${SetType<typeof ATTRIBUTES_SET>}`)

export const ATTRIBUTES_SET = new Set([
    'armor',
    'armor_toughness',
    'attack_damage',
    'attack_knockback',
    'attack_speed',
    'block_break_speed',
    'block_interaction_range',
    'burning_time',
    'camera_distance',
    'entity_interaction_range',
    'explosion_knockback_resistance',
    'fall_damage_multiplier',
    'flying_speed',
    'follow_range',
    'gravity',
    'jump_strength',
    'knockback_resistance',
    'luck',
    'max_absorption',
    'max_health',
    'mining_efficiency',
    'movement_efficiency',
    'movement_speed',
    'oxygen_bonus',
    'safe_fall_distance',
    'scale',
    'sneaking_speed',
    'spawn_reinforcements',
    'step_height',
    'submerged_mining_speed',
    'sweeping_damage_ratio',
    'tempt_range',
    'water_movement_efficiency',
    'waypoint_receive_range',
    'waypoint_transmit_range',
] as const)
