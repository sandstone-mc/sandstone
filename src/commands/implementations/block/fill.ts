import type { BLOCKS, Coordinates } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { coordinatesParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class FillCommandNode extends CommandNode {
  command = 'fill' as const
}

export class FillArgumentsCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Fill mode: destroy existing blocks and drop their items.
   * 
   * Replaces all blocks in the region while dropping items as if the blocks
   * were broken by a player with appropriate tools. This preserves resources
   * but creates item entities that need to be collected.
   * 
   * **Behavior:**
   * - Breaks all existing blocks in the region
   * - Drops items as if mined with proper tools
   * - Creates item entities that can be picked up
   * - Plays block breaking sounds and particles
   * 
   * **Note:** Some blocks (like vines) that require shears won't drop items.
   * 
   * @example
   * ```ts
   * // Mine out a region while keeping the resources
   * fill(['~-5', '~', '~-5'], ['~5', '~10', '~5'], 'minecraft:air').destroy()
   * 
   * // Replace stone with diamonds, dropping the stone
   * fill([0, 60, 0], [10, 70, 10], 'minecraft:diamond_block').destroy()
   * ```
   */
  destroy = () => this.finalCommand(['destroy'])

  /**
   * Fill mode: create hollow structure (walls only, air inside).
   * 
   * Creates a hollow box or shell with the specified block, removing the interior
   * and replacing it with air. Perfect for creating rooms, containers, or shells.
   * 
   * **Behavior:**
   * - Places blocks only on the outer surfaces (walls, floor, ceiling)
   * - Fills interior with air, dropping interior block contents
   * - For regions smaller than 3 blocks in any dimension, acts like replace
   * 
   * @example
   * ```ts
   * // Create a hollow stone room
   * fill([0, 64, 0], [10, 74, 10], 'minecraft:stone').hollow()
   * 
   * // Build a glass observatory with clear interior
   * fill(['~-5', '~', '~-5'], ['~5', '~10', '~5'], 'minecraft:glass').hollow()
   * ```
   */
  hollow = () => this.finalCommand(['hollow'])

  /**
   * Fill mode: only fill air blocks, preserve existing blocks.
   * 
   * Places the specified block only in locations that are currently air,
   * leaving all existing solid blocks unchanged. Great for adding supports
   * or filling gaps without destroying existing work.
   * 
   * **Behavior:**
   * - Only affects air blocks
   * - Preserves all existing solid blocks
   * - Perfect for non-destructive building
   * 
   * @example
   * ```ts
   * // Add stone support beams without damaging existing structure
   * fill([base.x, base.y, base.z], [base.x + 20, base.y + 5, base.z + 20], 'minecraft:stone').keep()
   * 
   * // Fill water/lava gaps with blocks
   * fill(['~-10', '~-5', '~-10'], ['~10', '~', '~10'], 'minecraft:cobblestone').keep()
   * ```
   */
  keep = () => this.finalCommand(['keep'])

  /**
   * Fill mode: create outline/frame (edges only, preserve interior).
   * 
   * Places blocks only on the outer edges/surfaces of the region while
   * leaving the interior completely unchanged. Creates frames, borders,
   * or outlines without affecting the inside.
   * 
   * **Behavior:**
   * - Only places blocks on outer surfaces
   * - Interior blocks remain completely unchanged
   * - For small regions (< 3 blocks), acts like replace
   * 
   * @example
   * ```ts
   * // Create a gold frame around an area
   * fill(['~-8', '~-1', '~-8'], ['~8', '~8', '~8'], 'minecraft:gold_block').outline()
   * 
   * // Border a farm area with fences
   * fill([farm.x, farm.y, farm.z], [farm.x + 15, farm.y + 2, farm.z + 15], 'minecraft:oak_fence').outline()
   * ```
   */
  outline = () => this.finalCommand(['outline'])

  /**
   * Fill mode: replace all blocks (default) or specific block types.
   * 
   * The standard fill mode that replaces all blocks in the region. Optionally,
   * you can specify a filter to only replace specific block types, leaving
   * other blocks unchanged.
   * 
   * **Behavior without filter:**
   * - Replaces ALL blocks (including air)
   * - No items are dropped (blocks are destroyed silently)
   * - Fastest and most complete fill mode
   * 
   * **Behavior with filter:**
   * - Only replaces blocks matching the filter
   * - Other blocks remain unchanged
   * - Useful for selective replacement
   *
   * @param filter Optional block type to limit replacement to.
   *              Only blocks of this type will be replaced.
   *              Examples: 'minecraft:stone', 'minecraft:dirt', 'minecraft:air'
   * 
   * @example
   * ```ts
   * // Standard fill - replace everything
   * fill([0, 64, 0], [10, 74, 10], 'minecraft:stone').replace()
   * 
   * // Replace only dirt blocks with grass
   * fill(['~-20', '~-5', '~-20'], ['~20', '~', '~20'], 'minecraft:grass_block').replace('minecraft:dirt')
   * 
   * // Convert all stone to diamond blocks
   * fill(mine_area_start, mine_area_end, 'minecraft:diamond_block').replace('minecraft:stone')
   * ```
   */
  replace = (filter?: Macroable<LiteralUnion<BLOCKS>, MACRO>) => this.finalCommand(['replace', filter])
}

export class FillCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = FillCommandNode

  /**
   * Fill a 3D region with the specified block.
   * 
   * Defines a rectangular region between two opposite corners and fills it
   * with the specified block type. The region can be up to 32,768 blocks total.
   * Returns a command object for chaining fill mode options.
   * 
   * **Region Definition:**
   * - Any two opposite corners define the region boundaries
   * - The command automatically calculates the full 3D area
   * - Supports all coordinate systems (absolute, relative, local)
   * 
   * **Size Limits:**
   * - Maximum 32,768 blocks total in the region
   * - No individual dimension limits (could be 1x1x32768 or 32x32x32)
   *
   * @param from One corner of the region to fill.
   *            Can be any corner - the command determines the bounds automatically.
   *            Supports absolute `[100, 64, 200]`, relative `['~-5', '~', '~5']`,
   *            and local `['^10', '^', '^-5']` coordinates.
   *
   * @param to The opposite corner of the region.
   *          Together with `from`, defines the complete 3D volume to fill.
   *          Must use the same coordinate system as `from`.
   *
   * @param block The block type to fill the region with.
   *             Examples: 'minecraft:stone', 'minecraft:air', 'minecraft:oak_planks'
   *             Can include block states: 'minecraft:oak_log[axis=y]'
   * 
   * @returns FillArgumentsCommand for chaining mode options (.replace(), .hollow(), etc.)
   * 
   * @example
   * ```ts
   * // Basic solid fill
   * fill([0, 64, 0], [10, 74, 10], 'minecraft:cobblestone')
   * 
   * // Relative to current position
   * fill(['~-5', '~-1', '~-5'], ['~5', '~3', '~5'], 'minecraft:glass')
   * 
   * // With fill mode options
   * fill(corner1, corner2, 'minecraft:stone').hollow()  // Hollow structure
   * fill(area_start, area_end, 'minecraft:air').keep()  // Only fill air blocks
   * fill(old_area, old_end, 'minecraft:grass').replace('minecraft:dirt') // Replace dirt only
   * ```
   */
  fill = (
    from: Macroable<Coordinates<MACRO>, MACRO>,
    to: Macroable<Coordinates<MACRO>, MACRO>,
    block: Macroable<LiteralUnion<BLOCKS>, MACRO>,
  ) => this.subCommand([coordinatesParser(from), coordinatesParser(to), block], FillArgumentsCommand, true)
}
