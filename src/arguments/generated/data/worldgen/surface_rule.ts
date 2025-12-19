import type { CaveSurface, VerticalAnchor } from 'sandstone/arguments/generated/data/worldgen.js'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.js'
import type { NBTFloat, NBTInt } from 'sandstone'

export type BiomeCondition = {
    biome_is: Array<Registry['minecraft:worldgen/biome']>
}

export type BlockRule = {
    result_state: BlockState
}

export type ConditionRule = {
    if_true: SurfaceCondition
    then_run: SurfaceRule
}

export type NoiseThresholdCondition = {
    noise: Registry['minecraft:worldgen/noise']
    min_threshold: NBTFloat
    max_threshold: NBTFloat
}

export type NotCondition = {
    invert: SurfaceCondition
}

export type SequenceRule = {
    sequence: Array<SurfaceRule>
}

export type StoneDepthCondition = {
    offset: NBTInt
    /**
     * Value:
     *
     *  - Floor(`floor`)
     *  - Ceiling(`ceiling`)
     */
    surface_type: CaveSurface
    add_surface_depth: boolean
    secondary_depth_range: NBTInt
}

export type SurfaceCondition = ({
    [S in Extract<Registry['minecraft:worldgen/material_condition'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:surface_condition'>
        ? Dispatcher<'minecraft:surface_condition'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:worldgen/material_condition']])

export type SurfaceRule = ({
    [S in Extract<Registry['minecraft:worldgen/material_rule'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:surface_rule'>
        ? Dispatcher<'minecraft:surface_rule'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:worldgen/material_rule']])

export type VerticalGradientCondition = {
    random_name: string
    true_at_and_below: VerticalAnchor
    false_at_and_above: VerticalAnchor
}

export type WaterCondition = {
    offset: NBTInt
    /**
     * Value:
     * Range: -20..20
     */
    surface_depth_multiplier: NBTInt<{
        min: -20
        max: 20
    }>
    add_stone_depth: boolean
}

export type YAboveCondition = {
    anchor: VerticalAnchor
    /**
     * Value:
     * Range: -20..20
     */
    surface_depth_multiplier: NBTInt<{
        min: -20
        max: 20
    }>
    add_stone_depth: boolean
}
type SurfaceConditionDispatcherMap = {
    'biome': SurfaceConditionBiome
    'minecraft:biome': SurfaceConditionBiome
    'noise_threshold': SurfaceConditionNoiseThreshold
    'minecraft:noise_threshold': SurfaceConditionNoiseThreshold
    'not': SurfaceConditionNot
    'minecraft:not': SurfaceConditionNot
    'stone_depth': SurfaceConditionStoneDepth
    'minecraft:stone_depth': SurfaceConditionStoneDepth
    'vertical_gradient': SurfaceConditionVerticalGradient
    'minecraft:vertical_gradient': SurfaceConditionVerticalGradient
    'water': SurfaceConditionWater
    'minecraft:water': SurfaceConditionWater
    'y_above': SurfaceConditionYAbove
    'minecraft:y_above': SurfaceConditionYAbove
}
type SurfaceConditionKeys = keyof SurfaceConditionDispatcherMap
type SurfaceConditionFallback = (
    | SurfaceConditionBiome
    | SurfaceConditionNoiseThreshold
    | SurfaceConditionNot
    | SurfaceConditionStoneDepth
    | SurfaceConditionVerticalGradient
    | SurfaceConditionWater
    | SurfaceConditionYAbove)
type SurfaceConditionBiome = BiomeCondition
type SurfaceConditionNoiseThreshold = NoiseThresholdCondition
type SurfaceConditionNot = NotCondition
type SurfaceConditionStoneDepth = StoneDepthCondition
type SurfaceConditionVerticalGradient = VerticalGradientCondition
type SurfaceConditionWater = WaterCondition
type SurfaceConditionYAbove = YAboveCondition
export type SymbolSurfaceCondition<CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? SurfaceConditionDispatcherMap
    : CASE extends 'keys' ? SurfaceConditionKeys : CASE extends '%fallback' ? SurfaceConditionFallback : never
type SurfaceRuleDispatcherMap = {
    'block': SurfaceRuleBlock
    'minecraft:block': SurfaceRuleBlock
    'condition': SurfaceRuleCondition
    'minecraft:condition': SurfaceRuleCondition
    'sequence': SurfaceRuleSequence
    'minecraft:sequence': SurfaceRuleSequence
}
type SurfaceRuleKeys = keyof SurfaceRuleDispatcherMap
type SurfaceRuleFallback = (SurfaceRuleBlock | SurfaceRuleCondition | SurfaceRuleSequence)
type SurfaceRuleBlock = BlockRule
type SurfaceRuleCondition = ConditionRule
type SurfaceRuleSequence = SequenceRule
export type SymbolSurfaceRule<CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? SurfaceRuleDispatcherMap
    : CASE extends 'keys' ? SurfaceRuleKeys : CASE extends '%fallback' ? SurfaceRuleFallback : never
