import type { TagClass } from 'sandstone/core'
import type { NumberProvider, PositionCriterion } from '.'
import type { Registry } from 'sandstone/arguments/generated/registry'

export type LocationCriterion = Partial<{
  /** The biome the entity is currently in. */
  biome: Registry['minecraft:worldgen/biome']

  /* The block at the location. */
  block: Partial<{
    /** An array of block IDs. */
    blocks: Registry['minecraft:block'][]

    /** The block Tag. */
    tag: string | TagClass<'blocks'>

    /** The block NBT. */
    nbt: string

    /**  A map of block property names to values. Test will fail if the block doesn't match. */
    state: Record<string, string | Omit<NumberProvider, number>>
  }>

  /** The dimension the entity is currently in. */
  dimension: Registry['minecraft:dimension']

  /** Name of a structure. */
  structure: Registry['minecraft:structure']

  /**
   * The fluid at the location.
   *
   * Must be an object defining the fluid.
   *
   * @example
   * {
   *   fluid: {
   *     fluid: 'minecraft:lava'
   *   }
   * }
   *
   * {
   *   fluid: {
   *     tag: '#custom:fluids'
   *   }
   * }
   *
   */
  fluid: Partial<{
    /** The fluid ID. */
    fluid: Registry['minecraft:fluid']

    /** The fluid Tag. */
    tag: string | TagClass<'fluids'>

    /** A map of fluid property names to values. Test will fail if the fluid doesn't match. */
    state: Record<string, string | Omit<NumberProvider, number>>
  }>

  /** The light at the location. : The light level of visible light is calculated using: `max(sky-darkening, block)`. */
  light: NumberProvider

  /** The position of the location. */
  position: PositionCriterion

  /** True if the block is closely above a campfire or soul campfire. */
  smokey: boolean
}>
