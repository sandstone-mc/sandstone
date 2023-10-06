import { rangeParser } from 'sandstone/variables/parsers.js'

import { SingleConditionNode } from './condition.js'

import type { Range } from 'sandstone/arguments/range.js'
import type { ExecuteCommand } from 'sandstone/commands/implementations/entity/execute.js'
import type { Score } from 'sandstone/variables/Score.js'
import type { SandstoneCore } from 'sandstone/core/index.js'

export class CommandConditionNode extends SingleConditionNode {
  readonly variable

  // eslint-disable-next-line max-len
  constructor(sandstoneCore: SandstoneCore, public type: 'success' | 'result', command: (run: ExecuteCommand) => void, public result: Range | Score['<' | '<=' | '>=' | '>' | '=='] = '1..') {
    super(sandstoneCore)

    const store = sandstoneCore.pack.commands.execute.store[type]
    this.variable = sandstoneCore.pack.Variable(undefined, 'condition')

    command(store.score(this.variable))
  }

  getCondition(): unknown[] {
    if (this.type === 'success') {
      return ['score', this.variable, 'matches', '1']
    }
    if (typeof this.result === 'function') {
      /** @ts-ignore */
      return this.result(this.variable)._toMinecraftCondition().getCondition()
    }
    return ['score', this.variable, 'matches', rangeParser(this.result)]
  }
}
