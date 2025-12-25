import type { Coordinates, MultiplePlayersArgument, Rotation } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class SpawnPointCommandNode extends CommandNode {
  command = 'spawnpoint' as const
}

export class SpawnPointCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SpawnPointCommandNode

  /**
   * Set player spawn points.
   *
   * @param targets Optional player selector whose spawn point to set.
   *               Defaults to command executor if not specified.
   *               Examples: '@p', '@a', 'PlayerName'
   *
   * @param pos Optional coordinates for the new spawn point.
   *           Defaults to current executor position if not specified.
   *           Examples: [100, 64, 200], abs(0, 70, 0), rel(5, 0, -10)
   *
   * @param angle Optional yaw angle to face when spawning.
   *             Defaults to current executor facing direction.
   *             Examples: [90, 0], [180, -10]
   *
   * @example
   * ```ts
   * spawnpoint()                                    // Set your spawn at current location
   * spawnpoint('@a')                               // Set all players' spawn at current location
   * spawnpoint('@p', [100, 64, 200])              // Set spawn at specific coordinates
   * spawnpoint('@a', abs(0, 70, 0), [90, 0])      // Set spawn with specific facing direction
   * ```
   */
  spawnpoint = (
    targets?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    pos?: Macroable<Coordinates<MACRO>, MACRO>,
    angle?: Macroable<Rotation<MACRO>, MACRO>,
  ) => this.finalCommand([targetParser(targets), coordinatesParser(pos), coordinatesParser(angle)])
}
