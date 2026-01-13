import type { Coordinates, NBTObject, SymbolBlock, SymbolMcdocBlockStates } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, nbtStringifier } from 'sandstone/variables'
import type { FinalCommandOutput } from '../../helpers'
import { CommandArguments } from '../../helpers'
import type { Registry } from 'sandstone/arguments/generated/registry'
import { BLOCKS_SET } from 'sandstone/arguments/generated/_registry/blocks'
import { NamespacedLiteralUnion, SetType } from 'sandstone/utils'

/** Converts stringified boolean/numeric literals to actual booleans/numbers */
type ParseLiteral<T> =
  T extends 'true' | 'false' ? boolean :
  T extends `${infer N extends number}` ? N :
  T

/** Converts block state types from stringified literals to proper primitives */
type ParseBlockState<T> = {
  [K in keyof T]: ParseLiteral<T[K]>
}

type BlockEntityName = keyof SymbolBlock

type BlockEntity = NamespacedLiteralUnion<BlockEntityName>

type BlockStaticName = keyof Omit<Record<SetType<typeof BLOCKS_SET>, false>, BlockEntityName>

type BlockStatic = (NamespacedLiteralUnion<BlockStaticName> | `minecraft:${BlockStaticName}`)

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
   * @param block The block type to place (e.g., `'minecraft:stone'`, `'oak_log'`).
   *
   * @param state Optional block state properties as an object. The available
   *             properties are type-checked based on the block type:
   *             - Oak log: `{ axis: 'x' | 'y' | 'z' }`
   *             - Redstone wire: `{ power: 0-15, north: 'none' | 'side' | 'up', ... }`
   *             - Stairs: `{ facing: 'north' | 'south' | 'east' | 'west', half: 'top' | 'bottom', ... }`
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
   * // Log with specific orientation using block state
   * setblock([0, 64, 0], 'minecraft:oak_log', { axis: 'x' })
   *
   * // Powered redstone wire
   * setblock(['~', '~-1', '~'], 'minecraft:redstone_wire', { power: 15 })
   *
   * // Replace only air blocks
   * setblock(['~', '~-1', '~'], 'minecraft:stone', {}, 'keep')
   *
   * // Break existing block first
   * setblock([spawn.x, spawn.y, spawn.z], 'minecraft:beacon', {}, 'destroy')
   * ```
   */

  setblock<BLOCK extends Macroable<BlockStatic, MACRO>>(
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    block: BLOCK,
    state?: Macroable<BLOCK extends keyof SymbolMcdocBlockStates ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>> : Record<string, string | boolean | number>, MACRO>,
    type?: 'destroy' | 'keep' | 'replace',
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
   * @param state Optional block state properties as an object. Type-checked based on block:
   *             - Chest: `{ facing: 'north' | 'south' | 'east' | 'west', type: 'single' | 'left' | 'right', ... }`
   *             - Command block: `{ facing: 'north' | 'south' | 'east' | 'west' | 'up' | 'down', conditional: true | false }`
   *             - Sign: `{ rotation: 0-15 }` or `{ facing: ... }` for wall signs
   *
   * @param nbt The NBT data object defining the block's properties:
   *           - For chests: `{ Items: [{ Slot: 0, id: 'diamond', Count: 1 }] }`
   *           - For signs: `{ front_text: { messages: [...] } }`
   *           - For command blocks: `{ Command: 'say Hello' }`
   *           - For spawners: `{ SpawnData: { id: 'minecraft:zombie' } }`
   *
   * @param type Placement behavior, same as basic variant.
   *
   * @example
   * ```ts
   * // Place chest with items
   * setblock([0, 64, 0], 'minecraft:chest', { facing: 'north' }, {
   *   Items: [
   *     { Slot: 0, id: 'minecraft:diamond', Count: 64 },
   *     { Slot: 1, id: 'minecraft:gold_ingot', Count: 32 }
   *   ]
   * })
   *
   * // Place command block with state and NBT
   * setblock(['~', '~', '~1'], 'minecraft:command_block', { facing: 'up', conditional: false }, {
   *   Command: 'tp @p ~ ~10 ~',
   *   auto: 1
   * })
   *
   * // Place sign with rotation and text
   * setblock([100, 65, 200], 'minecraft:oak_sign', { rotation: 8 }, {
   *   front_text: { messages: ['{"text":"Welcome!","color":"gold"}'] }
   * })
   * ```
   */
  setblock<BLOCK extends Macroable<BlockEntity, MACRO>>(
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    block: BLOCK,
    state?: Macroable<BLOCK extends keyof SymbolMcdocBlockStates ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>> : Record<string, string | boolean | number>, MACRO>,
    nbt?: Macroable<BLOCK extends keyof SymbolBlock ? NonNullable<SymbolBlock[BLOCK]> : SymbolBlock<'%fallback'>, MACRO>,
    type?: 'destroy' | 'keep' | 'replace',
  ): FinalCommandOutput

  setblock(
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    block: Macroable<Registry['minecraft:block'], MACRO>,
    arg3?: any,
    arg4?: any,
    arg5?: any
  ) {
    if (arg3 === undefined && arg4 === undefined) {
      return this.finalCommand([coordinatesParser(pos), block, arg5]) as FinalCommandOutput
    }
    const state = typeof arg3 === undefined ? 
      ''
      : blockStateStringifier(arg3 as any as Record<string, string | number | boolean>)
    const nbt = typeof arg4 === 'string' || arg4 === undefined ? 
      ''
      : nbtStringifier(arg4 as any as NBTObject)
    const setblockType = typeof arg4 === 'string' ? arg4 : arg5

    return this.finalCommand([coordinatesParser(pos), `${block}${state}${nbt}`, setblockType])
  }
}

export function blockStateStringifier(state: Record<string, string | number | boolean>) {
  let resultPairs: string[] = []
  
  for (const [key, value] of Object.entries(Object.entries(state))) {
    resultPairs.push(`${key}=${value}`)
  }
  return `[${resultPairs.join(',')}]`
}