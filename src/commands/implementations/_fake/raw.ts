import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments } from '../../helpers.js'

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
