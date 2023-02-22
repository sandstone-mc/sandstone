import { SandstonePack } from '#pack'

import type { JSONTextComponent } from './arguments/jsonTextComponent'
import type {
  // eslint-disable-next-line max-len
  AdvancementClassArguments, ItemModifierClassArguments, LootTableClassArguments, MCFunctionClassArguments, PredicateClassArguments, RecipeClassArguments, TagClassArguments, TrimMaterialClassArguments, TrimPatternClassArguments,
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

// Resources
export const {
  MCFunction,
  Advancement,
  ItemModifier,
  LootTable,
  Predicate,
  Recipe,
  Tag,
  TrimMaterial,
  TrimPattern,
} = sandstonePack

// Misc
export const {
  Objective,
  _,
} = sandstonePack

type PackTypes = LiteralUnion<'datapack'>

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
  formatVersion: number

  /** List of experimental game features to enable. */
  features: string[],

  /**
   * Section for filtering out files from data packs applied below this one. Any file that matches one of the patterns inside `block` will be treated as if it was not present in the pack at all.
   */
  filter: {
    /** List of patterns */
    block: {
      /** A regular expression for the namespace of files to be filtered out. If unspecified, it applies to every namespace. */
      namespace?: string
      /** A regular expression for the paths of files to be filtered out. If unspecified, it applies to every file. */
      path?: string
    }[]
  }
}

type PackConfigs<PackType extends PackTypes> = Record<PackType, PackType extends 'datapack' ? DatapackConfig : unknown>

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

  packs: PackConfigs<PackTypes>

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

  /**
   * The strategy to use when 2 resources of the same type (Advancement, MCFunctions...) have the same name.
   */
  onConflict?: {
    /**
     * The default conflict strategy to use for all resources.
     *
     * @default
     * 'warn'
     */
    default?: BASIC_CONFLICT_STRATEGIES,

    /**
     * The conflict strategy to use for Advancements.
     * Will override the defined `default` strategy.
     */
    advancement?: AdvancementClassArguments['onConflict']

    /**
     * The conflict strategy to use for Loot Tables.
     * Will override the defined `default` strategy.
     */
    lootTable?: LootTableClassArguments['onConflict']
    /**
     * The conflict strategy to use for MCFunctions.
     * Will override the defined `default` strategy.
     */
    mcFunction?: MCFunctionClassArguments['onConflict']
    /**
     * The conflict strategy to use for Predicates.
     * Will override the defined `default` strategy.
     */
    predicate?: PredicateClassArguments['onConflict']
    /**
     * The conflict strategy to use for RecipeOptions.
     * Will override the defined `default` strategy.
     */
    recipe?: RecipeClassArguments['onConflict']
    /**
     * The conflict strategy to use for Tags.
     * Will override the defined `default` strategy.
     */
    tag?: TagClassArguments<any>['onConflict']
    /**
     * The conflict strategy to use for Item modifiers.
     * Will override the defined `default` strategy.
     */
    itemModifier?: ItemModifierClassArguments['onConflict']
    /**
     * The conflict strategy to use for Trim materials.
     * Will override the defined `default` strategy.
     */
    trimMaterial?: TrimMaterialClassArguments['onConflict']
    /**
     * The conflict strategy to use for Trim patterns.
     * Will override the defined `default` strategy.
     */
    trimPattern?: TrimPatternClassArguments['onConflict']
  }
}
