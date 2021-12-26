import { JSONTextComponentParser } from '@variables'

import { Command } from '../Command'
import { command } from '../decorators'

import type { LiteralUnion } from '@/generalTypes'
import type {
  JSONTextComponent, MultipleEntitiesArgument, OBJECTIVE_CRITERION,
  ObjectiveArgument, OPERATORS,
} from '@arguments'
import type { DISPLAY_SLOTS } from '@arguments/displaySlots'

function objectiveCmd(subcommand: string) {
  return ['scoreboard', 'objectives', subcommand]
}

function playersCmd(...subcommands: string[]) {
  return ['scoreboard', 'players', ...subcommands]
}

class ScoreboardObjectives extends Command {
  /** List all existing objectives with their display names and criteria. */
  @command(objectiveCmd('list'), { isRoot: true })
  list = () => {}

  /**
   * Create a new objective with the given internal objective name, specified criterion, and the optional display name.
   * All three arguments are case-sensitive.
   *
   * --------------------------------------------------
   * ⚠️ The prefered way is using:
   * ```
   * const objective = Objective.create(...)
   * ```
   * --------------------------------------------------
   *
   * @param objective must be a plain text.
   *
   * @param criterion must be a valid criterion type.
   *
   * @param displayName must be a JSON text component, defaulting to `objective` when unspecified.
   */
  @command(objectiveCmd('add'), {
    isRoot: true,
    parsers: {
      '2': (displayName) => (displayName ? new JSONTextComponentParser(displayName) : displayName),
    },
  })
  add = (objective: string, criteria: LiteralUnion<OBJECTIVE_CRITERION>, displayName?: JSONTextComponent) => {}

  /**
   * Delete all references to the named objective in the scoreboard system.
   * Data is deleted from the objectives list and entity scores,
   * and if it was on a display list it is no longer displayed.
   *
   * --------------------------------------------------
   * ⚠️ The prefered way is using:
   * ```
   * const objective = Objective.create(...)
   * objective.remove()
   * ```
   * --------------------------------------------------
   */
  @command(objectiveCmd('remove'), { isRoot: true })
  remove = (objective: ObjectiveArgument) => {}

  /**
   * Display score info for the objective in the given slot.
   *
   * --------------------------------------------------
   * ⚠️ The prefered way is using:
   * ```
   * const objective = Objective.create(...)
   * objective.setDisplay(...)
   * ```
   * --------------------------------------------------
   *
   * @param slot The slot to display the objective in.
   *
   * @param objective The objective to display. If not provided, this display slot is cleared.
   */
  @command(objectiveCmd('setdisplay'), { isRoot: true })
  setDisplay = (slot: DISPLAY_SLOTS, objective?: ObjectiveArgument) => {}

  @command(objectiveCmd('modify'), {
    isRoot: true,
    parsers: {
      '2': (displayName, [_, type]) => (type === 'displayname' ? new JSONTextComponentParser(displayName) : displayName),
    },
  })
  modify: (
  /**
   * Change the display name of the scoreboard in display slots.
   *
   * --------------------------------------------------
   * ⚠️ The prefered way is using:
   * ```
   * const objective = Objective.create(...)
   * objective.modify(...)
   * ```
   * --------------------------------------------------
   *
   * @param objective The objective to change.
   *
   * @param displayName The new display name. Must be a JSON text component.
   */
  ((objective: ObjectiveArgument, type: 'displayname', displayName?: JSONTextComponent) => void) &

  /**
   * Change the display format of health bars.
   *
   * --------------------------------------------------
   * ⚠️ The prefered way is using:
   * ```
   * const objective = Objective.create(...)
   * objective.modify(...)
   * ```
   * --------------------------------------------------
   *
   * @param objective The objective to change.
   *
   * @param display Whether to display the health bars as hearts or integers.
   */
  ((objective: ObjectiveArgument, type: 'rendertype', display: 'hearts' | 'integer') => void)
  ) = (...args: unknown[]) => {}
}

class ScoreboardPlayers extends Command {
  @command(playersCmd('list'), { isRoot: true })
  list: (
    /**
     * Lists all entities which are tracked in some way by the scoreboard system.
     */
    (() => void) &

    /**
     * Lists the scores of a particular entity.
     *
     * --------------------------------------------------
     * ⚠️ The prefered way is using:
     * ```
     * const player = Selector(...)
     * player.listScores()
     * ```
     * --------------------------------------------------
     *
     * @param target The entity to list the scores from.
     */
    ((target: MultipleEntitiesArgument | number) => void)
  ) = (target?: unknown) => {}

  /**
   * Return the scoreboard value of a given objective for a given target.
   *
   * --------------------------------------------------
   * ⚠️ The prefered way is using:
   * ```
   * const objective = Objective.create(...)
   * const player = objective.ScoreHolder(...)
   * player.get()
   * ```
   * --------------------------------------------------
   *
   * @param target The entity to get the score from.
   *
   * @param objective The objective to get the score from.
   */
  @command(playersCmd('get'), { isRoot: true })
  get = (target: MultipleEntitiesArgument | number, objective: ObjectiveArgument) => {}

  @command(playersCmd('set'), { isRoot: true })
  set = (target: MultipleEntitiesArgument | number, objective: ObjectiveArgument, score: number) => {}

  @command(playersCmd('add'), { isRoot: true })
  add = (target: MultipleEntitiesArgument | number, objective: ObjectiveArgument, score: number) => {}

  @command(playersCmd('remove'), { isRoot: true })
  remove = (target: MultipleEntitiesArgument | number, objective: ObjectiveArgument, score: number) => {}

  @command(playersCmd('reset'), { isRoot: true })
  reset = (target: MultipleEntitiesArgument | number, objective: ObjectiveArgument) => {}

  @command(playersCmd('enable'), { isRoot: true })
  enable = (target: MultipleEntitiesArgument | number, objective: ObjectiveArgument) => {}

  @command(playersCmd('operation'), { isRoot: true })
  operation = (
    targets: MultipleEntitiesArgument | number,
    targetObjective: ObjectiveArgument,
    operation: OPERATORS,
    source: MultipleEntitiesArgument | number,
    sourceObjective: ObjectiveArgument,
  ) => {}
}

export class Scoreboard extends Command {
  /** All commands related to scoreboard objectives. */
  objectives = (new ScoreboardObjectives(this.commandsRoot))

  /** All commands related to scoreboard players. */
  players = (new ScoreboardPlayers(this.commandsRoot))
}
