import type { BLOCKS, Coordinates, RootNBT } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { coordinatesParser, nbtStringifier } from 'sandstone/variables'
import type { FinalCommandOutput } from '../../helpers.js'
import { CommandArguments } from '../../helpers.js'

export class SetBlockCommandNode extends CommandNode {
  command = 'setblock' as const
}

export class SetBlockCommand<MACRO extends boolean> extends CommandArguments {
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
  setblock(
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    block: Macroable<LiteralUnion<BLOCKS>, MACRO>,
    type?: Macroable<'destroy' | 'keep' | 'replace', MACRO>,
  ): FinalCommandOutput

  /**
   * Changes a block to another block.
   *
   * @param pos Specifies the position of the block to be changed.
   *
   * @param block Specifies the new block.
   *
   * @param nbt Specifies the nbt of the block to be changed.
   *
   * @param type Specifies how to handle the block change. Must be one of:
   * - `destroy`: The old block drops both itself and its contents (as if destroyed by a player). Plays the appropriate block breaking noise.
   * - `keep`: Only air blocks are changed (non-air blocks are unchanged).
   * - `replace`: The old block drops neither itself nor any contents. Plays no sound.
   *
   * If not specified, defaults to `replace`.
   */
  setblock(
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    block: Macroable<LiteralUnion<BLOCKS>, MACRO>,
    nbt?: Macroable<RootNBT, MACRO>,
    type?: Macroable<'destroy' | 'keep' | 'replace', MACRO>,
  ): FinalCommandOutput

  setblock(
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    block: Macroable<LiteralUnion<BLOCKS>, MACRO>,
    nbtOrType?: Macroable<RootNBT | 'destroy' | 'keep' | 'replace', MACRO>,
    type?: Macroable<'destroy' | 'keep' | 'replace', MACRO>,
  ) {
    if (typeof nbtOrType === 'object') {
      return this.finalCommand([coordinatesParser(pos), `${block}${nbtStringifier(nbtOrType)}`, type])
    }
    return this.finalCommand([coordinatesParser(pos), block, nbtOrType])
  }
}
