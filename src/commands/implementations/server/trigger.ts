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
   * Modifies a scoreboard objective with a "trigger" criterion.
   * Allows non-operator players to modify their own scoreboard objectives under tightly controlled conditions.
   * Often used to let players activate systems made by operators or mapmakers.
   *
   * @param objective An enabled scoreboard objective with the "trigger" criterion.
   *
   * @example
   *
   * // Adds 1 to the current value of `myobjective`.
   * trigger('myobjective')
   *
   * // Adds 2 to the current value of `objective`
   * trigger('myobjective').add(2)
   *
   * // Sets the value of `objective` to 5
   * trigger('myobjective').set(5)
   *
   * // If you created an objective via createObjective, and it is enabled, you can use it:
   * trigger(myObjective).add(2)
   */
  trigger = (objective: ObjectiveArgument) => this.subCommand([objective], TriggerArgumentsCommand, false)
}
