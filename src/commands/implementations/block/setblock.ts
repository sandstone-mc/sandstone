import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser } from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type { BLOCKS, Coordinates } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'

export class SetBlockCommandNode extends CommandNode {
  command = 'setblock' as const
}

export class SetBlockCommand extends CommandArguments {
  protected NodeType = SetBlockCommandNode

  /**
   * Changes a block to another block.
   *
   * @param pos Specifies the position of the block to be changed.
   *
   * @param block Specifies the new block.
   *
   * @param type Specifies how to handle the block change. Must be one of:
   * - `destroy`: The old block drops both itself and its contents (as if destroyed by a player). Plays the appropriate block breaking noise.
   * - `keep`: Only air blocks are changed (non-air blocks are unchanged).
   * - `replace`: The old block drops neither itself nor any contents. Plays no sound.
   *
   * If not specified, defaults to `replace`.
   */
  setblock = (pos: Coordinates, block: LiteralUnion<BLOCKS>, type?: 'destroy' | 'keep' | 'replace') => this.finalCommand([coordinatesParser(pos), block, type])
}
