import type { Coordinates, RootNBT,SymbolBlockEntity } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, nbtStringifier } from 'sandstone/variables'
import type { FinalCommandOutput } from '../../helpers'
import { CommandArguments } from '../../helpers'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class SetBlockCommandNode extends CommandNode {
  command = 'setblock' as const
}

export class SetBlockCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SetBlockCommandNode

  /**
   * Place a block at the specified coordinates.
   * 
   * Replaces whatever block exists at the target location with the new block.
   * This is the basic form for simple block placement without NBT data.
   *
   * @param pos The coordinates where to place the block. Supports:
   *           - Absolute: `[100, 64, 200]` - exact world coordinates
   *           - Relative: `['~5', '~1', '~-3']` - relative to command position
   *           - Local: `['^2', '^', '^-1']` - relative to facing direction
   *           - Mixed: `[100, '~5', '^2']` - combination of systems
   *
   * @param block The block type to place. Examples:
   *             - `'minecraft:stone'` - basic stone block
   *             - `'minecraft:oak_log[axis=x]'` - log with specific orientation
   *             - `'minecraft:redstone_wire[power=15]'` - powered redstone
   *
   * @param type How to handle the placement. Options:
   *            - `'replace'` (default): Silently replace any existing block
   *            - `'destroy'`: Break existing block, dropping items and playing sound
   *            - `'keep'`: Only place if the target location is air
   * 
   * @example
   * ```ts
   * // Simple block placement
   * setblock([0, 100, 0], 'minecraft:diamond_block')
   * 
   * // Replace only air blocks
   * setblock(['~', '~-1', '~'], 'minecraft:stone', 'keep')
   * 
   * // Break existing block first
   * setblock([spawn.x, spawn.y, spawn.z], 'minecraft:beacon', 'destroy')
   * ```
   */

  setblock(
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    block: Macroable<Registry['minecraft:block'], MACRO>,
    type?: Macroable<'destroy' | 'keep' | 'replace', MACRO>,
  ): FinalCommandOutput

  /**
   * Place a block with NBT data at the specified coordinates.
   * 
   * This variant allows setting complex block properties and data, essential for
   * functional blocks like chests, command blocks, signs, and other tile entities.
   * The NBT data defines the block's internal state and properties.
   *
   * @param pos The coordinates where to place the block. Same format as basic variant.
   *
   * @param block The block type to place. Must be a block that supports NBT data:
   *             - `'minecraft:chest'` - for containers
   *             - `'minecraft:command_block'` - for command storage
   *             - `'minecraft:sign'` - for text display
   *             - `'minecraft:spawner'` - for mob spawning
   *
   * @param nbt The NBT data object defining the block's properties:
   *           - For chests: `{Items: [{Slot: 0, id: 'diamond', Count: 1}]}`
   *           - For signs: `{Text1: '{"text":"Hello World"}'}`
   *           - For command blocks: `{Command: 'say Hello'}`
   *           - For spawners: `{SpawnData: {id: 'minecraft:zombie'}}`
   *
   * @param type Placement behavior, same as basic variant.
   * 
   * @example
   * ```ts
   * // Place chest with items
   * setblock([0, 64, 0], 'minecraft:chest', {
   *   Items: [
   *     {Slot: 0, id: 'minecraft:diamond', Count: 64},
   *     {Slot: 1, id: 'minecraft:gold_ingot', Count: 32}
   *   ]
   * })
   * 
   * // Place command block
   * setblock(['~', '~', '~1'], 'minecraft:command_block', {
   *   Command: 'tp @p ~ ~10 ~',
   *   auto: 1
   * })
   * 
   * // Place sign with text
   * setblock([100, 65, 200], 'minecraft:oak_sign', {
   *   Text1: '{"text":"Welcome!","color":"gold"}',
   *   Text2: '{"text":"to our server","color":"blue"}'
   * })
   * ```
   */
  setblock<BLOCK extends Macroable<Registry['minecraft:block'], MACRO>>(
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    block: BLOCK,
    nbt?: Macroable<BLOCK extends keyof SymbolBlockEntity ? NonNullable<SymbolBlockEntity[BLOCK]> : SymbolBlockEntity<'%fallback'>, MACRO>,
    type?: Macroable<'destroy' | 'keep' | 'replace', MACRO>,
  ): FinalCommandOutput

  setblock(
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    block: Macroable<Registry['minecraft:block'], MACRO>,
    nbtOrType?: Macroable<RootNBT | 'destroy' | 'keep' | 'replace', MACRO>,
    type?: Macroable<'destroy' | 'keep' | 'replace', MACRO>,
  ) {
    if (typeof nbtOrType === 'object') {
      return this.finalCommand([coordinatesParser(pos), `${block}${nbtStringifier(nbtOrType)}`, type])
    }
    return this.finalCommand([coordinatesParser(pos), block, nbtOrType])
  }
}