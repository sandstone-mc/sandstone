import { CommandNode } from 'sandstone/core/nodes'
import { arrayToArgsParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type {
  BLOCKS, Coordinates,
  ITEMS, MultiplePlayersArgument, PARTICLE_TYPES,
} from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'

// Particle command

export class ParticleCommandNode extends CommandNode {
  command = 'particle' as const
}

// This command is fucking hell

type ParticleCommandType<MACRO extends boolean> = (
  (
    /**
     * Creates particles.
     *
     * @param name Specifies the particle to create.
     *
     * @param pos Specifies the position at which to create the particle. If not specified, defaults to the position of the executor.
     *
     * @param delta
     * Specifies the size of the 3-dimensional cuboid volume to spawn particles in, centered on position `pos`, and multiplied by about 8 (using 1 1 1 specifies a cuboid of about 8×8×8 in size).
     * Negative values may be used, but have the same effect as their positive counterparts (using -1 -1 -1 still equates to an 8×8×8 cuboid).
     *
     * Note that the generated particles aren't evenly distributed over the cuboid, instead it uses a Gaussian distribution resulting in a particle-gradient most dense at the center.
     * Tilde and caret notation may be used, the resulting coordinates are then used as delta.
     *
     * - Exception 1: When `name` is entity_effect or ambient_entity_effect, a `count` of 0 causes the `delta` and `speed` to act like RGBE values instead, ranging from 0.0 to 1.0.
     *   The three `delta` values give red, green, and blue components for the color; the `speed` provides an exponent that makes the colors brighter or dimmer, with 128 being a default.
     * - Exception 2: When `count` is set to 0, the `delta` instead acts as motion values for the particle, with `speed` acting as a multiplier.
     *   `dx`, `dy` and `dz` instead becomes `motion:x`, `motion:y` and `motion:z` respectively. Particles that don't have any motion to begin with are not affected by this (Example: barrier).
     * - Exception 3: When `name` is note, a `count` of 0 causes `dx` to act as a color modifier, with `speed` acting as a multiplier.
     *   Starts at green with the hue moving backward as this increments.
     *
     * @param speed Specifies the speed of the particle. Does not work on all particles (Example: `angry_villager`).
     *
     * @param count Specifies the number of particle effects to create. If 0, it results in a single particle.
     * See the exceptions on `delta` for why having a <count> of 0 can be useful.
     *
     * @param mode Specifies the display mode: `normal` or `force`.
     * Setting `force` allows the particle(s) to be seen up to 256 blocks away and by players that use the minimal particles setting.
     *
     * @param viewers Allows control of which player should view this particle instead of everyone in the viewing range of the particle.
     */
    (
      name: Macroable<Exclude<PARTICLE_TYPES, 'minecraft:dust' | 'minecraft:block' | 'minecraft:falling_dust' | 'minecraft:item'>, MACRO>,
      pos?: Macroable<Coordinates<MACRO>, MACRO>,
      delta?: Macroable<[deltaX: Macroable<number, MACRO>, deltaY: Macroable<number, MACRO>, deltaZ: Macroable<number, MACRO>], MACRO>,
      speed?: Macroable<number, MACRO>,
      count?: Macroable<number, MACRO>,
      mode?: Macroable<'force' | 'normal', MACRO>,
      viewers?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>
    ) => void) & (

    /**
     * Creates dust particles.
     *
     * @param name Specifies the particle to create.
     *
     * @param colors The three color channel parameters, representing red, green, and blue, each being a value in the range 0 to 1. For example, `[1.0, 0.5, 0.5]` creates a pink particle.
     *
     * If one or more values are greater than 1, the particles change their colors. The greater the values the greater is the range of different colors.
     *
     * @param size The size of the dust particle.
     *
     * @param pos Specifies the position at which to create the particle. If not specified, defaults to the position of the executor.
     *
     * @param delta
     * Specifies the size of the 3-dimensional cuboid volume to spawn particles in, centered on position `pos`, and multiplied by about 8 (using 1 1 1 specifies a cuboid of about 8×8×8 in size).
     * Negative values may be used, but have the same effect as their positive counterparts (using -1 -1 -1 still equates to an 8×8×8 cuboid).
     *
     * Note that the generated particles aren't evenly distributed over the cuboid, instead it uses a Gaussian distribution resulting in a particle-gradient most dense at the center.
     * Tilde and caret notation may be used, the resulting coordinates are then used as delta.
     *
     * - Exception 1: When `name` is entity_effect or ambient_entity_effect, a `count` of 0 causes the `delta` and `speed` to act like RGBE values instead, ranging from 0.0 to 1.0.
     *   The three `delta` values give red, green, and blue components for the color; the `speed` provides an exponent that makes the colors brighter or dimmer, with 128 being a default.
     * - Exception 2: When `count` is set to 0, the `delta` instead acts as motion values for the particle, with `speed` acting as a multiplier.
     *   `dx`, `dy` and `dz` instead becomes `motion:x`, `motion:y` and `motion:z` respectively. Particles that don't have any motion to begin with are not affected by this (Example: barrier).
     * - Exception 3: When `name` is note, a `count` of 0 causes `dx` to act as a color modifier, with `speed` acting as a multiplier.
     *   Starts at green with the hue moving backward as this increments.
     *
     * @param speed Specifies the speed of the particle. Does not work on all particles (Example: `angry_villager`).
     *
     * @param count Specifies the number of particle effects to create. If 0, it results in a single particle.
     * See the exceptions on `delta` for why having a <count> of 0 can be useful.
     *
     * @param mode Specifies the display mode: `normal` or `force`.
     * Setting `force` allows the particle(s) to be seen up to 256 blocks away and by players that use the minimal particles setting.
     *
     * @param viewers Allows control of which player should view this particle instead of everyone in the viewing range of the particle.
     */
    (
      name: 'minecraft:dust',
      colors: Macroable<[red: Macroable<number, MACRO>, green: Macroable<number, MACRO>, blue: Macroable<number, MACRO>, size: Macroable<number, MACRO>], MACRO>,
      size: Macroable<number, MACRO>,
      pos?: Macroable<Coordinates<MACRO>, MACRO>,
      delta?: Macroable<[deltaX: Macroable<number, MACRO>, deltaY: Macroable<number, MACRO>, deltaZ: Macroable<number, MACRO>], MACRO>,
      speed?: Macroable<number, MACRO>,
      count?: Macroable<number, MACRO>,
      mode?: Macroable<'force' | 'normal', MACRO>,
      viewers?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>
    ) => void) & (

    /**
     * Creates block or falling dust particles.
     *
     * @param name Specifies the particle to create.
     *
     * @param block Specifies the block from which the particle will take the texture. Can specify a block state.
     * For example, `minecraft:grass_block[snowy=true]`.
     *
     * @param pos Specifies the position at which to create the particle. If not specified, defaults to the position of the executor.
     *
     * @param delta
     * Specifies the size of the 3-dimensional cuboid volume to spawn particles in, centered on position `pos`, and multiplied by about 8 (using 1 1 1 specifies a cuboid of about 8×8×8 in size).
     * Negative values may be used, but have the same effect as their positive counterparts (using -1 -1 -1 still equates to an 8×8×8 cuboid).
     *
     * Note that the generated particles aren't evenly distributed over the cuboid, instead it uses a Gaussian distribution resulting in a particle-gradient most dense at the center.
     * Tilde and caret notation may be used, the resulting coordinates are then used as delta.
     *
     * - Exception 1: When `name` is entity_effect or ambient_entity_effect, a `count` of 0 causes the `delta` and `speed` to act like RGBE values instead, ranging from 0.0 to 1.0.
     *   The three `delta` values give red, green, and blue components for the color; the `speed` provides an exponent that makes the colors brighter or dimmer, with 128 being a default.
     * - Exception 2: When `count` is set to 0, the `delta` instead acts as motion values for the particle, with `speed` acting as a multiplier.
     *   `dx`, `dy` and `dz` instead becomes `motion:x`, `motion:y` and `motion:z` respectively. Particles that don't have any motion to begin with are not affected by this (Example: barrier).
     * - Exception 3: When `name` is note, a `count` of 0 causes `dx` to act as a color modifier, with `speed` acting as a multiplier.
     *   Starts at green with the hue moving backward as this increments.
     *
     * @param speed Specifies the speed of the particle. Does not work on all particles (Example: `angry_villager`).
     *
     * @param count Specifies the number of particle effects to create. If 0, it results in a single particle.
     * See the exceptions on `delta` for why having a <count> of 0 can be useful.
     *
     * @param mode Specifies the display mode: `normal` or `force`.
     * Setting `force` allows the particle(s) to be seen up to 256 blocks away and by players that use the minimal particles setting.
     *
     * @param viewers Allows control of which player should view this particle instead of everyone in the viewing range of the particle.
     */
    (
      name: Macroable<'minecraft:block' | 'minecraft:falling_dust', MACRO>,
      block: Macroable<LiteralUnion<BLOCKS>, MACRO>,
      pos?: Macroable<Coordinates<MACRO>, MACRO>,
      delta?: Macroable<[deltaX: Macroable<number, MACRO>, deltaY: Macroable<number, MACRO>, deltaZ: Macroable<number, MACRO>], MACRO>,
      speed?: Macroable<number, MACRO>,
      count?: Macroable<number, MACRO>,
      mode?: Macroable<'force' | 'normal', MACRO>,
      viewers?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>
    ) => void) & (

    /**
     * Creates item particles.
     *
     * @param name Specifies the particle to create.
     *
     * @param item Specifies the item from which the particle will take the texture.
     *
     * @param pos Specifies the position at which to create the particle. If not specified, defaults to the position of the executor.
     *
     * @param delta
     * Specifies the size of the 3-dimensional cuboid volume to spawn particles in, centered on position `pos`, and multiplied by about 8 (using 1 1 1 specifies a cuboid of about 8×8×8 in size).
     * Negative values may be used, but have the same effect as their positive counterparts (using -1 -1 -1 still equates to an 8×8×8 cuboid).
     *
     * Note that the generated particles aren't evenly distributed over the cuboid, instead it uses a Gaussian distribution resulting in a particle-gradient most dense at the center.
     * Tilde and caret notation may be used, the resulting coordinates are then used as delta.
     *
     * - Exception 1: When `name` is entity_effect or ambient_entity_effect, a `count` of 0 causes the `delta` and `speed` to act like RGBE values instead, ranging from 0.0 to 1.0.
     *   The three `delta` values give red, green, and blue components for the color; the `speed` provides an exponent that makes the colors brighter or dimmer, with 128 being a default.
     * - Exception 2: When `count` is set to 0, the `delta` instead acts as motion values for the particle, with `speed` acting as a multiplier.
     *   `dx`, `dy` and `dz` instead becomes `motion:x`, `motion:y` and `motion:z` respectively. Particles that don't have any motion to begin with are not affected by this (Example: barrier).
     * - Exception 3: When `name` is note, a `count` of 0 causes `dx` to act as a color modifier, with `speed` acting as a multiplier.
     *   Starts at green with the hue moving backward as this increments.
     *
     * @param speed Specifies the speed of the particle. Does not work on all particles (Example: `angry_villager`).
     *
     * @param count Specifies the number of particle effects to create. If 0, it results in a single particle.
     * See the exceptions on `delta` for why having a <count> of 0 can be useful.
     *
     * @param mode Specifies the display mode: `normal` or `force`.
     * Setting `force` allows the particle(s) to be seen up to 256 blocks away and by players that use the minimal particles setting.
     *
     * @param viewers Allows control of which player should view this particle instead of everyone in the viewing range of the particle.
     */
    (
      name: 'minecraft:item',
      item: Macroable<LiteralUnion<ITEMS>, MACRO>,
      pos?: Macroable<Coordinates<MACRO>, MACRO>,
      delta?: Macroable<[deltaX: Macroable<number, MACRO>, deltaY: Macroable<number, MACRO>, deltaZ: Macroable<number, MACRO>], MACRO>,
      speed?: Macroable<number, MACRO>,
      count?: Macroable<number, MACRO>,
      mode?: Macroable<'force' | 'normal', MACRO>,
      viewers?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>
    ) => void)
)

export class ParticleCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ParticleCommandNode

  particle: ParticleCommandType<MACRO> = (...args: unknown[]) => this.finalCommand([
    args[0],
    arrayToArgsParser(args[1]),
    arrayToArgsParser(args[2]),
    arrayToArgsParser(args[3]),
    arrayToArgsParser(args[4]),
    ...args.slice(5),
  ])
}
