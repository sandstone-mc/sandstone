import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/variables'

export class ReloadCommandNode extends CommandNode {
  command = 'reload' as const
}

export class ReloadCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ReloadCommandNode

  /**
   * Reloads the current datapacks.
   *
   * If a datapack has invalid data (such as an invalid recipe format),
   * changes are not applied and the game continues using the previous data.
   */
  reload = () => this.finalCommand([])
}
