import type { Coordinates, SingleEntityArgumentOf } from 'sandstone/arguments'
import type { FloatNumberProviderRef } from 'sandstone/arguments/generated/data/number_provider'
import type { IntNumberProviderRef } from 'sandstone/arguments/generated/data/number_provider'
import type { Macroable, SandstoneCore } from 'sandstone/core'
import { FloatNumberProviderClass, IntegerNumberProviderClass, isMacroArgument } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { nbtResolver } from 'sandstone/variables/nbt/NBTs'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { CommandArguments, type FinalCommandOutput } from '../../helpers'

/**
 * Anything `/compute integer` accepts as an `<int_provider>`: registry id from
 * `minecraft:context_int_provider`, an inline `NBTInt`-shaped object literal,
 * or an `IntegerNumberProviderClass` resource handle (which serializes via
 * `toString()` → its namespaced id).
 */
export type IntegerNumberProviderArgument<MACRO extends boolean> =
  | Macroable<IntNumberProviderRef | IntegerNumberProviderClass, MACRO>

/**
 * Anything `/compute float` accepts as a `<float_provider>`: registry id from
 * `minecraft:context_float_provider`, an inline `NBTFloat`-shaped object
 * literal, or a `FloatNumberProviderClass` resource handle.
 */
export type FloatNumberProviderArgument<MACRO extends boolean> =
  | Macroable<FloatNumberProviderRef | FloatNumberProviderClass, MACRO>

/**
 * The optional trailing scale multiplier of `/compute float` (default `1.0`).
 * Integer providers cannot be scaled.
 */
export type FloatNumberProviderScale<MACRO extends boolean> = Macroable<number, MACRO>

export class ComputeCommandNode extends CommandNode {
  command = 'compute' as const
}

/**
 * Resolve a float provider for the command's `args` array:
 *
 *   - `string` registry reference → push as-is, unquoted.
 *   - `FloatNumberProviderClass` resource handle → push as-is; `toString()`
 *     emits its unquoted namespaced id.
 *   - `MacroArgument` → push as-is; its `toMacro()` fires later via
 *     `getValue()` and the resulting `$(name)` placeholder gets wired to the
 *     macro storage at call time.
 *   - inline `{ type: ... }` provider → route through `nbtResolver` so SNBT
 *     is emitted instead of `[object Object]`.
 */
export function floatNumberProviderArgument(
  core: SandstoneCore,
  provider: FloatNumberProviderArgument<boolean>,
) {
  if (
    typeof provider === 'string'
    || provider instanceof FloatNumberProviderClass
    || isMacroArgument(core, provider)
  ) {
    return provider
  }
  return nbtResolver(provider as any)
}

/**
 * Resolve an integer provider for the command's `args` array. Mirrors
 * {@link floatNumberProviderArgument}.
 */
export function integerNumberProviderArgument(
  core: SandstoneCore,
  provider: IntegerNumberProviderArgument<boolean>,
) {
  if (
    typeof provider === 'string'
    || provider instanceof IntegerNumberProviderClass
    || isMacroArgument(core, provider)
  ) {
    return provider
  }
  return nbtResolver(provider as any)
}

/**
 * Target-selected `/compute` invocation — the user picks the context
 * (`default` / `block <pos>` / `entity <target>`) on `ComputeCommand`, then
 * picks the provider kind (`.integer(...)` / `.float(...)`) here.
 *
 * Each call to `.integer(...)` / `.float(...)` produces an independent
 * command node — identical to how `attribute(@s, foo).get()` produces one
 * `attribute ... get` command per call.
 */
export class ComputeContext<MACRO extends boolean> extends CommandArguments {
  /**
   * Evaluate an `minecraft:context_int_provider` in the selected context.
   *
   * @example
   * ```ts
   * compute.default.integer({ type: 'minecraft:constant', value: 42 })
   * compute.default.integer('minecraft:my_pack:kill_count')
   * compute.block([0, 64, 0]).integer({ type: 'minecraft:score', target: '@s', score: 'health' })
   * ```
   *
   * @see https://minecraft.wiki/w/Commands/compute
   */
  integer = <PROVIDER extends IntegerNumberProviderArgument<MACRO>>(
    provider: PROVIDER,
  ): FinalCommandOutput =>
    this.finalCommand(['integer', integerNumberProviderArgument(this.sandstoneCore, provider)])

  /**
   * Evaluate an `minecraft:context_float_provider` in the selected context.
   *
   * @param scale Optional scale multiplier (default `1.0`). Integer providers
   *              cannot be scaled.
   *
   * @example
   * ```ts
   * compute.default.float('minecraft:my_pack:damage_multiplier')
   * compute.default.float({ type: 'minecraft:uniform', min: 1, max: 6 }, 100)
   * compute.entity('@p').float(FloatNumberProvider('my_pack:dmg_mult', { type: 'minecraft:constant', value: 1.5 }))
   * ```
   *
   * @see https://minecraft.wiki/w/Commands/compute
   */
  float = <PROVIDER extends FloatNumberProviderArgument<MACRO>>(
    provider: PROVIDER,
    scale?: FloatNumberProviderScale<MACRO>,
  ): FinalCommandOutput =>
    this.finalCommand(['float', floatNumberProviderArgument(this.sandstoneCore, provider), scale])
}

export class ComputeCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ComputeCommandNode

  /**
   * `/compute` with only common arguments (position, `this` entity) in scope.
   */
  get default(): ComputeContext<MACRO> {
    return this.subCommand(['default'], ComputeContext<MACRO>, false)
  }

  /**
   * `/compute block <pos>` — binds the `command_compute_position` context.
   *
   * @param pos Block position whose context is bound to the provider.
   */
  block = (
    pos: Macroable<Coordinates<MACRO>, MACRO>,
  ): ComputeContext<MACRO> =>
    this.subCommand(['block', coordinatesParser(pos)], ComputeContext<MACRO>, false)

  /**
   * `/compute entity <target>` — binds the `command_compute_entity` context.
   *
   * @param entity Selector for the entity whose context is bound to the provider.
   */
  entity = <T extends string>(
    entity: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>,
  ): ComputeContext<MACRO> =>
    this.subCommand(['entity', targetParser(entity)], ComputeContext<MACRO>, false)

  /**
   * Shortcut for the default-context float evaluation:
   * `compute.float(p)` is equivalent to `compute.default.float(p)` and emits
   * `compute default float <provider> [scale]`. The `default` token is
   * required by the in-game command even when no positional target is bound.
   *
   * @see {@link ComputeContext.float}
   */
  float = <PROVIDER extends FloatNumberProviderArgument<MACRO>>(
    provider: PROVIDER,
    scale?: FloatNumberProviderScale<MACRO>,
  ): FinalCommandOutput =>
    this.finalCommand([
      'default',
      'float',
      floatNumberProviderArgument(this.sandstoneCore, provider),
      scale,
    ])

  /**
   * Shortcut for the default-context integer evaluation:
   * `compute.int(p)` is equivalent to `compute.default.integer(p)` and emits
   * `compute default integer <provider>`. Integer providers cannot be scaled.
   *
   * @see {@link ComputeContext.integer}
   */
  int = <PROVIDER extends IntegerNumberProviderArgument<MACRO>>(
    provider: PROVIDER,
  ): FinalCommandOutput =>
    this.finalCommand([
      'default',
      'integer',
      integerNumberProviderArgument(this.sandstoneCore, provider),
    ])
}
