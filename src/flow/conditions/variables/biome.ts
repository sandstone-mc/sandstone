import type { Coordinates, WORLDGEN_BIOMES } from 'sandstone'
import type { SandstoneCore } from 'sandstone/core'
import { coordinatesParser } from 'sandstone/variables'
import type { LiteralUnion } from '../../../utils.js'
import { SingleConditionNode } from '../condition.js'

export class BiomeConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private coordinates: Coordinates,
    private biome: LiteralUnion<WORLDGEN_BIOMES>,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['biome', coordinatesParser(this.coordinates), this.biome]
  }
}
