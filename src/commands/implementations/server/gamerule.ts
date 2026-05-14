/* eslint-disable max-len */

import type { SymbolGameRule } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import type { NBTInt } from 'sandstone/variables/nbt/NBTs'
import type { PositiveWholeNumber, NegativeWholeNumber, SmartRange, IsNegative, ToNegative, PositiveRange, Abs, Enumerate, WholeNumber } from 'sandstone/utils'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments, FinalCommandOutput } from '../../helpers'

declare const RangeSymbol: unique symbol;

export type Inf = 1e999
export type NegativeInf = -1e999

export type RangedInt<Min, Max = Inf> = number & {
  readonly [RangeSymbol]?: [Min, Max],
}

export type RangeError<Message extends string> = Message & { readonly __brand: "RangeError" }

export type ExtractNBTIntRange<T, V extends number> = (
  T extends NBTInt<infer Range>
  ? [number] extends [V]
    ? // --- Display Mode ---
      Range extends { min: infer Min extends number; max: infer Max extends number } ? RangedInt<Min, Max>
      : Range extends { max: infer Max extends number } ? RangedInt<NegativeInf, Max>
      : Range extends { min: infer Min extends number } ? RangedInt<Min, Inf>
      : RangedInt<NegativeInf, Inf>

    : // --- Validation Mode ---
      V extends WholeNumber<V>
      ? ( // Nested check for boundaries
          Range extends { min: infer Min extends number; max: infer Max extends number }
            ? (V extends SmartRange<Min, Max> ? V : RangeError<`Error: ${V} is out of bounds (${Min}..${Max})`>)
          : Range extends { max: infer Max extends number }
            ? (IsNegative<Max> extends true
              ? (V extends NegativeWholeNumber<V>
                  ? (`${V}` extends `-${infer AbsV extends number}`
                      ? (AbsV extends Enumerate<Abs<Max>> ? RangeError<`Error: Value must be <= ${Max}`> : V)
                      : V)
                  : RangeError<`Error: Value must be <= ${Max}`>)
              : (V extends (NegativeWholeNumber<V> | 0 | PositiveRange<1, Max>)
                  ? V
                  : RangeError<`Error: ${V} must be <= ${Max}`>))
          : Range extends { min: infer Min extends number }
            ? (IsNegative<Min> extends true
              ? (V extends (ToNegative<PositiveRange<1, Abs<Min>>> | 0 | PositiveWholeNumber<V>)
                  ? V
                  : RangeError<`Error: Value must be >= ${Min}`>)
              : (V extends 0
                  ? (Min extends 0 ? 0 : RangeError<`Error: Value must be >= ${Min}`>)
                  : V extends PositiveWholeNumber<V>
                    ? (`${V}` extends `${infer VN extends number}`
                        ? (VN extends Enumerate<Min> ? RangeError<`Error: Value must be >= ${Min}`> : V)
                        : V)
                    : RangeError<`Error: Value must be >= ${Min}`>))
          : V // Fallback for NBTInt<{}> (V is already verified as WholeNumber)
        )
      : RangeError<`Error: ${V} must be a whole number (no decimals allowed)`>
  : T
)

// Gamerule command

export class GameRuleCommandNode extends CommandNode {
  command = 'gamerule' as const
}

export class GameRuleCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = GameRuleCommandNode

  /**
   * Set or query game rules.
   *
   * @param gamerule Game rule to modify or query.
   *                Common rules: 'keepInventory', 'doDaylightCycle', 'doMobSpawning',
   *                'mobGriefing', 'randomTickSpeed', 'showDeathMessages'
   *
   * @param value Optional value to set. If not specified, queries current value.
   *             Boolean rules: true/false
   *             Numeric rules: integer
   *
   * @example
   * ```ts
   * gamerule('keepInventory')              // Query current value
   * gamerule('keepInventory', true)        // Enable keep inventory
   * gamerule('randomTickSpeed', 10)        // Set tick speed to 10
   * gamerule('doDaylightCycle', false)     // Stop day/night cycle
   * ```
   */
  gamerule<RULE extends Macroable<keyof SymbolGameRule | `${string}:${string}`, MACRO>>(
    gamerule: RULE,
  ): FinalCommandOutput

  gamerule<
    RULE extends Macroable<keyof SymbolGameRule | (`${string}:${string}` & {}), MACRO>,
    // 1. Keep V as a broad number to avoid early constraint errors
    V extends (RULE extends keyof SymbolGameRule ? number | boolean : number | boolean)
  >(
    gamerule: RULE,
    value: RULE extends keyof SymbolGameRule
      ? (SymbolGameRule[RULE] extends NBTInt<any>
          ? ExtractNBTIntRange<SymbolGameRule[RULE], V & number>
          : Macroable<SymbolGameRule[RULE], MACRO>)
      : V,
  ): FinalCommandOutput

  gamerule(
    gamerule: any,
    value?: any,
  ) {
    return this.finalCommand([gamerule, value])
  }
}
