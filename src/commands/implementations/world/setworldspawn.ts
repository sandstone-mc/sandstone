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
   * Sets the world spawn.
   *
   * @param pos Specifies the coordinates of the world spawn. If not specified, defaults to the block position of the command's execution.
   *
   * @param angle Specified the yaw angle to spawn with. Defaults to the direction the executor is facing.
   */
  setworldspawn = (pos?: Macroable<Coordinates<MACRO>, MACRO>, angle?: Macroable<Rotation<MACRO>, MACRO>) =>
    this.finalCommand([coordinatesParser(pos), coordinatesParser(angle)])
}
