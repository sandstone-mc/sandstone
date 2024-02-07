import { PlaceCommand } from './implementations/block/place.js'
import { DamageCommand } from './implementations/entity/damage.js'
import {
  AdvancementCommand,
  AttributeCommand,
  BossBarCommand,
  ClearCommand,
  CloneCommand,
  CommentCommand,
  DataCommand,
  DataPackCommand,
  DebugCommand,
  DefaultGameModeCommand,
  DifficultyCommand,
  EffectCommand,
  EnchantCommand,
  ExecuteCommand,
  ExperienceCommand,
  FillCommand,
  ForceLoadCommand,
  FunctionCommand,
  GameModeCommand,
  GameRuleCommand,
  GiveCommand,
  HelpCommand,
  ItemCommand,
  KillCommand,
  ListCommand,
  LocateCommand,
  LootCommand,
  MeCommand,
  ParticleCommand,
  PlaySoundCommand,
  RawCommand,
  RecipeCommand,
  ReloadCommand,
  ReturnCommand,
  RideCommand,
  SayCommand,
  ScheduleCommand,
  ScoreboardCommand,
  SeedCommand,
  SetBlockCommand,
  SetIdleTimeoutCommand,
  SetWorldSpawnCommand,
  SpawnPointCommand,
  SpectateCommand,
  SpreadPlayersCommand,
  StopSoundCommand,
  SummonCommand,
  TagCommand,
  TeamCommand,
  TeamMessageCommand,
  TeleportCommand,
  TellCommand,
  TellRawCommand,
  TimeCommand,
  TitleCommand,
  TriggerCommand,
  WeatherCommand,
  WorldBorderCommand,
} from './implementations/index.js'

import type { SandstonePack } from 'sandstone/pack/index.js'

function bind<CLASS, METHOD extends string>(pack: SandstonePack, _class: CLASS, method: METHOD) {
  /* @ts-ignore */
  const cmd = new _class(pack)

  if (typeof cmd[method].bind === 'function') {
    return cmd[method].bind(cmd)
  }
  throw Error('Commands binder screwed up')
}

export class SandstoneCommands<MACRO extends boolean> {
  constructor(public sandstonePack: SandstonePack) {}

  get advancement() { return new AdvancementCommand<MACRO>(this.sandstonePack) }

  get attribute() { return bind(this.sandstonePack, AttributeCommand, 'attribute') as AttributeCommand<MACRO>['attribute'] }

  get bossbar() { return new BossBarCommand<MACRO>(this.sandstonePack) }

  get clear() { return bind(this.sandstonePack, ClearCommand, 'clear') as ClearCommand<MACRO>['clear'] }

  get clone() { return bind(this.sandstonePack, CloneCommand, 'clone') as CloneCommand<MACRO>['clone'] }

  get comment() { return bind(this.sandstonePack, CommentCommand, 'comment') as CommentCommand['comment'] }

  get damage() { return bind(this.sandstonePack, DamageCommand, 'damage') as DamageCommand<MACRO>['damage'] }

  get data() { return new DataCommand<MACRO>(this.sandstonePack) }

  get datapack() { return new DataPackCommand(this.sandstonePack) }

  get debug() { return new DebugCommand(this.sandstonePack) }

  get defaultgamemode() { return bind(this.sandstonePack, DefaultGameModeCommand, 'defaultgamemode') as DefaultGameModeCommand['defaultgamemode'] }

  get difficulty() { return bind(this.sandstonePack, DifficultyCommand, 'difficulty') as DifficultyCommand['difficulty'] }

  get effect() { return new EffectCommand<MACRO>(this.sandstonePack) }

  get enchant() { return bind(this.sandstonePack, EnchantCommand, 'enchant') as EnchantCommand<MACRO>['enchant'] }

  get execute() { return new ExecuteCommand<MACRO>(this.sandstonePack) }

  get experience() { return new ExperienceCommand<MACRO>(this.sandstonePack) }

  get fill() { return bind(this.sandstonePack, FillCommand, 'fill') as FillCommand<MACRO>['fill'] }

  get functionCmd() { return bind(this.sandstonePack, FunctionCommand, 'function') as FunctionCommand<MACRO>['function'] }

  get forceload() { return new ForceLoadCommand<MACRO>(this.sandstonePack) }

  get gamemode() { return bind(this.sandstonePack, GameModeCommand, 'gamemode') as GameModeCommand<MACRO>['gamemode'] }

  get gamerule() { return bind(this.sandstonePack, GameRuleCommand, 'gamerule') as GameRuleCommand<MACRO>['gamerule'] }

  get give() { return bind(this.sandstonePack, GiveCommand, 'give') as GiveCommand<MACRO>['give'] }

  get help() { return bind(this.sandstonePack, HelpCommand, 'help') as HelpCommand['help'] }

  get item() { return new ItemCommand<MACRO>(this.sandstonePack) }

  get kill() { return bind(this.sandstonePack, KillCommand, 'kill') as KillCommand<MACRO>['kill'] }

  get list() { return bind(this.sandstonePack, ListCommand, 'list') as ListCommand['list'] }

  get locate() { return new LocateCommand<MACRO>(this.sandstonePack) }

  get loot() { return new LootCommand<MACRO>(this.sandstonePack) }

  get me() { return bind(this.sandstonePack, MeCommand, 'me') as MeCommand['me'] }

  get particle() { return bind(this.sandstonePack, ParticleCommand, 'particle') as ParticleCommand<MACRO>['particle'] }

  get place() { return new PlaceCommand<MACRO>(this.sandstonePack) }

  get playsound() { return bind(this.sandstonePack, PlaySoundCommand, 'playsound') as PlaySoundCommand<MACRO>['playsound'] }

  get raw() { return bind(this.sandstonePack, RawCommand, 'raw') as RawCommand['raw'] }

  get recipe() { return new RecipeCommand<MACRO>(this.sandstonePack) }

  get reload() { return bind(this.sandstonePack, ReloadCommand, 'reload') as ReloadCommand['reload'] }

  get returnCmd() { return new ReturnCommand<MACRO>(this.sandstonePack).return }

  get ride() { return bind(this.sandstonePack, RideCommand, 'ride') as RideCommand<MACRO>['ride'] }

  get say() { return bind(this.sandstonePack, SayCommand, 'say') as SayCommand<MACRO>['say'] }

  get schedule() { return new ScheduleCommand<MACRO>(this.sandstonePack) }

  get scoreboard() { return new ScoreboardCommand<MACRO>(this.sandstonePack) }

  get seed() { return bind(this.sandstonePack, SeedCommand, 'seed') as SeedCommand['seed'] }

  get setblock() { return bind(this.sandstonePack, SetBlockCommand, 'setblock') as SetBlockCommand<MACRO>['setblock'] }

  get setidletimeout() { return bind(this.sandstonePack, SetIdleTimeoutCommand, 'setidletimeout') as SetIdleTimeoutCommand['setidletimeout'] }

  get setworldspawn() { return bind(this.sandstonePack, SetWorldSpawnCommand, 'setworldspawn') as SetWorldSpawnCommand<MACRO>['setworldspawn'] }

  get spawnpoint() { return bind(this.sandstonePack, SpawnPointCommand, 'spawnpoint') as SpawnPointCommand<MACRO>['spawnpoint'] }

  get spectate() { return bind(this.sandstonePack, SpectateCommand, 'spectate') as SpectateCommand<MACRO>['spectate'] }

  get stopsound() { return bind(this.sandstonePack, StopSoundCommand, 'stopsound') as StopSoundCommand<MACRO>['stopsound'] }

  get spreadplayers() { return bind(this.sandstonePack, SpreadPlayersCommand, 'spreadplayers') as SpreadPlayersCommand<MACRO>['spreadplayers'] }

  get summon() { return bind(this.sandstonePack, SummonCommand, 'summon') as SummonCommand<MACRO>['summon'] }

  get tag() { return bind(this.sandstonePack, TagCommand, 'tag') as TagCommand<MACRO>['tag'] }

  get team() { return new TeamCommand<MACRO>(this.sandstonePack) }

  get teammsg() { return bind(this.sandstonePack, TeamMessageCommand, 'teammessage') as TeamMessageCommand['teammessage'] }

  get teleport() { return bind(this.sandstonePack, TeleportCommand, 'tp') as TeleportCommand<MACRO>['tp'] }

  get tell() { return bind(this.sandstonePack, TellCommand, 'tell') as TellCommand<MACRO>['tell'] }

  get tellraw() { return bind(this.sandstonePack, TellRawCommand, 'tellraw') as TellRawCommand<MACRO>['tellraw'] }

  get time() { return new TimeCommand<MACRO>(this.sandstonePack) }

  get title() { return bind(this.sandstonePack, TitleCommand, 'title') as TitleCommand<MACRO>['title'] }

  get trigger() { return bind(this.sandstonePack, TriggerCommand, 'trigger') as TriggerCommand['trigger'] }

  get weather() { return new WeatherCommand<MACRO>(this.sandstonePack) }

  get worldborder() { return new WorldBorderCommand<MACRO>(this.sandstonePack) }

  // Aliases
  get msg() { return this.tell }

  get w() { return this.tell }

  get tm() { return this.teammsg }

  get xp() { return this.experience }

  get tp() { return this.teleport }
}
