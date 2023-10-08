/* eslint-disable max-len */
import { CommandNode } from 'sandstone/core/nodes'
import {
  coordinatesParser, structureMirrorParser, structureRotationParser,
} from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'
import { validateIntegerRange } from '../../validators.js'

import type {
  Coordinates, STRUCTURES, WORLDGEN_CONFIGURED_FEATURES, WORLDGEN_STRUCTURES, WORLDGEN_TEMPLATE_POOLS,
} from 'sandstone/arguments'
import type { StructureClass } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'
import type { StructureMirror, StructureRotation } from 'sandstone/variables'

export class PlaceCommandNode extends CommandNode {
  command = 'place' as const
}

export class PlaceCommand extends CommandArguments {
  protected NodeType = PlaceCommandNode

  // TODO: When working on worldgen add Feature Class here
  /**
   * Attempts to place a worldgen feature.
   *
   * @param feature Specifies the configured feature to place.
   * @param pos Optional. Where the placement should be tried.
   */
  feature = (feature: LiteralUnion<WORLDGEN_CONFIGURED_FEATURES>, pos: Coordinates = '~ ~ ~') => this.finalCommand(['feature', feature, coordinatesParser(pos)])

  /**
   * Places from a pool with a jigsaw.
   *
   * @param pool Configured structure template pool.
   * @param target Jigsaw with the target name will be anchored to the `pos` or current location. If multiple jigsaws have this name a random one will be the anchor.
   * @param maxDepth Max depth of the jigsaw. Must be an integer between 1 & 7 (inclusive).
   * @param pos Optional. Where to place.
   */
  jigsaw = (pool: LiteralUnion<WORLDGEN_TEMPLATE_POOLS>, target: string, maxDepth: number, pos: Coordinates = '~ ~ ~') => this.finalCommand(['jigsaw', pool, target, `${validateIntegerRange(maxDepth, 'Jigsaw max depth', 0, 7)}`, coordinatesParser(pos)])

  /**
   * Places a configured structure feature. (not from `data/<namespace>/structures`, see [the wiki](https://minecraft.wiki/w/Custom_structure#Configured_Structure_Feature))
   *
   * @param configuredStructure The configured structure feature to place.
   * @param pos Optional. Where to place.
   */
  structure = (configuredStructure: LiteralUnion<WORLDGEN_STRUCTURES>, pos: Coordinates = '~ ~ ~') => this.finalCommand(['structure', configuredStructure, coordinatesParser(pos)])

  /**
   * Places a structure (from `data/<namespace>/structures`, just like a LOAD structure block).
   *
   * @param structure The structure to place.
   * @param pos Optional. Where to place.
   * @param rotation Optional. Rotation to apply to the structure.
   * @param mirror Optional. Mirroring to apply to the structure.
   * @param integrity Optional. How complete the structure will be. Must be a float between 1.0 & 0.0 (inclusive), if below 1 the structure will be randomly degraded.
   * @param seed Optional. Integer applied to the integrity random. Defaults to 0.
   */
  template = (structure: LiteralUnion<STRUCTURES> | StructureClass, pos: Coordinates = '~ ~ ~', rotation?: StructureRotation, mirror?: StructureMirror, integrity = 1, seed = 0) => {
    // .
    this.finalCommand(['template', `${structure}`, coordinatesParser(pos), structureRotationParser(rotation), structureMirrorParser(mirror), `${integrity}`, `${seed}`])
  }
}
