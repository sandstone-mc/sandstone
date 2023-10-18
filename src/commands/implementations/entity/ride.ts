import { CommandNode } from 'sandstone/core'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { SingleEntityArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/variables'

export class RideCommandNode extends CommandNode {
  command = 'ride' as const
}

export class RideArgumentsCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Adds the target as a passenger of the mount.
   *
   * @param target Specifies the mount.
   */
  mount = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>) => this.finalCommand(['mount', targetParser(target)])

  /**
   * Dismounts the target if it is mounted.
   */
  dismount = () => this.finalCommand(['dismount'])
}

export class RideCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = RideCommandNode

  /**
   * Mounts or dismounts an individual entity
   *
   * @param target Specifies the command's target.
   */
  ride = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>) => this.subCommand([targetParser(target)], RideArgumentsCommand, false)
}
