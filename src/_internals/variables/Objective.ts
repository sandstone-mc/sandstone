import { JsonTextComponentClass } from './JsonTextComponentClass'
import { PlayerScore } from './PlayerScore'

import type { LiteralUnion } from '@/generalTypes'
import type { JsonTextComponent, MultipleEntitiesArgument, OBJECTIVE_CRITERION } from '@arguments'
import type { CommandsRoot } from '@commands'

export class ObjectiveClass {
  private commandsRoot: CommandsRoot

  name: string

  criterion: string

  display: JsonTextComponentClass | undefined

  _displayRaw: JsonTextComponent | undefined

  constructor(commandsRoot: CommandsRoot, name: string, criterion: LiteralUnion<OBJECTIVE_CRITERION>, display?: JsonTextComponent) {
    this.commandsRoot = commandsRoot
    this.name = name
    this.criterion = criterion as string
    this.display = display === undefined ? undefined : new JsonTextComponentClass(display)
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
  display?: JsonTextComponent,
): ObjectiveClass {
  return new ObjectiveClass(
    commandsRoot,
    name,
    criterion,
    display,
  )
}
