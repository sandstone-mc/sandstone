import type { Coordinates } from 'sandstone'
import type { SandstoneCore } from 'sandstone/core'
import { coordinatesParser } from 'sandstone/variables'
import { SingleConditionNode } from '../condition'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class BiomeConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private coordinates: Coordinates,
    private biome: Registry['minecraft:worldgen/biome'],
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['biome', coordinatesParser(this.coordinates), this.biome]
  }
}
