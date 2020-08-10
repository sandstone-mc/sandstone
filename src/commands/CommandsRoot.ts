/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function, @typescript-eslint/explicit-module-boundary-types */

import Datapack from '../datapack/Datapack'
import { CommandArgs } from '../datapack/minecraft'
import {
  Absolute, JsonTextComponentClass, Relative, Selector,
} from '../variables'
import { JsonTextComponent } from '../arguments'

import { command } from './decorators'
import { Teleport } from './teleport'

export class CommandsRoot {
  protected datapack: Datapack

  protected inExecute: boolean

  executable: boolean

  arguments: CommandArgs

  constructor(datapack: Datapack) {
    this.arguments = []
    this.inExecute = false
    this.executable = false
    this.datapack = datapack
  }

  register = () => {
    if (!this.executable) {
      throw new Error(`Registering a command that is not executable: ${this.arguments}`)
    }

    this.datapack.registerNewCommand(this.arguments as CommandArgs)
    this.reset()
  }

  protected reset() {
    this.arguments = []
    this.inExecute = false
  }

  // say command //
  @command('say')
  say = (...messages: string[]) => {}

  // teleport command //
  teleport: Teleport['teleport'] = (new Teleport(this)).teleport

  // tellraw command //
  @command('tellraw', { parsers: { '1': JsonTextComponentClass } })
  tellraw = (targets: string, message: JsonTextComponent) => {}
}

export default CommandsRoot
