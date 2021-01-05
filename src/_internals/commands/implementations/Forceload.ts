import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { coordinatesParser } from '@variables'

import type { ColumnCoordinates } from '@arguments'
import type { VectorClass } from '@variables'

/** Parses coordinates, and returns numbers. Looses the relative/local/absolute information. */
function coordinatesToNumbers(coords: string[] | VectorClass<string[]>): number[] {
  const realCoords = Array.isArray(coords) ? coords : coords.values

  return realCoords.map((coord) => parseInt(coord.replace(/[\^~]/, '') || '0', 10))
}

/**
 * Force chunks to load constantly or not.
 */
export class Forceload extends Command {
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
   * forceload.add(rel(0, 0)
   */
  @command(['forceload', 'add'], { isRoot: true, parsers: { '0': coordinatesParser, '1': coordinatesParser } })
  add = (from: ColumnCoordinates, to?: ColumnCoordinates) => {
    if (!to) return

    if (
      // If all coordinates are:
      [...from, ...to].every((c) => c[0] === '~') // Relative
      || [...from, ...to].every((c) => c[0] === '^') // or local
      || [...from, ...to].every((c) => c[0].match(/0-9/)) // or absolute
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
        throw new Error(`Impossible to forceload more than 256 chunks. From "${from}" to "${to}", at least ${affectedChunks} would be forceloaded.`)
      }
    }
  }

  /**
   * Unforces the chunk at the `from` position (through to `to` if set) in the dimension of the command's execution to be loaded constantly.
   *
   * @param from Specifies the start of the targeted chunks, in block coordinates.
   * @param to Specified the end of the targeted chunks, in block coordinates.
   * If unspecified, only targets the chunk specified by `from`.
   */
  @command(['forceload', 'remove'], { isRoot: true, parsers: { '0': coordinatesParser, '1': coordinatesParser } })
  remove = (from: ColumnCoordinates) => { }

  /** Unforces all chunks in the dimension of the command's execution to be loaded constantly. */
  @command(['forceload', 'remove', 'all'], { isRoot: true })
  removeAll = () => { }

  /**
   * If chunk coordinates are given, displays whether the specified chunk in the dimension of the command's execution is force loaded.
   * Otherwise, lists which chunks in the dimension of the command's execution are force loaded.
   *
   * @param pos Specifies a chunk to query, in block coordinates.
   * If unspecifiedd, lists which chunks are force loaded.
   *
   * @example
   */
  @command(['forceload', 'query'], { isRoot: true, parsers: { '0': coordinatesParser } })
  query = (pos?: ColumnCoordinates) => { }
}
