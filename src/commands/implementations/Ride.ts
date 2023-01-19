import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

import type { SingleEntityArgument } from '@arguments'

export class RideArguments extends Command {
  /**
   * Adds the target as a passenger of the mount.
   *
   * @param mount Specifies the mount.
   */
  @command('mount')
    mount = (mount: SingleEntityArgument) => {}

  /**
   * Dismounts the target if it is mounted.
   */
  @command('dismount')
    dismount = () => {}
}

export class Ride extends Command {
  /**
   * Mounts or dismounts an individual entity
   *
   * @param target Specifies the command's target.
   */
  @command('ride', { isRoot: true, executable: false, hasSubcommands: true })
    ride = (target: SingleEntityArgument) => new RideArguments(this.commandsRoot)
}
