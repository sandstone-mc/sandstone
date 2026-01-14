import type { FloatProvider, HeightProvider, VerticalAnchor } from 'sandstone/arguments/generated/data/worldgen'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state'
import type { NBTFloat, NBTInt, TagClass } from 'sandstone'
import type { RootNBT } from 'sandstone/arguments/nbt'

export type CanyonConfig = {
  vertical_rotation: FloatProvider<NBTFloat>
  shape: CanyonShape
}

export type CanyonShape = {
  distance_factor: FloatProvider<NBTFloat>
  thickness: FloatProvider<NBTFloat>
  /**
     * Value:
     * Range: 0..
     */
  width_smoothness: NBTInt<{
    min: 0
  }>
  horizontal_radius_factor: FloatProvider<NBTFloat>
  vertical_radius_default_factor: NBTFloat
  vertical_radius_center_factor: NBTFloat
}

export type CarverDebugSettings = {
  debug_mode?: boolean
  air_state: BlockState
  water_state: BlockState
  lava_state: BlockState
  barrier_state: BlockState
}

export type CarverRef = (Registry['minecraft:worldgen/configured_carver'] | ConfiguredCarver)

export type CaveConfig = {
  horizontal_radius_multiplier: FloatProvider<NBTFloat>
  vertical_radius_multiplier: FloatProvider<NBTFloat>
  floor_level: FloatProvider<NBTFloat<{
    leftExclusive: false
    rightExclusive: false
  }>>
}

export type ConfiguredCarver = ({
  [S in Extract<Registry['minecraft:worldgen/carver'], string>]?: {
    type: S
    config: ({
      /**
             * Value:
             * Range: 0..1
             */
      probability: NBTFloat<{
        leftExclusive: false
        rightExclusive: false
        min: 0
        max: 1
      }>
      replaceable?: (
              | Array<Registry['minecraft:block']> | (
              Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>))
    } & {
      y: HeightProvider
      yScale: FloatProvider<NBTFloat>
      lava_level: VerticalAnchor
      debug_settings?: CarverDebugSettings
    } & (S extends keyof SymbolCarverConfig ? SymbolCarverConfig[S] : RootNBT))
  };
}[Registry['minecraft:worldgen/carver']])
type CarverConfigDispatcherMap = {
  'canyon': CarverConfigCanyon
  'minecraft:canyon': CarverConfigCanyon
  'cave': CarverConfigCave
  'minecraft:cave': CarverConfigCave
  'nether_cave': CarverConfigNetherCave
  'minecraft:nether_cave': CarverConfigNetherCave
}
type CarverConfigKeys = keyof CarverConfigDispatcherMap
type CarverConfigFallback = (CarverConfigCanyon | CarverConfigCave | CarverConfigNetherCave)
type CarverConfigCanyon = CanyonConfig
type CarverConfigCave = CaveConfig
type CarverConfigNetherCave = CaveConfig
export type SymbolCarverConfig<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? CarverConfigDispatcherMap
  : CASE extends 'keys' ? CarverConfigKeys : CASE extends '%fallback' ? CarverConfigFallback : never
