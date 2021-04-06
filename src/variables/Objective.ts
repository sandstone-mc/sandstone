import { JSONTextComponentClass } from './JSONTextComponentClass'
import { PlayerScore } from './PlayerScore'

import type { JSONTextComponent, MultipleEntitiesArgument, OBJECTIVE_CRITERION } from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'
import type { CommandsRoot } from '@commands'

export class ObjectiveClass {
  private commandsRoot: CommandsRoot

  name: string

  criterion: string

  display: JSONTextComponentClass | undefined

  _displayRaw: JSONTextComponent | undefined

  constructor(commandsRoot: CommandsRoot, name: string, criterion: LiteralUnion<OBJECTIVE_CRITERION>, display?: JSONTextComponent) {
    this.commandsRoot = commandsRoot
    this.name = name
    this.criterion = criterion as string
    this.display = display === undefined ? undefined : new JSONTextComponentClass(display)
    this._displayRaw = display
  }

  toString() {
    return this.name
  }

  ScoreHolder(scoreHolder: MultipleEntitiesArgument) {
    return new PlayerScore(this.commandsRoot, scoreHolder.toString(), this)
  }
}

export function Objective(
  commandsRoot: CommandsRoot,
  name: string,
  criterion: string,
  display?: JSONTextComponent,
): ObjectiveClass {
  return new ObjectiveClass(
    commandsRoot,
    name,
    criterion,
    display,
  )
}
