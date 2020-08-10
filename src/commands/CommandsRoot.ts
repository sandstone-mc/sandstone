/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function, @typescript-eslint/explicit-module-boundary-types */

import Datapack from '../datapack/Datapack'
import { CommandArgs } from '../datapack/minecraft'
import {
  JsonTextComponentClass, Selector,
} from '../variables'
import { ITEMS, JsonTextComponent, SelectorArgument } from '../arguments'
import { LiteralUnion } from '../generalTypes'
import { command } from './decorators'
import { Teleport } from './Teleport'
import { Attribute } from './Attribute'
import { Bossbar } from './Bossbar'
import { Clone } from './Clone'

export class CommandsRoot {
  protected datapack: Datapack

  protected inExecute: boolean

  executable: boolean

  arguments: CommandArgs

  // This might seem weird, but we need this object to reference itself. Thanks to that, CommandsRoot implements the Command interface,
  // and we can directly create commands here.
  commandsRoot: CommandsRoot

  constructor(datapack: Datapack) {
    this.arguments = []
    this.inExecute = false
    this.executable = false
    this.datapack = datapack
    this.commandsRoot = this
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
    this.executable = false
  }

  // attribute command //
  attribute = (new Attribute(this)).attribute

  // bossabar command //
  bossbar = (new Bossbar(this))

  // clear command //
  @command('clear', { isRoot: true })
  clear = (targets?: SelectorArgument<false>, item?: LiteralUnion<ITEMS>, maxCount?: number) => { }

  clone = (new Clone(this)).clone

  // say command //
  @command('say', { isRoot: true })
  say = (...messages: string[]) => { }

  // teleport command //
  teleport = (new Teleport(this)).teleport

  // tellraw command //
  @command('tellraw', { isRoot: true, parsers: { '1': (msg) => new JsonTextComponentClass(msg) } })
  tellraw = (targets: SelectorArgument<false>, message: JsonTextComponent) => { }
}

export default CommandsRoot
