import type { FloatProvider, HeightProvider, IntProvider } from 'sandstone/arguments/generated/data/worldgen.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt, TagClass } from 'sandstone'

export type CanyonConfig = (CarverConfigBase & {
  vertical_rotation: FloatProvider<NBTFloat>,
  shape: CanyonShape,
})

export type CanyonShape = {
  distance_factor: FloatProvider<NBTFloat>,
  thickness: FloatProvider<NBTFloat>,
  /**
   * Value:
   * Range: 0..
   */
  width_smoothness: NBTInt<{
    min: 0,
  }>,
  horizontal_radius_factor: FloatProvider<NBTFloat>,
  vertical_radius_default_factor: NBTFloat,
  vertical_radius_center_factor: NBTFloat,
  y_scale: FloatProvider<NBTFloat>,
}

export type CarverConfigBase = {
  /**
   * Value:
   * Range: 0..1
   */
  probability: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  y: HeightProvider,
}

export type CarverDebugSettings = {
  debug_mode?: boolean,
  air_state: BlockState,
  water_state: BlockState,
  lava_state: BlockState,
  barrier_state: BlockState,
}

export type CarverListRef = (
  | ConfiguredCarver | (
  Registry['minecraft:worldgen/carver'] | `#${string}:${string}` | TagClass<'worldgen/carver'>)
  | Array<(Registry['minecraft:worldgen/carver'] | ConfiguredCarver)>)

export type CarverRef = (ConfiguredCarver | Registry['minecraft:worldgen/carver'])

export type CaveConfig = (CarverConfigBase & {
  count: IntProvider<NBTInt<{
    min: 0,
  }>>,
  thickness: FloatProvider<NBTFloat<{
    leftExclusive: false,
    min: 0,
  }>>,
  /**
   * Defaults to `false`.
   */
  weird_thickness_bias?: boolean,
  room_vertical_radius_multiplier: FloatProvider<NBTFloat>,
  horizontal_radius_multiplier: FloatProvider<NBTFloat>,
  vertical_radius_multiplier: FloatProvider<NBTFloat>,
  /**
   * Defaults to constant 1.0
   */
  start_vertical_radiues_multiplier?: FloatProvider<NBTFloat>,
  floor_level: FloatProvider<NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }>>,
})

export type ConfiguredCarver = NonNullable<({
  [S in Extract<Extract<Registry['minecraft:worldgen/carver_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolCarverConfig ? SymbolCarverConfig[S] : RootNBT))
}[Extract<Registry['minecraft:worldgen/carver_type'], string>])>
type CarverConfigDispatcherMap = {
  'canyon': CarverConfigCanyon,
  'minecraft:canyon': CarverConfigCanyon,
  'cave': CarverConfigCave,
  'minecraft:cave': CarverConfigCave,
}
type CarverConfigKeys = keyof CarverConfigDispatcherMap
type CarverConfigFallback = (CarverConfigCanyon | CarverConfigCave)
type CarverConfigCanyon = CanyonConfig
type CarverConfigCave = CaveConfig
export type SymbolCarverConfig<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? CarverConfigDispatcherMap
  : CASE extends 'keys' ? CarverConfigKeys : CASE extends '%fallback' ? CarverConfigFallback : never
