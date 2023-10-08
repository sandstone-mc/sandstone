import { makeClassCallable } from 'sandstone/utils'

import { JSONTextComponentClass } from './JSONTextComponentClass.js'
import { targetParser } from './parsers.js'
import { Score } from './Score.js'

import type { JSONTextComponent, MultipleEntitiesArgument, OBJECTIVE_CRITERION } from 'sandstone/arguments'
import type { LiteralUnion, MakeInstanceCallable } from 'sandstone/utils'
import type { SandstonePack } from '../pack/index.js'

export class _RawObjectiveClass {
  display: JSONTextComponentClass | undefined

  _displayRaw: JSONTextComponent | undefined

  protected creator: 'user' | 'sandstone'

  constructor(
    protected sandstonePack: SandstonePack,
    public name: string,
    public criteria: LiteralUnion<OBJECTIVE_CRITERION> = 'dummy',
    display: JSONTextComponent | undefined,
    opts: { creator: 'user' | 'sandstone' },
  ) {
    this.display = display === undefined ? undefined : new JSONTextComponentClass(display)
    this._displayRaw = display
    this.creator = opts.creator
  }

  /** Resets all scores on the objective */
  reset = () => this.sandstonePack.commands.scoreboard.players.reset('*', this.name)

  ScoreHolder = (scoreHolder: MultipleEntitiesArgument): Score => new Score(this.sandstonePack, targetParser(scoreHolder), this as any)

  toString() {
    return this.name
  }

  toJSON = this.toString

  __call__ = this.ScoreHolder
}

export const ObjectiveClass = makeClassCallable(_RawObjectiveClass)
export type ObjectiveClass = MakeInstanceCallable<_RawObjectiveClass>
