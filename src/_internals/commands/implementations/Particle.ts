/* eslint-disable no-restricted-globals */
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { arrayToArgsParser } from '@variables'

import type { LiteralUnion } from '@/generalTypes'
import type {
  BLOCKS, Coordinates, ITEMS, MultiplePlayersArgument, PARTICLE_TYPES,
} from '@arguments'

// This command is fucking hell

type ParticleCommand = (
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
      name: Exclude<PARTICLE_TYPES, 'minecraft:dust' | 'minecraft:block' | 'minecraft:falling_dust' | 'minecraft:item'>,
      pos?: Coordinates,
      delta?: [deltaX: number, deltaY: number, deltaZ: number],
      speed?: number,
      count?: number,
      mode?: 'force' | 'normal',
      viewers?: MultiplePlayersArgument
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
      colors: [red: number, green: number, blue: number, size: number],
      pos?: Coordinates,
      delta?: [deltaX: number, deltaY: number, deltaZ: number],
      speed?: number,
      count?: number,
      mode?: 'force' | 'normal',
      viewers?: MultiplePlayersArgument
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
      name: 'minecraft:block' | 'minecraft:falling_dust',
      block: LiteralUnion<BLOCKS>,
      pos?: Coordinates,
      delta?: [deltaX: number, deltaY: number, deltaZ: number],
      speed?: number,
      count?: number,
      mode?: 'force' | 'normal',
      viewers?: MultiplePlayersArgument
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
      item: LiteralUnion<ITEMS>,
      pos?: Coordinates,
      delta?: [deltaX: number, deltaY: number, deltaZ: number],
      speed?: number,
      count?: number,
      mode?: 'force' | 'normal',
      viewers?: MultiplePlayersArgument
    ) => void)
)

export class Particle extends Command {
  @command('particle', {
    isRoot: true,
    parsers: {
      '1': arrayToArgsParser,
      '2': arrayToArgsParser,
      '3': arrayToArgsParser,
    },
  })
  particle: ParticleCommand = (...args: unknown[]) => { }
}
