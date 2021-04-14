/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-types */
import { nbtParser, rangeParser } from '@variables/parsers'

import { ComponentClass } from './abstractClasses'

import type {
  ENTITY_TYPES, GAMEMODES, RootNBT, TextComponentObject,
} from 'src/arguments'
import type { CommandsRoot } from '@commands'
import type { PredicateInstance } from '@resources'
import type { LiteralUnion } from '../generalTypes'
import type { ConditionClass } from './abstractClasses'
import type { NotNBT } from './NBTs'

export type Range = number | [min: number, max: number] | [min: number, max: null] | [min: null, max: number]

type ScoreArgument = Record<string, Range>

type AdvancementsArgument = Record<string, boolean | Record<string, boolean>>

/**
 * If MustBeSingle is false, then anything is allowed.
 * If it is true, then you must provide limit=1 or limit=0.
 */
export type SelectorProperties<MustBeSingle extends boolean, MustBePlayer extends boolean> = {
  /**
   * Filter target selection based on their Euclidean distances from some point,
   * searching for the target's feet (a point at the bottom of the center of their hitbox).
   *
   * If the positional arguments `x`, `y` and `z` are left undefined,
   * radius is calculated relative to the position of the command's execution.
   *
   * Only unsigned values are allowed.
   */
  distance?: Range,

  /** Filter target selection based on their scores in the specified objectives. */
  scores?: ScoreArgument

  /**
   * Filter target selection to those who are on a given team.
   *
   * Allowed values are:
   * - `teamName`, to filter those who are in the given team.
   * - `!teamName`, to filter those who are not in the given team.
   * - `false`, to filter those who are teamless (in no team).
   * - `true`, ot filter those who have at least one team.
   */
  team?: string | boolean

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
  tag?: string | string[]

  /** Filter target selection to all those with a given name. This cannot be a JSON text compound. */
  name?: string

  /**
   * Specify the targets selection priority.
   *
   * - `nearest`: Sort by increasing distance. (Default for `@p`)
   * - `furthest`: Sort by decreasing distance.
   * - `random`: Sort randomly. (Default for `@r`)
   * - `arbitrary`: Do not sort. (Default for `@e`, `@a`)
   */
  sort?: LiteralUnion<'nearest' | 'furthest' | 'random' | 'abitrary'>

  /** Filter target selection based on their experience levels. This naturally filters out all non-player targets. */
  level?: Range

  /** Filter target selection to those who are in the specified game mode. */
  gamemode?: LiteralUnion<GAMEMODES | `!${GAMEMODES}`> | `!${GAMEMODES}`[]

  // Selecting targets by vertical rotation

  /**
   * Filter target selection based on their vertical rotation, measured in degrees.
   *
   * Values range from `-90` (straight up) to `0` (at the horizon) to `+90` (straight down).
   */
  x_rotation?: Range

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
  y_rotation?: Range

  /** Select all targets that match the specified advancement and value. */
  advancements?: AdvancementsArgument

  /** Select all targets that match the specified predicate. */
  predicate?: string | PredicateInstance | (PredicateInstance | string)[]

  /** Select all targets that have the specified NBT. */
  nbt?: RootNBT | NotNBT

  /**
   * Define a position on the X-axis in the world the selector starts at,
   * for use with the `distance` argument or the volume arguments, `dx`, `dy` and `dz`.
   */
  x?: number

  /**
   * Define a position on the Y-axis in the world the selector starts at,
   * for use with the `distance` argument or the volume arguments, `dx`, `dy` and `dz`.
   */
  y?: number

  /**
   * Define a position on the Z-axis in the world the selector starts at,
   * for use with the `distance` argument or the volume arguments, `dx`, `dy` and `dz`.
   */
  z?: number

  /**
   * Filter target selection based on their x-difference, from some point,
   * as measured from the closest corner of the entities' hitboxes
   */
  dx?: number

  /**
   * Filter target selection based on their y-difference, from some point,
   * as measured from the closest corner of the entities' hitboxes
   */
  dy?: number

  /**
   * Filter target selection based on their z-difference, from some point,
   * as measured from the closest corner of the entities' hitboxes
   */
  dz?: number
} & (
  MustBeSingle extends true ? { limit: 0 | 1 } : { limit?: number }
) & (
  MustBePlayer extends true ? {
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
    type: 'minecraft:player' | 'minecraft:player'[]
  } : {
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
    type?: LiteralUnion<ENTITY_TYPES> | LiteralUnion<ENTITY_TYPES>[]
  }
)

// Returns the string representation of a score argument. `{ myScore: [0, null] } => {myScore=0..}`, `{ myScore: [-Infinity, 5] } => {myScore='..5'}`, 8 => '8'
function parseScore(scores: ScoreArgument): string {
  return `{${Object.entries(scores).map(([scoreName, value]) => [scoreName, rangeParser(value)].join('=')).join(', ')}}`
}

// Returns the string representation of advancements
function parseAdvancements(advancements: AdvancementsArgument): string {
  return `{${Object.entries(advancements).map(([advancementName, value]) => {
    if (typeof value === 'boolean') {
      return [advancementName, value].join('=')
    }

    return [advancementName, parseAdvancements(value)].join('=')
  }).join(', ')}}`
}

export class SelectorClass<IsSingle extends boolean = false, IsPlayer extends boolean = false> extends ComponentClass implements ConditionClass {
  protected commandsRoot: CommandsRoot

  target

  arguments: SelectorProperties<IsSingle, IsPlayer>

  constructor(
    commandsRoot: CommandsRoot,
    target: '@s' | '@p' | '@a' | '@e' | '@r',
    selectorArguments?: SelectorProperties<IsSingle, IsPlayer>,
  ) {
    super()

    this.commandsRoot = commandsRoot
    this.target = target
    this.arguments = selectorArguments ?? {} as SelectorProperties<IsSingle, IsPlayer>
  }

  // Custom actions //

  /**
   * List all scores of this entity.
   */
  listScores = () => {
    this.commandsRoot.scoreboard.players.list(this.toString())
  }

  _toMinecraftCondition(this: SelectorClass<IsSingle, IsPlayer>) {
    return { value: ['if', 'entity', this] }
  }

  toString() {
    if (!Object.keys(this.arguments).length) {
      return this.target
    }

    const result: (readonly [string, string])[] = []

    if (this.arguments) {
      const args = { ...this.arguments }

      const modifiers = {
        // Parse scores
        scores: (scores: ScoreArgument) => result.push(['scores', parseScore(scores)]),

        nbt: (nbt: RootNBT) => result.push(['nbt', nbtParser(nbt)]),

        // Parse advancements
        advancements: (advancements: AdvancementsArgument) => result.push(
          ['advancements', parseAdvancements(advancements)],
        ),

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

        distance: (range_: Range) => result.push(['distance', rangeParser(range_)]),
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
          result.push([key, value.toString()])
        }
      })
    }

    return `${this.target}[${result.map(([key, value]) => `${key}=${value}`).join(', ')}]`
  }

  protected _toChatComponent(): TextComponentObject {
    return {
      selector: this.toString(),
    }
  }

  protected toJSON() {
    return this.toString()
  }
}

// Possible selector properties
export type AnySelectorProperties = SelectorProperties<false, false>
export type SingleSelectorProperties = SelectorProperties<true, false>
export type SinglePlayerSelectorProperties = SelectorProperties<true, true>

export function SelectorCreator(target: '@s' | '@p' | '@r', selectorArguments?: Omit<AnySelectorProperties, 'limit' | 'type'>): SelectorClass<true, true>
export function SelectorCreator(target: '@a', selectorArguments: Omit<SingleSelectorProperties, 'type'>): SelectorClass<true, true>
export function SelectorCreator(target: '@a', selectorArguments?: Omit<AnySelectorProperties, 'type'>): SelectorClass<false, true>
export function SelectorCreator(target: '@e', selectorArguments: SinglePlayerSelectorProperties): SelectorClass<true, true>
export function SelectorCreator(target: '@e', selectorArguments: SingleSelectorProperties): SelectorClass<true, false>
export function SelectorCreator(target: '@e', selectorArguments?: AnySelectorProperties): SelectorClass<false, false>

export function SelectorCreator<T extends boolean, U extends boolean>(this: CommandsRoot, target: '@s' | '@p' | '@r' | '@a' | '@e', selectorArguments?: SelectorProperties<T, U>): SelectorClass<T, U> {
  return new SelectorClass(this, target, selectorArguments)
}
