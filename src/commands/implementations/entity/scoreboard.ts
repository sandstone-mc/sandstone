/* eslint-disable max-len */
import { CommandNode } from 'sandstone/core'
import {
  JSONTextComponentClass, MacroArgument, Score, targetParser,
} from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type {
  DISPLAY_SLOTS, JSONTextComponent, MultipleEntitiesArgument, OBJECTIVE_CRITERION,
  ObjectiveArgument,
  OPERATORS,
} from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'
import type { Macroable } from 'sandstone/variables'

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

export class ScoreboardObjectivesModifyCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Change the display name of the scoreboard in display slots.
   *
   * @param displayName The new display name. Must be a JSON text component.
   */
  displayname = (displayName?: Macroable<JSONTextComponent, MACRO>) => this.finalCommand(
    [
      'displayname',
      /* @ts-ignore */
      (!displayName || (typeof displayName === 'object' && displayName.toMacro)) ? displayName : new JSONTextComponentClass(displayName)
    ]
  )

  /**
   * Change the display format of health bars.
   *
   * @param display Whether to display the health bars as hearts or integers.
   */

  rendertype = (display: Macroable<'hearts' | 'integer', MACRO>) => this.finalCommand(['rendertype', display])
}

export class ScoreboardCommand<MACRO extends boolean> extends CommandArguments {
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
    add: (objective: Macroable<ObjectiveArgument, MACRO>, criteria: Macroable<LiteralUnion<OBJECTIVE_CRITERION>, MACRO>, displayName?: Macroable<JSONTextComponent, MACRO>) => this.finalCommand(
      /* @ts-ignore */
      ['objectives', 'add', objective, criteria, (!displayName || (typeof displayName === 'object' && displayName.toMacro)) ? displayName : new JSONTextComponentClass(displayName)],
    ),

    /**
     * Delete all references to the named objective in the scoreboard system.
     * Data is deleted from the objectives list and entity scores,
     * and if it was on a display list it is no longer displayed
     */
    remove: (objective: Macroable<ObjectiveArgument, MACRO>) => this.finalCommand(['remove', objective]),

    /**
     * Display score info for the objective in the given slot.
     *
     * @param slot The slot to display the objective in.
     *
     * @param objective The objective to display. If not provided, this display slot is cleared.
     */
    setdisplay: (slot: Macroable<DISPLAY_SLOTS, MACRO>, objective?: Macroable<ObjectiveArgument, MACRO>) => this.finalCommand(['setdisplay', slot, objective]),

    /**
     * Modify the display of the objective.
     *
     * @param objective The objective to modify.
     */
    modify: (objective: Macroable<ObjectiveArgument, MACRO>) => this.subCommand(['modify', objective], ScoreboardObjectivesModifyCommand, false),
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
    list: (target?: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) => this.finalCommand(['players', 'list', targetParser(target)]),

    /**
     * Return the scoreboard value of a given objective for a given target.
     *
     * @param target The entity to get the score from.
     *
     * @param objective The objective to get the score from.
     */
    get: (
      ...args: [target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>, objective: Macroable<ObjectiveArgument, MACRO>] | [target: Macroable<Score, MACRO>]
    ) => this.finalCommand(['players', 'get', ...scoresParser(...args)]),

    set: (
      ...args: [..._: ([target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>, objective: Macroable<ObjectiveArgument, MACRO>] | [target: Macroable<Score, MACRO>]), score: Macroable<number, MACRO>]
    ) => this.finalCommand(['players', 'set', ...scoresParser(args)]),

    add: (
      ...args: [..._: ([target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>, objective: Macroable<ObjectiveArgument, MACRO>] | [target: Macroable<Score, MACRO>]), score: Macroable<number, MACRO>]
    ) => this.finalCommand(['players', 'add', ...scoresParser(args)]),

    remove: (
      ...args: [..._: ([target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>, objective: Macroable<ObjectiveArgument, MACRO>] | [target: Macroable<Score, MACRO>]), score: Macroable<number, MACRO>]
    ) => this.finalCommand(['players', 'remove', ...scoresParser(args)]),

    reset: (...args: [target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>, objective: Macroable<ObjectiveArgument, MACRO>] | [target: Macroable<Score, MACRO>]) => this.finalCommand(['players', 'reset', ...scoresParser(...args)]),

    enable: (...args: [target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>, objective: Macroable<ObjectiveArgument, MACRO>] | [target: Macroable<Score, MACRO>]) => this.finalCommand(['players', 'enable', ...scoresParser(...args)]),

    operation: (...args: [
      ...target: [target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>, targetObjective: Macroable<ObjectiveArgument, MACRO>] | [targetScore: Macroable<Score, MACRO>],
      operation: OPERATORS,
      ...source: [source: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>, sourceObjective: Macroable<ObjectiveArgument, MACRO>] | [sourceScore: Macroable<Score, MACRO>],
  ]) => this.finalCommand(['players', 'operation', ...scoresParser(...args)]),
  }
}
