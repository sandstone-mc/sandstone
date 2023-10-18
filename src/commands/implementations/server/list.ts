import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/variables'

export class ListCommandNode extends CommandNode {
  command = 'list' as const
}

export class ListCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ListCommandNode

  /**
   * Shows the names of all currently-connected players.
   *
   * @param uuid Whether to show player UUIDs alongside names. Defaults to false.
   */
  list = (uuids?: boolean) => this.finalCommand([uuids ? 'uuids' : undefined])
}
