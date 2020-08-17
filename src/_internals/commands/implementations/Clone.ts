import { VectorClass } from '@variables'
import { BLOCKS, Coordinates } from '@arguments'
import { LiteralUnion } from '@/generalTypes'
import { Command } from '../Command'
import { command } from '../decorators'

export class CloneOptions extends Command {
  @command('replace')
  replace = (mode: 'force' | 'move' | 'normal') => { }

  @command('masked')
  masked = (mode: 'force' | 'move' | 'normal') => { }

  @command('filtered')
  filtered = (filter: LiteralUnion<BLOCKS>, mode: 'force' | 'move' | 'normal') => { }
}

export class Clone extends Command {
  @command('clone', {
    isRoot: true,
    hasSubcommands: true,
    parsers: {
      '0': (arg) => (Array.isArray(arg) ? new VectorClass(arg) : arg),
      '1': (arg) => (Array.isArray(arg) ? new VectorClass(arg) : arg),
      '2': (arg) => (Array.isArray(arg) ? new VectorClass(arg) : arg),
    },
  })
  clone = (begin: Coordinates, end: Coordinates, destination: Coordinates) => new CloneOptions(this.commandsRoot)
}
