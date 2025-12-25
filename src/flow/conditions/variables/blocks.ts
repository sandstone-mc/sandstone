import type { Coordinates } from 'sandstone'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore'
import { coordinatesParser } from 'sandstone/variables'
import { SingleConditionNode } from '../condition'

export class BlocksConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private start: Coordinates,
    private end: Coordinates,
    private destination: Coordinates,
    private scan_mode: 'all' | 'masked',
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return [
      'blocks',
      coordinatesParser(this.start),
      coordinatesParser(this.end),
      coordinatesParser(this.destination),
      this.scan_mode,
    ]
  }
}
