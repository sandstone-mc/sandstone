import type {
  AdvancementType, LootTableType, PredicateType, RecipeType, TAG_TYPES,
} from '@arguments'
import type { Datapack } from '@datapack'
import type { HintedTagStringType, McFunctionOptions } from '@resources'
import {
  Advancement, LootTable, McFunction, Predicate, Recipe, Tag,
} from '@resources'
import type { McFunctionReturn } from './Datapack'
import type { TagSingleValue } from './resourcesTree'

export type BasePathOptions = {
  /** The namespace all nested resources will be located in. */
  namespace?: string

  /** The directory all nested resources will be located in. */
  directory?: string
}

/** Remove forward & trailing slashes */
function trimSlashes(str?: string): string | undefined {
  return str?.replace(/^\/+/, '')?.replace(/\/+$/, '')
}

/** Tranforms a path to an array of folders. */
function pathToArray(path?: string): string[] {
  return (path ?? '').split('/')
}

/** Changes the base namespace & directory of nested resources. */
export class BasePath {
  protected datapack: Datapack

  namespace?: string

  directory?: string

  constructor(datapack: Datapack, basePath: BasePathOptions) {
    this.datapack = datapack
    this.namespace = basePath.namespace

    // Remove forward & trailing slashes
    this.directory = trimSlashes(basePath.directory)
  }

  /** Validates & crafts the name of a resource. */
  protected getName(name: string): string {
    if (this.namespace !== undefined && name.includes(':')) {
      throw new Error('Cannot define namespace under a base path.')
    }

    const resourcePath = this.datapack.getResourcePath(name)

    // Find the new path
    const path = [this.directory, ...resourcePath.fullPath].filter((x) => x !== undefined).join('/')

    // Find the new namespace
    const namespace = this.namespace ?? resourcePath.namespace

    // Validate them both
    /**
     * A namespace should only contain the following symbols:
     *
     * 0123456789 (Numbers)
     * abcdefghijklmnopqrstuvwxyz (Lowercase letters)
     * _ (Underscore)
     * - (Hyphen/minus)
     */
    if (!namespace.match(/^[0-9a-z_-]+$/)) {
      throw new Error(
        `A namespace should only contain numbers, lowercase letters, underscores and hyphen/minus, and be at least 1 caracter long: got "${namespace}"`,
      )
    }

    /**
     * For resources:
     * You can name anything (recipes, advancements, etc) whatever name you like, but these are the only officially supported symbols:
     *
     * 0123456789 (Numbers)
     * abcdefghijklmnopqrstuvwxyz (Lowercase letters)
     * _ (Underscore)
     * / (Forward slash, directory separator)
     * . (Period)
     * - (Hyphen/minus)
     */
    if (!path.match(/^[0-9a-z_\-/.]+$/)) {
      throw new Error(
        `Resources names can only contain numbers, lowercase letters, underscores, forward slash, period, and hyphens: got "${path}"`,
      )
    }

    // Two consecutive dots are not allowed (Minecraft won't recognize the function)
    if (path.includes('..')) {
      throw new Error(
        `Resources names cannot inclue two consecutive dots: got "${path}"`,
      )
    }

    if (!this.namespace && !name.includes(':')) {
      // No namespace has been provided, directly return the path.
      return path
    }

    return `${namespace}:${path}`
  }

  /**
   * Get a child path of the current base path.
   *
   * The namespace cannot be provided in a child path.
   */
  child = (childPath: Omit<BasePathOptions, 'namespace'>) => {
    const newDirectory = pathToArray(trimSlashes(childPath.directory))
    const oldDirectory = pathToArray(this.directory)

    return new BasePath(this.datapack, {
      namespace: this.namespace,
      directory: [...oldDirectory, ...newDirectory].join('/'),
    })
  }

  /**
   * Creates a Minecraft Function.
   *
   * @param name The name of the function.
   * @param callback A callback containing the commands you want in the Minecraft Function.
   */
  mcfunction = <T extends any[]>(
    name: string, callback: (...args: T) => void, options?: McFunctionOptions,
  ): McFunctionReturn<T> => {
    const mcfunction = new McFunction(this.datapack, this.getName(name), callback, options ?? {})

    this.datapack.rootFunctions.add(mcfunction as McFunction<any[]>)

    const returnFunction: any = mcfunction.call
    returnFunction.schedule = mcfunction.schedule
    returnFunction.getName = mcfunction.getNameFromArgs
    returnFunction.clearSchedule = mcfunction.clearSchedule

    return returnFunction
  }

  /**
   * Creates a Minecraft Function.
   *
   * @param name The name of the function.
   * @param callback A callback containing the commands you want in the Minecraft Function.
   */
  Function = this.mcfunction

  /** Create an advancement. */
  Advancement = <T extends string>(name: string, advancement: AdvancementType<T>) => new Advancement(this.datapack.commandsRoot, this.getName(name), advancement)

  /** Create a predicate. */
  Predicate = (name: string, predicate: PredicateType) => new Predicate(this.datapack.commandsRoot, this.getName(name), predicate)

  /** Create a tag. */
  Tag = <T extends TAG_TYPES>(type: T, name: string, values: TagSingleValue<HintedTagStringType<T>>[], replace?: boolean) => new Tag(this.datapack, type, this.getName(name), values, replace)

  /** Create a loot table. */
  LootTable = (name: string, lootTable: LootTableType) => new LootTable(this.datapack, this.getName(name), lootTable)

  /** Create a recipe. */
  Recipe = <P1 extends string, P2 extends string, P3 extends string>(name: string, recipe: RecipeType<P1, P2, P3>) => new Recipe(this.datapack, this.getName(name), recipe)
}
