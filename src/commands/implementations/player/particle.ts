import type { Coordinates, MultiplePlayersArgumentOf, RootNBT, SymbolParticle, Registry, AbsoluteCoordinates } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, nbtStringifier, VectorClass } from 'sandstone/variables'
import type { FinalCommandOutput } from '../../helpers'
import { CommandArguments } from '../../helpers'

export class ParticleCommandNode extends CommandNode {
  command = 'particle' as const
}

/** Particle types that have configurable options (SNBT data) */
type ParticleWithOptions = SymbolParticle<'keys'>

/** Particle types that have no special options */
type SimpleParticle = Exclude<Registry['minecraft:particle_type'], ParticleWithOptions>

export class ParticleCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ParticleCommandNode

  /**
   * Create simple particle effects without special options.
   *
   * @param name Particle type to create. Only accepts particles that don't require special options.
   *
   * @param pos Position to spawn particles. Defaults to executor position.
   *
   * @param delta Spawn volume size [x, y, z], multiplied by ~8. Uses Gaussian distribution.
   *              When count=0, acts as motion vector instead.
   *
   * @param speed Particle speed/motion multiplier.
   *
   * @param count Number of particles. When 0, spawns single particle with delta as motion.
   *
   * @param mode Display mode: 'normal' (default) or 'force' (visible up to 256 blocks, ignores particle settings).
   *
   * @param viewers Player selector to show particles to instead of all nearby players.
   *
   * @example
   * ```ts
   * particle('minecraft:heart', abs(100, 70, 200))
   * particle('minecraft:smoke', rel(0, 1, 0), [1, 1, 1], 0.1, 10)
   * particle('minecraft:flame', '~ ~1 ~', [0.5, 0.5, 0.5], 0.02, 50, 'force')
   * ```
   */
  particle(
    name: Macroable<SimpleParticle, MACRO>,
    pos?: Macroable<Coordinates<MACRO>, MACRO>,
    delta?: Macroable<AbsoluteCoordinates<MACRO>, MACRO>,
    speed?: Macroable<number, MACRO>,
    count?: Macroable<number, MACRO>,
    mode?: Macroable<'force' | 'normal', MACRO>,
    viewers?: Macroable<MultiplePlayersArgumentOf<MACRO, string>, MACRO>,
  ): FinalCommandOutput

  /**
   * Create particle effects with configurable options as SNBT.
   *
   * Options are specified as an NBT object and appended to the particle ID as SNBT.
   * Each particle type has specific options available (e.g., dust has color and scale).
   *
   * @param name Particle type that supports options (dust, block, item, etc.) or any string for custom particles.
   *
   * @param options Particle-specific options as NBT. Type-checked based on particle type.
   *               For unknown particles, accepts any NBTObject as fallback.
   *
   * @param pos Position to spawn particles. Defaults to executor position.
   *
   * @param delta Spawn volume size [x, y, z], multiplied by ~8. Uses Gaussian distribution.
   *              When count=0, acts as motion vector instead.
   *
   * @param speed Particle speed/motion multiplier.
   *
   * @param count Number of particles. When 0, spawns single particle with delta as motion.
   *
   * @param mode Display mode: 'normal' (default) or 'force' (visible up to 256 blocks, ignores particle settings).
   *
   * @param viewers Player selector to show particles to instead of all nearby players.
   *
   * @example
   * ```ts
   * // Dust particle with color and scale
   * particle('minecraft:dust', { color: [1.0, 0.5, 0.5], scale: 1.5 }, abs(0, 70, 0))
   *
   * // Block particle
   * particle('minecraft:block', { block_state: 'minecraft:stone' }, rel(0, 0, 0))
   *
   * // Item particle
   * particle('minecraft:item', { item: 'minecraft:diamond' }, '~ ~1 ~')
   *
   * // Dust color transition
   * particle('minecraft:dust_color_transition', {
   *   from_color: [1.0, 0.0, 0.0],
   *   to_color: [0.0, 0.0, 1.0],
   *   scale: 1.0
   * }, abs(0, 64, 0))
   *
   * // Trail particle
   * particle('minecraft:trail', {
   *   target: [100.0, 64.0, 100.0],
   *   color: [0.0, 1.0, 0.0],
   *   duration: 20
   * })
   * ```
   */
  particle<PARTICLE extends Macroable<keyof SymbolParticle | `${string}:${string}`, MACRO>>(
    name: PARTICLE,
    options: Macroable<
      PARTICLE extends keyof SymbolParticle ? SymbolParticle[PARTICLE] : RootNBT,
      MACRO
    >,
    pos?: Macroable<Coordinates<MACRO>, MACRO>,
    delta?: Macroable<AbsoluteCoordinates<MACRO>, MACRO>,
    speed?: Macroable<number, MACRO>,
    count?: Macroable<number, MACRO>,
    mode?: Macroable<'force' | 'normal', MACRO>,
    viewers?: Macroable<MultiplePlayersArgumentOf<MACRO, string>, MACRO>,
  ): FinalCommandOutput

  particle(
    name: Macroable<Registry['minecraft:particle_type'] | `${string}:${string}`, MACRO>,
    arg2?: any,
    arg3?: any,
    arg4?: any,
    arg5?: any,
    arg6?: any,
    arg7?: any,
    arg8?: any,
  ) {
    // Check if arg2 is an options object (has options) or position/coordinates (no options)
    const hasOptions = arg2 !== undefined && typeof arg2 === 'object' && !isCoordinates(arg2)

    // Destructure args based on whether options are present
    const [particleName, pos, delta, speed, count, mode, viewers] = hasOptions
      ? [`${name}${nbtStringifier(arg2 as RootNBT)}`, arg3, arg4, arg5, arg6, arg7, arg8]
      : [name, arg2, arg3, arg4, arg5, arg6, arg7]

    return this.finalCommand([
      particleName,
      pos === undefined ? '~ ~ ~' : coordinatesParser(pos),
      delta === undefined ? '0 0 0' : coordinatesParser(delta),
      speed ?? '0',
      count ?? '1',
      mode ?? 'normal',
      ...(viewers === undefined ? [] : [viewers]),
    ]) as FinalCommandOutput
  }
}

/** Check if a value looks like coordinates (string or array with coordinate-like values) */
function isCoordinates(value: unknown): boolean {
  return typeof value === 'string' || value instanceof VectorClass || Array.isArray(value)
}
