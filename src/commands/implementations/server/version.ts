import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers'

export class VersionCommandNode extends CommandNode {
  command = 'version' as const
}

export class VersionCommand extends CommandArguments {
  protected NodeType = VersionCommandNode

  /**
   * Produces a command output containing game version information. Does not have a useful return result value.
   *
   * @example
   * ```ts
   * version()
   * ```
   */
  version = () => this.finalCommand([])
}
