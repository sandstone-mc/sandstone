import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonNBTList, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type JsonConcentricRingsPlacement = {
  /**
   * Value:
   * Range: 0..1023
   */
  distance: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..1023
   */
  spread: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 1..4095
   */
  count: (NBTInt<{
    min: 1,
  }> | number),
  preferred_biomes: (
      | Array<JsonRegistry['minecraft:worldgen/biome']> | (
        | JsonRegistry['minecraft:worldgen/biome']
        | `#${JsonRegistry['minecraft:tag/worldgen/biome']}`
        | TagClass<'worldgen/biome'>)),
}

export type JsonExclusionZone = {
  other_set: JsonStructureSetRef,
  /**
   * Value:
   * Range: 1..16
   */
  chunk_count: (NBTInt<{
    min: 1,
    max: 16,
  }> | number),
}

export type JsonFrequencyReductionMethod = ('default' | 'legacy_type_1' | 'legacy_type_2' | 'legacy_type_3')

export type JsonRandomSpreadPlacement = {
  /**
   * Average distance in chunks between two structures of this type.
   *
   * Value:
   * Range: 0..4096
   */
  spacing: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Minimum distance in chunks between two structures of this type.
   *
   * Value:
   * Range: 0..4096
   */
  separation: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   *
   *  - Linear(`linear`)
   *  - Triangular(`triangular`)
   */
  spread_type?: JsonSpreadType,
}

export type JsonSpreadType = ('linear' | 'triangular')

export type JsonStructurePlacement = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/structure_placement'], string>, string>]?: ({
    type: S,
    /**
     * Value:
     * Range: 0..
     */
    salt: (NBTInt<{
      min: 0,
    }> | number),
    /**
     * Value:
     *
     *  - Default(`default`)
     *  - LegacyType1(`legacy_type_1`)
     *  - LegacyType2(`legacy_type_2`)
     *  - LegacyType3(`legacy_type_3`)
     */
    frequency_reduction_method?: JsonFrequencyReductionMethod,
    /**
     * Value:
     * Range: 0..1
     */
    frequency?: (NBTFloat<{
      leftExclusive: false,
      rightExclusive: false,
      min: 0,
      max: 1,
    }> | number),
    exclusion_zone?: JsonExclusionZone,
    /**
     * Value:
     * List length range: 3
     */
    locate_offset?: JsonNBTList<(NBTInt<{
      min: -16,
      max: 16,
    }> | number), {
      leftExclusive: false,
      rightExclusive: false,
      min: 3,
      max: 3,
    }>,
  } & (S extends keyof JsonSymbolStructurePlacement
    ? JsonSymbolStructurePlacement[S]
    : JsonSymbolStructurePlacement<'%unknown'>))
}[Extract<JsonRegistry['minecraft:worldgen/structure_placement'], string>])>

export type JsonStructureSet = {
  structures: Array<JsonStructureSetElement>,
  placement: JsonStructurePlacement,
}

export type JsonStructureSetElement = {
  structure: JsonRegistry['minecraft:worldgen/structure'],
  /**
   * Value:
   * Range: 1..
   */
  weight: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonStructureSetRef = (JsonRegistry['minecraft:worldgen/structure_set'] | JsonStructureSet)
type JsonStructurePlacementDispatcherMap = {
  'concentric_rings': JsonStructurePlacementConcentricRings,
  'minecraft:concentric_rings': JsonStructurePlacementConcentricRings,
  'random_spread': JsonStructurePlacementRandomSpread,
  'minecraft:random_spread': JsonStructurePlacementRandomSpread,
}
type JsonStructurePlacementKeys = keyof JsonStructurePlacementDispatcherMap
type JsonStructurePlacementFallback = (
  | JsonStructurePlacementConcentricRings
  | JsonStructurePlacementRandomSpread
  | JsonStructurePlacementFallbackType)
export type JsonStructurePlacementFallbackType = Record<string, never>
type JsonStructurePlacementConcentricRings = JsonConcentricRingsPlacement
type JsonStructurePlacementRandomSpread = JsonRandomSpreadPlacement
export type JsonSymbolStructurePlacement<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonStructurePlacementDispatcherMap
  : CASE extends 'keys'
    ? JsonStructurePlacementKeys
    : CASE extends '%fallback'
      ? JsonStructurePlacementFallback
      : CASE extends '%unknown' ? JsonStructurePlacementFallbackType : never
