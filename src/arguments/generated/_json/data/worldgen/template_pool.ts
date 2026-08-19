import type { JsonPlacedFeatureRef } from 'sandstone/arguments/generated/_json/data/worldgen/feature/placement.ts'
import type { JsonProcessorListRef } from 'sandstone/arguments/generated/_json/data/worldgen/processor_list.ts'
import type { JsonLiquidSettings } from 'sandstone/arguments/generated/_json/data/worldgen/structure.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTInt, StructureClass } from 'sandstone'

export type JsonElement = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/structure_pool_element'], string>, string>]?: ({
    element_type: S,
  } & (S extends keyof JsonSymbolTemplatePoolElement ? JsonSymbolTemplatePoolElement[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/structure_pool_element'], string>])>

export type JsonElementBase = {
  /**
   * Value:
   *
   *  - Rigid(`rigid`)
   *  - TerrainMatching(`terrain_matching`)
   */
  projection: JsonProjection,
}

export type JsonFeatureElement = (JsonElementBase & {
  feature: JsonPlacedFeatureRef,
})

export type JsonListElement = (JsonElementBase & {
  elements: Array<JsonElement>,
})

export type JsonProjection = ('rigid' | 'terrain_matching')

export type JsonSingleElement = (JsonElementBase & {
  location: (JsonRegistry['minecraft:structure'] | StructureClass),
  processors: JsonProcessorListRef,
  /**
   * Value:
   *
   *  - ApplyWaterlogging(`apply_waterlogging`)
   *  - IgnoreWaterlogging(`ignore_waterlogging`)
   */
  override_liquid_settings?: JsonLiquidSettings,
})

export type JsonTemplatePool = ({
  name?: string,
} & {
  fallback: JsonRegistry['minecraft:worldgen/template_pool'],
  elements: Array<JsonWeightedElement>,
})

export type JsonWeightedElement = {
  /**
   * Value:
   * Range: 1..150
   */
  weight: (NBTInt<{
    min: 1,
  }> | number),
  element: JsonElement,
}
type JsonTemplatePoolElementDispatcherMap = {
  'feature_pool_element': JsonTemplatePoolElementFeaturePoolElement,
  'minecraft:feature_pool_element': JsonTemplatePoolElementFeaturePoolElement,
  'legacy_single_pool_element': JsonTemplatePoolElementLegacySinglePoolElement,
  'minecraft:legacy_single_pool_element': JsonTemplatePoolElementLegacySinglePoolElement,
  'list_pool_element': JsonTemplatePoolElementListPoolElement,
  'minecraft:list_pool_element': JsonTemplatePoolElementListPoolElement,
  'single_pool_element': JsonTemplatePoolElementSinglePoolElement,
  'minecraft:single_pool_element': JsonTemplatePoolElementSinglePoolElement,
}
type JsonTemplatePoolElementKeys = keyof JsonTemplatePoolElementDispatcherMap
type JsonTemplatePoolElementFallback = (
  | JsonTemplatePoolElementFeaturePoolElement
  | JsonTemplatePoolElementLegacySinglePoolElement
  | JsonTemplatePoolElementListPoolElement
  | JsonTemplatePoolElementSinglePoolElement)
type JsonTemplatePoolElementFeaturePoolElement = JsonFeatureElement
type JsonTemplatePoolElementLegacySinglePoolElement = JsonSingleElement
type JsonTemplatePoolElementListPoolElement = JsonListElement
type JsonTemplatePoolElementSinglePoolElement = JsonSingleElement
export type JsonSymbolTemplatePoolElement<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonTemplatePoolElementDispatcherMap
  : CASE extends 'keys'
    ? JsonTemplatePoolElementKeys
    : CASE extends '%fallback' ? JsonTemplatePoolElementFallback : never
