import type { SingleEntityArgumentOf } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class RideCommandNode extends CommandNode {
  command = 'ride' as const
}

export class RideArgumentsCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Adds the target as a passenger of the mount.
   *
   * @param target Specifies the mount.
   */
  mount = <T extends string>(target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>) => this.finalCommand(['mount', targetParser(target)])

  /**
   * Dismounts the target if it is mounted.
   */
  dismount = () => this.finalCommand(['dismount'])
}

export class RideCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = RideCommandNode

  /**
   * Control entity mounting and dismounting.
   *
   * @param target Entity to control mounting behavior for.
   *              Must be a single entity selector.
   *              Examples: '@p', '@e[type=horse,limit=1]', 'PlayerName'
   *
   * @example
   * ```ts
   * // Mount player on horse
   * ride('@p').mount('@e[type=horse,limit=1]')
   *
   * // Dismount player
   * ride('@p').dismount()
   *
   * // Mount specific entities
   * ride('@e[type=pig,limit=1]').mount('@e[type=chicken,limit=1]')
   * ride('PlayerName').mount('@e[type=boat,limit=1]')
   * ```
   */
  ride = <T extends string>(target: Macroable<SingleEntityArgumentOf<MACRO, T>, MACRO>) =>
    this.subCommand([targetParser(target)], RideArgumentsCommand, false)
}
