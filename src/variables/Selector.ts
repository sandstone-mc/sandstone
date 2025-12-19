/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-types */

import type { GAMEMODES, JSONTextComponent, Range, RootNBT } from 'sandstone/arguments'
import type { PredicateClass, SandstoneCore } from 'sandstone/core'
import type { SandstonePack } from 'sandstone/pack'
import { nbtStringifier } from 'sandstone/variables/nbt/NBTs'
import { rangeParser } from 'sandstone/variables/parsers'
import * as util from 'util'
import type { Macroable } from '../core/Macro.js'
import { formatDebugString, type LiteralUnion } from '../utils.js'
import type { ConditionClass, ConditionTextComponentClass, SelectorPickClass } from './abstractClasses.js'
import type { LabelClass } from './Label.js'
import type { NotNBT } from './nbt/NBTs.js'
import type { Registry } from 'sandstone/arguments/generated/registry'

type ScoreArgument<MACRO extends boolean = false> = Record<string, Range<MACRO>>

type AdvancementsArgumentValue = boolean | [string, boolean] | [string, boolean][]

type AdvancementsArgument = Record<string, AdvancementsArgumentValue | Record<string, AdvancementsArgumentValue>>

type TypeOrArray<T> = T | T[]

/**
 * If MustBeSingle is false, then anything is allowed.
 * If it is true, then you must provide limit=1 or limit=0.
 */
export type SelectorProperties<
  MustBeSingle extends boolean,
  MustBePlayer extends boolean,
  MACRO extends boolean = false,
> = {
  /**
   * Filter target selection based on their Euclidean distances from some point,
   * searching for the target's feet (a point at the bottom of the center of their hitbox).
   *
   * If the positional arguments `x`, `y` and `z` are left undefined,
   * radius is calculated relative to the position of the command's execution.
   *
   * Only unsigned values are allowed.
   */
  distance?: Macroable<Range<MACRO>, MACRO>

  /** Filter target selection based on their scores in the specified objectives. */
  scores?: Macroable<ScoreArgument<MACRO>, MACRO>

  /**
   * Filter target selection to those who are on a given team.
   *
   * Allowed values are:
   * - `teamName`, to filter those who are in the given team.
   * - `!teamName`, to filter those who are not in the given team.
   * - `false`, to filter those who are teamless (in no team).
   * - `true`, ot filter those who have at least one team.
   */
  team?: Macroable<string | boolean, MACRO>

  /**
   * Filter target selection to those that have the given tag(s).
   *
   * Multiple values are allowed, when passed as an array.
   *
   * @example
   *
   * Selector(`@e`, { tag: 'alive' }) => `@e[tag=alive]`
   *
   * Selector(`@e`, { tag: ['alive', 'winner'] }) => `@e[tag=alive, tag=winner]`
   *
   */
  tag?: Macroable<TypeOrArray<string | LabelClass>, MACRO>

  /** Filter target selection to all those with a given name. This cannot be a JSON text compound. */
  name?: Macroable<string, MACRO>

  /**
   * Specify the targets selection priority.
   *
   * - `nearest`: Sort by increasing distance. (Default for `@p`)
   * - `furthest`: Sort by decreasing distance.
   * - `random`: Sort randomly. (Default for `@r`)
   * - `arbitrary`: Do not sort. (Default for `@e`, `@a`)
   */
  sort?: 'nearest' | 'furthest' | 'random' | 'abitrary'

  /** Filter target selection based on their experience levels. This naturally filters out all non-player targets. */
  level?: Macroable<Range<MACRO>, MACRO>

  /** Filter target selection to those who are in the specified game mode. */
  gamemode?: Macroable<LiteralUnion<GAMEMODES | `!${GAMEMODES}`> | `!${GAMEMODES}`[], MACRO>

  // Selecting targets by vertical rotation

  /**
   * Filter target selection based on their vertical rotation, measured in degrees.
   *
   * Values range from `-90` (straight up) to `0` (at the horizon) to `+90` (straight down).
   */
  x_rotation?: Macroable<Range<MACRO>, MACRO>

  /**
   * Filter target selection based on their rotation in the horizontal XZ-plane,
   * measured clockwise in degrees from due south (or the positive Z direction).
   *
   * Values vary:
   * - from `-180` (facing due north, the -Z direction)
   * - to `-90` (facing due east, the +X direction)
   * - to `0` (facing due south, the +Z direction)
   * - to `+90` (facing due west, the -X direction)
   * - to `+180` (facing due north again).
   */
  y_rotation?: Macroable<Range<MACRO>, MACRO>

  /** Select all targets that match the specified advancement and value. */
  advancements?: Macroable<AdvancementsArgument, MACRO>

  /** Select all targets that match the specified predicate. */
  predicate?: Macroable<string | PredicateClass | (PredicateClass | string)[], MACRO>

  /** Select all targets that have the specified NBT. */
  nbt?: Macroable<RootNBT | NotNBT | (RootNBT | NotNBT)[], MACRO>

  /**
   * Define a position on the X-axis in the world the selector starts at,
   * for use with the `distance` argument or the volume arguments, `dx`, `dy` and `dz`.
   */
  x?: Macroable<number, MACRO>

  /**
   * Define a position on the Y-axis in the world the selector starts at,
   * for use with the `distance` argument or the volume arguments, `dx`, `dy` and `dz`.
   */
  y?: Macroable<number, MACRO>

  /**
   * Define a position on the Z-axis in the world the selector starts at,
   * for use with the `distance` argument or the volume arguments, `dx`, `dy` and `dz`.
   */
  z?: Macroable<number, MACRO>

  /**
   * Filter target selection based on their x-difference, from some point,
   * as measured from the closest corner of the entities' hitboxes
   */
  dx?: Macroable<number, MACRO>

  /**
   * Filter target selection based on their y-difference, from some point,
   * as measured from the closest corner of the entities' hitboxes
   */
  dy?: Macroable<number, MACRO>

  /**
   * Filter target selection based on their z-difference, from some point,
   * as measured from the closest corner of the entities' hitboxes
   */
  dz?: Macroable<number, MACRO>
} & (MustBeSingle extends true ? { limit: Macroable<0 | 1, MACRO> } : { limit?: Macroable<number, MACRO> }) &
  (MustBePlayer extends true
    ? {
        /**
         * Filter target selection to those of a specific entity type.
         *
         * Multiple values are allowed, when passed as an array.
         *
         * @example
         *
         * Selector(`@e`, { type: 'minecraft:cow' }) => `@e[type=!minecraft:cow]`
         *
         * Selector(`@e`, { type: ['!minecraft:cow', '!minecraft:skeleton'] }) => `@e[type=!minecraft:cow, type=!minecraft:skeleton]`
         */
        type: 'minecraft:player'
      }
    : {
        /**
         * Filter target selection to those of a specific entity type.
         *
         * Multiple values are allowed, when passed as an array.
         *
         * @example
         *
         * Selector(`@e`, { type: 'minecraft:cow' }) => `@e[type=!minecraft:cow]`
         *
         * Selector(`@e`, { type: ['!minecraft:cow', '!minecraft:skeleton'] }) => `@e[type=!minecraft:cow, type=!minecraft:skeleton]`
         */
        type?: Macroable<Registry['minecraft:entity_type'] | Registry['minecraft:entity_type'][], MACRO>
      })

// Returns the string representation of a score argument. `{ myScore: [0, null] } => {myScore=0..}`, `{ myScore: [-Infinity, 5] } => {myScore='..5'}`, 8 => '8'
function parseScore(core: SandstoneCore, scores: ScoreArgument<boolean>): string {
  return `{${Object.entries(scores)
    .map(([scoreName, value]) => [scoreName, rangeParser(core, value)].join('='))
    .join(', ')}}`
}

// Returns the string representation of advancements
function parseAdvancements(advancements: AdvancementsArgument): string {
  return `{${Object.entries(advancements)
    .map(([advancementName, value]) => {
      if (typeof value === 'boolean') {
        return [advancementName, value].join('=')
      }
      if (Array.isArray(value)) {
        if (Array.isArray(value[0])) {
          return [
            advancementName,
            `{${value.map((_value) => (_value as [string, boolean]).join('=')).join(',')}}`,
          ].join('=')
        }
        return [advancementName, `{${value.join('=')}}`].join('=')
      }

      return [advancementName, parseAdvancements(value)].join('=')
    })
    .join(', ')}}`
}

export class SelectorClass<
  MACRO extends boolean = false,
  IsSingle extends boolean = false,
  IsPlayer extends boolean = false,
> implements ConditionTextComponentClass, SelectorPickClass<IsSingle, IsPlayer>, ConditionClass
{
  arguments: SelectorProperties<IsSingle, IsPlayer, MACRO>

  constructor(
    protected sandstonePack: SandstonePack,
    public target: '@s' | '@p' | '@a' | '@e' | '@r',
    selectorArguments?: SelectorProperties<IsSingle, IsPlayer, MACRO>,
  ) {
    this.arguments = selectorArguments ?? ({} as SelectorProperties<IsSingle, IsPlayer, MACRO>)
  }

  // Custom actions //

  /**
   * List all scores of this entity.
   */
  listScores = () => {
    this.sandstonePack.commands.scoreboard.players.list(this.toString())
  }

  toString() {
    if (!this.arguments || !Object.keys(this.arguments).length) {
      return this.target
    }

    const result: (readonly [string, string])[] = []

    const args = { ...this.arguments }

    const modifiers = {
      // Parse scores
      scores: (scores: ScoreArgument<MACRO>) => result.push(['scores', parseScore(this.sandstonePack.core, scores)]),

      // Parse potentially multiple nbt
      nbt: (nbt: RootNBT | RootNBT[]) => {
        const nbts = Array.isArray(nbt) ? nbt : [nbt]
        result.push(...nbts.map((nbt_) => ['nbt', nbtStringifier(nbt_)] as const))
      },

      // Parse advancements
      advancements: (advancements: AdvancementsArgument) =>
        result.push(['advancements', parseAdvancements(advancements)]),

      // Parse potentially multiple tags
      tag: (tag: string | string[]) => {
        const tags = Array.isArray(tag) ? tag : [tag]
        result.push(...tags.map((tag_) => ['tag', tag_] as const))
      },

      // Parse potentially multiple gamemodes
      gamemode: (gamemode: string | string[]) => {
        const gamemodes = Array.isArray(gamemode) ? gamemode : [gamemode]
        result.push(...gamemodes.map((gamemode_) => ['gamemode', gamemode_] as const))
      },

      // Parse potentially multiple predicates
      predicate: (predicate: string | string[]) => {
        const predicates = Array.isArray(predicate) ? predicate : [predicate]
        result.push(...predicates.map((pred) => ['predicate', pred] as const))
      },

      // Handle boolean values for teams
      team: (team: string | boolean) => {
        let teamRepr: string

        if (team === true) {
          teamRepr = '!'
        } else if (team === false) {
          teamRepr = ''
        } else {
          teamRepr = team
        }
        result.push(['team', teamRepr])
      },

      distance: (range_: Range<MACRO>) => result.push(['distance', rangeParser(this.sandstonePack.core, range_)]),
    } as const

    for (const [baseName, modifier] of Object.entries(modifiers)) {
      const name = baseName as keyof typeof args
      const value = args[name]

      if (value !== undefined) {
        modifier(value as any)
        delete args[name]
      }
    }

    Object.entries(args).forEach(([key, value]) => {
      if (value !== undefined) {
        result.push([key, `${value}`])
      }
    })

    return `${this.target}[${result.map(([key, value]) => `${key}=${value}`).join(', ')}]`
  }

  /**
   * @internal
   */
  _toMinecraftCondition = () => new this.sandstonePack.conditions.Selector(this.sandstonePack.core, this.toString())

  /**
   * @internal
   */
  _toChatComponent(): JSONTextComponent {
    return {
      selector: this.toString(),
    }
  }

  /**
   * @internal
   */
  _toSelector(): SelectorClass<MACRO, IsSingle, IsPlayer> {
    return this
  }

  protected toJSON() {
    return this.toString()
  }

  [util.inspect.custom]() {
    return formatDebugString(this.constructor.name, this.toString(), undefined, undefined)
  }
}

// Possible selector properties
export type AnySelectorProperties<MACRO extends boolean = false> = SelectorProperties<false, false, MACRO>
export type SingleSelectorProperties<MACRO extends boolean = false> = SelectorProperties<true, false, MACRO>
export type SinglePlayerSelectorProperties<MACRO extends boolean = false> = SelectorProperties<true, true, MACRO>

export type SelectorCreator<MACRO extends boolean = false> = ((
  target: '@p' | '@r',
  selectorArguments?: Omit<AnySelectorProperties<MACRO>, 'limit' | 'type'>,
) => SelectorClass<MACRO, true, true>) &
  ((
    target: '@s',
    selectorArguments?: Omit<AnySelectorProperties<MACRO>, 'limit'>,
  ) => SelectorClass<MACRO, true, true>) &
  ((
    target: '@a',
    selectorArguments: Omit<SingleSelectorProperties<MACRO>, 'type'>,
  ) => SelectorClass<MACRO, true, true>) &
  ((
    target: '@a',
    selectorArguments?: Omit<AnySelectorProperties<MACRO>, 'type'>,
  ) => SelectorClass<MACRO, false, true>) &
  ((target: '@e', selectorArguments: SinglePlayerSelectorProperties<MACRO>) => SelectorClass<MACRO, true, true>) &
  ((target: '@e', selectorArguments: SingleSelectorProperties<MACRO>) => SelectorClass<MACRO, true, false>) &
  ((target: '@e', selectorArguments?: AnySelectorProperties<MACRO>) => SelectorClass<MACRO, false, false>)
