import { CommandNode } from '#core/nodes'

import { CommandArguments } from '../helpers'

export class RawCommandNode extends CommandNode {
  command = '' as const
}

export class RawCommand extends CommandArguments<typeof RawCommandNode> {
  protected NodeType = RawCommandNode

  /**
   * Creates an arbitrary command, separating arguments with spaces.
   */
  raw = (...args: unknown[]) => this.finalCommand([...args])
}
