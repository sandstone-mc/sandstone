import { CommandNode } from '#core'
import { JSONTextComponentClass, Score, targetParser } from '#variables'

import { CommandArguments } from '../../helpers'

import type {
  DISPLAY_SLOTS, JSONTextComponent, MultipleEntitiesArgument, OBJECTIVE_CRITERION,
  ObjectiveArgument,
  OPERATORS,
} from '#arguments'
import type { LiteralUnion } from '#utils'

function scoresParser(...args: unknown[]) {
  return args.map((_arg, i) => {
    const arg = _arg as any
    if (arg instanceof Score) {
      return [arg.target, arg.objective]
    }
    if (arg?._toSelector) {
      return [arg._toSelector()]
    }
    return [arg]
  }).flat(+Infinity)
}

export class ScoreboardCommandNode extends CommandNode {
  command = 'scoreboard' as const
}

export class ScoreboardObjectivesModifyCommand extends CommandArguments {
  /**
   * Change the display name of the scoreboard in display slots.
   *
   * @param displayName The new display name. Must be a JSON text component.
   */
  displayname = (displayName?: JSONTextComponent) => this.finalCommand(['displayname', displayName ? new JSONTextComponentClass(displayName) : undefined])

  /**
   * Change the display format of health bars.
   *
   * @param display Whether to display the health bars as hearts or integers.
   */

  rendertype = (display: 'hearts' | 'integer') => this.finalCommand(['rendertype', display])
}

export class ScoreboardCommand extends CommandArguments {
  protected NodeType = ScoreboardCommandNode

  /** All commands related to scoreboard objectives. */
  objectives = {
    /** List all existing objectives with their display names and criteria. */
    list: () => this.finalCommand(['objectives', 'list']),

    /**
     * Create a new objective with the given internal objective name, specified criterion, and the optional display name.
     * All three arguments are case-sensitive.
     *
     * @param objective must be a plain text.
     *
     * @param criterion must be a valid criterion type.
     *
     * @param displayName must be a JSON text component, defaulting to `objective` when unspecified.
     */
    add: (objective: ObjectiveArgument, criteria: LiteralUnion<OBJECTIVE_CRITERION>, displayName?: JSONTextComponent) => this.finalCommand(
      ['objectives', 'add', objective, criteria, displayName ? new JSONTextComponentClass(displayName) : displayName],
    ),

    /**
     * Delete all references to the named objective in the scoreboard system.
     * Data is deleted from the objectives list and entity scores,
     * and if it was on a display list it is no longer displayed
     */
    remove: (objective: ObjectiveArgument) => this.finalCommand(['remove', objective]),

    /**
     * Display score info for the objective in the given slot.
     *
     * @param slot The slot to display the objective in.
     *
     * @param objective The objective to display. If not provided, this display slot is cleared.
     */
    setdisplay: (slot: DISPLAY_SLOTS, objective?: ObjectiveArgument) => this.finalCommand(['setdisplay', slot, objective]),

    /**
     * Modify the display of the objective.
     *
     * @param objective The objective to modify.
     */
    modify: (objective: ObjectiveArgument) => this.subCommand(['modify', objective], ScoreboardObjectivesModifyCommand, false),
  }

  /** All commands related to scoreboard players. */
  players = {
    /**
     * If `target` is omitted, lists all entities which are tracked in some way by the scoreboard system.
     *
     * Else, lists the scores of a particular entity.
     *
     * @param target The entity to list the scores from.
     */
    list: (target?: MultipleEntitiesArgument) => this.finalCommand(['players', 'list', targetParser(target)]),

    /**
     * Return the scoreboard value of a given objective for a given target.
     *
     * @param target The entity to get the score from.
     *
     * @param objective The objective to get the score from.
     */
    get: (
      ...args: [target: MultipleEntitiesArgument | number, objective: ObjectiveArgument] | [target: Score]
    ) => this.finalCommand(['players', 'get', ...scoresParser(...args)]),

    set: (
      ...args: [..._: ([target: MultipleEntitiesArgument | number, objective: ObjectiveArgument] | [target: Score]), score: number]
    ) => this.finalCommand(['players', 'set', ...scoresParser(args)]),

    add: (
      ...args: [..._: ([target: MultipleEntitiesArgument | number, objective: ObjectiveArgument] | [target: Score]), score: number]
    ) => this.finalCommand(['players', 'add', ...scoresParser(args)]),

    remove: (
      ...args: [..._: ([target: MultipleEntitiesArgument | number, objective: ObjectiveArgument] | [target: Score]), score: number]
    ) => this.finalCommand(['players', 'remove', ...scoresParser(args)]),

    reset: (...args: [target: MultipleEntitiesArgument | number, objective: ObjectiveArgument] | [target: Score]) => this.finalCommand(['players', 'reset', ...scoresParser(...args)]),

    enable: (...args: [target: MultipleEntitiesArgument | number, objective: ObjectiveArgument] | [target: Score]) => this.finalCommand(['players', 'enable', ...scoresParser(...args)]),

    operation: (...args: [
      ...target: [target: MultipleEntitiesArgument | number, targetObjective: ObjectiveArgument] | [targetScore: Score],
      operation: OPERATORS,
      ...source: [source: MultipleEntitiesArgument | number, sourceObjective: ObjectiveArgument] | [sourceScore: Score],
  ]) => this.finalCommand(['players', 'operation', ...scoresParser(...args)]),
  }
}
