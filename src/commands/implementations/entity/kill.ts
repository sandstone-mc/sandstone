import { CommandNode } from '#core/nodes'

import { CommandArguments } from '../../helpers'

import type { MultipleEntitiesArgument } from '#arguments'

export class KillCommandNode extends CommandNode {
  command = 'kill' as const
}

export class KillCommand extends CommandArguments {
  protected NodeType = KillCommandNode

  /**
   * Kills entities (players, mobs, items, etc.).
   *
   * @param targets Specifies the target(s) to kill. If not specified, defaults to the executor who executed the command.
   */
  kill = (targets?: MultipleEntitiesArgument) => this.finalCommand([targets])
}
