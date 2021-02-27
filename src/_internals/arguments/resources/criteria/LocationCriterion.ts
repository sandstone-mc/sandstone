import type { LiteralUnion } from '@/generalTypes'
import type {
  BIOMES, BLOCKS, DIMENSION_TYPES, FLUIDS,
  STRUCTURES,
} from '@arguments'
import type { TagClass } from '@resources'
import type { NumberOrMinMax, PositionCriterion } from '.'

export type LocationCriterion = Partial<{
    /** The biome the entity is currently in. */
    biome: LiteralUnion<BIOMES>

    /* The block at the location. */
    block: Partial<{
        /** The block ID. */
        block: LiteralUnion<BLOCKS>

        /** The block Tag. */
        tag: string | TagClass<'blocks'>

        /** The block NBT. */
        nbt: string

        /**  A map of block property names to values. Test will fail if the block doesn't match. */
        state: Record<string, string | Omit<NumberOrMinMax, number>>
    }>

    /** The dimension the entity is currently in. */
    dimension: LiteralUnion<DIMENSION_TYPES>

    /** Name of a structure. */
    feature: LiteralUnion<STRUCTURES>

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
        fluid: LiteralUnion<FLUIDS>

        /** The fluid Tag. */
        tag: string | TagClass<'fluids'>

        /** A map of fluid property names to values. Test will fail if the fluid doesn't match. */
        state: Record<string, string | Omit<NumberOrMinMax, number>>
    }>

    /** The light at the location. : The light level of visible light is calculated using: `max(sky-darkening, block)`. */
    light: NumberOrMinMax

    /** The position of the location. */
    position: PositionCriterion

    /** True if the block is closely above a campfire or soul campfire. */
    smokey: boolean
}>
