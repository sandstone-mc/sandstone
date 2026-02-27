import type { Range } from 'sandstone/arguments/range'
import type { ExecuteCommand } from 'sandstone/commands/implementations/entity/execute'
import type { SandstoneCore } from 'sandstone/core'
import { rangeParser } from 'sandstone/variables/parsers'
import type { Score } from 'sandstone/variables/Score'
import { SingleConditionNode } from './condition'

export class CommandConditionNode extends SingleConditionNode {
  readonly variable

  // eslint-disable-next-line max-len
  constructor(
    sandstoneCore: SandstoneCore,
    public type: 'success' | 'result',
    command: (run: ExecuteCommand<false>) => void,
    public result: Range<false> | Score['<' | '<=' | '>=' | '>' | '=='] = '1..',
  ) {
    super(sandstoneCore)

    const store = sandstoneCore.pack.commands.execute.store[type]
    this.variable = sandstoneCore.pack.Variable(undefined, 'condition')

    command(store(this.variable))
  }

  getCondition(): unknown[] {
    if (this.type === 'success') {
      return ['score', this.variable, 'matches', '1']
    }
    if (typeof this.result === 'function') {
      /** @ts-ignore */
      return this.result(this.variable)._toMinecraftCondition().getCondition()
    }
    return ['score', this.variable, 'matches', rangeParser(this.sandstoneCore, this.result)]
  }
}
