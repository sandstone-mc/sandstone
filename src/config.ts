import type { JSONTextComponent } from './arguments/jsonTextComponent'
import type { BASIC_CONFLICT_STRATEGIES, LiteralUnion } from './utils'
import type { SandstonePack } from './pack'
import type { PackType } from './pack/packType'

import type {
  AdvancementClassArguments,
  AtlasClassArguments,
  BannerPatternClassArguments,
  BlockStateDefinitionArguments,
  BlockTransformerClassArguments,
  ChatTypeClassArguments,
  DamageTypeClassArguments,
  DecoratedPotPatternClassArguments,
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
  SlotSourceClassArguments,
  SoundEventArguments,
  SoundsIndexArguments,
  SulfurCubeArchetypeClassArguments,
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

export type HandlerFile = string | ArrayBuffer | Buffer

/**
 * Shape of the per-build cache shared with `sand clean`.
 */
export type Cache = {
  files: Record<string, string>
  archives?: string[]
  canUseSymlinks?: boolean
  symlinks?: string[]
  perChildEntries?: Record<string, string[]>
  /** Resolved `exportZips` value per pack type. */
  packTypeExportZips?: Record<string, boolean>
}

/** File-handler config from `SandstoneConfig.resources.handle`. */
export type FileHandler = {
  path: RegExp
  callback: (contents: HandlerFile) => HandlerFile | Promise<HandlerFile>
}

/** File-exclusion config from `SandstoneConfig.resources.exclude`. */
export type FileExclusions =
  | false
  | {
      generated?: RegExp[]
      existing?: RegExp[]
    }

/** Functions exposed on every script's `local`. */
export type LocalFunctions = {
  hash: (input: string) => string
  syncLinkedLibraries: (projectPath: string) => Promise<number>
  getClientPath: () => Promise<string | undefined>
  getClientWorldPath: (worldName: string, minecraftPath?: string) => Promise<string>
  checkSymlinksAvailable: (local: BeforeSaveLocal) => Promise<boolean>
  fs: {
    readText: (path: string) => Promise<string>
    writeText: (path: string, content: string) => Promise<number>
    writeJSON: (path: string, value: unknown, options?: { pretty?: boolean; trailingNewline?: boolean }) => Promise<number>
    writeBytes: (path: string, content: ArrayBuffer | Buffer | Uint8Array) => Promise<number>
    ensureDir: (path: string) => Promise<void>
    remove: (path: string, options?: { recursive?: boolean; force?: boolean }) => Promise<void>
    pathExists: (path: string) => Promise<boolean>
    fileExists: (path: string) => Promise<boolean>
    readDirNames: (path: string) => Promise<string[]>
    readBytes: (path: string) => Promise<Buffer>
    fileStat: (path: string) => Promise<{ size: number; isDirectory: () => boolean }>
    copyFile: (src: string, dest: string) => Promise<number>
    copyDir: (src: string, dest: string) => Promise<void>
    unlinkPath: (path: string) => Promise<void>
  }
}

export type BeforeAllLocal = {
  // Paths
  folder: string
  outputFolder: string

  // Config & pack
  sandstoneConfig: SandstoneConfig
  sandstonePack: SandstonePack
  saveOptions: NonNullable<SandstoneConfig['saveOptions']>
  resources: SandstoneConfig['resources']
  scripts: SandstoneConfig['scripts']

  // CLI input
  cliOptions: Record<string, unknown>

  // Project's `package.json`, with `module` typed to match the build's
  // entrypoint lookup.
  packageJson: { module?: string; [k: string]: unknown }

  // The entrypoint module path as declared in `package.json#module`.
  entrypoint: string

  // Resolved destinations (mutable — scripts can reroute)
  worldName: string | undefined
  root: boolean | undefined
  clientPath: string | undefined
  serverPath: string | undefined
  packName: string
} & LocalFunctions

export type BeforeSaveLocal = BeforeAllLocal & {
  // Cache
  cacheFile: string
  oldCache: Cache
  newCache: Cache
  changedPackTypes: Set<string>
  newDirs: Set<string>

  // Additional functions available by beforeSave
  autoRegisterPackTypes: (local: BeforeSaveLocal) => Promise<void>
  processExternalResources: (
    local: BeforeSaveLocal,
    packType: string,
    fileExclusions: FileExclusions,
    fileHandlers: FileHandler[] | false,
  ) => Promise<void>
  processPackTypeOutput: (local: BeforeSaveLocal, packType: PackType, outputPath: string) => Promise<void>
}

export type AfterAllLocal = BeforeSaveLocal & {
  // Post-save state
  resourceCounts: { functions: number; other: number }
  /** `'client'`, `'server'`, `'client & server'`, or `false` if nothing was exported. */
  exports: string | false

  // Additional functions available by afterAll
  createArchive: (local: AfterAllLocal, packType: PackType) => Promise<boolean>
  exportPack: (
    local: AfterAllLocal,
    destPath: string,
    packType: PackType,
    archivedOutput: boolean,
  ) => Promise<void>
  getExportPath: (local: AfterAllLocal, packType: PackType, target: 'client' | 'server') => string
  runExportHandler: (
    local: AfterAllLocal,
    packType: PackType,
    target: 'client' | 'server',
    exportPath: string,
  ) => Promise<void>
  cleanupOldArchives: (local: AfterAllLocal) => Promise<void>
  cleanupOldSymlinks: (local: AfterAllLocal) => Promise<void>
  saveCache: (local: AfterAllLocal) => Promise<number>
}

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

  minFormat?: number | [number] | [number, number]

  maxFormat?: number | [number] | [number, number]

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
   * @see [https://minecraft.wiki/w/Resource_Pack#pack.mcmeta](https://minecraft.wiki/w/Resource_Pack#pack.mcmeta)
   */
  packFormat?: number

  minFormat?: number | [number] | [number, number]

  maxFormat?: number | [number] | [number, number]

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

type PackConfigs<PackType extends LiteralUnion<'datapack' | 'resourcepack'>> = Record<
  PackType,
  PackType extends 'datapack' ? DatapackConfig : PackType extends 'resourcepack' ? ResourcePackConfig : unknown
>

export type ContentStrategyKind<Resource extends string, Conflict extends string> = {
  resource: Resource
  conflict: Conflict
}

type ContentStrategy =
  | ContentStrategyKind<'default', BASIC_CONFLICT_STRATEGIES>
  | ContentStrategyKind<'advancement', NonNullable<AdvancementClassArguments['onConflict']>>
  | ContentStrategyKind<'damage_type', NonNullable<DamageTypeClassArguments['onConflict']>>
  | ContentStrategyKind<'loot_table', NonNullable<LootTableClassArguments['onConflict']>>
  | ContentStrategyKind<'function', NonNullable<MCFunctionClassArguments['onConflict']>>
  | ContentStrategyKind<'predicate', NonNullable<PredicateClassArguments['onConflict']>>
  | ContentStrategyKind<'recipe', NonNullable<RecipeClassArguments['onConflict']>>
  | ContentStrategyKind<'slot_source', NonNullable<SlotSourceClassArguments['onConflict']>>
  | ContentStrategyKind<'sulfur_cube_archetype', NonNullable<SulfurCubeArchetypeClassArguments['onConflict']>>
  | ContentStrategyKind<'tag', NonNullable<TagClassArguments<any>['onConflict']>>
  | ContentStrategyKind<'item_modifier', NonNullable<ItemModifierClassArguments['onConflict']>>
  | ContentStrategyKind<'trim_material', NonNullable<TrimMaterialClassArguments['onConflict']>>
  | ContentStrategyKind<'trim_pattern', NonNullable<TrimPatternClassArguments['onConflict']>>
  | ContentStrategyKind<'banner_pattern', NonNullable<BannerPatternClassArguments['onConflict']>>
  | ContentStrategyKind<'block_transformer', NonNullable<BlockTransformerClassArguments['onConflict']>>
  | ContentStrategyKind<'chat_type', NonNullable<ChatTypeClassArguments['onConflict']>>
  | ContentStrategyKind<'decorated_pot_pattern', NonNullable<DecoratedPotPatternClassArguments['onConflict']>>
  | ContentStrategyKind<'dialog', NonNullable<DialogClassArguments['onConflict']>>
  | ContentStrategyKind<'enchantment', NonNullable<EnchantmentClassArguments['onConflict']>>
  | ContentStrategyKind<'enchantment_provider', NonNullable<EnchantmentProviderClassArguments['onConflict']>>
  | ContentStrategyKind<'instrument', NonNullable<InstrumentClassArguments['onConflict']>>
  | ContentStrategyKind<'jukebox_song', NonNullable<JukeboxSongClassArguments['onConflict']>>
  | ContentStrategyKind<'test_environment', NonNullable<TestEnvironmentClassArguments['onConflict']>>
  | ContentStrategyKind<'test_instance', NonNullable<TestInstanceClassArguments['onConflict']>>
  | ContentStrategyKind<'timeline', NonNullable<TimelineClassArguments['onConflict']>>
  | ContentStrategyKind<'trade_set', NonNullable<TradeSetClassArguments['onConflict']>>
  | ContentStrategyKind<'trial_spawner', NonNullable<TrialSpawnerClassArguments['onConflict']>>
  | ContentStrategyKind<'variant', NonNullable<VariantClassArguments<any>['onConflict']>>
  | ContentStrategyKind<'villager_trade', NonNullable<VillagerTradeClassArguments['onConflict']>>
  | ContentStrategyKind<'world_clock', NonNullable<WorldClockClassArguments['onConflict']>>
  | ContentStrategyKind<'atlas', NonNullable<AtlasClassArguments['onConflict']>>
  | ContentStrategyKind<'block_definition', NonNullable<BlockStateDefinitionArguments<any>['onConflict']>>
  | ContentStrategyKind<'font', NonNullable<FontArguments['onConflict']>>
  | ContentStrategyKind<'lang', NonNullable<LanguageArguments['onConflict']>>
  | ContentStrategyKind<'model', NonNullable<ModelClassArguments['onConflict']>>
  | ContentStrategyKind<'sound_event', NonNullable<SoundEventArguments['onConflict']>>
  | ContentStrategyKind<'text', NonNullable<PlainTextArguments['onConflict']>>
  | ContentStrategyKind<'texture', NonNullable<TextureArguments<any>['onConflict']>>
  | ContentStrategyKind<'equipment', NonNullable<EquipmentClassArguments['onConflict']>>
  | ContentStrategyKind<'particle', NonNullable<ParticleClassArguments['onConflict']>>
  | ContentStrategyKind<'post_effect', NonNullable<PostEffectClassArguments['onConflict']>>
  | ContentStrategyKind<'shader', NonNullable<ShaderClassArguments['onConflict']>>
  | ContentStrategyKind<'sounds', NonNullable<SoundsIndexArguments['onConflict']>>
  | ContentStrategyKind<'waypoint_style', NonNullable<WaypointStyleClassArguments['onConflict']>>
  | ContentStrategyKind<'item_definition', NonNullable<ItemModelDefinitionClassArguments['onConflict']>>

type OnConflict<Strategy extends ContentStrategy> = Record<Strategy['resource'], Strategy['conflict']>

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
  onConflict?: Partial<OnConflict<ContentStrategy>>

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
    customFileHandler?: (relativePath: string, content: any) => Promise<void>

    // TODO: Implement this
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
     * Overrides each `PackType`'s `archiveOutput` default.
     * - `true` forces every pack to export as a `.zip` archive.
     * - `false` forces every pack to export as a folder.
     * - `undefined` (default) uses the `archiveOutput` value the pack was constructed with — `false` for `DataPack`, `true` for `ResourcePack`.
     */
    exportZips?: boolean
  }

  /** Some scripts that can run at defined moments. */
  scripts?: {
    /**
     * A script running before Sandstone starts importing source files.
     * Return `false` to skip all builder code until the next entrypoint
     * (`beforeSave`).
     */
    beforeAll?: (local: BeforeAllLocal) => void | undefined | boolean | Promise<void | undefined | boolean>

    /**
     * A script running before Sandstone starts saving the files.
     * Return `false` skips all builder code until the next entrypoint
     * (`afterAll`).
     */
    beforeSave?: (local: BeforeSaveLocal) => void | undefined | boolean | Promise<void | undefined | boolean>

    /**
     * A script running after Sandstone saved all files. Return `false` skips
     * the final log message.
     */
    afterAll?: (local: AfterAllLocal) => void | undefined | boolean | Promise<void | undefined | boolean>
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

      callback: (contents: HandlerFile | Promise<HandlerFile>) => HandlerFile | Promise<HandlerFile>
    }[]
  }
}
