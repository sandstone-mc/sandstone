import type { BLOCKS, Coordinates } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { coordinatesParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class CloneCommandNode extends CommandNode {
  command = 'clone' as const
}

export class CloneCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = CloneCommandNode

  /**
   * Clones blocks from one region to another.
   *
   * @param begin Specifies the coordinates of the first corner blocks of the source region.
   *
   * @param end Specifies the coordinates of the opposing corner blocks of the source region.
   *
   * @param destination Specifies the lower northwest corner of the destination region.
   * It corresponds to the block with the lowest X-axis, Y-axis and Z-axis value.
   *
   * @example
   *
   * // Clone blocks from `0 0 0` to `8 8 8` at the current location.
   * clone(abs(0, 0, 0), abs(8, 8, 8), rel(0, 0, 0))
   *
   * // Same as above, but only clone dirt blocks.
   * clone(abs(0, 0, 0), abs(8, 8, 8), rel(0, 0, 0)).filtered('minecraft:dirt')
   *
   * // Move the current block 1 block above
   * clone(rel(0, 0, 0), rel(0, 0, 0), rel(0, 1, 0)).replace('move')
   */
  clone = (
    begin: Macroable<Coordinates<MACRO>, MACRO>,
    end: Macroable<Coordinates<MACRO>, MACRO>,
    destination: Macroable<Coordinates<MACRO>, MACRO>,
  ) => this.subCommand([begin, end, destination].map(coordinatesParser), CloneOptionsCommand<MACRO>, true)
}

export class CloneOptionsCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Copy all blocks, overwriting all blocks of the destination region with the blocks from the source region.
   *
   * @param mode One of these three:
   * - `force`: Force the clone even if the source and destination regions overlap.
   * - `move`: Clone the source region to the destination region, then replace the source region with air. When used in filtered mask mode, only the cloned blocks are replaced with air.
   * - `normal`: Don't move or force.
   */
  replace = (mode?: Macroable<'force' | 'move' | 'normal', MACRO>) => this.finalCommand(['replace', mode])

  /**
   * Copy only non-air blocks. Blocks in the destination region that would otherwise be overwritten by air are left unmodified.
   *
   * @param mode One of these three:
   * - `force`: Force the clone even if the source and destination regions overlap.
   * - `move`: Clone the source region to the destination region, then replace the source region with air. When used in filtered mask mode, only the cloned blocks are replaced with air.
   * - `normal`: Don't move or force.
   */
  masked = (mode?: Macroable<'force' | 'move' | 'normal', MACRO>) => this.finalCommand(['masked', mode])

  /**
   * Clones only blocks with the block id specified by `filter`.
   *
   * @param filter The block ID to clone.
   *
   * @param mode One of these three:
   * - `force`: Force the clone even if the source and destination regions overlap.
   * - `move`: Clone the source region to the destination region, then replace the source region with air. When used in filtered mask mode, only the cloned blocks are replaced with air.
   * - `normal`: Don't move or force.
   */
  filtered = (filter: Macroable<LiteralUnion<BLOCKS>, MACRO>, mode?: Macroable<'force' | 'move' | 'normal', MACRO>) =>
    this.finalCommand(['filtered', filter, mode])
}
