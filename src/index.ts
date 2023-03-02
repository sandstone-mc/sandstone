import { SandstonePack } from './pack'

import type { JSONTextComponent } from './arguments/jsonTextComponent'
import type {
  // eslint-disable-next-line max-len
  AdvancementClassArguments, DamageTypeClassArguments, ItemModifierClassArguments, LootTableClassArguments, MCFunctionClassArguments, PredicateClassArguments, RecipeClassArguments, TagClassArguments, TrimMaterialClassArguments, TrimPatternClassArguments,
} from './core/index'
import type { BASIC_CONFLICT_STRATEGIES, LiteralUnion } from './utils'

export const sandstonePack = new SandstonePack('default', '0')
export { SandstonePack }

// Commands
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
  defaultgamemode,
  difficulty,
  effect,
  enchant,
  execute,
  experience,
  fill,
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
  playsound,
  raw,
  recipe,
  reload,
  item,
  say,
  schedule,
  scoreboard,
  seed,
  setblock,
  setidletimeout,
  setworldspawn,
  spawnpoint,
  spectate,
  spreadplayers,
  stopsound,
  summon,
  tag,
  team,
  teammsg,
  teleport,
  tellraw,
  time,
  title,
  trigger,
  w,
  weather,
  worldborder,
  tm,
  tp,
  xp,
  tell,
} = sandstonePack.commands

export const {
  // Resources
  MCFunction,
  Advancement,
  DamageType,
  ItemModifier,
  LootTable,
  Predicate,
  Recipe,
  Tag,
  TrimMaterial,
  TrimPattern,
  RawResource,

  // Variables
  packTypes,
  Objective,
  _,
  Variable,
  flowVariable,
  Label,
  Data,
  DataVariable,
  getTempStorage,
  ResolveNBT,
  Selector,
  UUID,
  rootChunk,
  dimensionChunk,
  dimensionMarker,
  UtilityChunk,
  makeCustomResource,
  sleep,
} = sandstonePack

export type DatapackConfig = {
  /**
   * The description of the datapack.
   * Can be a single string or a JSON Text Component
   * (like in /tellraw or /title).
   */
  description: JSONTextComponent

  /**
   * The format version of the data pack.
   * Can change depending on the versions of Minecraft.
   *
   * @see [https://minecraft.gamepedia.com/Data_Pack#pack.mcmeta](https://minecraft.gamepedia.com/Data_Pack#pack.mcmeta)
   */
  packFormat: number

  /** List of experimental game features to enable. */
  features?: string[],

  /**
   * Section for filtering out files from data packs applied below this one. Any file that matches one of the patterns inside `block` will be treated as if it was not present in the pack at all.
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

  /**
   * The strategy to use when 2 resources of the same type (Advancement, MCFunctions...) have the same name.
   */
  onConflict?: OnConflict<ContentStrategy>
}

type PackConfigs<PackType extends LiteralUnion<'datapack'>> = Record<PackType, PackType extends 'datapack' ? DatapackConfig : unknown>

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
     * Incompatible with `root` and `path`.
     */
    world?: string

    /**
     * Whether to save the resource pack & datapack in the `.minecraft/datapacks` & `.minecraft/resource_pack` folders.
     *
     * Incompatible with `world` and `path`.
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
  }

  /** Some scripts that can run at defined moments. */
  scripts?: {
    /** A script running before Sandstone starts importing source files. */
    beforeAll?: () => (void | Promise<void>)

    /** A script running before Sandstone starts saving the files. */
    beforeSave?: () => (void | Promise<void>)

    /** A script running after Sandstone saved all files. */
    afterAll?: () => (void | Promise<void>)
  }

  resources?: {
    /** Path regex of files to exclude from the output. */
    exclude?: {
      /** From `SandstonePack` (your code in `./src`). */
      generated?: RegExp[]

      /** From `./resources`. */
      existing?: RegExp[]
    } | RegExp[]

    /** Handle files before they are written to the output. */
    handle?: {
      path: RegExp

      callback: (contents: string | Buffer | Promise<Buffer>) => Promise<Buffer>
    }[]
  }
}

export type ContentStrategyKind<Resource extends string, Conflict extends string> = { resource: Resource, conflict: Conflict }

type ContentStrategy = (
  /**
   * The default conflict strategy to use for all resources.
   *
   * @default
   * 'warn'
   */
  ContentStrategyKind<'default', BASIC_CONFLICT_STRATEGIES> |

  /**
   * The conflict strategy to use for Advancements.
   * Will override the defined `default` strategy.
   */
  ContentStrategyKind<'advancements', NonNullable<AdvancementClassArguments['onConflict']>> |
  /**
   * The conflict strategy to use for damage types.
   * Will override the defined `default` strategy.
   */
  ContentStrategyKind<'damage_types', NonNullable<DamageTypeClassArguments['onConflict']>> |
  /**
   * The conflict strategy to use for Loot Tables.
   * Will override the defined `default` strategy.
   */
  ContentStrategyKind<'loot_tables', NonNullable<LootTableClassArguments['onConflict']>> |
  /**
   * The conflict strategy to use for MCFunctions.
   * Will override the defined `default` strategy.
   */
  ContentStrategyKind<'functions', NonNullable<MCFunctionClassArguments['onConflict']>> |
  /**
   * The conflict strategy to use for Predicates.
   * Will override the defined `default` strategy.
   */
  ContentStrategyKind<'predicates', NonNullable<PredicateClassArguments['onConflict']>> |
  /**
   * The conflict strategy to use for RecipeOptions.
   * Will override the defined `default` strategy.
   */
  ContentStrategyKind<'recipes', NonNullable<RecipeClassArguments['onConflict']>> |
  /**
   * The conflict strategy to use for Tags.
   * Will override the defined `default` strategy.
   */
  ContentStrategyKind<'tags', NonNullable<TagClassArguments<any>['onConflict']>> |
  /**
   * The conflict strategy to use for Item modifiers.
   * Will override the defined `default` strategy.
   */
  ContentStrategyKind<'item_modifiers', NonNullable<ItemModifierClassArguments['onConflict']>> |
  /**
   * The conflict strategy to use for Trim materials.
   * Will override the defined `default` strategy.
   */
  ContentStrategyKind<'trim_materials', NonNullable<TrimMaterialClassArguments['onConflict']>> |
  /**
   * The conflict strategy to use for Trim patterns.
   * Will override the defined `default` strategy.
   */
  ContentStrategyKind<'trim_patterns', NonNullable<TrimPatternClassArguments['onConflict']>>
)

type OnConflict<Strategy extends ContentStrategy> = Record<Strategy['resource'], Strategy['conflict']>
