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

    // Snapshot the user MCFunction body length before/after the entire side-effecting
    // sequence — both the `data modify ... set from <source>` emitted by DataVariable (which
    // copies the source into the anonymous storage) AND the `execute store result ... set
    // value` written by `execute.store.result().run()`. They belong together: the first
    // loads the data, the second overwrites it with `value`, and the subsequent
    // `if score matches 0..` only makes sense after both have run.
    const mcFunction = sandstoneCore.getCurrentMCFunctionOrThrow()
    const before = mcFunction.body.length
    const anon = DataVariable(this.dataPoint)
    this.conditional = Variable()
    execute.store.result(this.conditional).run(() => anon.set(this.value as unknown as DataPointClass))
    const after = mcFunction.body.length
    this.preNodes = mcFunction.body.splice(before, after - before)
  }

  getValue = (negated?: boolean) =>
    (negated ? ['if', ...this.getCondition()] : ['unless', ...this.getCondition()]).join(' ')

  getCondition(): unknown[] {
    return ['score', this.conditional, 'matches', '0..']
  }
}
