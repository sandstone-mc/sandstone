import type { GlobalEnvironmentAttributeMap } from 'sandstone/arguments/generated/data/worldgen/attribute.ts'
import type { ChunkGenerator } from 'sandstone/arguments/generated/data/worldgen/dimension/chunk_generator.ts'
import type { IntProvider } from 'sandstone/arguments/generated/data/worldgen.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NBTDouble, NBTFloat, NBTInt, TagClass, TimelineClass, WorldClockClass } from 'sandstone'

export type CardinalLightType = ('default' | 'nether')

export type Dimension = {
  type: DimensionTypeRef,
  generator: ChunkGenerator,
}

export type DimensionType = {
  attributes?: GlobalEnvironmentAttributeMap,
  default_clock?: (Registry['minecraft:world_clock'] | WorldClockClass),
  timelines?: ((
        | Registry['minecraft:timeline']
        | `#${Registry['minecraft:tag/timeline']}`
        | TagClass<'timeline'>
        | TimelineClass)
      | Array<(Registry['minecraft:timeline'] | TimelineClass)>),
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
  ambient_light: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
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
  logical_height: NBTInt<{
    min: 0,
  }>,
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
  skybox?: SkyboxType,
  /**
   * The direction of cardinal lighting that affects blocks.
   *
   * Value:
   *
   *  - Default(`default`)
   *  - Nether(`nether`)
   */
  cardinal_light?: CardinalLightType,
  /**
   * Block tag defining what blocks keep fire infinitely burning.
   */
  infiniburn: (`#${Registry['minecraft:tag/block']}` | TagClass<'block'>),
  /**
   * The minimum height in which blocks can exist.
   *
   * Value:
   * Range: -2032..2031
   */
  min_y: NBTInt<{}>,
  /**
   * The total height in which blocks can exist. Max Y = Min Y + Height.
   *
   * Value:
   * Range: 16..4064
   */
  height: NBTInt<{
    min: 1,
  }>,
  monster_spawn_light_level: IntProvider<NBTInt<{
    min: 0,
    max: 15,
  }>>,
  /**
   * Value:
   * Range: 0..15
   */
  monster_spawn_block_light_limit: NBTInt<{
    min: 0,
    max: 15,
  }>,
}

export type DimensionTypeEffects = ('overworld' | 'the_nether' | 'the_end')

export type DimensionTypeRef = Registry['minecraft:dimension_type']

export type SkyboxType = ('none' | 'overworld' | 'end')
