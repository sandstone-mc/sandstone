import { CommandNode } from '#core/nodes'

import { CommandArguments } from '../../helpers'

import type { POINT_OF_INTEREST_TYPES, WORLDGEN_BIOMES, WORLDGEN_STRUCTURES } from '#arguments'
import type { LiteralUnion } from '#utils'

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
