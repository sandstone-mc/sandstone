import type { LiteralUnion } from '@/generalTypes'
import type {
  GAMEMODES, ITEMS, JsonTextComponent, SelectorArgument,
} from '@arguments'
import Datapack from '@datapack/Datapack'
import type { SaveOptions } from '@datapack/filesystem'
import type { CommandArgs } from '@datapack/minecraft'
import { Objective, Selector } from '@variables'
import { JsonTextComponentClass } from '@variables/JsonTextComponentClass'
import { command } from './decorators'
import {
  Advancement, Attribute, Bossbar, Clone, Data, DatapackCommand, Debug,
  DefaultGamemode, Difficulty, Effect, Enchant, Execute,
  Experience,
  Fill,
  Forceload,
  FunctionCommand, Scoreboard, Teleport,
} from './implementations'

export class CommandsRoot {
  Datapack: Datapack

  inExecute: boolean

  executable: boolean

  arguments: CommandArgs

  // This might seem weird, but we need this object to reference itself.
  // Thanks to that, CommandsRoot implements the Command interface,
  // and we can directly create commands here.
  commandsRoot: CommandsRoot

  constructor(datapack: Datapack) {
    this.arguments = []
    this.inExecute = false
    this.executable = false
    this.Datapack = datapack
    this.commandsRoot = this
  }

  /**
   * Registers the current command.
   *
   * @param soft If true, then it allows to try to register a command when we don't know if it is needed.
   * Sometimes, is is possible a command needs to be registered, or maybe it's not. Then a soft register is necessary.
   */
  register = (soft = false) => {
    if (this.executable) {
      this.Datapack.registerNewCommand(this.arguments as CommandArgs)
      this.reset()
      return
    }

    if (!soft) {
      throw new Error(`Registering a command that is not executable: ${JSON.stringify(this.arguments)}`)
    }

    // Soft registering. If the last command had arguments but was not executable, it's an error.
    if (this.arguments.length > 0) {
      throw new Error(`Error: the previous command ${this.arguments} was not finished.`)
    }
  }

  reset() {
    this.arguments = []
    this.inExecute = false
    this.executable = false
  }

  /** UTILS */
  // Create a new objective
  createObjective = (name: string, criterion: string, display?: JsonTextComponent) => {
    const objective = Objective(this, name, criterion, display)
    this.Datapack.registerNewObjective(objective)
    return objective
  }

  Selector = Selector

  /**
   * Saves the datapack to the file system.
   *
   * @param name The name of the Datapack
   *
   * @param options The save options
   */
  save = (name: string, options?: SaveOptions) => {
    this.Datapack.save(name, options)
  }

  /** COMMANDS */
  // advancement command //
  advancement = new Advancement(this)

  // attribute command //
  attribute = (new Attribute(this)).attribute

  // bossabar command //
  bossbar = new Bossbar(this)

  // clear command //
  @command('clear', { isRoot: true })
  clear = (targets?: SelectorArgument<false>, item?: LiteralUnion<ITEMS>, maxCount?: number) => { }

  // clone command //
  clone = (new Clone(this)).clone

  // data command //
  data = new Data(this)

  // datapack command //
  datapack = new DatapackCommand(this)

  // debug command //
  debug = new Debug(this)

  // defaultgamemode command //
  defaultgamemode = (new DefaultGamemode(this)).defaultgamemode

  // difficulty command //
  difficulty = (new Difficulty(this)).difficulty

  // effect command //
  effect = (new Effect(this))

  // enchant command //
  enchant = (new Enchant(this)).enchant

  // execute command //
  execute: Omit<Execute, 'run' | 'runOne'> = (new Execute(this))

  // experience command //
  experience = new Experience(this)

  // fill command //
  fill = (new Fill(this)).fill

  // forceload command //
  forceload = new Forceload(this)

  // function command //
  function = (new FunctionCommand(this).function)

  // gamemode command //
  @command('gamemode', { isRoot: true })
  gamemode = (gamemode: GAMEMODES, target: SelectorArgument<false>) => {}

  // say command //
  @command('say', { isRoot: true })
  say = (...messages: string[]) => { }

  // scoreboard command //
  scoreboard = new Scoreboard(this)

  // teleport command //
  teleport = (new Teleport(this)).teleport

  // tellraw command //
  @command('tellraw', { isRoot: true, parsers: { '1': (msg) => new JsonTextComponentClass(msg) } })
  tellraw = (targets: SelectorArgument<false>, message: JsonTextComponent) => { }
}

export default CommandsRoot
