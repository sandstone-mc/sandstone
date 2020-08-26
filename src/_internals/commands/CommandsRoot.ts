import type { AtLeastOne, LiteralUnion } from '@/generalTypes'
import {
  BIOMES,
  BLOCKS,
  Coordinates,
  coordinatesParser,
  ENTITY_TYPES,
  GAMEMODES,
  GAMERULES,
  ITEMS,
  JsonTextComponent,
  MessageOrSelector,
  MultipleEntitiesArgument,
  MultiplePlayersArgument,
  NBT, Rotation,
  rotationParser,
  SingleEntityArgument,
  SinglePlayerArgument,
  SOUND_EVENTS,
  SOUND_SOURCES,
  STRUCTURES,
} from '@arguments'

import Datapack from '@datapack/Datapack'
import type { SaveOptions } from '@datapack/filesystem'
import type { CommandArgs } from '@datapack/minecraft'
import { Objective, Selector } from '@variables'
import { JsonTextComponentClass } from '@variables/JsonTextComponentClass'
import type * as commands from '../../commands'
import { command } from './decorators'
import {
  Advancement, Attribute, Bossbar, Clone, Data, DatapackCommand, Debug,
  DefaultGamemode, Difficulty, Effect, Enchant, Execute,
  Experience,
  Fill,
  Forceload,
  FunctionCommand, Loot, Particle, Recipe, ReplaceItem, Schedule, Scoreboard, SpreadPlayers, TagCommand, Team, Teleport, Time, Title, Trigger, Weather, WorldBorder,
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
  clear = (targets?: MultiplePlayersArgument, item?: LiteralUnion<ITEMS>, maxCount?: number) => { }

  // clone command //
  clone = (new Clone(this)).clone

  // Add a comment //
  @command('#', { isRoot: true })
  comment = (...comments: string[]) => { }

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
  gamemode = (gamemode: GAMEMODES, target: MultiplePlayersArgument) => { }

  // gamerule command //
  @command('gamerule', { isRoot: true })
  gamerule = (gamerule: LiteralUnion<GAMERULES>, value: boolean | number) => { }

  // give command //
  @command('give', { isRoot: true })
  give = (target: MultiplePlayersArgument, item: LiteralUnion<ITEMS>, count?: number) => { }

  // help command //
  @command('help', { isRoot: true })
  help = (command_?: keyof typeof commands) => { }

  // kill command //
  @command('kill', { isRoot: true })
  kill = (targets: MultipleEntitiesArgument) => { }

  // list command //
  @command('list', {
    isRoot: true,
    parsers: {
      '0': (uuids) => (uuids ? 'uuids' : undefined),
    },
  })
  list = (uuids?: boolean) => { }

  // locate command //
  @command('locate', { isRoot: true })
  locate = (structure: LiteralUnion<STRUCTURES>) => { }

  // locatebiome command //
  @command('locatebiome', { isRoot: true })
  locatebiome = (biome: LiteralUnion<BIOMES>) => { }

  // loot command //
  loot = new Loot(this)

  // me command //
  @command('me', { isRoot: true })
  me = (action: string) => { }

  // particle command //
  particle = (new Particle(this)).particle

  // playsound command //
  @command('playsound', { isRoot: true })
  playsound = (sound: LiteralUnion<SOUND_EVENTS>, source: SOUND_SOURCES, targets: MultiplePlayersArgument, sourcePosition?: Coordinates, volume?: number, pitch?: number, minVolume?: number) => { }

  // recipe command //
  recipe = new Recipe(this)

  // reload command //
  @command('reload', { isRoot: true })
  reload = () => { }

  // replaceitem command //
  replaceitem = new ReplaceItem(this)

  // say command //
  @command('say', { isRoot: true })
  say = (...messages: string[]) => { }

  // schedule command //
  schedule = new Schedule(this)

  // scoreboard command //
  scoreboard = new Scoreboard(this)

  // seed command //
  @command('seed', { isRoot: true })
  seed = () => { }

  // setblock command //
  @command('setblock', { isRoot: true, parsers: { '0': coordinatesParser } })
  setblock = (pos: Coordinates, block: LiteralUnion<BLOCKS>, type?: 'destroy' | 'keep' | 'replace') => { }

  // setidletimeout command //
  @command('setidletimeout', { isRoot: true })
  setidletimeout = (minutes: number) => { }

  // setworldspawn command //
  @command('setworldspawn', { isRoot: true, parsers: { '0': coordinatesParser, '1': rotationParser } })
  setworldspawn = (pos?: Coordinates, angle?: Rotation) => { }

  // spawnpoint command //
  @command('spawnpoint', { isRoot: true, parsers: { '1': coordinatesParser, '2': rotationParser } })
  spawnpoint = (targets?: MultiplePlayersArgument, pos?: Coordinates, angle?: Rotation) => { }

  // spectate command //
  /**
   * Causes a player in Spectator mode to spectate another entity.
   *
   * @param targets Specifies the target to be spectated.
   *
   * @param player Specifies the spectating player. If unspecified, defaults to the executor.
   */
  @command('spectate', { isRoot: true })
  spectate = (target: SinglePlayerArgument, player?: SingleEntityArgument) => { }

  // spreadplayers command //
  spreadplayers = (new SpreadPlayers(this)).spreadplayers

  /**
   * Stops a given sound.
   *
   * @param targets Specifies the command's target.
   *
   * @param source Specifies which category in the Music & Sound options the sound falls under. If it is *, stop sound of all category.
   *
   * @param sound Specifies the sound to stop.
   */
  @command('stopsound', { isRoot: true })
  stopsound = (targets: MultiplePlayersArgument, source?: SOUND_SOURCES | '*', sound?: LiteralUnion<SOUND_EVENTS>) => { }

  /**
   * Summons an entity.
   *
   * @param entity Specifies the entity to be summoned.
   *
   * @param pos Specifies the position to summon the entity. If not specified, defaults to the position of the command's execution.
   *
   * @param nbt Specifies the data tag for the entity.
   */
  @command('summon', { isRoot: true })
  summon = (entity: LiteralUnion<ENTITY_TYPES>, pos?: Coordinates, nbt?: NBT) => { }

  // tag command //
  tag = (new TagCommand(this)).tag

  // team command //
  team = new Team(this)

  // teammessage command //
  /**
   * Specifies a message to send to team.
   *
   * @param messages Must be plain text messages.
   * Can include spaces as well as target selectors.
   * The game replaces entity selectors in the message with the list of selected entities' names,
   * which is formatted as "name1 and name2" for two entities, or "name1, name2, ... and namen" for n entities.
   *
   * At least one message is necesarry.
   */
  @command('teammessage', { isRoot: true })
  teammessage = (...messages: AtLeastOne<MessageOrSelector>) => { }

  // teleport command //
  teleport = (new Teleport(this)).teleport

  // tell command //
  /**
   * Sends a private message to one or more players.
   * @param targets Specifies the player(s) to send the message to.
   * @param messages Specified the message to tell. They will be joined with whitespaces.
   * Can include target selectors.
   * The game replaces entity selectors in the message with the list of selected entities' names,
   * which is formatted as "name1 and name2" for two entities, or "name1, name2, ... and namen" for n entities.
   */
  @command('tell', { isRoot: true })
  tell = (targets: MultiplePlayersArgument, ...messages: AtLeastOne<MessageOrSelector>) => { }

  // tellraw command //
  @command('tellraw', { isRoot: true, parsers: { '1': (msg) => new JsonTextComponentClass(msg) } })
  tellraw = (targets: MultiplePlayersArgument, message: JsonTextComponent) => { }

  // time command //
  time = new Time(this)

  // title command //
  title = (new Title(this)).title

  // trigger command //
  trigger = (new Trigger(this)).trigger

  weather = new Weather(this)

  worldborder = new WorldBorder(this)

  /// ALIAS COMMANDS ///

  // msg command //
  msg: CommandsRoot['tell'] = (...args) => this.tell(...args)

  // w command //
  w: CommandsRoot['tell'] = (...args) => this.tell(...args)

  // xp command //
  xp: CommandsRoot['experience'] = this.experience
}

export default CommandsRoot
