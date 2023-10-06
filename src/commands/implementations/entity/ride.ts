import { targetParser } from 'sandstone/variables/parsers.js'
import { CommandNode } from 'sandstone/core/index.js'

import { CommandArguments } from '../../helpers.js'

import type { SingleEntityArgument } from 'sandstone/arguments/index.js'

export class RideCommandNode extends CommandNode {
  command = 'ride' as const
}

export class RideArgumentsCommand extends CommandArguments {
  /**
   * Adds the target as a passenger of the mount.
   *
   * @param target Specifies the mount.
   */
  mount = (target: SingleEntityArgument) => this.finalCommand(['mount', targetParser(target)])

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
  ride = (target: SingleEntityArgument) => this.subCommand([targetParser(target)], RideArgumentsCommand, false)
}
