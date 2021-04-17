import { JSONTextComponentClass } from './JSONTextComponentClass'
import { Score } from './Score'

import type { JSONTextComponent, MultipleEntitiesArgument } from 'src/arguments'
import type { CommandsRoot } from '@commands'

export class ObjectiveClass<CRITERION extends string | undefined = string | undefined> {
  private commandsRoot: CommandsRoot

  name: string

  criterion: CRITERION

  display: JSONTextComponentClass | undefined

  _displayRaw: JSONTextComponent | undefined

  constructor(commandsRoot: CommandsRoot, name: string, criterion?: CRITERION, display?: JSONTextComponent) {
    this.commandsRoot = commandsRoot
    this.name = name
    this.criterion = criterion as CRITERION
    this.display = display === undefined ? undefined : new JSONTextComponentClass(display)
    this._displayRaw = display
  }

  toString() {
    return this.name
  }

  ScoreHolder = (scoreHolder: MultipleEntitiesArgument): Score<CRITERION> => new Score<CRITERION>(this.commandsRoot, scoreHolder.toString(), this)
}

export type ObjectiveInstance<CRITERION extends string | undefined = string | undefined> = (
  Omit<ObjectiveClass<CRITERION>, 'ScoreHolder'> & ObjectiveClass<CRITERION>['ScoreHolder']
)
