/* eslint-disable max-len */

import type {
  DISPLAY_SLOTS,
  FormattingTags,
  JSONTextComponent,
  MultipleEntitiesArgument,
  OBJECTIVE_CRITERION,
  ObjectiveArgument,
  OPERATORS,
} from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import type { Score } from 'sandstone/variables'
import { parseJSONText } from 'sandstone/variables/JSONTextComponentClass'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

// Yes this sucks

const isScore = (arg: any): arg is Score => typeof arg === 'object' && Object.hasOwn(arg, 'setDisplay')

function scoresParser(...args: unknown[]) {
  return args
    .map((_arg, i) => {
      const arg = _arg as any
      if (isScore(arg)) {
        return [arg.target, arg.objective]
      }
      if (arg?._toSelector) {
        return [arg._toSelector()]
      }
      return [arg]
    })
    .flat(Number.POSITIVE_INFINITY)
}

export class ScoreboardCommandNode extends CommandNode {
  command = 'scoreboard' as const
}

export class ScoreboardObjectivesModifyCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Change the display name of the scoreboard in display slots.
   * 
   * Modifies how the objective appears in display slots like sidebar, belowName, or playerlist.
   *
   * @param displayName The new display name. Must be a JSON text component. Can include formatting, colors, and interactive elements.
   * 
   * @example
   * ```ts
   * scoreboard.objectives.modify('kills').displayname({text: 'Player Kills', color: 'red'})
   * ```
   */
  displayname = (displayName?: Macroable<JSONTextComponent, MACRO>) =>
    this.finalCommand(['displayname', parseJSONText(this.sandstoneCore, displayName)])

  /**
   * Change the display format of scores in this objective.
   * 
   * Controls whether scores are displayed as hearts (❤) or as plain integers.
   * Only affects objectives with 'health' criterion when displayed in certain slots.
   *
   * @param display The render type - 'hearts' shows as heart icons, 'integer' shows as numbers.
   * 
   * @example
   * ```ts
   * scoreboard.objectives.modify('health').rendertype('hearts')
   * ```
   */
  rendertype = (display: Macroable<'hearts' | 'integer', MACRO>) => this.finalCommand(['rendertype', display])
}

export class ScoreboardCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ScoreboardCommandNode

  /** 
   * All commands related to scoreboard objectives.
   * 
   * Objectives are containers for scores that track specific criteria like deaths, kills, health, etc.
   * Each objective has an internal name, a criterion that determines how scores change, and an optional display name.
   */
  objectives = {
    /** 
     * List all existing objectives with their display names and criteria.
     * 
     * Shows all objectives currently registered in the scoreboard system.
     * 
     * @example
     * ```ts
     * scoreboard.objectives.list()
     * ```
     */
    list: () => this.finalCommand(['objectives', 'list']),

    /**
     * Create a new objective with the given internal objective name, specified criterion, and optional display name.
     * 
     * Objectives track scores for entities based on the specified criterion. Common criteria include:
     * - 'dummy': manually set scores that don't change automatically
     * - 'deathCount': automatically increments when entities die
     * - 'playerKillCount': increments when players kill other players
     * - 'health': tracks current health (hearts * 2)
     * 
     * All arguments are case-sensitive.
     *
     * @param objective The internal name for this objective. Must be unique and contain only allowed characters.
     * @param criteria The criterion that determines how this objective's scores change. Must be a valid criterion type.
     * @param displayName Optional display name shown in interfaces. Defaults to the objective name if not specified. Supports JSON text formatting.
     * 
     * @example
     * ```ts
     * scoreboard.objectives.add('deaths', 'deathCount', {text: 'Player Deaths', color: 'red'})
     * scoreboard.objectives.add('money', 'dummy')
     * ```
     */
    add: (
      objective: Macroable<ObjectiveArgument, MACRO>,
      criteria: Macroable<LiteralUnion<OBJECTIVE_CRITERION>, MACRO>,
      displayName?: Macroable<JSONTextComponent, MACRO>,
    ) =>
      this.finalCommand(
        /* @ts-ignore */
        ['objectives', 'add', objective, criteria, parseJSONText(displayName)],
      ),

    /**
     * Delete all references to the named objective in the scoreboard system.
     * 
     * Completely removes the objective and all associated data:
     * - Removes the objective from the objectives list
     * - Deletes all entity scores for this objective
     * - Clears the objective from any display slots
     * 
     * This action cannot be undone.
     *
     * @param objective The internal name of the objective to remove.
     * 
     * @example
     * ```ts
     * scoreboard.objectives.remove('deaths')
     * ```
     */
    remove: (objective: Macroable<ObjectiveArgument, MACRO>) => this.finalCommand(['objectives', 'remove', objective]),

    /**
     * Display score info for the objective in the given slot.
     * 
     * Shows objective scores in specific display locations:
     * - 'sidebar': right side of the screen
     * - 'list': tab player list (shows next to player names)
     * - 'belowName': below player nameplates in-world
     * 
     * Only one objective can be displayed per slot at a time.
     *
     * @param slot The display slot where the objective should appear.
     * @param objective The objective to display. If omitted, clears the display slot.
     * 
     * @example
     * ```ts
     * scoreboard.objectives.setdisplay('sidebar', 'deaths')
     * scoreboard.objectives.setdisplay('list') // clears list display
     * ```
     */
    setdisplay: (slot: Macroable<DISPLAY_SLOTS, MACRO>, objective?: Macroable<ObjectiveArgument, MACRO>) =>
      this.finalCommand(['objectives', 'setdisplay', slot, objective]),

    /**
     * Modify display properties of an existing objective.
     * 
     * Allows changing how an objective appears without recreating it.
     * You can modify the display name and render type (for health objectives).
     *
     * @param objective The internal name of the objective to modify.
     * 
     * @example
     * ```ts
     * scoreboard.objectives.modify('health').displayname({text: 'HP', color: 'green'})
     * scoreboard.objectives.modify('health').rendertype('hearts')
     * ```
     */
    modify: (objective: Macroable<ObjectiveArgument, MACRO>) =>
      this.subCommand(['objectives', 'modify', objective], ScoreboardObjectivesModifyCommand, false),
  }

  /** 
   * All commands related to scoreboard players.
   * 
   * Player commands manage individual entity scores within objectives.
   * These work with any entity (players, mobs, etc.) that can have scores.
   */
  players = {
    /**
     * List entities tracked by the scoreboard system or scores for a specific entity.
     * 
     * When called without arguments, shows all entities that have scores in any objective.
     * When called with a target, shows all scores for that specific entity across all objectives.
     *
     * @param target Optional entity selector or player name. If omitted, lists all tracked entities.
     * 
     * @example
     * ```ts
     * scoreboard.players.list() // List all tracked entities
     * scoreboard.players.list('@p') // List all scores for nearest player
     * scoreboard.players.list('Steve') // List all scores for player 'Steve'
     * ```
     */
    list: (target?: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) =>
      this.finalCommand(['players', 'list', targetParser(target)]),

    /**
     * Get the score value for a specific entity and objective.
     * 
     * Returns the current score as a command result. Useful for conditional execution 
     * or storing results in other objectives.
     *
     * @param target The entity to get the score from, or a Score object.
     * @param objective The objective to get the score from (not needed if using Score object).
     * 
     * @example
     * ```ts
     * scoreboard.players.get('@p', 'deaths') // Get death count for nearest player
     * scoreboard.players.get('Steve', 'money') // Get money for player 'Steve'
     * 
     * const playerScore = Score.of('@p', 'kills')
     * scoreboard.players.get(playerScore) // Using Score object
     * ```
     */
    get: (
      ...args:
        | [
            target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>,
            objective: Macroable<ObjectiveArgument, MACRO>,
          ]
        | [target: Macroable<Score, MACRO>]
    ) => this.finalCommand(['players', 'get', ...scoresParser(...args)]),

    /**
     * Set the score for a specific entity and objective to an exact value.
     * 
     * Overwrites any existing score with the specified value.
     * This is the primary way to assign scores in 'dummy' objectives.
     *
     * @param target The entity to set the score for, or a Score object.
     * @param objective The objective to set the score in (not needed if using Score object).
     * @param score The exact value to set the score to.
     * 
     * @example
     * ```ts
     * scoreboard.players.set('@p', 'money', 100) // Set player money to 100
     * scoreboard.players.set('Steve', 'level', 50) // Set Steve's level to 50
     * 
     * const playerScore = Score.of('@p', 'health')
     * scoreboard.players.set(playerScore, 20) // Set to full health (20 = 10 hearts)
     * ```
     */
    set: (
      ...args: [
        ..._:
          | [
              target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>,
              objective: Macroable<ObjectiveArgument, MACRO>,
            ]
          | [target: Macroable<Score, MACRO>],
        score: Macroable<number, MACRO>,
      ]
    ) => this.finalCommand(['players', 'set', ...scoresParser(args)]),

    /**
     * Add a value to the existing score for a specific entity and objective.
     * 
     * Increases the current score by the specified amount. Use negative values to subtract.
     * If the entity has no existing score, it starts from 0.
     *
     * @param target The entity to modify the score for, or a Score object.
     * @param objective The objective to modify the score in (not needed if using Score object).
     * @param score The amount to add to the current score. Can be negative to subtract.
     * 
     * @example
     * ```ts
     * scoreboard.players.add('@p', 'money', 50) // Give player 50 money
     * scoreboard.players.add('Steve', 'experience', -10) // Remove 10 experience
     * 
     * const playerScore = Score.of('@p', 'kills')
     * scoreboard.players.add(playerScore, 1) // Increment kill count by 1
     * ```
     */
    add: (
      ...args: [
        ..._:
          | [
              target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>,
              objective: Macroable<ObjectiveArgument, MACRO>,
            ]
          | [target: Macroable<Score, MACRO>],
        score: Macroable<number, MACRO>,
      ]
    ) => this.finalCommand(['players', 'add', ...scoresParser(args)]),

    /**
     * Subtract a value from the existing score for a specific entity and objective.
     * 
     * Decreases the current score by the specified amount. Use negative values to add.
     * If the entity has no existing score, it starts from 0 then subtracts.
     *
     * @param target The entity to modify the score for, or a Score object.
     * @param objective The objective to modify the score in (not needed if using Score object).
     * @param score The amount to subtract from the current score. Can be negative to add.
     * 
     * @example
     * ```ts
     * scoreboard.players.remove('@p', 'money', 25) // Take away 25 money
     * scoreboard.players.remove('Steve', 'health', 4) // Remove 2 hearts (4 health points)
     * 
     * const playerScore = Score.of('@p', 'ammo')
     * scoreboard.players.remove(playerScore, 1) // Use 1 ammo
     * ```
     */
    remove: (
      ...args: [
        ..._:
          | [
              target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>,
              objective: Macroable<ObjectiveArgument, MACRO>,
            ]
          | [target: Macroable<Score, MACRO>],
        score: Macroable<number, MACRO>,
      ]
    ) => this.finalCommand(['players', 'remove', ...scoresParser(args)]),

    /**
     * Reset (remove) the score entry for a specific entity and objective.
     * 
     * Completely removes the score entry, making it as if the entity never had a score
     * in that objective. The entity will no longer appear in score listings for that objective.
     * 
     * This is different from setting the score to 0 - reset actually removes the entry.
     *
     * @param target The entity to reset the score for, or a Score object.
     * @param objective The objective to reset the score in (not needed if using Score object).
     * 
     * @example
     * ```ts
     * scoreboard.players.reset('@p', 'deaths') // Remove player's death count entry
     * scoreboard.players.reset('Steve', 'temp_score') // Clear Steve's temporary score
     * 
     * const playerScore = Score.of('@p', 'quest_progress')
     * scoreboard.players.reset(playerScore) // Reset quest progress
     * ```
     */
    reset: (
      ...args:
        | [
            target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>,
            objective: Macroable<ObjectiveArgument, MACRO>,
          ]
        | [target: Macroable<Score, MACRO>]
    ) => this.finalCommand(['players', 'reset', ...scoresParser(...args)]),

    /**
     * Enable a trigger objective for a specific entity.
     * 
     * Only works with objectives that have the 'trigger' criterion.
     * Trigger objectives are disabled by default and must be enabled for each entity
     * before they can be used. Once triggered, they automatically disable again.
     * 
     * This is commonly used for player-activated systems like GUI interactions.
     *
     * @param target The entity to enable the trigger for, or a Score object.
     * @param objective The trigger objective to enable (not needed if using Score object).
     * 
     * @example
     * ```ts
     * // First create a trigger objective
     * scoreboard.objectives.add('gui_click', 'trigger')
     * 
     * // Enable it for a player
     * scoreboard.players.enable('@p', 'gui_click')
     * 
     * const triggerScore = Score.of('@p', 'shop_trigger')
     * scoreboard.players.enable(triggerScore)
     * ```
     */
    enable: (
      ...args:
        | [
            target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>,
            objective: Macroable<ObjectiveArgument, MACRO>,
          ]
        | [target: Macroable<Score, MACRO>]
    ) => this.finalCommand(['players', 'enable', ...scoresParser(...args)]),

    /**
     * Perform mathematical operations between two scores.
     * 
     * Applies the specified operation using the source score as the operand.
     * The target score is modified, while the source score remains unchanged.
     * 
     * Available operations:
     * - '=': Assign (target = source)
     * - '+=': Add (target += source)
     * - '-=': Subtract (target -= source)
     * - '*=': Multiply (target *= source)
     * - '/=': Divide (target /= source, integer division)
     * - '%=': Modulo (target %= source)
     * - '<': Minimum (target = min(target, source))
     * - '>': Maximum (target = max(target, source))
     * - '><': Swap (target <-> source)
     *
     * @param target The entity and objective to modify, or a Score object.
     * @param targetObjective The target objective (not needed if using Score object).
     * @param operation The mathematical operation to perform.
     * @param source The entity and objective to use as the operand, or a Score object.
     * @param sourceObjective The source objective (not needed if using Score object).
     * 
     * @example
     * ```ts
     * // Copy one score to another
     * scoreboard.players.operation('@p', 'display_money', '=', '@p', 'money')
     * 
     * // Add two scores together
     * scoreboard.players.operation('Steve', 'total_score', '+=', 'Steve', 'bonus_points')
     * 
     * // Using Score objects
     * const playerHealth = Score.of('@p', 'health')
     * const maxHealth = Score.of('$constants', 'max_health')
     * scoreboard.players.operation(playerHealth, '<', maxHealth) // Cap health
     * ```
     */
    operation: (
      ...args: [
        ...target:
          | [
              target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>,
              targetObjective: Macroable<ObjectiveArgument, MACRO>,
            ]
          | [targetScore: Macroable<Score, MACRO>],
        operation: OPERATORS,
        ...source:
          | [
              source: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>,
              sourceObjective: Macroable<ObjectiveArgument, MACRO>,
            ]
          | [sourceScore: Macroable<Score, MACRO>],
      ]
    ) => this.finalCommand(['players', 'operation', ...scoresParser(...args)]),

    /**
     * Commands for customizing how individual player scores are displayed.
     * 
     * These affect how scores appear in various display contexts like sidebars,
     * player lists, and below-name displays.
     */
    display: {
      /**
       * Set a custom display name for a specific entity's score entry.
       * 
       * Changes how the entity's name appears in scoreboards without affecting
       * the actual entity name. Useful for creating custom labels or formatted displays.
       *
       * @param target The entity whose display name to change, or a Score object.
       * @param targetObjective The objective for the display name (not needed if using Score object).
       * @param name The custom display name as a JSON text component. Supports formatting and colors.
       * 
       * @example
       * ```ts
       * // Custom name in sidebar
       * scoreboard.players.display.name('@p', 'money', {text: 'Your Coins', color: 'gold'})
       * 
       * // Using Score object
       * const playerScore = Score.of('Steve', 'level')
       * scoreboard.players.display.name(playerScore, {text: 'Steve [ADMIN]', color: 'red'})
       * ```
       */
      name: (
        ...args: [
          ...target:
            | [
                target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>,
                targetObjective: Macroable<ObjectiveArgument, MACRO>,
              ]
            | [targetScore: Macroable<Score, MACRO>],
          name: Macroable<JSONTextComponent, MACRO>,
        ]
      ) => {
        if (isScore(args[1])) {
          args[1] = parseJSONText(this.sandstoneCore, args[1] as JSONTextComponent) as any
        } else {
          args[2] = parseJSONText(this.sandstoneCore, args[2] as JSONTextComponent) as any
        }
        return this.finalCommand(['players', 'display', 'name', ...scoresParser(...args)])
      },

      /**
       * Set a custom number format for how a specific entity's score is displayed.
       * 
       * Controls the visual representation of the score number itself:
       * - 'blank': Score is hidden (shows only the name)
       * - 'styled': Apply text formatting to the number
       * - 'fixed': Replace the number with custom text
       *
       * @param target The entity whose number format to change, or a Score object.
       * @param targetObjective The objective for the number format (not needed if using Score object).
       * @param format The format type: 'blank', 'styled', or 'fixed'.
       * @param style For 'styled' format: formatting tags to apply to the number.
       * @param rightColumn For 'fixed' format: custom text to show instead of the number.
       * 
       * @example
       * ```ts
       * // Hide the number, show only name
       * scoreboard.players.display.numberformat('@p', 'status', 'blank')
       * 
       * // Style the number with color
       * scoreboard.players.display.numberformat('@p', 'money', 'styled', {color: 'green'})
       * 
       * // Replace number with custom text
       * scoreboard.players.display.numberformat('@p', 'health', 'fixed', {text: '❤❤❤', color: 'red'})
       * ```
       */
      numberformat: (
        ...args: [
          ...target:
            | [
                target: Macroable<MultipleEntitiesArgument<MACRO> | number, MACRO>,
                targetObjective: Macroable<ObjectiveArgument, MACRO>,
              ]
            | [targetScore: Macroable<Score, MACRO>],
          ...format:
            | [format: 'blank']
            | [format: 'styled', style: Macroable<FormattingTags, MACRO>]
            | [format: 'fixed', rightColumn: Macroable<JSONTextComponent, MACRO>],
        ]
      ) => {
        if (args[1] === 'styled') {
          args[2] = parseJSONText(this.sandstoneCore, args[2] as JSONTextComponent) as any
        }
        if (args[2] === 'styled') {
          args[3] = parseJSONText(this.sandstoneCore, args[3] as JSONTextComponent) as any
        }
        if (args[1] === 'fixed') {
          args[2] = parseJSONText(this.sandstoneCore, args[2] as JSONTextComponent) as any
        }
        if (args[2] === 'fixed') {
          args[3] = parseJSONText(this.sandstoneCore, args[3] as JSONTextComponent) as any
        }
        return this.finalCommand(['players', 'display', 'numberformat', ...scoresParser(...args)])
      },
    } as const,
  } as const
}
