import { makeClassCallable } from 'sandstone/utils'

import { JSONTextComponentClass } from './JSONTextComponentClass'
import { Score } from './Score'

import type { LiteralUnion, MakeInstanceCallable } from 'sandstone/utils'
import type { SandstonePack } from '../pack'
import type { JSONTextComponent, MultipleEntitiesArgument, OBJECTIVE_CRITERION } from '#arguments'

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

  toString() {
    return this.name
  }

  toJSON = this.toString

  ScoreHolder = (scoreHolder: MultipleEntitiesArgument): Score => new Score(this.sandstonePack, scoreHolder.toString(), this as any)

  __call__ = this.ScoreHolder
}

export const ObjectiveClass = makeClassCallable(_RawObjectiveClass)
export type ObjectiveClass = MakeInstanceCallable<_RawObjectiveClass>
