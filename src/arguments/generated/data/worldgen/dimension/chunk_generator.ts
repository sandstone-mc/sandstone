import type { BiomeSource } from 'sandstone/arguments/generated/data/worldgen/dimension/biome_source.ts'
import type { NoiseGeneratorSettingsRef } from 'sandstone/arguments/generated/data/worldgen/noise_settings.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTInt, TagClass } from 'sandstone'

export type ChunkGenerator = NonNullable<({
  [S in Extract<Registry['minecraft:worldgen/chunk_generator'], string>]?: ({
    type: S
  } & (S extends keyof SymbolChunkGenerator ? SymbolChunkGenerator[S] : RootNBT));
}[Registry['minecraft:worldgen/chunk_generator']])>

export type Flat = {
  settings: FlatGeneratorSettings
}

export type FlatGeneratorLayer = {
  /**
   * Value:
   * Range: 0..4096
   */
  height: NBTInt<{
    min: 0
  }>
  block: Registry['minecraft:block']
}

export type FlatGeneratorSettings = {
  biome?: Registry['minecraft:worldgen/biome']
  lakes?: boolean
  features?: boolean
  layers: Array<FlatGeneratorLayer>
  structure_overrides?: (
      | Array<Registry['minecraft:worldgen/structure_set']> | (
      Registry['minecraft:worldgen/structure_set'] | `#${string}:${string}` | TagClass<'worldgen/structure_set'>))
}

export type Noise = {
  settings: NoiseGeneratorSettingsRef
  biome_source: BiomeSource
}
type ChunkGeneratorDispatcherMap = {
  'flat': ChunkGeneratorFlat
  'minecraft:flat': ChunkGeneratorFlat
  'noise': ChunkGeneratorNoise
  'minecraft:noise': ChunkGeneratorNoise
}
type ChunkGeneratorKeys = keyof ChunkGeneratorDispatcherMap
type ChunkGeneratorFallback = (ChunkGeneratorFlat | ChunkGeneratorNoise)
type ChunkGeneratorFlat = Flat
type ChunkGeneratorNoise = Noise
export type SymbolChunkGenerator<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? ChunkGeneratorDispatcherMap
  : CASE extends 'keys' ? ChunkGeneratorKeys : CASE extends '%fallback' ? ChunkGeneratorFallback : never
