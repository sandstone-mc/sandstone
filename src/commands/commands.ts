import type { SandstonePack } from 'sandstone/pack'
import {
  AdvancementCommand,
  AttributeCommand,
  BossBarCommand,
  ClearCommand,
  CloneCommand,
  CommentCommand,
  ComputeCommand,
  DamageCommand,
  DataCommand,
  DataPackCommand,
  DebugCommand,
  DefaultGameModeCommand,
  DialogCommand,
  DifficultyCommand,
  EffectCommand,
  EnchantCommand,
  ExecuteCommand,
  ExperienceCommand,
  FillBiomeCommand,
  FillCommand,
  ForceLoadCommand,
  FunctionCommand,
  GameModeCommand,
  GameRuleCommand,
  GiveCommand,
  HelpCommand,
  ItemCommand,
  JFRCommand,
  KillCommand,
  ListCommand,
  LocateCommand,
  LootCommand,
  MeCommand,
  ParticleCommand,
  PerfCommand,
  PlaceCommand,
  PlaySoundCommand,
  PostEffectCommand,
  RandomCommand,
  RawCommand,
  RecipeCommand,
  ReloadCommand,
  ReturnCommand,
  RideCommand,
  RotateCommand,
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
  StopwatchCommand,
  SummonCommand,
  SwingCommand,
  TagCommand,
  TeamCommand,
  TeamMessageCommand,
  TeleportCommand,
  TellCommand,
  TellRawCommand,
  TestCommand,
  TimeCommand,
  TitleCommand,
  TransferCommand,
  TriggerCommand,
  VersionCommand,
  WaypointCommand,
  WeatherCommand,
  WorldBorderCommand,
} from './implementations'

function bind<CLASS, METHOD extends string>(
  pack: SandstonePack,
  isMacro: boolean,
  _class: CLASS,
  method: METHOD,
) {
  /* @ts-ignore */
  const cmd = new _class(pack, isMacro)

  if (typeof cmd[method].bind === 'function') {
    return cmd[method].bind(cmd)
  }
  throw Error('Commands binder screwed up')
}

export class SandstoneCommands<MACRO extends boolean = false> {
  constructor(
    public sandstonePack: SandstonePack,
    public readonly isMacro: MACRO = false as MACRO,
  ) {}

  get advancement() {
    return new AdvancementCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get attribute() {
    return bind(this.sandstonePack, this.isMacro, AttributeCommand, 'attribute') as AttributeCommand<MACRO>['attribute']
  }

  get bossbar() {
    return new BossBarCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get clear() {
    return bind(this.sandstonePack, this.isMacro, ClearCommand, 'clear') as ClearCommand<MACRO>['clear']
  }

  get clone() {
    return bind(this.sandstonePack, this.isMacro, CloneCommand, 'clone') as CloneCommand<MACRO>['clone']
  }

  get compute() {
    return new ComputeCommand<MACRO>(this.sandstonePack, this.isMacro).compute
  }

  get comment() {
    return bind(this.sandstonePack, this.isMacro, CommentCommand, 'comment') as CommentCommand['comment']
  }

  get damage() {
    return bind(this.sandstonePack, this.isMacro, DamageCommand, 'damage') as DamageCommand<MACRO>['damage']
  }

  get data() {
    return new DataCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get datapack() {
    return new DataPackCommand(this.sandstonePack, this.isMacro)
  }

  get debug() {
    return new DebugCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get dialog() {
    return new DialogCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get defaultgamemode() {
    return bind(
      this.sandstonePack,
      this.isMacro,
      DefaultGameModeCommand,
      'defaultgamemode',
    ) as DefaultGameModeCommand['defaultgamemode']
  }

  get difficulty() {
    return bind(this.sandstonePack, this.isMacro, DifficultyCommand, 'difficulty') as DifficultyCommand['difficulty']
  }

  get effect() {
    return new EffectCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get enchant() {
    return bind(this.sandstonePack, this.isMacro, EnchantCommand, 'enchant') as EnchantCommand<MACRO>['enchant']
  }

  get execute() {
    return new ExecuteCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get experience() {
    return new ExperienceCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get fill(): FillCommand<MACRO>['fill'] {
    return bind(this.sandstonePack, this.isMacro, FillCommand, 'fill') as FillCommand<MACRO>['fill']
  }

  get fillbiome() {
    return bind(this.sandstonePack, this.isMacro, FillBiomeCommand, 'fillbiome') as FillBiomeCommand<MACRO>['fillbiome']
  }

  get functionCmd() {
    return bind(this.sandstonePack, this.isMacro, FunctionCommand, 'function') as FunctionCommand<MACRO>['function']
  }

  get forceload() {
    return new ForceLoadCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get gamemode() {
    return bind(this.sandstonePack, this.isMacro, GameModeCommand, 'gamemode') as GameModeCommand<MACRO>['gamemode']
  }

  get gamerule() {
    return bind(this.sandstonePack, this.isMacro, GameRuleCommand, 'gamerule') as GameRuleCommand<MACRO>['gamerule']
  }

  get give() {
    return bind(this.sandstonePack, this.isMacro, GiveCommand, 'give') as GiveCommand<MACRO>['give']
  }

  get help() {
    return bind(this.sandstonePack, this.isMacro, HelpCommand, 'help') as HelpCommand['help']
  }

  get item() {
    return new ItemCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get jfr() {
    return new JFRCommand(this.sandstonePack, this.isMacro)
  }

  get kill() {
    return bind(this.sandstonePack, this.isMacro, KillCommand, 'kill') as KillCommand<MACRO>['kill']
  }

  get list() {
    return bind(this.sandstonePack, this.isMacro, ListCommand, 'list') as ListCommand['list']
  }

  get locate() {
    return new LocateCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get loot() {
    return new LootCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get me() {
    return bind(this.sandstonePack, this.isMacro, MeCommand, 'me') as MeCommand['me']
  }

  get particle() {
    return bind(this.sandstonePack, this.isMacro, ParticleCommand, 'particle') as ParticleCommand<MACRO>['particle']
  }

  get perf() {
    return new PerfCommand(this.sandstonePack, this.isMacro)
  }

  get place() {
    return new PlaceCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get playsound() {
    return bind(this.sandstonePack, this.isMacro, PlaySoundCommand, 'playsound') as PlaySoundCommand<MACRO>['playsound']
  }

  get posteffect() {
    return new PostEffectCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get random() {
    return new RandomCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get raw() {
    return bind(this.sandstonePack, this.isMacro, RawCommand, 'raw') as RawCommand['raw']
  }

  get recipe() {
    return new RecipeCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get reload() {
    return bind(this.sandstonePack, this.isMacro, ReloadCommand, 'reload') as ReloadCommand['reload']
  }

  get returnCmd() {
    return new ReturnCommand<MACRO>(this.sandstonePack, this.isMacro).return
  }

  get ride() {
    return bind(this.sandstonePack, this.isMacro, RideCommand, 'ride') as RideCommand<MACRO>['ride']
  }

  get rotate() {
    return bind(this.sandstonePack, this.isMacro, RotateCommand, 'rotate') as RotateCommand<MACRO>['rotate']
  }

  get say() {
    return bind(this.sandstonePack, this.isMacro, SayCommand, 'say') as SayCommand<MACRO>['say']
  }

  get schedule() {
    return new ScheduleCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get scoreboard() {
    return new ScoreboardCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get seed() {
    return bind(this.sandstonePack, this.isMacro, SeedCommand, 'seed') as SeedCommand['seed']
  }

  get setblock(): SetBlockCommand<MACRO>['setblock'] {
    return bind(this.sandstonePack, this.isMacro, SetBlockCommand, 'setblock') as SetBlockCommand<MACRO>['setblock']
  }

  get setidletimeout() {
    return bind(this.sandstonePack, this.isMacro, SetIdleTimeoutCommand, 'setidletimeout') as SetIdleTimeoutCommand['setidletimeout']
  }

  get setworldspawn() {
    return bind(
      this.sandstonePack,
      this.isMacro,
      SetWorldSpawnCommand,
      'setworldspawn',
    ) as SetWorldSpawnCommand<MACRO>['setworldspawn']
  }

  get spawnpoint() {
    return bind(this.sandstonePack, this.isMacro, SpawnPointCommand, 'spawnpoint') as SpawnPointCommand<MACRO>['spawnpoint']
  }

  get spectate() {
    return bind(this.sandstonePack, this.isMacro, SpectateCommand, 'spectate') as SpectateCommand<MACRO>['spectate']
  }

  get stopsound() {
    return bind(this.sandstonePack, this.isMacro, StopSoundCommand, 'stopsound') as StopSoundCommand<MACRO>['stopsound']
  }

  get stopwatch() {
    return new StopwatchCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get spreadplayers() {
    return bind(
      this.sandstonePack,
      this.isMacro,
      SpreadPlayersCommand,
      'spreadplayers',
    ) as SpreadPlayersCommand<MACRO>['spreadplayers']
  }

  get summon() {
    return bind(this.sandstonePack, this.isMacro, SummonCommand, 'summon') as SummonCommand<MACRO>['summon']
  }

  get swing() {
    return bind(this.sandstonePack, this.isMacro, SwingCommand, 'swing') as SwingCommand<MACRO>['swing']
  }

  get tag() {
    return bind(this.sandstonePack, this.isMacro, TagCommand, 'tag') as TagCommand<MACRO>['tag']
  }

  get team() {
    return new TeamCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get teammsg() {
    return bind(this.sandstonePack, this.isMacro, TeamMessageCommand, 'teammessage') as TeamMessageCommand['teammessage']
  }

  get teleport() {
    return bind(this.sandstonePack, this.isMacro, TeleportCommand, 'tp') as TeleportCommand<MACRO>['tp']
  }

  get tell() {
    return bind(this.sandstonePack, this.isMacro, TellCommand, 'tell') as TellCommand<MACRO>['tell']
  }

  get tellraw() {
    return bind(this.sandstonePack, this.isMacro, TellRawCommand, 'tellraw') as TellRawCommand<MACRO>['tellraw']
  }

  get test() {
    return new TestCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get time() {
    return new TimeCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get title() {
    return bind(this.sandstonePack, this.isMacro, TitleCommand, 'title') as TitleCommand<MACRO>['title']
  }

  get trigger() {
    return bind(this.sandstonePack, this.isMacro, TriggerCommand, 'trigger') as TriggerCommand['trigger']
  }

  get transfer() {
    return bind(this.sandstonePack, this.isMacro, TransferCommand, 'transfer') as TransferCommand<MACRO>['transfer']
  }

  get version() {
    return bind(this.sandstonePack, this.isMacro, VersionCommand, 'version') as VersionCommand['version']
  }

  get waypoint() {
    return new WaypointCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get weather() {
    return new WeatherCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  get worldborder() {
    return new WorldBorderCommand<MACRO>(this.sandstonePack, this.isMacro)
  }

  // Aliases
  get msg() {
    return this.tell
  }

  get w() {
    return this.tell
  }

  get tm() {
    return this.teammsg
  }

  get xp() {
    return this.experience
  }

  get tp() {
    return this.teleport
  }
}
