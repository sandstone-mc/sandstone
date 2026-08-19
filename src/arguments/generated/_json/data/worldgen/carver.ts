import type {
  JsonFloatProvider,
  JsonHeightProvider,
  JsonIntProvider,
} from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt, TagClass } from 'sandstone'

export type JsonCanyonConfig = (JsonCarverConfigBase & {
  vertical_rotation: JsonFloatProvider<(NBTFloat | number)>,
  shape: JsonCanyonShape,
})

export type JsonCanyonShape = {
  distance_factor: JsonFloatProvider<(NBTFloat | number)>,
  thickness: JsonFloatProvider<(NBTFloat | number)>,
  /**
   * Value:
   * Range: 0..
   */
  width_smoothness: (NBTInt<{
    min: 0,
  }> | number),
  horizontal_radius_factor: JsonFloatProvider<(NBTFloat | number)>,
  vertical_radius_default_factor: (NBTFloat | number),
  vertical_radius_center_factor: (NBTFloat | number),
  y_scale: JsonFloatProvider<(NBTFloat | number)>,
}

export type JsonCarverConfigBase = {
  /**
   * Value:
   * Range: 0..1
   */
  probability: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  y: JsonHeightProvider,
}

export type JsonCarverDebugSettings = {
  debug_mode?: boolean,
  air_state: JsonBlockState,
  water_state: JsonBlockState,
  lava_state: JsonBlockState,
  barrier_state: JsonBlockState,
}

export type JsonCarverListRef = (
  | JsonConfiguredCarver | (
  JsonRegistry['minecraft:worldgen/carver'] | `#${string}:${string}` | TagClass<'worldgen/carver'>)
  | Array<(JsonRegistry['minecraft:worldgen/carver'] | JsonConfiguredCarver)>)

export type JsonCarverRef = (JsonConfiguredCarver | JsonRegistry['minecraft:worldgen/carver'])

export type JsonCaveConfig = (JsonCarverConfigBase & {
  count: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
  thickness: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    min: 0,
  }> | number)>,
  /**
   * Defaults to `false`.
   */
  weird_thickness_bias?: boolean,
  room_vertical_radius_multiplier: JsonFloatProvider<(NBTFloat | number)>,
  horizontal_radius_multiplier: JsonFloatProvider<(NBTFloat | number)>,
  vertical_radius_multiplier: JsonFloatProvider<(NBTFloat | number)>,
  /**
   * Defaults to constant 1.0
   */
  start_vertical_radiues_multiplier?: JsonFloatProvider<(NBTFloat | number)>,
  floor_level: JsonFloatProvider<(NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
  }> | number)>,
})

export type JsonConfiguredCarver = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/carver_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolCarverConfig ? JsonSymbolCarverConfig[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/carver_type'], string>])>
type JsonCarverConfigDispatcherMap = {
  'canyon': JsonCarverConfigCanyon,
  'minecraft:canyon': JsonCarverConfigCanyon,
  'cave': JsonCarverConfigCave,
  'minecraft:cave': JsonCarverConfigCave,
}
type JsonCarverConfigKeys = keyof JsonCarverConfigDispatcherMap
type JsonCarverConfigFallback = (JsonCarverConfigCanyon | JsonCarverConfigCave)
type JsonCarverConfigCanyon = JsonCanyonConfig
type JsonCarverConfigCave = JsonCaveConfig
export type JsonSymbolCarverConfig<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonCarverConfigDispatcherMap
  : CASE extends 'keys' ? JsonCarverConfigKeys : CASE extends '%fallback' ? JsonCarverConfigFallback : never
