import { CommandNode } from '#core/nodes'

import { CommandArguments } from '../../helpers'

export class ReloadCommandNode extends CommandNode {
  command = 'reload' as const
}

export class ReloadCommand extends CommandArguments {
  protected NodeType = ReloadCommandNode

  /**
   * Reloads the current datapacks.
   *
   * If a datapack has invalid data (such as an invalid recipe format),
   * changes are not applied and the game continues using the previous data.
   */
  reload = () => this.finalCommand([])
}
