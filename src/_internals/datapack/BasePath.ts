import {
  AdvancementClass, LootTableClass, MCFunctionClass, PredicateClass, RecipeClass, TagClass,
} from '@resources'

import type {
  AdvancementType, LootTableType, PredicateType, RecipeType, TAG_TYPES,
} from '@arguments'
import type { Datapack } from '@datapack'
import type { HintedTagStringType, MCFunctionOptions } from '@resources'
import type { MCFunctionInstance } from './Datapack'
import type { TagSingleValue } from './resourcesTree'

/** The namespace all nested resources will be located in. */
export type BasePathOptions<N extends (undefined | string), D extends (undefined | string)> = {
  namespace?: N

  /** The directory all nested resources will be located in. */
  directory?: D
}

/** Remove forward & trailing slashes */
function trimSlashes(str: string): string {
  return str.replace(/^\/+/, '')?.replace(/\/+$/, '')
}

/** Tranforms a path to an array of folders. */
function pathToArray(path?: string): string[] {
  return (path ?? '').split('/')
}

/** Changes the base namespace & directory of nested resources. */
export class BasePathClass<N extends (undefined | string), D extends (undefined | string)> {
  protected datapack: Datapack

  namespace: N

  directory: D

  constructor(datapack: Datapack, basePath: BasePathOptions<N, D>) {
    this.datapack = datapack
    this.namespace = basePath.namespace as N

    // Remove forward & trailing slashes
    this.directory = (typeof basePath.directory === 'string' ? trimSlashes(basePath.directory) : undefined) as D
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
    if (!path.length) {
      throw new Error(
        'Empty name is not allowed.',
      )
    }

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
  child = <DIR extends string | undefined>(childPath: Omit<BasePathOptions<undefined, DIR>, 'namespace'>) => {
    const newDirectory = pathToArray(typeof childPath.directory === 'string' ? trimSlashes(childPath.directory) : undefined)
    const oldDirectory = pathToArray(this.directory)

    return new BasePathClass(this.datapack, {
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
  MCFunction = <RETURN extends void | Promise<void>>(
    name: string, callback: () => RETURN, options?: MCFunctionOptions,
  ): MCFunctionInstance<RETURN> => {
    const mcfunction = new MCFunctionClass(this.datapack, this.getName(name), callback, options ?? {})

    this.datapack.rootFunctions.add(mcfunction as MCFunctionClass<any>)

    const returnFunction: any = mcfunction.call
    returnFunction.schedule = mcfunction.schedule

    // Set the function's name
    const descriptor = Object.getOwnPropertyDescriptor(returnFunction, 'name')!
    descriptor.value = mcfunction.name
    Object.defineProperty(returnFunction, 'name', descriptor)

    returnFunction.clearSchedule = mcfunction.clearSchedule
    returnFunction.generate = mcfunction.generate
    returnFunction.toString = mcfunction.toString
    returnFunction.toJSON = mcfunction.toJSON

    return returnFunction
  }

  /**
   * Create an advancement.
   *
   * @param advancement The actual advancement. You must provide at least a `criteria` for it to be valid.
   *
   * @example
   *
   * Advancement('bred_two_cows', {
   *   criteria: {
   *     'bred_cows': {
   *       trigger: 'minecraft:bred_animals',
   *       conditions: {
   *         child: { type: 'minecraft:cow' }
   *       }
   *     }
   *   }
   * })
   */
  Advancement = <T extends string>(name: string, advancement: AdvancementType<T>) => new AdvancementClass(this.datapack, this.getName(name), advancement)

  /**
   * Create a predicate.
   *
   * @param predicate The actual predicate. You must provide at least a `condition` for it to be valid.
   *
   * @example
   *
   * Predicate('is_raining', {
   *   condition: 'minecraft:weather_check',
   *   raining: true,
   * })
   */
  Predicate = (name: string, predicate: PredicateType) => new PredicateClass(this.datapack, this.getName(name), predicate)

  /** Create a tag. */
  Tag = <T extends TAG_TYPES>(type: T, name: string, values: TagSingleValue<HintedTagStringType<T>>[] = [], replace?: boolean) => new TagClass(this.datapack, type, this.getName(name), values, replace)

  /**
   * Create a loot table.
   *
   * @param lootTable The actual loot table. Each pool must provide a number of `rolls` and a list of `entries` to be valid.
   * Each entry must at least provide its `type` and the type-dependant required properties.
   *
   * @example
   *
   * LootTable('give_diamond', {
   *   pools: [{
   *     rolls: 1,
   *     entries: [{
   *       type: 'item',
   *       name: 'minecraft:diamond',
   *     }],
   *   }],
   * })
   */
  LootTable = (name: string, lootTable: LootTableType) => new LootTableClass(this.datapack, this.getName(name), lootTable)

  /** Create a recipe. */
  Recipe = <P1 extends string, P2 extends string, P3 extends string>(name: string, recipe: RecipeType<P1, P2, P3>) => new RecipeClass(this.datapack, this.getName(name), recipe)
}
