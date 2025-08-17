import type { ObjectiveArgument } from 'sandstone/arguments'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments } from '../../helpers.js'

export class TriggerCommandNode extends CommandNode {
  command = 'trigger' as const
}

export class TriggerArgumentsCommand extends CommandArguments {
  /**
   * Adds `value` to the current value of `objective`.
   *
   * @param value the value to add.
   */
  add = (value: number) => this.finalCommand(['add', value])

  /**
   * Sets the value of `objective` to `value`.
   *
   * @param value the new value.
   */
  set = (value: number) => this.finalCommand(['set', value])
}

export class TriggerCommand extends CommandArguments {
  protected NodeType = TriggerCommandNode

  /**
   * Modify trigger scoreboard objective.
   *
   * @param objective Trigger-type objective to modify.
   *                 Must be enabled for the player executing the command.
   *                 Examples: 'my_trigger', triggerObjective
   *
   * @example
   * ```ts
   * trigger('my_trigger')              // Add 1 to trigger
   * trigger('settings').add(5)         // Add 5 to settings trigger
   * trigger('menu').set(3)             // Set menu trigger to 3
   * trigger(myTriggerObj).add(10)      // Use Sandstone objective
   * ```
   */
  trigger = (objective: ObjectiveArgument) => this.subCommand([objective], TriggerArgumentsCommand, false)
}
