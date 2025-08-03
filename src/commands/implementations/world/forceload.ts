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

export class ForceLoadCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ForceLoadCommandNode

  /**
   * Force chunks to stay loaded.
   *
   * @param from Starting chunk coordinates (x, z block positions).
   *            Examples: [0, 0], [100, -200], rel(0, 0)
   *
   * @param to Optional ending chunk coordinates for area selection.
   *          If not specified, only forces single chunk.
   *
   * @example
   * ```ts
   * forceload.add([0, 0])              // Force single chunk at origin
   * forceload.add([0, 0], [32, 32])    // Force 3x3 chunk area
   * forceload.add(rel(0, 0))           // Force current chunk
   * ```
   */
  add = (from: Macroable<ColumnCoordinates<MACRO>, MACRO>, to?: Macroable<ColumnCoordinates<MACRO>, MACRO>) => {
    validateNumberOfChunks(from, to)

    return this.finalCommand(['add', coordinatesParser(from), coordinatesParser(to)])
  }

  /**
   * Stop forcing chunks to stay loaded.
   *
   * @param from Starting chunk coordinates to unforce.
   * @param to Optional ending coordinates for area selection.
   *
   * @example
   * ```ts
   * forceload.remove([0, 0])           // Unforce single chunk
   * forceload.remove([0, 0], [32, 32]) // Unforce chunk area
   * ```
   */
  remove = (from: Macroable<ColumnCoordinates<MACRO>, MACRO>, to?: Macroable<ColumnCoordinates<MACRO>, MACRO>) => {
    validateNumberOfChunks(from, to)

    return this.finalCommand(['remove', coordinatesParser(from), coordinatesParser(to)])
  }

  /**
   * Stop forcing all chunks in current dimension.
   *
   * @example
   * ```ts
   * forceload.removeAll()    // Unforce all chunks
   * ```
   */
  removeAll = () => this.finalCommand(['remove', 'all'])

  /**
   * Check which chunks are force loaded.
   *
   * @param pos Optional chunk coordinates to check specifically.
   *           If not specified, lists all force loaded chunks.
   *
   * @example
   * ```ts
   * forceload.query()        // List all force loaded chunks
   * forceload.query([0, 0])  // Check if specific chunk is force loaded
   * ```
   */
  query = (pos?: Macroable<ColumnCoordinates<MACRO>, MACRO>) => this.finalCommand(['query', coordinatesParser(pos)])
}
