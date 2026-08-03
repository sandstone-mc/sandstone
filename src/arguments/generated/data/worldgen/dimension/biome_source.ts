import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTDouble, NBTFloat, NBTInt, NBTList, NBTLong, TagClass } from 'sandstone'

export type BiomeNoiseEntry = {
  biome: Registry['minecraft:worldgen/biome'],
  parameters: ClimateParameters,
}

export type BiomeSource = NonNullable<({
  [S in Extract<Extract<Registry['minecraft:worldgen/biome_source'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolBiomeSource ? SymbolBiomeSource[S] : RootNBT))
}[Extract<Registry['minecraft:worldgen/biome_source'], string>])>

export type Checkerboard = {
  /**
   * Value:
   * Range: 0..62
   */
  scale?: NBTInt<{
    min: 0,
    max: 62,
  }>,
  biomes: (
      | Array<Registry['minecraft:worldgen/biome']> | (
        | Registry['minecraft:worldgen/biome']
        | `#${Registry['minecraft:tag/worldgen/biome']}`
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
export type ClimateParameter = (NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
}> | NBTList<NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
}>, {
  leftExclusive: false,
  rightExclusive: false,
  min: 2,
  max: 2,
}>)

export type ClimateParameters = {
  temperature: ClimateParameter,
  humidity: ClimateParameter,
  continentalness: ClimateParameter,
  erosion: ClimateParameter,
  weirdness: ClimateParameter,
  depth: ClimateParameter,
  /**
   * Value:
   * Range: 0..1
   */
  offset: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type DirectMultiNoise = {
  biomes: Array<{
    biome: Registry['minecraft:worldgen/biome'],
    parameters: ClimateParameters,
  }>,
}

export type Fixed = {
  biome: Registry['minecraft:worldgen/biome'],
}

export type MultiNoise = NonNullable<({
  [S in Extract<Extract<Registry['minecraft:worldgen/multi_noise_biome_source_parameter_list'], string>, string>]?: (MultiNoiseBase & {
    preset?: S,
  } & (S extends undefined
    ? SymbolMultiNoiseBiomeSource<'%none'> :
    (S extends keyof SymbolMultiNoiseBiomeSource
      ? SymbolMultiNoiseBiomeSource[S]
      : SymbolMultiNoiseBiomeSource<'%unknown'>)))
}[Extract<Registry['minecraft:worldgen/multi_noise_biome_source_parameter_list'], string>])>

export type MultiNoiseBase = Record<string, never>

export type MultiNoiseBiomeSourceParameterList = {
  /**
   * Value:
   *
   *  - Nether(`nether`)
   *  - Overworld(`overworld`)
   */
  preset: (MultiNoisePreset | `minecraft:${MultiNoisePreset}`),
}

export type MultiNoisePreset = ('nether' | 'overworld')

export type NoiseParameters = ({
  firstOctave: NBTInt,
  amplitudes: Array<(NBTDouble | number)>,
} & {
  /**
   * Value:
   * Range: -32..32
   */
  base_octave: NBTInt<{
    min: -32,
    max: 32,
  }>,
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
  octave_count?: NBTInt<{
    min: 1,
    max: 32,
  }>,
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
  amplitude_modifiers?: NBTList<(NBTDouble<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number), {
    rightExclusive: false,
  }>,
})

export type TheEnd = Record<string, never>

export type VanillaLayered = {
  seed: NBTLong,
  large_biomes?: boolean,
  legacy_biome_init_layer?: boolean,
}
type BiomeSourceDispatcherMap = {
  'checkerboard': BiomeSourceCheckerboard,
  'minecraft:checkerboard': BiomeSourceCheckerboard,
  'fixed': BiomeSourceFixed,
  'minecraft:fixed': BiomeSourceFixed,
  'multi_noise': BiomeSourceMultiNoise,
  'minecraft:multi_noise': BiomeSourceMultiNoise,
  'the_end': BiomeSourceTheEnd,
  'minecraft:the_end': BiomeSourceTheEnd,
}
type BiomeSourceKeys = keyof BiomeSourceDispatcherMap
type BiomeSourceFallback = (BiomeSourceCheckerboard | BiomeSourceFixed | BiomeSourceMultiNoise | BiomeSourceTheEnd)
type BiomeSourceCheckerboard = Checkerboard
type BiomeSourceFixed = Fixed
type BiomeSourceMultiNoise = MultiNoise
type BiomeSourceTheEnd = TheEnd
export type SymbolBiomeSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? BiomeSourceDispatcherMap
  : CASE extends 'keys' ? BiomeSourceKeys : CASE extends '%fallback' ? BiomeSourceFallback : never
type MultiNoiseBiomeSourceDispatcherMap = {}
type MultiNoiseBiomeSourceKeys = keyof MultiNoiseBiomeSourceDispatcherMap
type MultiNoiseBiomeSourceFallback = (MultiNoiseBiomeSourceFallbackType)
export type MultiNoiseBiomeSourceFallbackType = Record<string, never>
type MultiNoiseBiomeSourceNoneType = DirectMultiNoise
export type SymbolMultiNoiseBiomeSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? MultiNoiseBiomeSourceDispatcherMap
  : CASE extends 'keys'
    ? MultiNoiseBiomeSourceKeys
    : CASE extends '%fallback'
      ? MultiNoiseBiomeSourceFallback
      : CASE extends '%none'
        ? MultiNoiseBiomeSourceNoneType
        : CASE extends '%unknown' ? MultiNoiseBiomeSourceFallbackType : never
