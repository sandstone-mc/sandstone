import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers'

export class ListCommandNode extends CommandNode {
  command = 'list' as const
}

export class ListCommand extends CommandArguments {
  protected NodeType = ListCommandNode

  /**
   * Display list of online players.
   *
   * @param uuids Optional flag to show player UUIDs alongside names.
   *             Defaults to false (names only).
   *
   * @example
   * ```ts
   * list()          // Show player names
   * list(true)      // Show names and UUIDs
   * ```
   */
  list = (uuids?: boolean) => this.finalCommand([uuids ? 'uuids' : undefined])
}
