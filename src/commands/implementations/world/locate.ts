import { CommandNode } from 'sandstone/core/nodes.js'

import { CommandArguments } from '../../helpers.js'

import type { POINT_OF_INTEREST_TYPES, WORLDGEN_BIOMES, WORLDGEN_STRUCTURES } from 'sandstone/arguments/index.js'
import type { LiteralUnion } from 'sandstone/utils.js'

export class LocateCommandNode extends CommandNode {
  command = 'locate' as const
}

export class LocateCommand extends CommandArguments {
  protected NodeType = LocateCommandNode

  /**
   * Displays the coordinates for the closest generated structure of a given type.
   *
   * @param structure Specifies the structure to locate.
   */
  structure = (structure: LiteralUnion<WORLDGEN_STRUCTURES>) => this.finalCommand(['structure', structure])

  /**
   * Displays the coordinates for the closest generated biome of a given type.
   *
   * @param biome Specifies the biome to locate.
   */
  biome = (biome: LiteralUnion<WORLDGEN_BIOMES>) => this.finalCommand(['biome', biome])

  /**
   * Displays the coordinates for the closest generated point of interest of a given type.
   *
   * @param pointOfInterest Specifies the point of interest to locate.
   */
  poi = (pointOfInterest: LiteralUnion<POINT_OF_INTEREST_TYPES>) => this.finalCommand(['poi', pointOfInterest])
}
