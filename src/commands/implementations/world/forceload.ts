import type { ColumnCoordinates } from 'sandstone/arguments'
import type { MacroArgument, Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { VectorClass } from 'sandstone/variables'
import { coordinatesParser } from 'sandstone/variables/parsers'
import { CommandArguments, type FinalCommandOutput } from '../../helpers.js'

/** Parses coordinates, and returns numbers. Looses the relative/local/absolute information. */
function coordinatesToNumbers(coords: string[] | VectorClass<string[]> | string): number[] {
  if (typeof coords === 'string') {
    return coords
      .replace(/[~^]/, '')
      .split(' ')
      .map((i) => Number(i))
  }

  const realCoords = Array.isArray(coords) ? coords : coords.values

  return realCoords.map((coord) => Number.parseInt(coord.replace(/[\^~]/, '') || '0', 10))
}

function validateNumberOfChunks(
  from: MacroArgument | ColumnCoordinates<boolean>,
  to: MacroArgument | ColumnCoordinates<boolean> | undefined,
) {
  if (!to) {
    return
  }

  if (typeof from === 'object' || typeof to === 'object') {
    return
  }

  const coords = [...from, ...to].map(coordinatesParser)

  if (
    // If all coordinates are:
    coords.every((c) => c[0] === '~') || // Relative
    coords.every((c) => c[0] === '^') || // or local
    coords.every((c) => c[0].match(/0-9/)) // or absolute
  ) {
    /*
     * Then we can calculate before-hand the number of affected chunks, and throw an error
     * if it's greater than 256
     */

    const [fromX, fromZ] = coordinatesToNumbers(from)
    const [toX, toZ] = coordinatesToNumbers(to)

    const chunksX = Math.ceil((Math.abs(fromX - toX) + 1) / 16)
    const chunksZ = Math.ceil((Math.abs(fromZ - toZ) + 1) / 16)

    const affectedChunks = chunksX * chunksZ

    if (affectedChunks > 256) {
      throw new Error(
        `Impossible to forceload more than 256 chunks. From "${from}" to "${to}", at least ${affectedChunks} would be forceloaded.`,
      )
    }
  }
}

export class ForceLoadCommandNode extends CommandNode {
  command = 'forceload' as const
}

/**
 * Force chunks to load constantly or not.
 */
export class ForceLoadCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ForceLoadCommandNode

  /**
   * Forces the chunk at the `from` position (through to `to` if set) in the dimension of the command's execution to be loaded constantly.
   *
   * Fails if more than 256 chunks are added at once.
   *
   * @param from Specifies the start of the targeted chunks, in block coordinates.
   * @param to Specified the end of the targeted chunks, in block coordinates.
   * If unspecified, only targets the chunk specified by `from`.
   *
   * @example
   * // Forceload current chunk
   * forceload.add('~ ~')
   */
  add = (from: Macroable<ColumnCoordinates<MACRO>, MACRO>, to?: Macroable<ColumnCoordinates<MACRO>, MACRO>) => {
    validateNumberOfChunks(from, to)

    return this.finalCommand(['add', coordinatesParser(from), coordinatesParser(to)])
  }

  /**
   * Unforces the chunk at the `from` position (through to `to` if set) in the dimension of the command's execution to be loaded constantly.
   *
   * @param from Specifies the start of the targeted chunks, in block coordinates. Can be 'all' to unforce all chunks.
   * @param to Specified the end of the targeted chunks, in block coordinates.
   * If unspecified, only targets the chunk specified by `from`.
   */
  remove = (from: Macroable<ColumnCoordinates<MACRO>, MACRO>, to?: Macroable<ColumnCoordinates<MACRO>, MACRO>) => {
    validateNumberOfChunks(from, to)

    return this.finalCommand(['remove', coordinatesParser(from), coordinatesParser(to)])
  }

  /** Unforces all chunks in the dimension of the command's execution to be loaded constantly. */
  removeAll = () => this.finalCommand(['remove', 'all'])

  /**
   * If chunk coordinates are given, displays whether the specified chunk in the dimension of the command's execution is force loaded.
   * Otherwise, lists which chunks in the dimension of the command's execution are force loaded.
   *
   * @param pos Specifies a chunk to query, in block coordinates.
   * If unspecified, lists which chunks are force loaded.
   *
   * @example
   */
  query = (pos?: Macroable<ColumnCoordinates<MACRO>, MACRO>) => this.finalCommand(['query', coordinatesParser(pos)])
}
