import type { Coordinates, NBTObject } from 'sandstone'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore'
import { coordinatesParser, nbtStringifier } from 'sandstone/variables'
import { SingleConditionNode } from '../condition'
import type { Registry } from 'sandstone/arguments/generated/registry'
import { blockStateStringifier } from 'sandstone/commands/implementations/block/setblock'

export class BlockConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private position: Coordinates,
    private block: Registry['minecraft:block'],
    private state?: Record<string, string | number | boolean>,
    private nbt?: NBTObject,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    const stateStr = this.state && Object.keys(this.state).length > 0
      ? blockStateStringifier(this.state)
      : ''
    const nbtStr = this.nbt ? nbtStringifier(this.nbt) : ''
    return ['block', coordinatesParser(this.position), `${this.block}${stateStr}${nbtStr}`]
  }
}
