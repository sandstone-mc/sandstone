import type { Coordinates, SingleEntityArgument } from '@arguments'
import { coordinatesParser } from '@variables'
import { Command } from '../Command'
import { command } from '../decorators'

const getCmd = (name: string) => ['data', 'get', name]

const mergeCmd = (name: string) => ['data', 'merge', name]

const modifyCmd = (name: string) => ['data', 'modify', name]

const removeCmd = (name: string) => ['data', 'remove', name]

class DataGet extends Command {
  @command(getCmd('block'), { isRoot: true, parsers: { '0': coordinatesParser } })
  block = (targetPos: Coordinates, path?: string, scale?: number) => { }

  @command(getCmd('entity'), { isRoot: true })
  entity = (target: SingleEntityArgument, path?: string, scale?: number) => { }

  @command(getCmd('storage'), { isRoot: true })
  storage = (target: string, path?: string, scale?: number) => { }
}

class DataMerge extends Command {
  @command(mergeCmd('block'), { isRoot: true, parsers: { '0': coordinatesParser } })
  block = (targetPos: Coordinates, nbt: string) => { }

  @command(mergeCmd('entity'), { isRoot: true })
  entity = (target: SingleEntityArgument, nbt: string) => { }

  @command(mergeCmd('storage'), { isRoot: true })
  storage = (target: string, nbt: string) => { }
}

class DataModifyValues extends Command {
  @command(['from', 'block'], { parsers: { '0': coordinatesParser } })
  fromBlock = (sourcePosition: Coordinates, sourcePath: string) => { }

  @command(['from', 'entity'])
  fromEntity = (source: SingleEntityArgument, sourcePath: string) => { }

  @command(['from', 'storage'])
  fromStorage = (source: string, sourcePath: string) => { }

  @command('value')
  value = (value: string) => { }
}

class DataModifyType extends Command {
  get append() {
    this.commandsRoot.arguments.push('append')
    this.commandsRoot.executable = false
    return new DataModifyValues(this.commandsRoot)
  }

  @command('insert', { isRoot: false, hasSubcommands: true, executable: false })
  insert = () => new DataModifyValues(this.commandsRoot)

  get merge() {
    this.commandsRoot.arguments.push('merge')
    this.commandsRoot.executable = false
    return new DataModifyValues(this.commandsRoot)
  }

  get preprend() {
    this.commandsRoot.arguments.push('prepend')
    this.commandsRoot.executable = false
    return new DataModifyValues(this.commandsRoot)
  }

  get set() {
    this.commandsRoot.arguments.push('set')
    this.commandsRoot.executable = false
    return new DataModifyValues(this.commandsRoot)
  }
}

class DataModify extends Command {
  @command(modifyCmd('block'), {
    isRoot: true, executable: false, hasSubcommands: true, parsers: { '0': coordinatesParser },
  })
  block = (targetPos: Coordinates, targetPath: string) => new DataModifyType(this.commandsRoot)

  @command(modifyCmd('entity'), { isRoot: true, executable: false, hasSubcommands: true })
  entity = (target: SingleEntityArgument, targetPath: string) => new DataModifyType(this.commandsRoot)

  @command(modifyCmd('storage'), { isRoot: true, executable: false, hasSubcommands: true })
  storage = (target: string, targetPath: string) => new DataModifyType(this.commandsRoot)
}

class DataRemove extends Command {
  @command(removeCmd('block'), {
    isRoot: true, executable: false, hasSubcommands: true, parsers: { '0': coordinatesParser },
  })
  block = (targetPos: Coordinates, targetPath: string) => { }

  @command(removeCmd('entity'), { isRoot: true, executable: false, hasSubcommands: true })
  entity = (target: SingleEntityArgument, targetPath: string) => { }

  @command(removeCmd('storage'), { isRoot: true, executable: false, hasSubcommands: true })
  storage = (target: string, targetPath: string) => { }
}

export class Data extends Command {
  get = new DataGet(this.commandsRoot)

  merge = new DataMerge(this.commandsRoot)

  modify = new DataModify(this.commandsRoot)

  remove = new DataRemove(this.commandsRoot)
}
