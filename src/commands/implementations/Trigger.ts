import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

import type { ObjectiveArgument } from 'src/arguments'

export class TriggerArguments extends Command {
    /**
     * Adds `value` to the current value of `objective`.
     *
     * @param value the value to add.
     */
    @command('add')
    add = (value: number) => {}

    /**
     * Sets the value of `objective` to `value`.
     *
     * @param value the new value.
     */
    @command('add')
    set = (value: number) => {}
}

export class Trigger extends Command {
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
    @command('trigger', { isRoot: true, hasSubcommands: true })
    trigger = (objective: ObjectiveArgument) => new TriggerArguments(this.commandsRoot)
}
