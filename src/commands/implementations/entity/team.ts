import type { BASIC_COLORS, JSONTextComponent, MultipleEntitiesArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { parseJSONText } from 'sandstone/variables/JSONTextComponentClass'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

interface TeamOptions {
  collisionRule: 'always' | 'never' | 'pushOtherTeams' | 'pushOwnTeam'
  color: BASIC_COLORS
  deathMessageVisibility: 'never' | 'hideForOtherTeams' | 'hideForOwnTeam' | 'always'
  friendlyFire: boolean
  nametagVisibility: 'never' | 'hideForOtherTeams' | 'hideForOwnTeam' | 'always'
  seeFriendlyInvisibles: boolean

  displayName: JSONTextComponent
  prefix: JSONTextComponent
  suffix: JSONTextComponent
}

export class TeamCommandNode extends CommandNode {
  command = 'team' as const
}

export class TeamCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TeamCommandNode

  /**
   * Create a new team.
   *
   * @param team Team name identifier.
   *            Examples: 'red', 'blue', 'hunters', 'defenders'
   *
   * @param displayName Optional display name shown in UI.
   *                   Supports JSON text formatting.
   *
   * @example
   * ```ts
   * team.add('red')                              // Create team 'red'
   * team.add('blue', 'Blue Team')                // With display name
   * team.add('winners', {text: 'Winners!', color: 'gold'})
   * ```
   */
  add = (team: Macroable<string, MACRO>, displayName?: Macroable<JSONTextComponent, MACRO>) =>
    this.finalCommand(['add', team, parseJSONText(this.sandstoneCore, displayName)])

  /**
   * Remove all members from a team.
   *
   * @param team Team name to empty.
   *
   * @example
   * ```ts
   * team.empty('red')     // Remove all members from red team
   * ```
   */
  empty = (team: Macroable<string, MACRO>) => this.finalCommand(['empty', team])

  /**
   * Add entities to a team.
   *
   * @param team Team name to join.
   * @param members Entity selector or '*' for all scoreboard entities.
   *               Defaults to command executor if not specified.
   *
   * @example
   * ```ts
   * team.join('red', '@p')              // Add nearest player to red team
   * team.join('blue', '@a[team=!blue]') // Add non-blue players to blue
   * team.join('hunters', '*')           // Add all entities to hunters
   * ```
   */
  join = (team: Macroable<string, MACRO>, members?: Macroable<MultipleEntitiesArgument<MACRO> | '*', MACRO>) =>
    this.finalCommand(['join', team, targetParser(members)])

  /**
   * Remove entities from their teams.
   *
   * @param members Entity selector or '*' for all scoreboard entities.
   *
   * @example
   * ```ts
   * team.leave('@p')      // Remove nearest player from team
   * team.leave('@a')      // Remove all players from teams
   * team.leave('*')       // Remove all entities from teams
   * ```
   */
  leave = (members: Macroable<MultipleEntitiesArgument<MACRO> | '*', MACRO>) =>
    this.finalCommand(['leave', targetParser(members)])

  /**
   * List teams or team members.
   *
   * @param team Optional team name to list members of.
   *            If not specified, lists all teams.
   *
   * @example
   * ```ts
   * team.list()         // List all teams
   * team.list('red')    // List red team members
   * ```
   */
  list = (team?: Macroable<string, MACRO>) => this.finalCommand(['list', team ? targetParser(team) : undefined])

  /**
   * Modify team properties with type-safe options.
   *
   * @param team Team name to modify.
   * @param option Property to change: 'color', 'displayName', 'friendlyFire',
   *              'collisionRule', 'nametagVisibility', 'deathMessageVisibility',
   *              'seeFriendlyInvisibles', 'prefix', 'suffix'
   * @param value New value for the property (type depends on option).
   *
   * @example
   * ```ts
   * team.modify('red', 'color', 'red')               // Set team color
   * team.modify('blue', 'friendlyFire', false)       // Disable friendly fire
   * team.modify('hunters', 'prefix', '[HUNTER] ')    // Add prefix
   * team.modify('defenders', 'displayName', 'The Defenders')
   * ```
   */
  modify<T extends keyof TeamOptions>(team: Macroable<string, MACRO>, option: T, value: TeamOptions[T]): void

  /**
   * Modify team properties with custom option string.
   *
   * @param team Team name to modify.
   * @param option Custom property name.
   * @param value String value for the property.
   */
  modify<T extends string>(
    team: Macroable<string, MACRO>,
    option: Exclude<T, keyof TeamOptions>,
    value: Macroable<string, MACRO>,
  ): void

  modify(team: Macroable<string, MACRO>, option: string, value: unknown) {
    if (['displayName', 'prefix', 'suffix'].includes(option)) {
      value = parseJSONText(this.sandstoneCore, value as JSONTextComponent)
    }
    this.finalCommand(['modify', team, option, value])
  }

  /**
   * Delete a team.
   *
   * @param team Team name to remove.
   *
   * @example
   * ```ts
   * team.remove('red')    // Delete red team
   * ```
   */
  remove = (team: Macroable<string, MACRO>) => this.finalCommand(['remove', team])
}
