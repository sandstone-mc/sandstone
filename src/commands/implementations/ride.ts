import { CommandNode } from '#core'

import { CommandArguments } from '../helpers'

import type { SingleEntityArgument } from '#arguments'

export class RideCommandNode extends CommandNode {
  command = 'ride' as const
}

export class RideArgumentsCommand extends CommandArguments {
  /**
   * Adds the target as a passenger of the mount.
   *
   * @param mount Specifies the mount.
   */
  mount = (name: SingleEntityArgument) => this.finalCommand(['mount', name])

  /**
   * Dismounts the target if it is mounted.
   */
  dismount = () => this.finalCommand(['dismount'])
}

export class RideCommand extends CommandArguments {
  protected NodeType = RideCommandNode

  /**
   * Mounts or dismounts an individual entity
   *
   * @param target Specifies the command's target.
   */
  ride = (target: SingleEntityArgument) => this.subCommand([target], RideArgumentsCommand, false)
}
