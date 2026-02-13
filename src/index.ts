import type { JSONTextComponent } from './arguments/jsonTextComponent'
import type { SandstoneContext } from './context'
import type { FillCommand, SetBlockCommand } from './commands'
import type {
  AdvancementClassArguments,
  AtlasClassArguments,
  BannerPatternClassArguments,
  BlockStateArguments,
  ChatTypeClassArguments,
  DamageTypeClassArguments,
  DialogClassArguments,
  EnchantmentClassArguments,
  EnchantmentProviderClassArguments,
  EquipmentClassArguments,
  FontArguments,
  InstrumentClassArguments,
  ItemModelDefinitionClassArguments,
  ItemModifierClassArguments,
  JukeboxSongClassArguments,
  LanguageArguments,
  LootTableClassArguments,
  MCFunctionClassArguments,
  ModelClassArguments,
  ParticleClassArguments,
  PlainTextArguments,
  PostEffectClassArguments,
  PredicateClassArguments,
  RecipeClassArguments,
  ShaderClassArguments,
  SoundEventArguments,
  TagClassArguments,
  TestEnvironmentClassArguments,
  TestInstanceClassArguments,
  TextureArguments,
  TimelineClassArguments,
  TradeSetClassArguments,
  TrialSpawnerClassArguments,
  TrimMaterialClassArguments,
  TrimPatternClassArguments,
  VariantClassArguments,
  VillagerTradeClassArguments,
  WaypointStyleClassArguments,
  WorldClockClassArguments,
} from './core'
import { SandstonePack } from './pack'
import type { BASIC_CONFLICT_STRATEGIES, LiteralUnion, NamespacedLiteralUnion, SetType } from './utils'
import { Set } from './utils'
import * as coordinates from './variables/Coordinates'
import { ResolveNBTPart } from './variables/ResolveNBT'
import { setSandstoneContext, hasContext, getSandstoneContext } from './context'

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

export { LiteralUnion, NamespacedLiteralUnion, Set, SetType }

export { ResolveNBTPart }

// Commands must go through sandstonePack.commands at call time for the same reason as pack methods.
type SandstoneCommands = SandstonePack['commands']
// Exclude setblock since it needs explicit type annotation due to complex generics
type CommandKeys = Exclude<keyof SandstoneCommands, 'setblock' | 'fill'>

// Creates a proxy that handles both callable commands and object-based commands.
// This avoids hardcoding which commands are object-based by detecting at runtime.
const commandsProxy = new Proxy({} as Pick<SandstoneCommands, CommandKeys>, {
  get<K extends CommandKeys>(_: unknown, prop: K): SandstoneCommands[K] {
    // Create a function that delegates to the actual command when called
    const fn = (...args: unknown[]) => {
      const cmd = sandstonePack.commands[prop]
      if (typeof cmd === 'function') {
        return (cmd as CallableFunction)(...args)
      }
      throw new Error(`Command '${prop}' is not callable`)
    }

    // Return a proxy that intercepts both function calls and property access
    return new Proxy(fn, {
      get(_target: unknown, subProp: string | symbol) {
        // Access the actual command and get the property from it
        const cmd = sandstonePack.commands[prop]
        return (cmd as unknown as Record<string | symbol, unknown>)[subProp]
      },
      apply(_target: unknown, _thisArg: unknown, args: unknown[]) {
        const cmd = sandstonePack.commands[prop]
        if (typeof cmd === 'function') {
          return (cmd as CallableFunction)(...args)
        }
        throw new Error(`Command '${prop}' is not callable`)
      },
    }) as SandstoneCommands[K]
  },
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
  give,
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
  | 'loadTags' | '__rootObjective' | 'defaultNamespace' | 'packUid'
  | 'reset' | 'appendNode' | 'initMCFunction' | 'save' | 'resourceToPath' | 'rootObjective'
  | 'setupLantern' | 'dataPack' | 'resourcePack' | 'registerTickedCommands'
type PackMethodKeys = Exclude<keyof SandstonePack, PackNonMethodKeys>

// Creates a proxy that handles both callable methods and object-based properties.
// This avoids hardcoding which properties are objects by detecting at runtime.
const packMethodsProxy = new Proxy({} as Pick<SandstonePack, PackMethodKeys>, {
  get<K extends PackMethodKeys>(_: unknown, prop: K): SandstonePack[K] {
    // Create a function that delegates to the actual method when called
    const fn = (...args: unknown[]) => {
      const method = sandstonePack[prop]
      if (typeof method === 'function') {
        return (method as CallableFunction)(...args)
      }
      throw new Error(`Pack method '${prop}' is not callable`)
    }

    // Return a proxy that intercepts both function calls and property access
    return new Proxy(fn, {
      get(_target: unknown, subProp: string | symbol) {
        // Access the actual method/property and get the sub-property from it
        const method = sandstonePack[prop]
        return (method as unknown as Record<string | symbol, unknown>)[subProp]
      },
      apply(_target: unknown, _thisArg: unknown, args: unknown[]) {
        const method = sandstonePack[prop]
        if (typeof method === 'function') {
          return (method as CallableFunction)(...args)
        }
        throw new Error(`Pack method '${prop}' is not callable`)
      },
    }) as SandstonePack[K]
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
  BlockState,
  Equipment,
  Font,
  ItemModelDefinition,
  Language,
  Model,
  Particle: ParticleResource,
  PostEffect,
  Shader,
  SoundEvent,
  PlainText,
  Texture,
  WaypointStyle,

  // Variables
  Objective,
  Macro,
  _,
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
} = packMethodsProxy

export * from './variables/nbt/NBTs'

export * from './arguments'
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
  BlockStateClass,
  EquipmentClass,
  FontClass,
  ItemModelDefinitionClass,
  LanguageClass,
  ModelClass,
  ParticleClass,
  PostEffectClass,
  SoundEventClass,
  TextureClass,
  WaypointStyleClass,
} from './core/resources'

// Utils
export const { absolute, relative, local } = coordinates

export const abs = absolute
export const rel = relative
export const loc = local

export const { getVanillaResource, getExistingResource, getMcMetaCache, depend } = sandstonePack.core

export type DatapackConfig = {
  /**
   * The description of the datapack.
   * Can be a single string or a JSON Text Component
   * (like in /tellraw or /title).
   */
  description: JSONTextComponent

  /**
   * The format version of the datapack.
   * Can change depending on the versions of Minecraft.
   *
   * @see [https://minecraft.wiki/w/Data_Pack#pack.mcmeta](https://minecraft.wiki/w/Data_Pack#pack.mcmeta)
   */
  packFormat?: number

  minVersion?: number | [number] | [number, number]

  maxVersion?: number | [number] | [number, number]

  /** List of experimental game features to enable. */
  features?: string[]

  supported_formats?:
    | number
    | number[]
    | {
        min_inclusive: number
        max_inclusive: number
      }

  /**
   * Section for filtering out files from datapacks applied below this one. Any file that matches one of the patterns inside `block` will be treated as if it was not present in the pack at all.
   */
  filter?: {
    /** List of patterns */
    block: {
      /** A regular expression for the namespace of files to be filtered out. If unspecified, it applies to every namespace. */
      namespace?: string
      /** A regular expression for the paths of files to be filtered out. If unspecified, it applies to every file. */
      path?: string
    }[]
  }
}

export type ResourcePackConfig = {
  /**
   * The description of the resource pack.
   * Can be a single string or a JSON Text Component
   * (like in /tellraw or /title).
   */
  description: JSONTextComponent

  /**
   * The format version of the resource pack.
   * Can change depending on the versions of Minecraft.
   *
   * @see [https://minecraft.wiki/w/Resource_pack#Contents](https://minecraft.wiki/w/Resource_pack#Contents)
   */
  packFormat: number

  supported_formats?:
    | number
    | number[]
    | {
        min_inclusive: number
        max_inclusive: number
      }

  /**
   * Section for filtering out files from resource packs applied below this one. Any file that matches one of the patterns inside `block` will be treated as if it was not present in the pack at all.
   */
  filter?: {
    /** List of patterns */
    block: {
      /** A regular expression for the namespace of files to be filtered out. If unspecified, it applies to every namespace. */
      namespace?: string
      /** A regular expression for the paths of files to be filtered out. If unspecified, it applies to every file. */
      path?: string
    }[]
  }
}

// eslint-disable-next-line max-len
type PackConfigs<PackType extends LiteralUnion<'datapack' | 'resourcepack'>> = Record<
  PackType,
  PackType extends 'datapack' ? DatapackConfig : PackType extends 'resourcepack' ? ResourcePackConfig : unknown
>

export interface SandstoneConfig {
  /**
   * The default namespace for the packs.
   * It can be changed for each resources, individually or using Base Paths.
   */
  namespace: string

  /**
   * The name of the pack.
   */
  name: string

  packs: PackConfigs<LiteralUnion<'datapack'>>

  /**
   * The strategy to use when 2 resources of the same type (Advancement, MCFunctions...) have the same name.
   */
  onConflict?: Partial<OnConflict<ContentStrategy>> // TODO: Types are still screwy with this, fix.

  /**
   * A unique identifier that is used to distinguish your variables from other Sandstone pack variables.
   *
   * It must be a string of valid scoreboard characters.
   */
  packUid: string

  /** All the options to save the pack. */
  saveOptions: {
    /**
     * A custom handler for saving files. If specified, files won't be saved anymore, you will have to handle that yourself.
     */
    customFileHandler?: (relativePath: string, content: any, contentSummary: string) => void

    /**
     * The indentation to use for all JSON & MCMeta files. This argument is the same than `JSON.stringify` 3d argument.
     */
    indentation?: string | number

    /**
     * The world to save the packs in.
     *
     * Incompatible with `root`.
     */
    world?: string

    /**
     * Whether to save the resource pack & datapack in the `.minecraft/datapacks` & `.minecraft/resource_pack` folders.
     *
     * Incompatible with `world`.
     */
    root?: true

    /**
     * A custom path to your .minecraft folder,
     * in case you changed the default and Sandstone fails to find it.
     */
    clientPath?: string

    /**
     * A server path to save the server-side packs at.
     */
    serverPath?: string

    /**
     * Whether to force enable/disable symlinks. Defaults to false. Useful if you want to enable symlinks on Windows.
     */
    enableSymlinks?: boolean
  }

  /** Some scripts that can run at defined moments. */
  scripts?: {
    /** A script running before Sandstone starts importing source files. */
    beforeAll?: () => void | Promise<void>

    /** A script running before Sandstone starts saving the files. */
    beforeSave?: () => void | Promise<void>

    /** A script running after Sandstone saved all files. */
    afterAll?: () => void | Promise<void>
  }

  resources?: {
    /** Path regex of files to exclude from the output. */
    exclude?:
      | {
          /** From `SandstonePack` (your code in `./src`). */
          generated?: RegExp[]

          /** From `./resources`. */
          existing?: RegExp[]
        }
      | RegExp[]

    /** Handle files before they are written to the output. */
    handle?: {
      path: RegExp

      callback: (contents: string | Buffer | Promise<Buffer>) => Promise<Buffer>
    }[]
  }
}

export type ContentStrategyKind<Resource extends string, Conflict extends string> = {
  resource: Resource
  conflict: Conflict
}

type ContentStrategy =
  /**
   * The default conflict strategy to use for all resources.
   *
   * @default
   * 'warn'
   */
  | ContentStrategyKind<'default', BASIC_CONFLICT_STRATEGIES>

  /**
   * The conflict strategy to use for Advancements.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'advancement', NonNullable<AdvancementClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for damage types.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'damage_type', NonNullable<DamageTypeClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Loot Tables.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'loot_table', NonNullable<LootTableClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for MCFunctions.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'function', NonNullable<MCFunctionClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Predicates.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'predicate', NonNullable<PredicateClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for RecipeOptions.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'recipe', NonNullable<RecipeClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Tags.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'tag', NonNullable<TagClassArguments<any>['onConflict']>>
  /**
   * The conflict strategy to use for Item modifiers.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'item_modifier', NonNullable<ItemModifierClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Trim materials.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'trim_material', NonNullable<TrimMaterialClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Trim patterns.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'trim_pattern', NonNullable<TrimPatternClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Banner patterns.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'banner_pattern', NonNullable<BannerPatternClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Chat types.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'chat_type', NonNullable<ChatTypeClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Dialogs.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'dialog', NonNullable<DialogClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Enchantments.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'enchantment', NonNullable<EnchantmentClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Enchantment providers.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'enchantment_provider', NonNullable<EnchantmentProviderClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Instruments.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'instrument', NonNullable<InstrumentClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Jukebox songs.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'jukebox_song', NonNullable<JukeboxSongClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Test environments.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'test_environment', NonNullable<TestEnvironmentClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Test instances.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'test_instance', NonNullable<TestInstanceClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Timelines.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'timeline', NonNullable<TimelineClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Trade sets.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'trade_set', NonNullable<TradeSetClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Trial spawners.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'trial_spawner', NonNullable<TrialSpawnerClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Variants.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'variant', NonNullable<VariantClassArguments<any>['onConflict']>>
  /**
   * The conflict strategy to use for Villager trades.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'villager_trade', NonNullable<VillagerTradeClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for World clocks.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'world_clock', NonNullable<WorldClockClassArguments['onConflict']>>

  /**
   * The conflict strategy to use for Atlases.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'atlas', NonNullable<AtlasClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Block states.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'block_state', NonNullable<BlockStateArguments<any>['onConflict']>>
  /**
   * The conflict strategy to use for Fonts.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'font', NonNullable<FontArguments['onConflict']>>
  /**
   * The conflict strategy to use for Languages.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'lang', NonNullable<LanguageArguments['onConflict']>>
  /**
   * The conflict strategy to use for Models.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'model', NonNullable<ModelClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Sound Events.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'sound_event', NonNullable<SoundEventArguments['onConflict']>>
  /**
   * The conflict strategy to use for Plain Text files.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'text', NonNullable<PlainTextArguments['onConflict']>>
  /**
   * The conflict strategy to use for Textures.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'texture', NonNullable<TextureArguments<any>['onConflict']>>
  /**
   * The conflict strategy to use for Equipment.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'equipment', NonNullable<EquipmentClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Particles.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'particle', NonNullable<ParticleClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Post effects.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'post_effect', NonNullable<PostEffectClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Shaders.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'shader', NonNullable<ShaderClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Waypoint styles.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'waypoint_style', NonNullable<WaypointStyleClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Item model definitions.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'item_definition', NonNullable<ItemModelDefinitionClassArguments['onConflict']>>

type OnConflict<Strategy extends ContentStrategy> = Record<Strategy['resource'], Strategy['conflict']>
