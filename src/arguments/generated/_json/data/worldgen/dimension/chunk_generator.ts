import type { JsonBiomeSource } from 'sandstone/arguments/generated/_json/data/worldgen/dimension/biome_source.ts'
import type {
  JsonNoiseGeneratorSettingsRef,
} from 'sandstone/arguments/generated/_json/data/worldgen/noise_settings.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTInt, TagClass } from 'sandstone'

export type JsonChunkGenerator = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/chunk_generator'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolChunkGenerator ? JsonSymbolChunkGenerator[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/chunk_generator'], string>])>

export type JsonFlat = {
  settings: JsonFlatGeneratorSettings,
}

export type JsonFlatGeneratorLayer = {
  /**
   * Value:
   * Range: 0..4096
   */
  height: (NBTInt<{
    min: 0,
  }> | number),
  block: JsonRegistry['minecraft:block'],
}

export type JsonFlatGeneratorSettings = {
  biome?: JsonRegistry['minecraft:worldgen/biome'],
  lakes?: boolean,
  features?: boolean,
  layers: Array<JsonFlatGeneratorLayer>,
  structure_overrides?: (
      | Array<JsonRegistry['minecraft:worldgen/structure_set']> | (
      JsonRegistry['minecraft:worldgen/structure_set'] | `#${string}:${string}` | TagClass<'worldgen/structure_set'>)),
}

export type JsonNoise = {
  settings: JsonNoiseGeneratorSettingsRef,
  biome_source: JsonBiomeSource,
}
type JsonChunkGeneratorDispatcherMap = {
  'flat': JsonChunkGeneratorFlat,
  'minecraft:flat': JsonChunkGeneratorFlat,
  'noise': JsonChunkGeneratorNoise,
  'minecraft:noise': JsonChunkGeneratorNoise,
}
type JsonChunkGeneratorKeys = keyof JsonChunkGeneratorDispatcherMap
type JsonChunkGeneratorFallback = (JsonChunkGeneratorFlat | JsonChunkGeneratorNoise)
type JsonChunkGeneratorFlat = JsonFlat
type JsonChunkGeneratorNoise = JsonNoise
export type JsonSymbolChunkGenerator<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonChunkGeneratorDispatcherMap
  : CASE extends 'keys' ? JsonChunkGeneratorKeys : CASE extends '%fallback' ? JsonChunkGeneratorFallback : never
