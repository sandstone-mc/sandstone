import {
  AdvancementInstance, LootTableInstance, MCFunctionClass, PredicateInstance, RecipeInstance, TagInstance,
} from '@resources'

import type {
  AdvancementJSON, HintedTagStringType, LootTableJSON, PredicateJSON, RecipeJSON, TAG_TYPES,
  TagSingleValue,
} from 'src/arguments'
import type { HideFunctionProperties } from '@/generalTypes'
import type { Datapack } from '@datapack'
import type {
  AdvancementOptions, LootTableOptions, MCFunctionOptions, PredicateOptions, RecipeOptions, TagOptions,
} from '@resources'
import type { SandstoneConfig } from '..'
import type { MCFunctionInstance } from './Datapack'

export type BasePathOptions<N extends (undefined | string), D extends (undefined | string)> = {
  /** The namespace all nested resources will be located in. */
  namespace?: N

  /** The directory all nested resources will be located in. */
  directory?: D

  /** The default conflict strategies for all nested resources. */
  onConflict?: SandstoneConfig['onConflict']
}

export type BasePathInstance<N extends (undefined | string) = (undefined | string), D extends (undefined | string) = (undefined | string)> = (
  HideFunctionProperties<BasePathClass<N, D>['getResourceName'] & BasePathClass<N, D>>
)

/** Remove forward & trailing slashes */
function trimSlashes(str: string): string {
  return str.replace(/^\/+/, '')?.replace(/\/+$/, '')
}

/** Tranforms a path to an array of folders. */
function pathToArray(path?: string): string[] {
  return (path ?? '').split('/')
}

/** Changes the base namespace & directory of nested resources. */
export class BasePathClass<N extends (undefined | string) = (undefined | string), D extends (undefined | string) = (undefined | string)> {
  protected datapack: Datapack

  namespace: N

  directory: D

  onConflict

  constructor(datapack: Datapack, basePath: BasePathOptions<N, D>) {
    this.datapack = datapack
    this.namespace = basePath.namespace as N

    // Copy onConflict into an object
    const onConflict = basePath.onConflict ? { ...basePath.onConflict } : undefined

    // Apply default
    if (onConflict?.default) {
      onConflict.advancement ??= onConflict.default
      onConflict.lootTable ??= onConflict.default
      onConflict.mcFunction ??= onConflict.default
      onConflict.predicate ??= onConflict.default
      onConflict.recipe ??= onConflict.default
      onConflict.tag ??= onConflict.default
    }

    this.onConflict = onConflict

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
  child = <DIR extends string | undefined>(childPath: Omit<BasePathOptions<undefined, DIR>, 'namespace'>): BasePathInstance<N, string> => {
    const newDirectory = pathToArray(typeof childPath.directory === 'string' ? trimSlashes(childPath.directory) : undefined)
    const oldDirectory = pathToArray(this.directory)

    return this.datapack.BasePath({
      namespace: this.namespace,
      directory: [...oldDirectory, ...newDirectory].join('/'),
      onConflict: this.onConflict,
    })
  }

  /**
   * Get the name of a resource under this base path. Can also be used with template strings.
   * @param name The basic name of the resource.
   * @returns The name of the resource under this base path.
   *
   * @example
   * >>> const basePath = BasePath({ directory: 'sub/folder', namespace: 'mynamespace' })
   * >>> basePath.getResourceName('my_resource')
   * "mynamespace:sub/folder/my_resource"
   */
  getResourceName = (name: string | TemplateStringsArray) => this.getName(typeof name === 'string' ? name : name.join())

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
  Advancement = <T extends string>(name: string, advancement: AdvancementJSON<T>, options?: AdvancementOptions) => (
    new AdvancementInstance(this.datapack, this.getName(name), advancement, { onConflict: this.onConflict?.advancement, ...options })
  )

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
  LootTable = (name: string, lootTable: LootTableJSON, options?: LootTableOptions) => (
    new LootTableInstance(this.datapack, this.getName(name), lootTable, { onConflict: this.onConflict?.lootTable, ...options })
  )

  /**
   * Creates a Minecraft Function.
   *
   * @param name The name of the function.
   * @param callback A callback containing the commands you want in the Minecraft Function.
   */
  MCFunction = <RETURN extends void | Promise<void>>(
    name: string, callback: () => RETURN, options?: MCFunctionOptions,
  ): MCFunctionInstance<RETURN> => {
    const mcfunction = new MCFunctionClass(this.datapack, this.getName(name), callback, {
      onConflict: this.onConflict?.mcFunction, ...options,
    })

    this.datapack.rootFunctions.add(mcfunction as MCFunctionClass<any>)

    const returnFunction: any = mcfunction.call

    // Set the function's name
    const descriptor = Object.getOwnPropertyDescriptor(returnFunction, 'name')!
    descriptor.value = mcfunction.name
    Object.defineProperty(returnFunction, 'name', descriptor)

    // Set all properties, except for "name"
    const { name: _, ...mcfunctionClone } = mcfunction
    Object.assign(returnFunction, mcfunctionClone)

    return returnFunction
  }

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
  Predicate = (name: string, predicate: PredicateJSON, options?: PredicateOptions) => (
    new PredicateInstance(this.datapack, this.getName(name), predicate, { onConflict: this.onConflict?.predicate, ...options })
  )

  /** Create a recipe. */
  Recipe = <P1 extends string, P2 extends string, P3 extends string>(name: string, recipe: RecipeJSON<P1, P2, P3>, options?: RecipeOptions) => (
    new RecipeInstance(this.datapack, this.getName(name), recipe, { onConflict: this.onConflict?.recipe, ...options })
  )

  /** Create a tag. */
  Tag = <T extends TAG_TYPES>(type: T, name: string, values: TagSingleValue<HintedTagStringType<T>>[] = [], replace?: boolean, options?: TagOptions) => (
    new TagInstance(this.datapack, type, this.getName(name), values, replace, { onConflict: this.onConflict?.tag, ...options })
  )
}
