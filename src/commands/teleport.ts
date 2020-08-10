/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function, @typescript-eslint/explicit-module-boundary-types, consistent-return */
import { command } from './decorators'

import type { CommandsRoot } from './CommandsRoot'
import type { Coordinates, Rotation } from '../arguments'
import { CoordinatesClass } from '../variables/Coordinates'

export class TeleportFacing {
  commandsRoot: CommandsRoot

  constructor(commandsRoot: CommandsRoot) {
    this.commandsRoot = commandsRoot
  }

  @command('facing', { thisField: 'commandsRoot' })
  facing = (location: Coordinates) => {}

  @command(['facing', 'entity'], { thisField: 'commandsRoot' })
  facingEntity = (entity: string, anchor: 'eyes' | 'feet' = 'eyes') => {}
}

export class Teleport {
  commandsRoot: CommandsRoot

  constructor(commandsRoot: CommandsRoot) {
    this.commandsRoot = commandsRoot
  }

  @command('teleport', { hasSubcommands: true, thisField: 'commandsRoot' })
  teleport: (
    ((destinationEntity: string) => void) &
    ((location: Coordinates) => void) &
    ((targets: string, destinationEntity: string) => void) &
    ((targets: string, location: Coordinates) => TeleportFacing) &
    ((targets: string, location: Coordinates, rotation: Rotation) => void)
  ) = (...args: unknown[]): any => {
    if (args.length === 2 && (args[1] instanceof CoordinatesClass || typeof args[1] === 'string')) {
      return new TeleportFacing(this.commandsRoot)
    }

    this.commandsRoot.register()
  }
}
