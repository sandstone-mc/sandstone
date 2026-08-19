import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTDouble, NBTFloat, NBTInt, NBTLong, TagClass } from 'sandstone'

export type JsonBiomeNoiseEntry = {
  biome: JsonRegistry['minecraft:worldgen/biome'],
  parameters: JsonClimateParameters,
}

export type JsonBiomeSource = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/biome_source'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolBiomeSource ? JsonSymbolBiomeSource[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/biome_source'], string>])>

export type JsonCheckerboard = {
  /**
   * Value:
   * Range: 0..62
   */
  scale?: (NBTInt<{
    min: 0,
    max: 62,
  }> | number),
  biomes: (
      | Array<JsonRegistry['minecraft:worldgen/biome']> | (
        | JsonRegistry['minecraft:worldgen/biome']
        | `#${JsonRegistry['minecraft:tag/worldgen/biome']}`
        | TagClass<'worldgen/biome'>)),
}

/**
 * *either*
 *
 * Range: -2..2
 *
 * *or*
 *
 * List length range: 2
 */
export type JsonClimateParameter = ((NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
}> | number) | JsonNBTList<(NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
}> | number), {
  leftExclusive: false,
  rightExclusive: false,
  min: 2,
  max: 2,
}>)

export type JsonClimateParameters = {
  temperature: JsonClimateParameter,
  humidity: JsonClimateParameter,
  continentalness: JsonClimateParameter,
  erosion: JsonClimateParameter,
  weirdness: JsonClimateParameter,
  depth: JsonClimateParameter,
  /**
   * Value:
   * Range: 0..1
   */
  offset: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonDirectMultiNoise = {
  biomes: Array<{
    biome: JsonRegistry['minecraft:worldgen/biome'],
    parameters: JsonClimateParameters,
  }>,
}

export type JsonFixed = {
  biome: JsonRegistry['minecraft:worldgen/biome'],
}

export type JsonMultiNoise = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/multi_noise_biome_source_parameter_list'], string>, string>]?: (JsonMultiNoiseBase & {
    preset?: S,
  } & (S extends undefined
    ? JsonSymbolMultiNoiseBiomeSource<'%none'> :
    (S extends keyof JsonSymbolMultiNoiseBiomeSource
      ? JsonSymbolMultiNoiseBiomeSource[S]
      : JsonSymbolMultiNoiseBiomeSource<'%unknown'>)))
}[Extract<JsonRegistry['minecraft:worldgen/multi_noise_biome_source_parameter_list'], string>])>

export type JsonMultiNoiseBase = Record<string, never>

export type JsonMultiNoiseBiomeSourceParameterList = {
  /**
   * Value:
   *
   *  - Nether(`nether`)
   *  - Overworld(`overworld`)
   */
  preset: (JsonMultiNoisePreset | `minecraft:${JsonMultiNoisePreset}`),
}

export type JsonMultiNoisePreset = ('nether' | 'overworld')

export type JsonNoiseParameters = {
  /**
   * Value:
   * Range: -32..32
   */
  base_octave: (NBTInt<{
    min: -32,
    max: 32,
  }> | number),
  /**
   * Defaults to 1.0.
   *
   * Value:
   * Range: 0..1000000
   */
  base_amplitude?: (NBTDouble<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Defaults to 1.
   *
   * Value:
   * Range: 1..32
   */
  octave_count?: (NBTInt<{
    min: 1,
    max: 32,
  }> | number),
  /**
   * Defaults to `true`.
   */
  normalize?: boolean,
  /**
   * When empty or not present, defaults to all 1.0. \
   * Otherwise, the size must match `octave_count`.
   *
   * Value:
   * List length range: ..32
   */
  amplitude_modifiers?: JsonNBTList<(NBTDouble<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number), {
    rightExclusive: false,
  }>,
}

export type JsonTheEnd = Record<string, never>

export type JsonVanillaLayered = {
  seed: (NBTLong | number),
  large_biomes?: boolean,
  legacy_biome_init_layer?: boolean,
}
type JsonBiomeSourceDispatcherMap = {
  'checkerboard': JsonBiomeSourceCheckerboard,
  'minecraft:checkerboard': JsonBiomeSourceCheckerboard,
  'fixed': JsonBiomeSourceFixed,
  'minecraft:fixed': JsonBiomeSourceFixed,
  'multi_noise': JsonBiomeSourceMultiNoise,
  'minecraft:multi_noise': JsonBiomeSourceMultiNoise,
  'the_end': JsonBiomeSourceTheEnd,
  'minecraft:the_end': JsonBiomeSourceTheEnd,
}
type JsonBiomeSourceKeys = keyof JsonBiomeSourceDispatcherMap
type JsonBiomeSourceFallback = (
  | JsonBiomeSourceCheckerboard
  | JsonBiomeSourceFixed
  | JsonBiomeSourceMultiNoise
  | JsonBiomeSourceTheEnd)
type JsonBiomeSourceCheckerboard = JsonCheckerboard
type JsonBiomeSourceFixed = JsonFixed
type JsonBiomeSourceMultiNoise = JsonMultiNoise
type JsonBiomeSourceTheEnd = JsonTheEnd
export type JsonSymbolBiomeSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonBiomeSourceDispatcherMap
  : CASE extends 'keys' ? JsonBiomeSourceKeys : CASE extends '%fallback' ? JsonBiomeSourceFallback : never
type JsonMultiNoiseBiomeSourceDispatcherMap = {}
type JsonMultiNoiseBiomeSourceKeys = keyof JsonMultiNoiseBiomeSourceDispatcherMap
type JsonMultiNoiseBiomeSourceFallback = (JsonMultiNoiseBiomeSourceFallbackType)
export type JsonMultiNoiseBiomeSourceFallbackType = Record<string, never>
type JsonMultiNoiseBiomeSourceNoneType = JsonDirectMultiNoise
export type JsonSymbolMultiNoiseBiomeSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMultiNoiseBiomeSourceDispatcherMap
  : CASE extends 'keys'
    ? JsonMultiNoiseBiomeSourceKeys
    : CASE extends '%fallback'
      ? JsonMultiNoiseBiomeSourceFallback
      : CASE extends '%none'
        ? JsonMultiNoiseBiomeSourceNoneType
        : CASE extends '%unknown' ? JsonMultiNoiseBiomeSourceFallbackType : never
