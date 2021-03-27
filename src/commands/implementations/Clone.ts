import { coordinatesParser, VectorClass } from '@variables'

import { Command } from '../Command'
import { command } from '../decorators'

import type { BLOCKS, Coordinates } from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'

export class CloneOptions extends Command {
  /**
   * Copy all blocks, overwriting all blocks of the destination region with the blocks from the source region.
   *
   * @param mode One of these three:
   * - `force`: Force the clone even if the source and destination regions overlap.
   * - `move`: Clone the source region to the destination region, then replace the source region with air. When used in filtered mask mode, only the cloned blocks are replaced with air.
   * - `normal`: Don't move or force.
   */
  @command('replace')
  replace = (mode?: 'force' | 'move' | 'normal') => { }

  /**
   * Copy only non-air blocks. Blocks in the destination region that would otherwise be overwritten by air are left unmodified.
   *
   * @param mode One of these three:
   * - `force`: Force the clone even if the source and destination regions overlap.
   * - `move`: Clone the source region to the destination region, then replace the source region with air. When used in filtered mask mode, only the cloned blocks are replaced with air.
   * - `normal`: Don't move or force.
   */
  @command('masked')
  masked = (mode?: 'force' | 'move' | 'normal') => { }

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
  @command('filtered')
  filtered = (filter: LiteralUnion<BLOCKS>, mode?: 'force' | 'move' | 'normal') => { }
}

export class Clone extends Command {
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
  @command('clone', {
    isRoot: true,
    hasSubcommands: true,
    parsers: {
      '0': coordinatesParser,
      '1': coordinatesParser,
      '2': coordinatesParser,
    },
  })
  clone = (begin: Coordinates, end: Coordinates, destination: Coordinates) => new CloneOptions(this.commandsRoot)
}
