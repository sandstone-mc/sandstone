import { CommandNode } from '@core/nodes'

import { CommandArguments } from '../helpers'

import type { STRUCTURES } from '@arguments'
import type { LiteralUnion } from '@utils'

export class LocateCommandNode extends CommandNode {
  command = 'locate' as const
}

export class LocateCommand extends CommandArguments {
  public NodeType = LocateCommandNode

  /**
   * Displays the coordinates for the closest generated structure of a given type in the chat for the player who executed the command.
   *
   * @param structure Specifies the structure to locate.
   */
  locate = (structure: LiteralUnion<STRUCTURES>) => this.finalCommand([structure])
}
