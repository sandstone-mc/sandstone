import type { Coordinates, SingleEntityArgumentOf } from 'sandstone/arguments'
import type { NumberProviderRef } from 'sandstone/arguments/generated/data/number_provider'
import type { Macroable, SandstoneCore } from 'sandstone/core'
import { isMacroArgument, NumberProviderClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { nbtResolver } from 'sandstone/variables/nbt/NBTs'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { makeCallable } from 'sandstone/utils'
import { CommandArguments } from '../../helpers'

/**
 * The optional trailing argument of `/compute`: either a scaling float,
 * or the literal `integer` marker to force integer-mode evaluation.
 */
export type NumberProviderScale<MACRO extends boolean> = Macroable<number | 'integer', MACRO>

/**
 * Anything `/compute` accepts as a `<provider>`: registry id, inline NBT
 * object literal, or a `NumberProviderClass` resource handle (which
 * serializes via `toString()` → its namespaced id).
 */
export type NumberProviderArgument<MACRO extends boolean> =
  | Macroable<NumberProviderRef | NumberProviderClass, MACRO>

export class ComputeCommandNode extends CommandNode {
  command = 'compute' as const
}

/**
 * Resolve a `ComputeProvider` for the command's `args` array, mirroring the
 * `give` command's multi-branch approach plus the `NumberProviderClass` case:
 *
 *   - `MacroArgument` → push as-is; its `toMacro()` fires later via
 *     `getValue()` and the resulting `$(name)` placeholder gets wired to the
 *     macro storage at call time.
 *   - `NumberProviderClass` resource handle → push as-is. Its `toString()`
 *     returns its namespaced id, so `args.join(' ')` emits the unquoted
 *     registry reference (e.g. `minecraft:my_pack:dmg_mult`).
 *   - plain `string` registry reference → push as-is, unquoted.
 *   - inline `{ type: ... }` provider → route through `nbtResolver` so SNBT
 *     is emitted instead of `[object Object]`.
 */
export function numberProviderArgument(core: SandstoneCore, provider: NumberProviderArgument<boolean>) {
  if (
    typeof provider === 'string'
    || provider instanceof NumberProviderClass
    || isMacroArgument(core, provider)
  ) {
    return provider
  }
  return nbtResolver(provider as any)
}

export class ComputeCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ComputeCommandNode

  /**
   * Evaluate a number provider in the default command context.
   *
   * Only common arguments (position, `this` entity) are available to the provider.
   *
   * @param provider A `minecraft:number_provider` registry entry, an inline
   *                 number-provider object (uniform, binomial, score, storage, ...),
   *                 or a `NumberProviderClass` resource. May also be a
   *                 `MacroArgument` when called from within `_.with()`.
   *
   * @param scaleOrInteger Optional. A scale multiplier (default `1.0`) or the
   *                       `integer` marker to use integer-mode evaluation.
   *
   * @example
   * ```ts
   * compute.default({ type: 'minecraft:constant', value: 42 })
   * compute.default('minecraft:my_pack:damage_multiplier')
   * compute.default(NumberProvider('my_pack:dmg_mult', { json: { type: 'minecraft:constant', value: 1.5 } }))
   * compute.default({ type: 'minecraft:uniform', min: 1, max: 6 }, 100)
   * ```
   *
   * @see https://minecraft.wiki/w/Commands/compute
   */
  default = <PROVIDER extends NumberProviderArgument<MACRO>>(
    provider: PROVIDER,
    scaleOrInteger?: NumberProviderScale<MACRO>,
  ) =>
    this.finalCommand(['default', numberProviderArgument(this.sandstoneCore, provider), scaleOrInteger])

  /**
   * Evaluate a number provider with a block position in scope.
   *
   * The provider's `command_compute_position` context receives block state and
   * block position from the block at `<pos>`.
   *
   * @param pos Block position whose context is bound to the provider.
   *
   * @param provider A `minecraft:number_provider` registry entry, an inline
   *                 number-provider object, or a `NumberProviderClass` resource.
   *
   * @param scaleOrInteger Optional. A scale multiplier (default `1.0`) or the
   *                       `integer` marker.
   *
   * @example
   * ```ts
   * compute.block([0, 64, 0], { type: 'minecraft:constant', value: 1 })
   * compute.block(abs(0, 64, 0), 'minecraft:my_pack:redstone_strength', 100)
   * ```
   *
   * @see https://minecraft.wiki/w/Commands/compute
   */
  block = (
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    provider: NumberProviderArgument<MACRO>,
    scaleOrInteger?: NumberProviderScale<MACRO>,
  ) =>
    this.finalCommand([
      'block',
      coordinatesParser(pos),
      numberProviderArgument(this.sandstoneCore, provider),
      scaleOrInteger,
    ])

  /**
   * Evaluate a number provider with a target entity in scope.
   *
   * The provider's `command_compute_entity` context receives `target_entity`
   * resolved from the selector result.
   *
   * @param entity Selector for the entity whose context is bound to the provider.
   *
   * @param provider A `minecraft:number_provider` registry entry, an inline
   *                 number-provider object, or a `NumberProviderClass` resource.
   *
   * @param scaleOrInteger Optional. A scale multiplier (default `1.0`) or the
   *                       `integer` marker.
   *
   * @example
   * ```ts
   * compute.entity('@p', { type: 'minecraft:score', target: '@s', score: 'health' })
   * compute.entity('@e[type=zombie,limit=1]', 'minecraft:my_pack:boss_damage', 100)
   * ```
   *
   * @see https://minecraft.wiki/w/Commands/compute
   */
  entity = <T extends string>(
    entity: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
    provider: NumberProviderArgument<MACRO>,
    scaleOrInteger?: NumberProviderScale<MACRO>,
  ) =>
    this.finalCommand([
      'entity',
      targetParser(entity),
      numberProviderArgument(this.sandstoneCore, provider),
      scaleOrInteger,
    ])

  /**
   * Callable alias for `.default(...)`. Lets the root `compute` getter chain
   * to a one-line `new ComputeCommand(...).compute`, mirroring how
   * `returnCmd` chains to `new ReturnCommand(...).return`.
   */
  get compute() {
    return makeCallable(this, this.default)
  }
}
