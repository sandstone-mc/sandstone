import type { PlacedFeatureRef } from 'sandstone/arguments/generated/data/worldgen/feature/placement'
import type { ProcessorListRef } from 'sandstone/arguments/generated/data/worldgen/processor_list'
import type { LiquidSettings } from 'sandstone/arguments/generated/data/worldgen/structure'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { NBTInt } from 'sandstone'
import type { RootNBT } from 'sandstone/arguments/nbt'

export type Element = ({
  [S in Extract<Registry['minecraft:worldgen/structure_pool_element'], string>]?: ({
    element_type: S
  } & (S extends keyof SymbolTemplatePoolElement ? SymbolTemplatePoolElement[S] : RootNBT));
}[Registry['minecraft:worldgen/structure_pool_element']])

export type ElementBase = {
  /**
     * Value:
     *
     *  - Rigid(`rigid`)
     *  - TerrainMatching(`terrain_matching`)
     */
  projection: Projection
}

export type FeatureElement = (ElementBase & {
  feature: PlacedFeatureRef
})

export type ListElement = (ElementBase & {
  elements: Array<Element>
})

export type Projection = ('rigid' | 'terrain_matching')

export type SingleElement = (ElementBase & {
  location: Registry['minecraft:structure']
  processors: ProcessorListRef
  /**
     * Value:
     *
     *  - ApplyWaterlogging(`apply_waterlogging`)
     *  - IgnoreWaterlogging(`ignore_waterlogging`)
     */
  override_liquid_settings?: LiquidSettings
})

export type TemplatePool = ({
  name?: string
} & {
  fallback: Registry['minecraft:worldgen/template_pool']
  elements: Array<WeightedElement>
})

export type WeightedElement = {
  /**
     * Value:
     * Range: 1..150
     */
  weight: NBTInt<{
    min: 1
  }>
  element: Element
}
type TemplatePoolElementDispatcherMap = {
  'feature_pool_element': TemplatePoolElementFeaturePoolElement
  'minecraft:feature_pool_element': TemplatePoolElementFeaturePoolElement
  'legacy_single_pool_element': TemplatePoolElementLegacySinglePoolElement
  'minecraft:legacy_single_pool_element': TemplatePoolElementLegacySinglePoolElement
  'list_pool_element': TemplatePoolElementListPoolElement
  'minecraft:list_pool_element': TemplatePoolElementListPoolElement
  'single_pool_element': TemplatePoolElementSinglePoolElement
  'minecraft:single_pool_element': TemplatePoolElementSinglePoolElement
}
type TemplatePoolElementKeys = keyof TemplatePoolElementDispatcherMap
type TemplatePoolElementFallback = (
  | TemplatePoolElementFeaturePoolElement
  | TemplatePoolElementLegacySinglePoolElement
  | TemplatePoolElementListPoolElement
  | TemplatePoolElementSinglePoolElement)
type TemplatePoolElementFeaturePoolElement = FeatureElement
type TemplatePoolElementLegacySinglePoolElement = SingleElement
type TemplatePoolElementListPoolElement = ListElement
type TemplatePoolElementSinglePoolElement = SingleElement
export type SymbolTemplatePoolElement<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? TemplatePoolElementDispatcherMap
  : CASE extends 'keys' ? TemplatePoolElementKeys : CASE extends '%fallback' ? TemplatePoolElementFallback : never
