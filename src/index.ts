import type { JSONTextComponent } from './arguments/jsonTextComponent.js'
import type {
  // eslint-disable-next-line max-len
  AdvancementClassArguments,
  AtlasClassArguments,
  BlockStateArguments,
  DamageTypeClassArguments,
  FontArguments,
  ItemModifierClassArguments,
  LanguageArguments,
  LootTableClassArguments,
  MCFunctionClassArguments,
  ModelClassArguments,
  PlainTextArguments,
  PredicateClassArguments,
  RecipeClassArguments,
  SoundEventArguments,
  TagClassArguments,
  TextureArguments,
  TrimMaterialClassArguments,
  TrimPatternClassArguments,
} from './core/index.js'
import { SandstonePack } from './pack/index.js'
import type { BASIC_CONFLICT_STRATEGIES, LiteralUnion, NamespacedLiteralUnion, SetType } from './utils.js'
import { Set } from './utils.js'
import * as coordinates from './variables/Coordinates.js'
import { ResolveNBTPart } from './variables/ResolveNBT.js'

export const sandstonePack = new SandstonePack('default', '0')
export { SandstonePack }

export { LiteralUnion, NamespacedLiteralUnion, Set, SetType }

export { ResolveNBTPart }

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
  place,
  random,
  raw,
  recipe,
  reload,
  returnCmd,
  ride,
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
  RawResource,

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

  Atlas,
  BlockState,
  Font,
  Language,
  Model,
  SoundEvent,
  PlainText, // TODO: text type is any when in a workspace, w h y
  Texture,

  // Variables
  packTypes,
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
  makeCustomResource,
  sleep,
} = sandstonePack

export * from './variables/nbt/NBTs.js'

export * from './arguments/index.js'
export type { Condition } from './flow/index.js'
export {
  ObjectiveClass,
  Score,
  SelectorClass,
  LabelClass,
  UUIDClass,
  DataPointClass,
} from './variables/index.js'

export {
  MCFunctionClass
} from './core/index.js'

export {
  AdvancementClass,
  TagClass,
  TextureClass,
} from './core/resources/index.js'

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
  packFormat: number

  /** List of experimental game features to enable. */
  features?: string[]

  supported_formats:
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

  supported_formats:
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
  | ContentStrategyKind<'advancements', NonNullable<AdvancementClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for damage types.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'damage_types', NonNullable<DamageTypeClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Loot Tables.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'loot_tables', NonNullable<LootTableClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for MCFunctions.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'functions', NonNullable<MCFunctionClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Predicates.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'predicates', NonNullable<PredicateClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for RecipeOptions.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'recipes', NonNullable<RecipeClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Tags.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'tags', NonNullable<TagClassArguments<any>['onConflict']>>
  /**
   * The conflict strategy to use for Item modifiers.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'item_modifiers', NonNullable<ItemModifierClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Trim materials.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'trim_materials', NonNullable<TrimMaterialClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Trim patterns.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'trim_patterns', NonNullable<TrimPatternClassArguments['onConflict']>>

  /**
   * The conflict strategy to use for Atlases.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'atlass', NonNullable<AtlasClassArguments['onConflict']>> // atlass is not a typo. feel free to PR :trolley:
  /**
   * The conflict strategy to use for Block states.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'block_states', NonNullable<BlockStateArguments<any>['onConflict']>>
  /**
   * The conflict strategy to use for Fonts.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'fonts', NonNullable<FontArguments['onConflict']>>
  /**
   * The conflict strategy to use for Languages.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'languages', NonNullable<LanguageArguments['onConflict']>>
  /**
   * The conflict strategy to use for Models.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'models', NonNullable<ModelClassArguments['onConflict']>>
  /**
   * The conflict strategy to use for Sound Events.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'sound_events', NonNullable<SoundEventArguments['onConflict']>>
  /**
   * The conflict strategy to use for Plain Text files.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'texts', NonNullable<PlainTextArguments['onConflict']>>
  /**
   * The conflict strategy to use for Textures.
   * Will override the defined `default` strategy.
   */
  | ContentStrategyKind<'texture', NonNullable<TextureArguments<any>['onConflict']>>

type OnConflict<Strategy extends ContentStrategy> = Record<Strategy['resource'], Strategy['conflict']>
