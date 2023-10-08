import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, targetParser } from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type { Coordinates, MultiplePlayersArgument, Rotation } from 'sandstone/arguments'

export class SpawnPointCommandNode extends CommandNode {
  command = 'spawnpoint' as const
}

export class SpawnPointCommand extends CommandArguments {
  protected NodeType = SpawnPointCommandNode

  /**
   * Sets the spawn point for a player. You can now set your spawnpoint in the Nether and End.
   *
   * @param targets Specifies the player whose spawn point should be set.
   * If not specified, defaults to the command's executor.
   *
   * @param pos Specifies the coordinates of the player's new spawn point.
   * If not specified, defaults to the position of the command's executor in Java Edition.
   *
   * @param angle Specifies the yaw angle to spawn with. Defaults to the direction the executor is facing.
   */
  spawnpoint = (targets?: MultiplePlayersArgument, pos?: Coordinates, angle?: Rotation) => this.finalCommand([targetParser(targets), coordinatesParser(pos), coordinatesParser(angle)])
}
