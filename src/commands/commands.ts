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
} from './implementations'
import { PlaceCommand } from './implementations/block/place'
import { DamageCommand } from './implementations/entity/damage'

import type { SandstonePack } from '#pack'

export class SandstoneCommands {
  constructor(public sandstonePack: SandstonePack) {}

  get advancement() { return new AdvancementCommand(this.sandstonePack) }

  get attribute() { return new AttributeCommand(this.sandstonePack).attribute }

  get bossbar() { return new BossBarCommand(this.sandstonePack) }

  get clear() { return new ClearCommand(this.sandstonePack).clear }

  get clone() { return new CloneCommand(this.sandstonePack).clone }

  get comment() { return new CommentCommand(this.sandstonePack).comment }

  get damage() { return new DamageCommand(this.sandstonePack).damage }

  get data() { return new DataCommand(this.sandstonePack) }

  get datapack() { return new DataCommand(this.sandstonePack) }

  get debug() { return new DebugCommand(this.sandstonePack) }

  get defaultgamemode() { return new DefaultGameModeCommand(this.sandstonePack).defaultgamemode }

  get difficulty() { return new DifficultyCommand(this.sandstonePack).difficulty }

  get effect() { return new EffectCommand(this.sandstonePack) }

  get enchant() { return new EnchantCommand(this.sandstonePack).enchant }

  get execute() { return new ExecuteCommand(this.sandstonePack) }

  get experience() { return new ExperienceCommand(this.sandstonePack) }

  get fill() { return new FillCommand(this.sandstonePack).fill }

  get functionCmd() { return new FunctionCommand(this.sandstonePack).function }

  get forceload() { return new ForceLoadCommand(this.sandstonePack) }

  get gamemode() { return new GameModeCommand(this.sandstonePack).gamemode }

  get gamerule() { return new GameRuleCommand(this.sandstonePack).gamerule }

  get give() { return new GiveCommand(this.sandstonePack).give }

  get help() { return new HelpCommand(this.sandstonePack).help }

  get item() { return new ItemCommand(this.sandstonePack) }

  get kill() { return new KillCommand(this.sandstonePack).kill }

  get list() { return new ListCommand(this.sandstonePack).list }

  get locate() { return new LocateCommand(this.sandstonePack) }

  get loot() { return new LootCommand(this.sandstonePack) }

  get me() { return new MeCommand(this.sandstonePack).me }

  get particle() { return new ParticleCommand(this.sandstonePack).particle }

  get place() { return new PlaceCommand(this.sandstonePack) }

  get playsound() { return new PlaySoundCommand(this.sandstonePack).playsound }

  get raw() { return new RawCommand(this.sandstonePack).raw }

  get recipe() { return new RecipeCommand(this.sandstonePack) }

  get reload() { return new ReloadCommand(this.sandstonePack).reload }

  get ride() { return new RideCommand(this.sandstonePack).ride }

  get say() { return new SayCommand(this.sandstonePack).say }

  get schedule() { return new ScheduleCommand(this.sandstonePack) }

  get scoreboard() { return new ScoreboardCommand(this.sandstonePack) }

  get seed() { return new SeedCommand(this.sandstonePack).seed }

  get setblock() { return new SetBlockCommand(this.sandstonePack).setblock }

  get setidletimeout() { return new SetIdleTimeoutCommand(this.sandstonePack).setidletimeout }

  get setworldspawn() { return new SetWorldSpawnCommand(this.sandstonePack).setworldspawn }

  get spawnpoint() { return new SpawnPointCommand(this.sandstonePack).spawnpoint }

  get spectate() { return new SpectateCommand(this.sandstonePack).spectate }

  get stopsound() { return new StopSoundCommand(this.sandstonePack).stopsound }

  get spreadplayers() { return new SpreadPlayersCommand(this.sandstonePack).spreadplayers }

  get summon() { return new SummonCommand(this.sandstonePack).summon }

  get tag() { return new TagCommand(this.sandstonePack).tag }

  get team() { return new TeamCommand(this.sandstonePack) }

  get teammsg() { return new TeamMessageCommand(this.sandstonePack).teammessage }

  get teleport() { return new TeleportCommand(this.sandstonePack).tp }

  get tell() { return new TellCommand(this.sandstonePack).tell }

  get tellraw() { return new TellRawCommand(this.sandstonePack).tellraw }

  get time() { return new TimeCommand(this.sandstonePack) }

  get title() { return new TitleCommand(this.sandstonePack).title }

  get trigger() { return new TriggerCommand(this.sandstonePack).trigger }

  get weather() { return new WeatherCommand(this.sandstonePack) }

  get worldborder() { return new WorldBorderCommand(this.sandstonePack) }

  // Aliases
  msg = this.tell

  get w() { return this.tell }

  get tm() { return this.teammsg }

  get xp() { return this.experience }

  get tp() { return this.teleport }
}
