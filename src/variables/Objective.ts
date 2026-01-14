import type { JSONTextComponent, MultipleEntitiesArgument, NBTSerializable, OBJECTIVE_CRITERIA } from 'sandstone/arguments'
import type { LiteralUnion, MakeInstanceCallable } from 'sandstone/utils'
import { formatDebugString, makeClassCallable } from 'sandstone/utils'
import * as util from 'util'
import type { SandstonePack } from '../pack'
import { JSONTextComponentClass } from './JSONTextComponentClass'
import { targetParser } from './parsers'
import type { ScoreDisplay } from './Score'
import { Score } from './Score'

export class _RawObjectiveClass implements NBTSerializable {
  display: JSONTextComponentClass | undefined

  _displayRaw: JSONTextComponent | undefined

  /** @internal */
  creator: 'user' | 'sandstone'

  constructor(
    protected sandstonePack: SandstonePack,
    public name: string,
    public criteria: LiteralUnion<OBJECTIVE_CRITERIA> = 'dummy',
    display: JSONTextComponent | undefined,
    opts: { creator: 'user' | 'sandstone' },
  ) {
    this.display = display === undefined ? undefined : new JSONTextComponentClass(display)
    this._displayRaw = display
    this.creator = opts.creator
  }

  /** Resets all scores on the objective */
  reset = () => this.sandstonePack.commands.scoreboard.players.reset('*', this.name)

  ScoreHolder = (scoreHolder: MultipleEntitiesArgument<false>, display?: ScoreDisplay): Score =>
    new Score(this.sandstonePack, targetParser(scoreHolder), display, this as any)

  toString() {
    return this.name
  }

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(
      this.constructor.name,
      {
        name: this.name,
        criteria: this.criteria,
        display: this.display,
        creator: this.creator,
      },
      undefined,
      options.indent,
    )
  }

  toJSON = this.toString

  toNBT = this.toString

  __call__ = this.ScoreHolder
}

export const ObjectiveClass = makeClassCallable(_RawObjectiveClass)
export type ObjectiveClass = MakeInstanceCallable<_RawObjectiveClass> & NBTSerializable
