import { CommandNode } from '#core/nodes'
import { coordinatesParser } from '#variables'

import { CommandArguments } from '../helpers'

import type { BLOCKS, Coordinates } from '#arguments'
import type { LiteralUnion } from '#utils'

export class CloneCommandNode extends CommandNode {
  command = 'clone' as const
}

export class CloneCommand extends CommandArguments {
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
  clone = (begin: Coordinates, end: Coordinates, destination: Coordinates) => this.subCommand([begin, end, destination].map(coordinatesParser), CloneOptionsCommand, true)
}

export class CloneOptionsCommand extends CommandArguments {
  /**
   * Copy all blocks, overwriting all blocks of the destination region with the blocks from the source region.
   *
   * @param mode One of these three:
   * - `force`: Force the clone even if the source and destination regions overlap.
   * - `move`: Clone the source region to the destination region, then replace the source region with air. When used in filtered mask mode, only the cloned blocks are replaced with air.
   * - `normal`: Don't move or force.
   */
  replace = (mode?: 'force' | 'move' | 'normal') => this.finalCommand(['replace', mode])

  /**
   * Copy only non-air blocks. Blocks in the destination region that would otherwise be overwritten by air are left unmodified.
   *
   * @param mode One of these three:
   * - `force`: Force the clone even if the source and destination regions overlap.
   * - `move`: Clone the source region to the destination region, then replace the source region with air. When used in filtered mask mode, only the cloned blocks are replaced with air.
   * - `normal`: Don't move or force.
   */
  masked = (mode?: 'force' | 'move' | 'normal') => this.finalCommand(['masked', mode])

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
  filtered = (filter: LiteralUnion<BLOCKS>, mode?: 'force' | 'move' | 'normal') => this.finalCommand(['filtered', filter, mode])
}
