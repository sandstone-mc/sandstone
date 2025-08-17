import type { Coordinates, Rotation } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class SetWorldSpawnCommandNode extends CommandNode {
  command = 'setworldspawn' as const
}

export class SetWorldSpawnCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SetWorldSpawnCommandNode

  /**
   * Set world spawn point.
   *
   * @param pos Optional coordinates for world spawn.
   *           Defaults to current command execution position.
   *           Examples: [0, 70, 0], abs(100, 64, 200), rel(0, 5, 0)
   *
   * @param angle Optional yaw angle for spawn direction.
   *             Defaults to current executor facing direction.
   *             Examples: [90, 0], [180, -10]
   *
   * @example
   * ```ts
   * setworldspawn()                      // Set spawn at current location
   * setworldspawn([0, 70, 0])           // Set spawn at coordinates
   * setworldspawn(abs(100, 64, 200), [90, 0])  // With specific direction
   * ```
   */
  setworldspawn = (pos?: Macroable<Coordinates<MACRO>, MACRO>, angle?: Macroable<Rotation<MACRO>, MACRO>) =>
    this.finalCommand([coordinatesParser(pos), coordinatesParser(angle)])
}
