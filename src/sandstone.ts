import type { SandstoneContext } from './context'
import type { FillCommand, GiveCommand, SetBlockCommand } from './commands'
import { SandstonePack } from './pack'
import type { Flow } from './flow'
import type { LiteralUnion, NamespacedLiteralUnion, SetType } from './utils'
import { randomUUID, Set, createLazyProxy } from './utils'
import * as coordinates from './variables/Coordinates'
import { ResolveNBTPart } from './variables/ResolveNBT'
import { setSandstoneContext, hasContext, getSandstoneContext } from './context'

export type { NonEmptyString, NamespacedString } from './utils'

// Singleton pack instance - lazily initialized
let _sandstonePack: SandstonePack | undefined

/**
 * Get the global SandstonePack singleton.
 * Uses context if available, otherwise creates a default pack.
 */
export const sandstonePack: SandstonePack = new Proxy({} as SandstonePack, {
  get(_target, prop) {
    if (!_sandstonePack) {
      if (hasContext()) {
        const ctx = getSandstoneContext()
        _sandstonePack = new SandstonePack(ctx.namespace, ctx.packUid)
      } else {
        _sandstonePack = new SandstonePack('default', '0')
      }
    }
    return (_sandstonePack as any)[prop]
  },
})

export { SandstonePack }

// Context management (for CLI)
export { setSandstoneContext, getSandstoneContext, hasContext, resetContext } from './context'
export type { SandstoneContext }

/**
 * Create a new SandstonePack with explicit context.
 * This is the preferred way to create packs from the CLI.
 */
export function createSandstonePack(context: SandstoneContext): SandstonePack {
  setSandstoneContext(context)
  _sandstonePack = new SandstonePack(context.namespace, context.packUid)
  return _sandstonePack
}

/**
 * Reset the global pack state. Used by CLI between builds.
 * This clears all resources but keeps the same instance so user code
 * registering through the proxy uses the same pack as the CLI.
 */
export function resetSandstonePack(): void {
  if (_sandstonePack) {
    _sandstonePack.reset()
  }
}

export { LiteralUnion, NamespacedLiteralUnion, randomUUID, Set, SetType }

export { ResolveNBTPart }

// Commands must go through sandstonePack.commands at call time for the same reason as pack methods.
type SandstoneCommands = SandstonePack['commands']
// Exclude a few commands that need explicit type annotation due to complex generics
type CommandKeys = Exclude<keyof SandstoneCommands, 'give' | 'setblock' | 'fill'>

// Creates a proxy that handles both callable commands and object-based commands.
// This avoids hardcoding which commands are object-based by detecting at runtime.
// `bind` is omitted: `SandstoneCommands` already binds function-based commands
// via its own `bind()` helper, and instance-based commands expose arrow-function
// methods that capture `this` lexically.
const commandsProxy = createLazyProxy<CommandKeys, unknown, Pick<SandstoneCommands, CommandKeys>>({
  getSource: (key: CommandKeys) => sandstonePack.commands[key],
  label: 'Command',
})

export const {
  advancement,
  attribute,
  bossbar,
  clear,
  clone,
  comment,
  damage,
  data,
  datapack,
  debug,
  dialog,
  defaultgamemode,
  difficulty,
  effect,
  enchant,
  execute,
  experience,
  fillbiome,
  functionCmd,
  forceload,
  gamemode,
  gamerule,
  help,
  kill,
  list,
  locate,
  loot,
  me,
  msg,
  particle,
  perf,
  playsound,
  place,
  random,
  raw,
  recipe,
  reload,
  returnCmd,
  rotate,
  ride,
  item,
  jfr,
  say,
  schedule,
  scoreboard,
  seed,
  setidletimeout,
  setworldspawn,
  spawnpoint,
  spectate,
  spreadplayers,
  stopsound,
  stopwatch,
  summon,
  swing,
  tag,
  team,
  teammsg,
  teleport,
  tellraw,
  test,
  time,
  title,
  trigger,
  transfer,
  version,
  waypoint,
  w,
  weather,
  worldborder,
  tm,
  tp,
  xp,
  tell,
} = commandsProxy

// give needs explicit type annotation due to complex generics
export const give: GiveCommand<false>['give'] = ((...args: unknown[]) =>
  (sandstonePack.commands.give as CallableFunction)(...args)) as GiveCommand<false>['give']

// setblock needs explicit type annotation due to complex generics
export const setblock: SetBlockCommand<false>['setblock'] = ((...args: unknown[]) =>
  (sandstonePack.commands.setblock as CallableFunction)(...args)) as SetBlockCommand<false>['setblock']

// fill needs explicit type annotation due to complex generics
export const fill: FillCommand<false>['fill'] = ((...args: unknown[]) =>
  (sandstonePack.commands.fill as CallableFunction)(...args)) as FillCommand<false>['fill']

// Pack method exports must go through sandstonePack at call time, not capture at module load time.
// This proxy ensures each method call uses the current pack instance set by createSandstonePack().
type PackNonMethodKeys =
  | 'core' | 'packTypes' | 'packOptions' | '__initMCFunction' | 'dependencies' | 'flow' | 'commands'
  | 'conditions' | 'objectives' | 'anonymousScoreId' | 'anonymousDataId' | 'constants' | 'tickedLoops'
  | '__rootObjective' | 'packUid'
  | 'reset' | 'appendNode' | 'initMCFunction' | 'save' | 'resourceToPath' | 'rootObjective'
  | 'setupLantern' | 'dataPack' | 'resourcePack' | 'registerTickedCommands'
type PackMethodKeys = Exclude<keyof SandstonePack, PackNonMethodKeys>

// Creates a proxy that handles both callable methods and object-based properties.
// This avoids hardcoding which properties are objects by detecting at runtime.
// `bind: true` because pack methods are regular class methods that depend on
// `this` (e.g. `MCFunction` accesses `this.pack`, `this.core`).
const packMethodsProxy = createLazyProxy<PackMethodKeys, unknown, Pick<SandstonePack, PackMethodKeys>>({
  getSource: (key: PackMethodKeys) => sandstonePack[key],
  label: 'Pack method',
  bind: true,
})

// Dedicated proxy for Flow (_) that preserves type information
// The packMethodsProxy loses nested property types, so we handle _ separately
export const _: Flow = new Proxy({} as Flow, {
  get<K extends keyof Flow>(_target: unknown, prop: K): Flow[K] {
    return sandstonePack._[prop]
  },
})

export const {
  // Resources
  RawResource,

  MCFunction,
  Advancement,
  BannerPattern,
  ChatType,
  DamageType,
  Dialog,
  Enchantment,
  EnchantmentProvider,
  Instrument,
  ItemModifier,
  JukeboxSong,
  LootTable,
  Predicate,
  Recipe,
  SulfurCubeArchetype,
  Tag,
  TestEnvironment,
  TestInstance,
  Timeline,
  TradeSet,
  TrialSpawner,
  TrimMaterial,
  TrimPattern,
  Variant,
  VillagerTrade,
  WorldClock,

  Atlas,
  BlockStateDefinition,
  Equipment,
  Font,
  ItemModelDefinition,
  Language,
  Model,
  Particle: ParticleResource,
  PostEffect,
  Shader,
  SoundEvent,
  SoundsIndex,
  PlainText,
  Texture,
  WaypointStyle,

  // Variables
  Objective,
  Macro,
  // _ is exported separately above to preserve Flow type information
  Variable,
  flowVariable,
  Trigger,
  Label,
  Data,
  DataVariable,
  getTempStorage,
  ResolveNBT,
  DataIndexMap,
  DataArray,
  Selector,
  UUID,
  ItemPredicate,
  makeCustomResource,
  sleep,
  loadTags,
  defaultNamespace,
} = packMethodsProxy

export {
  NBT,
  NBTAnyValue,
  NBTByte,
  NBTByteArray,
  NBTClass,
  NBTDouble,
  NBTFloat,
  NBTInt,
  NBTIntArray,
  NBTList,
  NBTLong,
  NBTLongArray,
  NBTPrimitive,
  NBTRange,
  NBTShort,
  NBTString,
  NBTTypedArray,
  NotNBT,
  ResolvedNBT,
  nbtResolver,
  type NBTAllArrays,
  type NBTAllNumberClasses,
  type NBTAllNumbers,
  type NBTAllPrimitives,
  type NBTAllValues,
  type NBTSimpleClasses,
} from './variables/nbt/NBTs'

export type { Condition } from './flow'
export {
  ObjectiveClass,
  Score,
  SelectorClass,
  LabelClass,
  UUIDClass,
  DataPointClass,
} from './variables'

export {
  MCFunctionClass,
} from './core'

export {
  // Datapack resources
  AdvancementClass,
  BannerPatternClass,
  ChatTypeClass,
  DamageTypeClass,
  DialogClass,
  EnchantmentClass,
  EnchantmentProviderClass,
  InstrumentClass,
  ItemModifierClass,
  JukeboxSongClass,
  LootTableClass,
  PredicateClass,
  RecipeClass,
  StructureClass,
  SulfurCubeArchetypeClass,
  TagClass,
  TestEnvironmentClass,
  TestInstanceClass,
  TimelineClass,
  TradeSetClass,
  TrialSpawnerClass,
  TrimMaterialClass,
  TrimPatternClass,
  VariantClass,
  VillagerTradeClass,
  WorldClockClass,

  // Resourcepack resources
  AtlasClass,
  BlockStateDefinitionClass,
  EquipmentClass,
  FontClass,
  ItemModelDefinitionClass,
  LanguageClass,
  ModelClass,
  ParticleClass,
  PostEffectClass,
  SoundEventClass,
  SoundsIndexClass,
  TextureClass,
  WaypointStyleClass,
} from './core/resources'

// Utils
export const { absolute, relative, local } = coordinates

export const abs = absolute
export const rel = relative
export const loc = local

export const { getVanillaResource, getExistingResource, depend } = sandstonePack.core
export const mcMetaCache = new Proxy({} as typeof sandstonePack['core']['mcMetaCache'], {
  get: () => sandstonePack.core.mcMetaCache
})

export type {
  HandlerFile,
  Cache,
  FileHandler,
  FileExclusions,
  LocalFunctions,
  BeforeAllLocal,
  BeforeSaveLocal,
  AfterAllLocal,
  DatapackConfig,
  ResourcePackConfig,
  ContentStrategyKind,
  SandstoneConfig,
} from './config'
