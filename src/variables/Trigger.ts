import type { SandstoneCore } from 'sandstone/core'
import { _RawMCFunctionClass, type MCFunctionClass } from 'sandstone/core/resources/datapack/mcfunction'
import { ObjectiveClass } from './Objective.js'
import type { Score } from './Score.js'

const checkTriggers: Record<number, MCFunctionClass<undefined, undefined>> = {}

export type TriggerHandler =
  | (() => any)
  | MCFunctionClass<undefined, undefined>
  | readonly [_: 'num', max: number, callback: (num: number) => any]
  | readonly [_: 'score', callback: (score: Score) => any]

export class TriggerClass<HANDLE extends TriggerHandler> {
  public readonly objective: ObjectiveClass

  constructor(
    protected sandstoneCore: SandstoneCore,
    public readonly name: string,
    protected readonly callback: HANDLE,
    public readonly pollingEvery: number,
  ) {
    this.objective = new ObjectiveClass(sandstoneCore.pack, name, 'dummy', undefined, { creator: 'sandstone' })

    const { registerNewObjective, MCFunction, commands } = sandstoneCore.pack

    registerNewObjective(this.objective)

    if (!checkTriggers[pollingEvery]) {
      checkTriggers[pollingEvery] = MCFunction(`triggers/check/${pollingEvery}`, {
        creator: 'sandstone',
        runEvery: pollingEvery,
      })
    }

    checkTriggers[pollingEvery].push(() => {
      commands.execute.as(`@a[scores={${name}=1..}]`).run(() => {
        const score = this.objective('@s')

        if (callback instanceof _RawMCFunctionClass || typeof callback === 'function') {
          callback()
        } else if (callback[0] === 'num') {
          score.match(1, callback[1], callback[2])
        } else {
          callback[1](score)
        }

        score['='](0)
      })
    })
  }

  toString = () => this.name
}
