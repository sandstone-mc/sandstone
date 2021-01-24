import { SelectorArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { JsonTextComponentClass } from '@variables'

import type { BASIC_COLORS, JsonTextComponent, MultipleEntitiesArgument } from '@arguments'

interface TeamOptions {
  collisionRule: 'always' | 'never' | 'pushOtherTeams' | 'pushOwnTeam'
  color: BASIC_COLORS
  deathMessageVisibility: 'never' | 'hideForOtherTeams' | 'hideForOwnTeam' | 'always'
  displayName: JsonTextComponent
  friendlyFire: boolean
  nametagVisibility: 'never' | 'hideForOtherTeams' | 'hideForOwnTeam' | 'always'
  prefix: JsonTextComponent
  seeFriendlyInvisibles: boolean

  /** Hey */
  suffix: JsonTextComponent
}

export class Team extends Command {
  /**
   * Creates a new team.
   *
   * @param team Specifies the name of the team.
   *
   * @param displayName Specifies the team name to be displayed.
   */
  @command(['team', 'add'], {
    isRoot: true,
    parsers: {
      '1': (displayName) => new JsonTextComponentClass(displayName),
    },
  })
  add = (team: string, displayName?: JsonTextComponent) => {}

  /**
   * Removes all members from a team.
   *
   * @param team Specifies the name of the team.
   */
  @command(['team', 'empty'], { isRoot: true })
  empty = (team: string) => {}

  /**
   * Makes specified entities join a team.
   *
   * @param team Specifies the name of the team.
   *
   * @param members Specifies the entities to join the team.
   * `'*'` may be used to represent all entities tracked by the scoreboard
   * If unspecified, defaults to the executor.
   */
  @command(['team', 'join'], { isRoot: true })
  join = (team: string, members?: MultipleEntitiesArgument | '*') => {}

  /**
   * Makes specified entities leave a team.
   *
   * @param members Specifies the entities to leave the team.
   * `'*'` may be used to represent all entities tracked by the scoreboard
   */
  @command(['team', 'join'], { isRoot: true })
  leave = (members: MultipleEntitiesArgument | '*') => {}

  /**
   * Lists all teams, or lists all members of a team if `team` is set.
   *
   * @param team Specifies the name of the team.
   */
  @command(['team', 'list'], { isRoot: true })
  list = (team?: string) => {}

  @command(['team', 'modify'], { isRoot: true })
  modify: (
    /**
     * Modifies the option of the team.
     *
     * Value must be one of the following:
     *
     * - `collisionRule`: Decide what entities entities on this team can push.
     *
     * - `color`: Decide the color of the team and players in chat, above their head, on the Tab menu, and on the sidebar.
     * Also changes the color of the outline of the entities caused by the Glowing effect.
     *
     * - `deathMessageVisibility`: Decide whose death messages can be seen in chat.
     *
     * - `displayName`: Set the display name of the team.
     *
     * - `friendlyFire`: Enable/Disable players inflicting damage on each other when on the same team.
     * (Note: players can still inflict status effects on each other.) Does not affect non-player entities on a team.
     *
     * - `nametagVisibility`: Decide whose name tags above their heads can be seen.
     *
     * - `prefix`: Modifies the prefix that appears before players' names in chat.
     *
     * - `seeFriendlyInvisibles`: Decide if players can see invisible players on their team as semi-transparent or completely invisible.
     *
     * - `suffix`: Modifies the suffix that appears after players' names in chat.
     */
    (<T extends keyof TeamOptions>(team: string, option: T, value: TeamOptions[T]) => void) &

    /*
     * Here, for the 2nd overload, we can't do Exclude<string, keyof TeamOptions> because this doesn't work in Typescript.
     * We need T to capture the exact value of the string (like "foo"),
     * and the type of the parameter becomes Exclude<"foo", keyof TeamOptions> which works.
     */

    /**
     * Modifies the option of the team.
     *
     * Value must be one of the following:
     *
     * - `collisionRule`: Decide what entities entities on this team can push.
     *
     * - `color`: Decide the color of the team and players in chat, above their head, on the Tab menu, and on the sidebar.
     * Also changes the color of the outline of the entities caused by the Glowing effect.
     *
     * - `deathMessageVisibility`: Decide whose death messages can be seen in chat.
     *
     * - `displayName`: Set the display name of the team.
     *
     * - `friendlyFire`: Enable/Disable players inflicting damage on each other when on the same team.
     * (Note: players can still inflict status effects on each other.) Does not affect non-player entities on a team.
     *
     * - `nametagVisibility`: Decide whose name tags above their heads can be seen.
     *
     * - `prefix`: Modifies the prefix that appears before players' names in chat.
     *
     * - `seeFriendlyInvisibles`: Decide if players can see invisible players on their team as semi-transparent or completely invisible.
     *
     * - `suffix`: Modifies the suffix that appears after players' names in chat.
     */
    (<T extends string>(team: string, option: Exclude<T, keyof TeamOptions>, value: string) => void)
  ) = (...args: unknown[]) => {}

  /**
   * Removes a team.
   *
   * @param team Specifies the name of the team.
   */
  @command(['team', 'remove'])
  remove = (team: string) => {}
}
