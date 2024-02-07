import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { MultipleEntitiesArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'

export class KillCommandNode extends CommandNode {
  command = 'kill' as const
}

export class KillCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = KillCommandNode

  /**
   * Kills entities (players, mobs, items, etc.).
   *
   * @param targets Specifies the target(s) to kill. If not specified, defaults to the executor who executed the command.
   */
  kill = (targets?: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>) => this.finalCommand([targetParser(targets)])
}
