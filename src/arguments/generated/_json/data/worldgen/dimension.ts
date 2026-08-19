import type { JsonGlobalEnvironmentAttributeMap } from 'sandstone/arguments/generated/_json/data/worldgen/attribute.ts'
import type {
  JsonChunkGenerator,
} from 'sandstone/arguments/generated/_json/data/worldgen/dimension/chunk_generator.ts'
import type { JsonIntProvider } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { NBTDouble, NBTFloat, NBTInt, TagClass, TimelineClass, WorldClockClass } from 'sandstone'

export type JsonCardinalLightType = ('default' | 'nether')

export type JsonDimension = {
  type: JsonDimensionTypeRef,
  generator: JsonChunkGenerator,
}

export type JsonDimensionType = {
  attributes?: JsonGlobalEnvironmentAttributeMap,
  default_clock?: (JsonRegistry['minecraft:world_clock'] | WorldClockClass),
  timelines?: ((
        | JsonRegistry['minecraft:timeline']
        | `#${JsonRegistry['minecraft:tag/timeline']}`
        | TagClass<'timeline'>
        | TimelineClass)
      | Array<(JsonRegistry['minecraft:timeline'] | TimelineClass)>),
  /**
   * Affects the weather, lighting engine and respawning rules.
   */
  has_skylight: boolean,
  /**
   * Affects the weather, map items and respawning rules.
   */
  has_ceiling: boolean,
  has_ender_dragon_fight: boolean,
  /**
   * Value:
   * Range: 0.00001..30000000
   */
  coordinate_scale: (NBTDouble<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  ambient_light: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  /**
   * Defaults to `false`.
   */
  has_fixed_time?: boolean,
  /**
   * Portals can't spawn and chorus fruit can't teleport players above this height.
   *
   * Value:
   * Range: 0..4064
   */
  logical_height: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Skybox type.
   * Defaults to `overworld`.
   *
   * Value:
   *
   *  - None(`none`)
   *  - Overworld(`overworld`)
   *  - End(`end`)
   */
  skybox?: JsonSkyboxType,
  /**
   * The direction of cardinal lighting that affects blocks.
   *
   * Value:
   *
   *  - Default(`default`)
   *  - Nether(`nether`)
   */
  cardinal_light?: JsonCardinalLightType,
  /**
   * Defining what blocks keep fire infinitely burning.
   */
  infiniburn: ((
      | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
      | Array<JsonRegistry['minecraft:block']>),
  /**
   * The minimum height in which blocks can exist.
   *
   * Value:
   * Range: -2032..2031
   */
  min_y: (NBTInt<{}> | number),
  /**
   * The total height in which blocks can exist. Max Y = Min Y + Height.
   *
   * Value:
   * Range: 16..4064
   */
  height: (NBTInt<{
    min: 1,
  }> | number),
  monster_spawn_light_level: JsonIntProvider<(NBTInt<{
    min: 0,
    max: 15,
  }> | number)>,
  /**
   * Value:
   * Range: 0..15
   */
  monster_spawn_block_light_limit: (NBTInt<{
    min: 0,
    max: 15,
  }> | number),
}

export type JsonDimensionTypeEffects = ('overworld' | 'the_nether' | 'the_end')

export type JsonDimensionTypeRef = JsonRegistry['minecraft:dimension_type']

export type JsonSkyboxType = ('none' | 'overworld' | 'end')
