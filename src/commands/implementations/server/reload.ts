import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

export class ReloadCommandNode extends CommandNode {
  command = 'reload' as const
}

export class ReloadCommand extends CommandArguments {
  protected NodeType = ReloadCommandNode

  /**
   * Reload all datapacks.
   *
   * @example
   * ```ts
   * reload()    // Reload all datapacks
   * ```
   */
  reload = () => this.finalCommand([])
}
