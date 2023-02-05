import { CommandNode } from '@core/nodes'

import { CommandArguments } from '../helpers'

import type { BIOMES } from '@arguments'
import type { LiteralUnion } from '@utils'

export class LocateBiomeCommandNode extends CommandNode {
  command = 'locatebiome' as const
}

export class LocateBiomeCommand extends CommandArguments {
  public NodeType = LocateBiomeCommandNode

  /**
   * Displays the coordinates for the closest biome of a given biome ID in the chat for the player who executed the command.
   *
   * @param biome Specifies the biome to be located.
   */
  locatebiome = (biome: LiteralUnion<BIOMES>) => { }
}
