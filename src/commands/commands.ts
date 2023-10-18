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

export class SandstoneCommands<MACRO extends boolean> {
  constructor(public sandstonePack: SandstonePack) {}

  get advancement() { return new AdvancementCommand<MACRO>(this.sandstonePack) }

  get attribute() { return new AttributeCommand<MACRO>(this.sandstonePack).attribute }

  get bossbar() { return new BossBarCommand<MACRO>(this.sandstonePack) }

  get clear() { return new ClearCommand<MACRO>(this.sandstonePack).clear }

  get clone() { return new CloneCommand<MACRO>(this.sandstonePack).clone }

  get comment() { return new CommentCommand(this.sandstonePack).comment }

  get damage() { return new DamageCommand<MACRO>(this.sandstonePack).damage }

  get data() { return new DataCommand<MACRO>(this.sandstonePack) }

  get datapack() { return new DataCommand<MACRO>(this.sandstonePack) }

  get debug() { return new DebugCommand<MACRO>(this.sandstonePack) }

  get defaultgamemode() { return new DefaultGameModeCommand<MACRO>(this.sandstonePack).defaultgamemode }

  get difficulty() { return new DifficultyCommand<MACRO>(this.sandstonePack).difficulty }

  get effect() { return new EffectCommand<MACRO>(this.sandstonePack) }

  get enchant() { return new EnchantCommand<MACRO>(this.sandstonePack).enchant }

  get execute() { return new ExecuteCommand<MACRO>(this.sandstonePack) }

  get experience() { return new ExperienceCommand<MACRO>(this.sandstonePack) }

  get fill() { return new FillCommand<MACRO>(this.sandstonePack).fill }

  get functionCmd() { return new FunctionCommand<MACRO>(this.sandstonePack).function }

  get forceload() { return new ForceLoadCommand<MACRO>(this.sandstonePack) }

  get gamemode() { return new GameModeCommand<MACRO>(this.sandstonePack).gamemode }

  get gamerule() { return new GameRuleCommand<MACRO>(this.sandstonePack).gamerule }

  get give() { return new GiveCommand<MACRO>(this.sandstonePack).give }

  get help() { return new HelpCommand<MACRO>(this.sandstonePack).help }

  get item() { return new ItemCommand<MACRO>(this.sandstonePack) }

  get kill() { return new KillCommand<MACRO>(this.sandstonePack).kill }

  get list() { return new ListCommand<MACRO>(this.sandstonePack).list }

  get locate() { return new LocateCommand<MACRO>(this.sandstonePack) }

  get loot() { return new LootCommand<MACRO>(this.sandstonePack) }

  get me() { return new MeCommand<MACRO>(this.sandstonePack).me }

  get particle() { return new ParticleCommand<MACRO>(this.sandstonePack).particle }

  get place() { return new PlaceCommand<MACRO>(this.sandstonePack) }

  get playsound() { return new PlaySoundCommand<MACRO>(this.sandstonePack).playsound }

  get raw() { return new RawCommand(this.sandstonePack).raw }

  get recipe() { return new RecipeCommand<MACRO>(this.sandstonePack) }

  get reload() { return new ReloadCommand<MACRO>(this.sandstonePack).reload }

  get returnCmd() { return new ReturnCommand<MACRO>(this.sandstonePack).return }

  get ride() { return new RideCommand<MACRO>(this.sandstonePack).ride }

  get say() { return new SayCommand<MACRO>(this.sandstonePack).say }

  get schedule() { return new ScheduleCommand<MACRO>(this.sandstonePack) }

  get scoreboard() { return new ScoreboardCommand<MACRO>(this.sandstonePack) }

  get seed() { return new SeedCommand<MACRO>(this.sandstonePack).seed }

  get setblock() { return new SetBlockCommand<MACRO>(this.sandstonePack).setblock }

  get setidletimeout() { return new SetIdleTimeoutCommand<MACRO>(this.sandstonePack).setidletimeout }

  get setworldspawn() { return new SetWorldSpawnCommand<MACRO>(this.sandstonePack).setworldspawn }

  get spawnpoint() { return new SpawnPointCommand<MACRO>(this.sandstonePack).spawnpoint }

  get spectate() { return new SpectateCommand<MACRO>(this.sandstonePack).spectate }

  get stopsound() { return new StopSoundCommand<MACRO>(this.sandstonePack).stopsound }

  get spreadplayers() { return new SpreadPlayersCommand<MACRO>(this.sandstonePack).spreadplayers }

  get summon() { return new SummonCommand<MACRO>(this.sandstonePack).summon }

  get tag() { return new TagCommand<MACRO>(this.sandstonePack).tag }

  get team() { return new TeamCommand<MACRO>(this.sandstonePack) }

  get teammsg() { return new TeamMessageCommand<MACRO>(this.sandstonePack).teammessage }

  get teleport() { return new TeleportCommand<MACRO>(this.sandstonePack).tp }

  get tell() { return new TellCommand<MACRO>(this.sandstonePack).tell }

  get tellraw() { return new TellRawCommand<MACRO>(this.sandstonePack).tellraw }

  get time() { return new TimeCommand<MACRO>(this.sandstonePack) }

  get title() { return new TitleCommand<MACRO>(this.sandstonePack).title }

  get trigger() { return new TriggerCommand<MACRO>(this.sandstonePack).trigger }

  get weather() { return new WeatherCommand<MACRO>(this.sandstonePack) }

  get worldborder() { return new WorldBorderCommand<MACRO>(this.sandstonePack) }

  // Aliases
  get msg() { return this.tell }

  get w() { return this.tell }

  get tm() { return this.teammsg }

  get xp() { return this.experience }

  get tp() { return this.teleport }
}
