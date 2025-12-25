import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments } from '../../helpers'

export class RawCommandNode extends CommandNode {
  command = '' as const
}

export class RawCommand extends CommandArguments<typeof RawCommandNode> {
  protected NodeType = RawCommandNode

  /**
   * Create arbitrary command with raw arguments.
   *
   * @param args Command arguments to join with spaces.
   *            Use for commands not supported by Sandstone or custom syntax.
   *
   * @example
   * ```ts
   * raw('custommod:special', 'arg1', 'arg2')     // custommod:special arg1 arg2
   * raw('execute', 'run', 'say', 'Hello')        // execute run say Hello
   * raw('debug', 'start')                        // debug start
   * ```
   */
  raw = (...args: unknown[]) => this.finalCommand([...args])
}
