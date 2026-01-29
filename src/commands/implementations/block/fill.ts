import type { Coordinates, NBTObject, SymbolBlock, SymbolMcdocBlockStates } from 'sandstone/arguments'
import type { Macroable, TagClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, nbtStringifier } from 'sandstone/variables'
import { CommandArguments, FinalCommandOutput } from '../../helpers'
import type { Registry } from 'sandstone/arguments/generated/registry'
import { blockStateStringifier, type BlockEntity, type BlockStatic, type ParseBlockState } from './setblock'

export class FillCommandNode extends CommandNode {
  command = 'fill' as const
}

export class FillCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = FillCommandNode

  /**
   * Fill a 3D region with the specified block.
   *
   * Defines a rectangular region between two opposite corners and fills it
   * with the specified block type. The region can be up to 32,768 blocks total.
   *
   * @param from One corner of the region to fill.
   * @param to The opposite corner of the region.
   * @param block The block type to fill the region with.
   * @param state Optional block state properties.
   *
   * @example
   * ```ts
   * // Basic solid fill
   * fill([0, 64, 0], [10, 74, 10], 'minecraft:cobblestone')
   *
   * // With block state
   * fill([0, 64, 0], [10, 74, 10], 'minecraft:oak_log', { axis: 'x' })
   *
   * // With fill mode options
   * fill(corner1, corner2, 'minecraft:stone').hollow()
   * fill(area_start, area_end, 'minecraft:grass_block').replace('minecraft:dirt')
   * ```
   */
  fill<BLOCK extends Macroable<BlockStatic, MACRO>>(
    from: Macroable<Coordinates<MACRO>, MACRO>,
    to: Macroable<Coordinates<MACRO>, MACRO>,
    block: BLOCK,
    state?: Macroable<BLOCK extends keyof SymbolMcdocBlockStates ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>> : Record<string, string | boolean | number>, MACRO>,
  ): FillArgumentsCommand<MACRO>

  /**
   * Fill a 3D region with a block entity (supports NBT data).
   *
   * @param from One corner of the region to fill.
   * @param to The opposite corner of the region.
   * @param block The block entity type to fill with.
   * @param state Optional block state properties.
   * @param nbt Optional NBT data for the block entity.
   *
   * @example
   * ```ts
   * // Fill with chests containing items
   * fill([0, 64, 0], [2, 64, 2], 'minecraft:chest', { facing: 'north' }, {
   *   Items: [{ Slot: 0, id: 'minecraft:diamond', Count: 64 }]
   * })
   *
   * // Fill with command blocks
   * fill([0, 64, 0], [5, 64, 0], 'minecraft:command_block', { facing: 'up' }, {
   *   Command: 'say Hello'
   * })
   * ```
   */
  fill<BLOCK extends Macroable<BlockEntity, MACRO>>(
    from: Macroable<Coordinates<MACRO>, MACRO>,
    to: Macroable<Coordinates<MACRO>, MACRO>,
    block: BLOCK,
    state?: Macroable<BLOCK extends keyof SymbolMcdocBlockStates ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>> : Record<string, string | boolean | number>, MACRO>,
    nbt?: Macroable<BLOCK extends keyof SymbolBlock ? NonNullable<SymbolBlock[BLOCK]> : SymbolBlock<'%fallback'>, MACRO>,
  ): FillArgumentsCommand<MACRO>

  fill(
    from: Macroable<Coordinates<MACRO>, MACRO>,
    to: Macroable<Coordinates<MACRO>, MACRO>,
    block: Macroable<Registry['minecraft:block'], MACRO>,
    state?: Record<string, string | boolean | number>,
    nbt?: NBTObject,
  ): FillArgumentsCommand<MACRO> {
    const stateStr = state && Object.keys(state).length > 0 ? blockStateStringifier(state) : ''
    const nbtStr = nbt ? nbtStringifier(nbt) : ''
    const blockArg = `${block}${stateStr}${nbtStr}`

    return this.subCommand([coordinatesParser(from), coordinatesParser(to), blockArg], FillArgumentsCommand<MACRO>, true)
  }
}

export class FillArgumentsCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Fill mode: destroy existing blocks and drop their items.
   *
   * Replaces all blocks in the region while dropping items as if the blocks
   * were broken by a player with appropriate tools.
   *
   * @example
   * ```ts
   * fill(['~-5', '~', '~-5'], ['~5', '~10', '~5'], 'minecraft:air').destroy()
   * ```
   */
  destroy = () => this.finalCommand(['destroy'])

  /**
   * Fill mode: create hollow structure (walls only, air inside).
   *
   * Creates a hollow box or shell with the specified block, removing the interior
   * and replacing it with air.
   *
   * @example
   * ```ts
   * fill([0, 64, 0], [10, 74, 10], 'minecraft:stone').hollow()
   * ```
   */
  hollow = () => this.finalCommand(['hollow'])

  /**
   * Fill mode: only fill air blocks, preserve existing blocks.
   *
   * Places the specified block only in locations that are currently air.
   *
   * @example
   * ```ts
   * fill([base.x, base.y, base.z], [base.x + 20, base.y + 5, base.z + 20], 'minecraft:stone').keep()
   * ```
   */
  keep = () => this.finalCommand(['keep'])

  /**
   * Fill mode: create outline/frame (edges only, preserve interior).
   *
   * Places blocks only on the outer edges/surfaces of the region.
   *
   * @example
   * ```ts
   * fill(['~-8', '~-1', '~-8'], ['~8', '~8', '~8'], 'minecraft:gold_block').outline()
   * ```
   */
  outline = () => this.finalCommand(['outline'])

  /**
   * Fill mode: replace without block updates.
   *
   * @example
   * ```ts
   * fill([0, 64, 0], [10, 74, 10], 'minecraft:redstone_block').strict()
   * ```
   */
  strict = () => this.finalCommand(['strict'])

  /**
   * Fill mode: replace all blocks in the region.
   *
   * @example
   * ```ts
   * fill([0, 64, 0], [10, 74, 10], 'minecraft:stone').replace()
   * ```
   */
  replace(): FinalCommandOutput

  /**
   * Fill mode: replace only blocks matching a block tag.
   *
   * @param filter Block tag specifying which blocks to replace.
   * @param filterState Optional block state to match.
   * @param filterNbt Optional NBT data to match.
   *
   * @example
   * ```ts
   * // Replace all logs with stripped oak logs
   * fill(from, to, 'minecraft:stripped_oak_log').replace(Tag('block', 'minecraft:logs'))
   *
   * // Replace all logs with specific axis
   * fill(from, to, 'minecraft:stripped_oak_log').replace(Tag('block', 'minecraft:logs'), { axis: 'y' })
   * ```
   */
  replace(
    filter: Macroable<TagClass<'block'>, MACRO>,
    filterState?: Macroable<SymbolMcdocBlockStates<'%fallback'>, MACRO>,
    filterNbt?: Macroable<SymbolBlock<'%fallback'>, MACRO>,
  ): FillReplaceFilterCommand

  /**
   * Fill mode: replace only blocks matching the filter.
   *
   * @param filter Block predicate specifying which blocks to replace.
   * @param filterState Optional block state to match.
   *
   * @example
   * ```ts
   * // Replace dirt with grass
   * fill(['~-20', '~-5', '~-20'], ['~20', '~', '~20'], 'minecraft:grass_block').replace('minecraft:dirt')
   *
   * // Replace only east-facing logs
   * fill(from, to, 'minecraft:stripped_oak_log').replace('minecraft:oak_log', { axis: 'x' })
   *
   * // Replace and destroy to drop items
   * fill(mine_start, mine_end, 'minecraft:diamond_block').replace('minecraft:stone').destroy()
   * ```
   */
  replace<FILTER extends Macroable<BlockStatic, MACRO>>(
    filter: FILTER,
    filterState?: Macroable<FILTER extends keyof SymbolMcdocBlockStates ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[FILTER]>> : Record<string, string | boolean | number>, MACRO>,
  ): FillReplaceFilterCommand

  /**
   * Fill mode: replace only block entities matching the filter (supports NBT).
   *
   * @param filter Block entity predicate specifying which blocks to replace.
   * @param filterState Optional block state to match.
   * @param filterNbt Optional NBT data to match.
   *
   * @example
   * ```ts
   * // Replace chests facing north
   * fill(from, to, 'minecraft:barrel').replace('minecraft:chest', { facing: 'north' })
   *
   * // Replace command blocks with specific command
   * fill(from, to, 'minecraft:air').replace('minecraft:command_block', {}, { Command: 'say Hello' })
   * ```
   */
  replace<FILTER extends Macroable<BlockEntity, MACRO>>(
    filter: FILTER,
    filterState?: Macroable<FILTER extends keyof SymbolMcdocBlockStates ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[FILTER]>> : Record<string, string | boolean | number>, MACRO>,
    filterNbt?: Macroable<FILTER extends keyof SymbolBlock ? NonNullable<SymbolBlock[FILTER]> : SymbolBlock<'%fallback'>, MACRO>,
  ): FillReplaceFilterCommand

  replace(
    filter?: Macroable<Registry['minecraft:block'] | TagClass<'block'>, MACRO>,
    filterState?: any,
    filterNbt?: any,
  ) {
    if (filter === undefined) {
      return this.finalCommand(['replace'])
    }
    const stateStr = filterState && Object.keys(filterState).length > 0 ? blockStateStringifier(filterState) : ''
    const nbtStr = filterNbt ? nbtStringifier(filterNbt) : ''
    return this.subCommand(['replace', `${filter}${stateStr}${nbtStr}`], FillReplaceFilterCommand, true)
  }
}

/**
 * Fill modes available after `replace(filter)`.
 * This class is executable on its own (filter with default behavior).
 */
export class FillReplaceFilterCommand extends CommandArguments {
  /**
   * Destroy replaced blocks and drop their items.
   *
   * @example
   * ```ts
   * fill(from, to, 'minecraft:diamond_block').replace('minecraft:stone').destroy()
   * ```
   */
  destroy = () => this.finalCommand(['destroy'])

  /**
   * Create hollow structure (walls only, air inside) for replaced blocks.
   *
   * @example
   * ```ts
   * fill(from, to, 'minecraft:glass').replace('minecraft:stone').hollow()
   * ```
   */
  hollow = () => this.finalCommand(['hollow'])

  /**
   * Create outline/frame (edges only) for replaced blocks.
   *
   * @example
   * ```ts
   * fill(from, to, 'minecraft:gold_block').replace('minecraft:stone').outline()
   * ```
   */
  outline = () => this.finalCommand(['outline'])

  /**
   * Fill without block updates.
   *
   * @example
   * ```ts
   * fill(from, to, 'minecraft:redstone_block').replace('minecraft:stone').strict()
   * ```
   */
  strict = () => this.finalCommand(['strict'])
}