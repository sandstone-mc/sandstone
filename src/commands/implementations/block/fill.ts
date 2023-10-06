import { CommandNode } from 'sandstone/core/nodes.js'
import { coordinatesParser } from 'sandstone/variables/index.js'

import { CommandArguments } from '../../helpers.js'

import type { BLOCKS, Coordinates } from 'sandstone/arguments/index.js'
import type { LiteralUnion } from 'sandstone/utils.js'

export class FillCommandNode extends CommandNode {
  command = 'fill' as const
}

export class FillArgumentsCommand extends CommandArguments {
  /**
   * Replaces all blocks (including air) in the fill region with the specified block,
   * dropping the existing blocks (including those that are unchanged) and block contents as entities,
   * as if they had been mined with an unenchanted diamond shovel or pickaxe.
   *
   * (Blocks that can be mined only with shears, such as vines, do not drop; neither do liquids.)
   */
  destroy = () => this.finalCommand(['destroy'])

  /**
   * Replaces only the blocks on the outer edge of the fill region with the specified block.
   *
   * Inner blocks are changed to air, dropping their contents as entities but not themselves.
   *
   * If the fill region has no inner blocks (because it is smaller than three blocks in at least one dimension),
   * acts like `replace`.
   */
  hollow = () => this.finalCommand(['hollow'])

  /**
   * Replaces only the air blocks in the fill region with the specified block.
   */
  keep = () => this.finalCommand(['keep'])

  /**
   * Replaces only the blocks on the outer edge of the fill region with the specified block.
   *
   * Inner blocks are not affected.
   *
   * If the fill region has no inner blocks (because it is smaller than three blocks in at least one dimension),
   * acts like `replace`.
   */
  outline = () => this.finalCommand(['outline'])

  /**
   * Replaces all blocks (including air) in the fill region with the specified block,
   * without dropping blocks or block contents as entities.
   *
   * Optionally, instead of specifying a data tag for the replacing block,
   * block ID and data values may be specified to limit which blocks are replaced.
   *
   * @example
   * // Replace only furnaces facing north, with a BurnTime of 200 ticks:
   * fill(...).replace('minecraft:furnace[facing=north]{BurnTime:200}')
   */
  replace = (filter?: LiteralUnion<BLOCKS>) => this.finalCommand(['replace', filter])
}

/** Adds, sets or removes player experience.  */
export class FillCommand extends CommandArguments {
  protected NodeType = FillCommandNode

  /**
   * Fills all or parts of a region with a specific block.
   *
   * @param from
   * Specifies the first corner blocks of the region to be filled (the "fill region").
   *
   * Block position is the coordinates of the point at the lower northwest corner of a block,
   * corresponding to the lowest X-axis, Y-axis and Z-axis point of the block.
   *
   * @param to
   * Specifies the second, opposite corner blocks of the region to be filled (the "fill region").
   *
   * @param block Specifies the block to fill the region with.
   *
   * @example
   * // Fill a block of 9x9 blocks, centered on the player
   * fill('~-4 ~-4 ~-4', '~4 ~4 ~4', 'minecraft:diamond_block')
   *
   * // Fill a hollow block of 9x9 blocks, centered on the player
   * fill('~-4 ~-4 ~-4', '~4 ~4 ~4', 'minecraft:diamond_block').hollow()
   *
   * // Replace all dirt with grass in a 9x9 blocks, centered on the player
   * fill('~-4 ~-4 ~-4', '~4 ~4 ~4', 'minecraft:grass_block').replace('minecraft:dirt')
   */
  fill = (from: Coordinates, to: Coordinates, block: LiteralUnion<BLOCKS>) => this.subCommand(
    [coordinatesParser(from), coordinatesParser(to), block],
    FillArgumentsCommand,
    true,
  )
}
