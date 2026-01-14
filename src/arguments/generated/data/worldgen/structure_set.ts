import type { Registry } from 'sandstone/arguments/generated/registry'
import type { NBTFloat, NBTInt, NBTList, TagClass } from 'sandstone'
import type { RootNBT } from 'sandstone/arguments/nbt'

export type ConcentricRingsPlacement = {
  /**
     * Value:
     * Range: 0..1023
     */
  distance: NBTInt<{
    min: 0
  }>
  /**
     * Value:
     * Range: 0..1023
     */
  spread: NBTInt<{
    min: 0
  }>
  /**
     * Value:
     * Range: 1..4095
     */
  count: NBTInt<{
    min: 1
  }>
  preferred_biomes: (
      | Array<Registry['minecraft:worldgen/biome']> | (
        | Registry['minecraft:worldgen/biome']
        | `#${Registry['minecraft:tag/worldgen/biome']}`
        | TagClass<'worldgen/biome'>))
}

export type ExclusionZone = {
  other_set: StructureSetRef
  /**
     * Value:
     * Range: 1..16
     */
  chunk_count: NBTInt<{
    min: 1
    max: 16
  }>
}

export type FrequencyReductionMethod = ('default' | 'legacy_type_1' | 'legacy_type_2' | 'legacy_type_3')

export type RandomSpreadPlacement = {
  /**
     * Average distance in chunks between two structures of this type.
     *
     * Value:
     * Range: 0..4096
     */
  spacing: NBTInt<{
    min: 0
  }>
  /**
     * Minimum distance in chunks between two structures of this type.
     *
     * Value:
     * Range: 0..4096
     */
  separation: NBTInt<{
    min: 0
  }>
  /**
     * Value:
     *
     *  - Linear(`linear`)
     *  - Triangular(`triangular`)
     */
  spread_type?: SpreadType
}

export type SpreadType = ('linear' | 'triangular')

export type StructurePlacement = ({
  [S in Extract<Registry['minecraft:worldgen/structure_placement'], string>]?: ({
    type: S
    /**
         * Value:
         * Range: 0..
         */
    salt: NBTInt<{
      min: 0
    }>
    /**
         * Value:
         *
         *  - Default(`default`)
         *  - LegacyType1(`legacy_type_1`)
         *  - LegacyType2(`legacy_type_2`)
         *  - LegacyType3(`legacy_type_3`)
         */
    frequency_reduction_method?: FrequencyReductionMethod
    /**
         * Value:
         * Range: 0..1
         */
    frequency?: NBTFloat<{
      leftExclusive: false
      rightExclusive: false
      min: 0
      max: 1
    }>
    exclusion_zone?: ExclusionZone
    /**
         * Value:
         * List length range: 3
         */
    locate_offset?: NBTList<NBTInt<{
      min: -16
      max: 16
    }>, {
      leftExclusive: false
      rightExclusive: false
      min: 3
      max: 3
    }>
  } & (S extends keyof SymbolStructurePlacement ? SymbolStructurePlacement[S] : RootNBT));
}[Registry['minecraft:worldgen/structure_placement']])

export type StructureSet = {
  structures: Array<StructureSetElement>
  placement: StructurePlacement
}

export type StructureSetElement = {
  structure: Registry['minecraft:worldgen/structure']
  /**
     * Value:
     * Range: 1..
     */
  weight: NBTInt<{
    min: 1
  }>
}

export type StructureSetRef = (Registry['minecraft:worldgen/structure_set'] | StructureSet)
type StructurePlacementDispatcherMap = {
  'concentric_rings': StructurePlacementConcentricRings
  'minecraft:concentric_rings': StructurePlacementConcentricRings
  'random_spread': StructurePlacementRandomSpread
  'minecraft:random_spread': StructurePlacementRandomSpread
}
type StructurePlacementKeys = keyof StructurePlacementDispatcherMap
type StructurePlacementFallback = (StructurePlacementConcentricRings | StructurePlacementRandomSpread)
type StructurePlacementConcentricRings = ConcentricRingsPlacement
type StructurePlacementRandomSpread = RandomSpreadPlacement
export type SymbolStructurePlacement<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? StructurePlacementDispatcherMap
  : CASE extends 'keys' ? StructurePlacementKeys : CASE extends '%fallback' ? StructurePlacementFallback : never
