import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser } from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/variables'

import type { Coordinates, Rotation } from 'sandstone/arguments'

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
  setworldspawn = (pos?: Macroable<Coordinates<MACRO>, MACRO>, angle?: Rotation) => this.finalCommand([coordinatesParser(pos), coordinatesParser(angle)])
}
