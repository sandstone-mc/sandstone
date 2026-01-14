import type { HeightmapType, IntProvider } from 'sandstone/arguments/generated/data/worldgen.ts'
import type { SymbolBlock } from 'sandstone/arguments/generated/dispatcher.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { NBTFloat, NBTInt, TagClass } from 'sandstone'
import type { RootNBT, NBTObject } from 'sandstone/arguments/nbt.ts'

export type AppendLoot = {
  loot_table: Registry['minecraft:loot_table']
}

export type AppendStatic<S = undefined> = {
  data: (S extends keyof SymbolBlock ? SymbolBlock[S] : NBTObject)
}

export type Axis = ('x' | 'y' | 'z')

export type AxisAlignedLinearPos = ({
  /**
     * Value:
     *
     *  - X(`x`)
     *  - Y(`y`)
     *  - Z(`z`)
     */
  axis: Axis
} & LinearPos)

export type BlockAge = {
  mossiness: NBTFloat
}

export type BlockEntityModifier = ({
  [S in Extract<Registry['minecraft:rule_block_entity_modifier'], string>]?: ({
    type: S
  } & (S extends keyof SymbolRuleBlockEntityModifier ? SymbolRuleBlockEntityModifier[S] : RootNBT));
}[Registry['minecraft:rule_block_entity_modifier']])

export type BlockIgnore = {
  blocks: Array<BlockState>
}

export type BlockMatch = {
  block: Registry['minecraft:block']
}

export type BlockRot = {
  /**
     * Value:
     * Range: 0..1
     */
  integrity: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  rottable_blocks?: (
      | Array<Registry['minecraft:block']> | (
      Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>))
}

export type BlockStateMatch = {
  block_state: BlockState
}

export type Capped = {
  delegate: Processor
  limit: IntProvider<NBTInt<{
    min: 0
  }>>
}

export type Gravity = {
  /**
     * Value:
     *
     *  - MotionBlocking(`MOTION_BLOCKING`)
     *  - MotionBlockingNoLeaves(`MOTION_BLOCKING_NO_LEAVES`)
     *  - OceanFloor(`OCEAN_FLOOR`)
     *  - OceanFloorWorldgen(`OCEAN_FLOOR_WG`)
     *  - WorldSurface(`WORLD_SURFACE`)
     *  - WorldSurfaceWorldgen(`WORLD_SURFACE_WG`)
     */
  heightmap: HeightmapType
  offset: NBTInt
}

export type LinearPos = {
  /**
     * Value:
     * Range: 0..255
     */
  min_dist?: NBTInt<{
    min: 0
  }>
  /**
     * Value:
     * Range: 0..255
     */
  max_dist?: NBTInt<{
    min: 0
  }>
  /**
     * Value:
     * Range: 0..1
     */
  min_chance?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
  /**
     * Value:
     * Range: 0..1
     */
  max_chance?: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type PosRuleTest = ({
  [S in Extract<Registry['minecraft:pos_rule_test'], string>]?: ({
    predicate_type: S
  } & (S extends keyof SymbolPosRuleTest ? SymbolPosRuleTest[S] : RootNBT));
}[Registry['minecraft:pos_rule_test']])

export type Processor = ({
  [S in Extract<Registry['minecraft:worldgen/structure_processor'], string>]?: ({
    processor_type: S
  } & (S extends keyof SymbolTemplateProcessor ? SymbolTemplateProcessor[S] : RootNBT));
}[Registry['minecraft:worldgen/structure_processor']])

export type ProcessorList = (Array<Processor> | {
  processors: Array<Processor>
})

export type ProcessorListRef = (Registry['minecraft:worldgen/processor_list'] | ProcessorList)

export type ProcessorRule = {
  position_predicate?: PosRuleTest
  location_predicate: RuleTest
  input_predicate: RuleTest
  output_state: BlockState
  block_entity_modifier?: BlockEntityModifier
}

export type ProtectedBlocks = {
  value: (`#${Registry['minecraft:tag/block']}` | TagClass<'block'>)
}

export type RandomBlockMatch = {
  block: Registry['minecraft:block']
  /**
     * Value:
     * Range: 0..1
     */
  probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type RandomBlockStateMatch = {
  block_state: BlockState
  /**
     * Value:
     * Range: 0..1
     */
  probability: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type Rule = {
  rules: Array<ProcessorRule>
}

export type RuleTest = ({
  [S in Extract<Registry['minecraft:rule_test'], string>]?: ({
    predicate_type: S
  } & (S extends keyof SymbolRuleTest ? SymbolRuleTest[S] : RootNBT));
}[Registry['minecraft:rule_test']])

export type TagMatch = {
  tag: (Registry['minecraft:tag/block'])
}
type PosRuleTestDispatcherMap = {
  'axis_aligned_linear_pos': PosRuleTestAxisAlignedLinearPos
  'minecraft:axis_aligned_linear_pos': PosRuleTestAxisAlignedLinearPos
  'linear_pos': PosRuleTestLinearPos
  'minecraft:linear_pos': PosRuleTestLinearPos
}
type PosRuleTestKeys = keyof PosRuleTestDispatcherMap
type PosRuleTestFallback = (PosRuleTestAxisAlignedLinearPos | PosRuleTestLinearPos)
type PosRuleTestAxisAlignedLinearPos = AxisAlignedLinearPos
type PosRuleTestLinearPos = LinearPos
export type SymbolPosRuleTest<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? PosRuleTestDispatcherMap
  : CASE extends 'keys' ? PosRuleTestKeys : CASE extends '%fallback' ? PosRuleTestFallback : never
type RuleBlockEntityModifierDispatcherMap = {
  'append_loot': RuleBlockEntityModifierAppendLoot
  'minecraft:append_loot': RuleBlockEntityModifierAppendLoot
  'append_static': RuleBlockEntityModifierAppendStatic
  'minecraft:append_static': RuleBlockEntityModifierAppendStatic
  'clear': RuleBlockEntityModifierClear
  'minecraft:clear': RuleBlockEntityModifierClear
  'passthrough': RuleBlockEntityModifierPassthrough
  'minecraft:passthrough': RuleBlockEntityModifierPassthrough
}
type RuleBlockEntityModifierKeys = keyof RuleBlockEntityModifierDispatcherMap
type RuleBlockEntityModifierFallback = (
  | RuleBlockEntityModifierAppendLoot
  | RuleBlockEntityModifierAppendStatic
  | RuleBlockEntityModifierClear
  | RuleBlockEntityModifierPassthrough)
type RuleBlockEntityModifierAppendLoot = AppendLoot
type RuleBlockEntityModifierAppendStatic = AppendStatic
type RuleBlockEntityModifierClear = Record<string, never>
type RuleBlockEntityModifierPassthrough = Record<string, never>
export type SymbolRuleBlockEntityModifier<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? RuleBlockEntityModifierDispatcherMap
  : CASE extends 'keys'
    ? RuleBlockEntityModifierKeys
    : CASE extends '%fallback' ? RuleBlockEntityModifierFallback : never
type RuleTestDispatcherMap = {
  'block_match': RuleTestBlockMatch
  'minecraft:block_match': RuleTestBlockMatch
  'blockstate_match': RuleTestBlockstateMatch
  'minecraft:blockstate_match': RuleTestBlockstateMatch
  'random_block_match': RuleTestRandomBlockMatch
  'minecraft:random_block_match': RuleTestRandomBlockMatch
  'random_blockstate_match': RuleTestRandomBlockstateMatch
  'minecraft:random_blockstate_match': RuleTestRandomBlockstateMatch
  'tag_match': RuleTestTagMatch
  'minecraft:tag_match': RuleTestTagMatch
}
type RuleTestKeys = keyof RuleTestDispatcherMap
type RuleTestFallback = (
  | RuleTestBlockMatch
  | RuleTestBlockstateMatch
  | RuleTestRandomBlockMatch
  | RuleTestRandomBlockstateMatch
  | RuleTestTagMatch)
type RuleTestBlockMatch = BlockMatch
type RuleTestBlockstateMatch = BlockStateMatch
type RuleTestRandomBlockMatch = RandomBlockMatch
type RuleTestRandomBlockstateMatch = RandomBlockStateMatch
type RuleTestTagMatch = TagMatch
export type SymbolRuleTest<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? RuleTestDispatcherMap
  : CASE extends 'keys' ? RuleTestKeys : CASE extends '%fallback' ? RuleTestFallback : never
type TemplateProcessorDispatcherMap = {
  'block_age': TemplateProcessorBlockAge
  'minecraft:block_age': TemplateProcessorBlockAge
  'block_ignore': TemplateProcessorBlockIgnore
  'minecraft:block_ignore': TemplateProcessorBlockIgnore
  'block_rot': TemplateProcessorBlockRot
  'minecraft:block_rot': TemplateProcessorBlockRot
  'capped': TemplateProcessorCapped
  'minecraft:capped': TemplateProcessorCapped
  'gravity': TemplateProcessorGravity
  'minecraft:gravity': TemplateProcessorGravity
  'protected_blocks': TemplateProcessorProtectedBlocks
  'minecraft:protected_blocks': TemplateProcessorProtectedBlocks
  'rule': TemplateProcessorRule
  'minecraft:rule': TemplateProcessorRule
}
type TemplateProcessorKeys = keyof TemplateProcessorDispatcherMap
type TemplateProcessorFallback = (
  | TemplateProcessorBlockAge
  | TemplateProcessorBlockIgnore
  | TemplateProcessorBlockRot
  | TemplateProcessorCapped
  | TemplateProcessorGravity
  | TemplateProcessorProtectedBlocks
  | TemplateProcessorRule)
type TemplateProcessorBlockAge = BlockAge
type TemplateProcessorBlockIgnore = BlockIgnore
type TemplateProcessorBlockRot = BlockRot
type TemplateProcessorCapped = Capped
type TemplateProcessorGravity = Gravity
type TemplateProcessorProtectedBlocks = ProtectedBlocks
type TemplateProcessorRule = Rule
export type SymbolTemplateProcessor<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? TemplateProcessorDispatcherMap
  : CASE extends 'keys' ? TemplateProcessorKeys : CASE extends '%fallback' ? TemplateProcessorFallback : never
