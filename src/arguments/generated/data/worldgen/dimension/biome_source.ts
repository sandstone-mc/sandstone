import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { NBTDouble, NBTFloat, NBTInt, NBTList, NBTLong, TagClass } from 'sandstone'

export type BiomeSource = ({
    [S in Extract<Registry['minecraft:worldgen/biome_source'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:biome_source'>
        ? Dispatcher<'minecraft:biome_source'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:worldgen/biome_source']])

export type Checkerboard = {
    /**
     * Value:
     * Range: 0..62
     */
    scale?: NBTInt<{
        min: 0
        max: 62
    }>
    biomes: (
      | Array<Registry['minecraft:worldgen/biome']> | (
        | Registry['minecraft:worldgen/biome']
        | `#${Registry['minecraft:tag/worldgen/biome']}`
        | TagClass<'worldgen/biome'>))
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
    leftExclusive: false
    rightExclusive: false
}> | NBTList<NBTFloat<{
    leftExclusive: false
    rightExclusive: false
}>, {
    leftExclusive: false
    rightExclusive: false
    min: 2
    max: 2
}>)

export type ClimateParameters = {
    temperature: ClimateParameter
    humidity: ClimateParameter
    continentalness: ClimateParameter
    erosion: ClimateParameter
    weirdness: ClimateParameter
    depth: ClimateParameter
    /**
     * Value:
     * Range: 0..1
     */
    offset: NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 1
    }>
}

export type DirectMultiNoise = {
    biomes: Array<{
        biome: Registry['minecraft:worldgen/biome']
        parameters: ClimateParameters
    }>
}

export type Fixed = {
    biome: Registry['minecraft:worldgen/biome']
}

export type MultiNoise = ({
    [S in Extract<Registry['minecraft:worldgen/multi_noise_biome_source_parameter_list'], string>]?: (MultiNoiseBase & {
        preset?: S
    } & (S extends undefined ? Dispatcher<'minecraft:multi_noise_biome_source', [
        '%none',
    ]> : (S extends keyof Dispatcher<'minecraft:multi_noise_biome_source'>
        ? Dispatcher<'minecraft:multi_noise_biome_source'>[S]
        : Record<string, unknown>)));
}[Registry['minecraft:worldgen/multi_noise_biome_source_parameter_list']])

export type MultiNoiseBase = Record<string, never>

export type MultiNoiseBiomeSourceParameterList = {
    /**
     * Value:
     *
     *  - Nether(`nether`)
     *  - Overworld(`overworld`)
     */
    preset: (MultiNoisePreset | `minecraft:${MultiNoisePreset}`)
}

export type MultiNoisePreset = ('nether' | 'overworld')

export type NoiseParameters = {
    firstOctave: NBTInt
    amplitudes: Array<(NBTDouble | number)>
}

export type TheEnd = Record<string, never>

export type VanillaLayered = {
    seed: NBTLong
    large_biomes?: boolean
    legacy_biome_init_layer?: boolean
}
type BiomeSourceDispatcherMap = {
    'checkerboard': BiomeSourceCheckerboard
    'minecraft:checkerboard': BiomeSourceCheckerboard
    'fixed': BiomeSourceFixed
    'minecraft:fixed': BiomeSourceFixed
    'multi_noise': BiomeSourceMultiNoise
    'minecraft:multi_noise': BiomeSourceMultiNoise
    'the_end': BiomeSourceTheEnd
    'minecraft:the_end': BiomeSourceTheEnd
    'vanilla_layered': BiomeSourceVanillaLayered
    'minecraft:vanilla_layered': BiomeSourceVanillaLayered
}
type BiomeSourceKeys = keyof BiomeSourceDispatcherMap
type BiomeSourceFallback = (
  | BiomeSourceCheckerboard
  | BiomeSourceFixed
  | BiomeSourceMultiNoise
  | BiomeSourceTheEnd
  | BiomeSourceVanillaLayered)
type BiomeSourceCheckerboard = Checkerboard
type BiomeSourceFixed = Fixed
type BiomeSourceMultiNoise = MultiNoise
type BiomeSourceTheEnd = TheEnd
type BiomeSourceVanillaLayered = VanillaLayered
export type SymbolBiomeSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? BiomeSourceDispatcherMap
    : CASE extends 'keys' ? BiomeSourceKeys : CASE extends '%fallback' ? BiomeSourceFallback : never
type MultiNoiseBiomeSourceDispatcherMap = {}
type MultiNoiseBiomeSourceKeys = keyof MultiNoiseBiomeSourceDispatcherMap
type MultiNoiseBiomeSourceFallback = (MultiNoiseBiomeSourceFallbackType)
type MultiNoiseBiomeSourceFallbackType = Record<string, never>
type MultiNoiseBiomeSourceNoneType = DirectMultiNoise
export type SymbolMultiNoiseBiomeSource<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
    ? MultiNoiseBiomeSourceDispatcherMap
    : CASE extends 'keys'
        ? MultiNoiseBiomeSourceKeys
        : CASE extends '%fallback'
            ? MultiNoiseBiomeSourceFallback
            : CASE extends '%none' ? MultiNoiseBiomeSourceNoneType : never
