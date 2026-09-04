import type { NBTObject } from 'sandstone/arguments/nbt'
import type { DataPointPickClass, Node, SandstoneCore } from 'sandstone/core'
import type { DataPointClass, Score } from 'sandstone/variables'
import { SingleConditionNode } from '../condition'

export class DataPointExistsConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    readonly dataPoint: DataPointClass,
  ) {
    super(sandstoneCore)
  }

  getCondition(): string[] {
    return ['data', this.dataPoint.type, this.dataPoint.currentTarget, this.dataPoint.path]
  }
}

export class DataPointEqualsConditionNode extends SingleConditionNode {
  readonly conditional: Score

  constructor(
    sandstoneCore: SandstoneCore,
    readonly dataPoint: DataPointClass,
    readonly value: NBTObject | Score | DataPointClass | DataPointPickClass,
  ) {
    super(sandstoneCore)

    const { DataVariable, Variable, commands } = sandstoneCore.pack
    const { execute } = commands

    const mcFunction = sandstoneCore.getCurrentMCFunctionOrThrow()
    const before = mcFunction.body.length
    const anon = DataVariable(this.dataPoint)
    this.conditional = Variable()
    execute.store.result(this.conditional).run(() => anon.set(this.value as unknown as DataPointClass))
    const after = mcFunction.body.length
    this.preNodes = mcFunction.body.splice(before, after - before)
  }

  getCondition(): unknown[] {
    return ['score', this.conditional, 'matches', '0']
  }
}
