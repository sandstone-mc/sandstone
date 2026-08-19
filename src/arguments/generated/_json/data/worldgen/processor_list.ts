import type { JsonHeightmapType, JsonIntProvider } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonSymbolBlock } from 'sandstone/arguments/generated/_json/dispatcher.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonAxis } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { LootTableClass, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type JsonAppendLoot = {
  loot_table: (JsonRegistry['minecraft:loot_table'] | LootTableClass),
}

export type JsonAppendStatic<S = undefined> = {
  data: ((S extends keyof JsonSymbolBlock
    ? JsonSymbolBlock[S]
    : JsonSymbolBlock<'%unknown'>) & (S extends keyof JsonSymbolBlock
      ? JsonSymbolBlock[S]
      : JsonSymbolBlock<'%unknown'>)),
}

export type JsonAxisAlignedLinearPos = ({
  /**
   * Value:
   *
   *  - X(`x`)
   *  - Y(`y`)
   *  - Z(`z`)
   */
  axis: JsonAxis,
} & JsonLinearPos)

export type JsonBlockAge = {
  mossiness: (NBTFloat | number),
}

export type JsonBlockEntityModifier = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:rule_block_entity_modifier'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolRuleBlockEntityModifier ? JsonSymbolRuleBlockEntityModifier[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:rule_block_entity_modifier'], string>])>

export type JsonBlockIgnore = {
  blocks: Array<JsonBlockState>,
}

export type JsonBlockMatch = {
  block: JsonRegistry['minecraft:block'],
}

export type JsonBlockRot = {
  /**
   * Value:
   * Range: 0..1
   */
  integrity: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  rottable_blocks?: (
      | Array<JsonRegistry['minecraft:block']> | (
      JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)),
}

export type JsonBlockStateMatch = {
  block_state: JsonBlockState,
}

export type JsonCapped = {
  delegate: JsonProcessor,
  limit: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
}

export type JsonCompositeMatch = {
  rules: Array<JsonRuleTest>,
}

export type JsonGravity = {
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
  heightmap: JsonHeightmapType,
  offset: (NBTInt | number),
}

export type JsonHeightMatch = {
  min_inclusive: (NBTInt | number),
  max_inclusive: (NBTInt | number),
}

export type JsonInvertedMatch = {
  rule: JsonRuleTest,
}

export type JsonLinearPos = {
  /**
   * Value:
   * Range: 0..255
   */
  min_dist?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..255
   */
  max_dist?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  min_chance?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  max_chance?: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonPosRuleTest = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:pos_rule_test'], string>, string>]?: ({
    predicate_type: S,
  } & (S extends keyof JsonSymbolPosRuleTest ? JsonSymbolPosRuleTest[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:pos_rule_test'], string>])>

export type JsonProcessor = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/structure_processor'], string>, string>]?: ({
    processor_type: S,
  } & (S extends keyof JsonSymbolTemplateProcessor ? JsonSymbolTemplateProcessor[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/structure_processor'], string>])>

export type JsonProcessorList = (Array<JsonProcessor> | {
  processors: Array<JsonProcessor>,
})

export type JsonProcessorListObject = {
  processors: Array<JsonProcessor>,
}

export type JsonProcessorListRef = (JsonRegistry['minecraft:worldgen/processor_list'] | JsonProcessorList)

export type JsonProcessorRule = {
  position_predicate?: JsonPosRuleTest,
  location_predicate: JsonRuleTest,
  input_predicate: JsonRuleTest,
  output_state: JsonBlockState,
  block_entity_modifier?: JsonBlockEntityModifier,
}

export type JsonProtectedBlocks = {
  value: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
}

export type JsonRandomBlockMatch = {
  block: JsonRegistry['minecraft:block'],
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonRandomBlockStateMatch = {
  block_state: JsonBlockState,
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonRule = {
  rules: Array<JsonProcessorRule>,
}

export type JsonRuleTest = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:rule_test'], string>, string>]?: ({
    predicate_type: S,
  } & (S extends keyof JsonSymbolRuleTest ? JsonSymbolRuleTest[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:rule_test'], string>])>

export type JsonTagMatch = {
  tag: (JsonRegistry['minecraft:tag/block']),
}
type JsonPosRuleTestDispatcherMap = {
  'axis_aligned_linear_pos': JsonPosRuleTestAxisAlignedLinearPos,
  'minecraft:axis_aligned_linear_pos': JsonPosRuleTestAxisAlignedLinearPos,
  'linear_pos': JsonPosRuleTestLinearPos,
  'minecraft:linear_pos': JsonPosRuleTestLinearPos,
}
type JsonPosRuleTestKeys = keyof JsonPosRuleTestDispatcherMap
type JsonPosRuleTestFallback = (JsonPosRuleTestAxisAlignedLinearPos | JsonPosRuleTestLinearPos)
type JsonPosRuleTestAxisAlignedLinearPos = JsonAxisAlignedLinearPos
type JsonPosRuleTestLinearPos = JsonLinearPos
export type JsonSymbolPosRuleTest<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonPosRuleTestDispatcherMap
  : CASE extends 'keys' ? JsonPosRuleTestKeys : CASE extends '%fallback' ? JsonPosRuleTestFallback : never
type JsonRuleBlockEntityModifierDispatcherMap = {
  'append_loot': JsonRuleBlockEntityModifierAppendLoot,
  'minecraft:append_loot': JsonRuleBlockEntityModifierAppendLoot,
  'append_static': JsonRuleBlockEntityModifierAppendStatic,
  'minecraft:append_static': JsonRuleBlockEntityModifierAppendStatic,
  'clear': JsonRuleBlockEntityModifierClear,
  'minecraft:clear': JsonRuleBlockEntityModifierClear,
  'passthrough': JsonRuleBlockEntityModifierPassthrough,
  'minecraft:passthrough': JsonRuleBlockEntityModifierPassthrough,
}
type JsonRuleBlockEntityModifierKeys = keyof JsonRuleBlockEntityModifierDispatcherMap
type JsonRuleBlockEntityModifierFallback = (
  | JsonRuleBlockEntityModifierAppendLoot
  | JsonRuleBlockEntityModifierAppendStatic
  | JsonRuleBlockEntityModifierClear
  | JsonRuleBlockEntityModifierPassthrough)
type JsonRuleBlockEntityModifierAppendLoot = JsonAppendLoot
type JsonRuleBlockEntityModifierAppendStatic = JsonAppendStatic
type JsonRuleBlockEntityModifierClear = Record<string, never>
type JsonRuleBlockEntityModifierPassthrough = Record<string, never>
export type JsonSymbolRuleBlockEntityModifier<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonRuleBlockEntityModifierDispatcherMap
  : CASE extends 'keys'
    ? JsonRuleBlockEntityModifierKeys
    : CASE extends '%fallback' ? JsonRuleBlockEntityModifierFallback : never
type JsonRuleTestDispatcherMap = {
  'all_of': JsonRuleTestAllOf,
  'minecraft:all_of': JsonRuleTestAllOf,
  'any_of': JsonRuleTestAnyOf,
  'minecraft:any_of': JsonRuleTestAnyOf,
  'block_match': JsonRuleTestBlockMatch,
  'minecraft:block_match': JsonRuleTestBlockMatch,
  'blockstate_match': JsonRuleTestBlockstateMatch,
  'minecraft:blockstate_match': JsonRuleTestBlockstateMatch,
  'height_match': JsonRuleTestHeightMatch,
  'minecraft:height_match': JsonRuleTestHeightMatch,
  'not': JsonRuleTestNot,
  'minecraft:not': JsonRuleTestNot,
  'random_block_match': JsonRuleTestRandomBlockMatch,
  'minecraft:random_block_match': JsonRuleTestRandomBlockMatch,
  'random_blockstate_match': JsonRuleTestRandomBlockstateMatch,
  'minecraft:random_blockstate_match': JsonRuleTestRandomBlockstateMatch,
  'tag_match': JsonRuleTestTagMatch,
  'minecraft:tag_match': JsonRuleTestTagMatch,
}
type JsonRuleTestKeys = keyof JsonRuleTestDispatcherMap
type JsonRuleTestFallback = (
  | JsonRuleTestAllOf
  | JsonRuleTestAnyOf
  | JsonRuleTestBlockMatch
  | JsonRuleTestBlockstateMatch
  | JsonRuleTestHeightMatch
  | JsonRuleTestNot
  | JsonRuleTestRandomBlockMatch
  | JsonRuleTestRandomBlockstateMatch
  | JsonRuleTestTagMatch)
type JsonRuleTestAllOf = JsonCompositeMatch
type JsonRuleTestAnyOf = JsonCompositeMatch
type JsonRuleTestBlockMatch = JsonBlockMatch
type JsonRuleTestBlockstateMatch = JsonBlockStateMatch
type JsonRuleTestHeightMatch = JsonHeightMatch
type JsonRuleTestNot = JsonInvertedMatch
type JsonRuleTestRandomBlockMatch = JsonRandomBlockMatch
type JsonRuleTestRandomBlockstateMatch = JsonRandomBlockStateMatch
type JsonRuleTestTagMatch = JsonTagMatch
export type JsonSymbolRuleTest<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonRuleTestDispatcherMap
  : CASE extends 'keys' ? JsonRuleTestKeys : CASE extends '%fallback' ? JsonRuleTestFallback : never
type JsonTemplateProcessorDispatcherMap = {
  'block_age': JsonTemplateProcessorBlockAge,
  'minecraft:block_age': JsonTemplateProcessorBlockAge,
  'block_ignore': JsonTemplateProcessorBlockIgnore,
  'minecraft:block_ignore': JsonTemplateProcessorBlockIgnore,
  'block_rot': JsonTemplateProcessorBlockRot,
  'minecraft:block_rot': JsonTemplateProcessorBlockRot,
  'capped': JsonTemplateProcessorCapped,
  'minecraft:capped': JsonTemplateProcessorCapped,
  'gravity': JsonTemplateProcessorGravity,
  'minecraft:gravity': JsonTemplateProcessorGravity,
  'protected_blocks': JsonTemplateProcessorProtectedBlocks,
  'minecraft:protected_blocks': JsonTemplateProcessorProtectedBlocks,
  'rule': JsonTemplateProcessorRule,
  'minecraft:rule': JsonTemplateProcessorRule,
}
type JsonTemplateProcessorKeys = keyof JsonTemplateProcessorDispatcherMap
type JsonTemplateProcessorFallback = (
  | JsonTemplateProcessorBlockAge
  | JsonTemplateProcessorBlockIgnore
  | JsonTemplateProcessorBlockRot
  | JsonTemplateProcessorCapped
  | JsonTemplateProcessorGravity
  | JsonTemplateProcessorProtectedBlocks
  | JsonTemplateProcessorRule)
type JsonTemplateProcessorBlockAge = JsonBlockAge
type JsonTemplateProcessorBlockIgnore = JsonBlockIgnore
type JsonTemplateProcessorBlockRot = JsonBlockRot
type JsonTemplateProcessorCapped = JsonCapped
type JsonTemplateProcessorGravity = JsonGravity
type JsonTemplateProcessorProtectedBlocks = JsonProtectedBlocks
type JsonTemplateProcessorRule = JsonRule
export type JsonSymbolTemplateProcessor<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonTemplateProcessorDispatcherMap
  : CASE extends 'keys' ? JsonTemplateProcessorKeys : CASE extends '%fallback' ? JsonTemplateProcessorFallback : never
