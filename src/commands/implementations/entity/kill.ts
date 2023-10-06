import { targetParser } from 'sandstone/variables/parsers.js'
import { CommandNode } from 'sandstone/core/nodes.js'

import { CommandArguments } from '../../helpers.js'

import type { MultipleEntitiesArgument } from 'sandstone/arguments/index.js'

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
  kill = (targets?: MultipleEntitiesArgument) => this.finalCommand([targetParser(targets)])
}
