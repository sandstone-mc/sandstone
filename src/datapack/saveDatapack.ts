import chalk from 'chalk'
import fs from 'graceful-fs'
import path from 'path'
import { promisify } from 'util'

import {
  createDirectory, deleteDirectory, getMinecraftPath, getWorldPath,
} from './filesystem'
import packMcMeta from './packMcMeta.json'

import type { JSONTextComponent } from 'src/arguments'
import type {
  ResourceOnlyTypeMap,
  ResourcesTree,
  ResourceTypeMap,
  ResourceTypes,
} from './resourcesTree'

type SaveFileObject = {
  packType: 'datapack'
  type: ResourceTypes | 'raw'
  rootPath: string
  relativePath: string
  content: string
  saveOptions: SaveOptions
  resource: any
}

type CustomHandlerFileObject = Omit<SaveFileObject, 'rootPath'> & { rootPath: string | null }

const writeFileAsync = promisify(fs.writeFile)
const writeFile = (saveObject: SaveFileObject) => writeFileAsync(path.join(saveObject.rootPath, saveObject.relativePath), saveObject.content)

export type SaveOptions = {
  /**
   * The location of the `.minecraft` folder.
   * If unspecified, the location of the `.minecraft` folder will be automatically discovered.
   */
  minecraftPath?: string

  /**
   * If true, will display the resulting commands in the console.
   *
   * @default false
   */
  verbose?: boolean

  /**
   * If true, then nothing will actually be saved to the file system.
   *
   * Used with `verbose`, you can use this option to only print the results of your functions, without saving anything.
   */
  dryRun?: boolean

  /**
   * The description of the datapack.
   * Corresponds to the `pack.description` property of the `pack.mcmeta` file.
   *
   * Can be a string or a JSON Text Component.
   */
  description?: JSONTextComponent

  /**
   * The format version of the datapack.
   * Corresponds to the `pack.pack_format` property of the `pack.mcmeta` file.
   *
   * @default 6
   */
  formatVersion?: number

  /**
   * A custom handler for saving files. If specified, files won't be saved anymore, you will have to handle that yourself.
   */
  customFileHandler?: (fileInfo: CustomHandlerFileObject) => Promise<void> | void

  /** The indentation to use for all JSON & MCMeta files. This argument is the same than `JSON.stringify` 3d argument. */
  indentation?: string | number

  /**
   * Whether to put the datapack in the .minecraft/datapacks folder, or not.
   *
   * Incompatible with the `world` and the `customPath` parameters.
   */
  asRootDatapack?: boolean

  /**
   * The name of the world to save the datapack in.
   *
   * Incompatible with the `asRootDatapack` and the `customPath` parameters.
   */

  world?: string
  /**
   * A custom path to save the data pack at.
   *
   * Incompatible with the `asRootDatapack` and the `world` parameters.
   */
  customPath?: string
}

type RestrictedSaveOptions = { world?: string, asRootDatapack?: boolean, customPath?: string, minecraftPath?: string }

function hasWorld(arg: RestrictedSaveOptions): arg is { world: string } & RestrictedSaveOptions {
  return Object.prototype.hasOwnProperty.call(arg, 'world')
}

function hasRoot(arg: RestrictedSaveOptions): arg is { asRootDatapack: boolean } & RestrictedSaveOptions {
  return Object.prototype.hasOwnProperty.call(arg, 'asRootDatapack')
}

function hasCustomPath(arg: RestrictedSaveOptions): arg is { customPath: string } & RestrictedSaveOptions {
  return Object.prototype.hasOwnProperty.call(arg, 'customPath')
}

function saveResource<T extends ResourceTypes>(
  rootPath: string | null,
  type: T,
  resource: ResourceTypeMap[T],
  options: SaveOptions,
  getRepresentation: (resource_: ResourceOnlyTypeMap[T], consoleDisplay: boolean) => string,
  getDisplayTitle: (namespace: string, folders: string[], fileName: string) => string,
): Promise<void>[] {
  // This ensure the function is async, and can be await
  const writeFileToDisk = async (info: CustomHandlerFileObject) => {
    const customFileHandler = options?.customFileHandler
    if (!customFileHandler && info.rootPath) {
      // If we don't have a custom file handler, info.rootPath is necessarily not null
      return writeFile(info as SaveFileObject)
    }
    if (customFileHandler) {
      return customFileHandler(info)
    }
    return undefined
  }

  const promises: Promise<void>[] = []

  if (resource.isResource) {
    const [namespace, ...folders] = resource.path

    const basePath = path.join('data', namespace, type)
    const fileName = folders.pop() as string
    const resourceFolder = path.join(basePath, ...folders)

    if (!options.dryRun) {
      if (!options.customFileHandler && rootPath) {
        createDirectory(path.join(rootPath, resourceFolder))
      }

      // Write the commands to the file system
      const resourcePath = path.join(resourceFolder, `${fileName}.${type === 'functions' ? 'mcfunction' : 'json'}`)

      promises.push(
        writeFileToDisk({
          packType: 'datapack',
          type,
          content: getRepresentation(resource as ResourceOnlyTypeMap[T], false),
          rootPath,
          relativePath: resourcePath,
          resource,
          saveOptions: options,
        }),
      )
    }

    if (options.verbose) {
      console.log(chalk`{cyan ## ${getDisplayTitle(namespace, folders, fileName)}}`)
      console.log(getRepresentation(resource as ResourceOnlyTypeMap[T], true))
      console.log()
    }
  }

  for (const r of resource.children.values()) {
    promises.push(
      ...saveResource(rootPath, type, r as ResourceTypeMap[T], options, getRepresentation, getDisplayTitle),
    )
  }

  return promises
}

export function getDestinationPath(name: string, options: RestrictedSaveOptions) {
  if (hasWorld(options) && options.world !== undefined) {
    return path.join(getWorldPath(options?.world, options?.minecraftPath), 'datapacks', name)
  } if (hasRoot(options) && options.asRootDatapack !== undefined) {
    return path.join(getMinecraftPath(), 'datapacks', name)
  } if (hasCustomPath(options) && options.customPath !== undefined) {
    return path.join(options.customPath, name)
  }
  return null
}

/**
 * Saves the datapack to the file system.
 *
 * @param functions A mapping between function full names and their commands.
 * @param name The name of the Datapack
 * @param options The save options.
 */
export async function saveDatapack(resources: ResourcesTree, name: string, options: SaveOptions) {
  // This ensure the function is async, and can be await
  const writeFileToDisk = async (info: SaveFileObject) => {
    const func = options?.customFileHandler ?? writeFile
    return func(info)
  }

  const indentation = options.indentation ?? 2

  try {
    const start = Date.now()

    // Files saving promises
    const promises: Promise<void>[] = []

    // Find the save path
    const rootPath: string | null = getDestinationPath(name, options)

    if (options.description !== undefined) {
      packMcMeta.pack.description = options.description as string
    }

    if (options.formatVersion !== undefined) {
      packMcMeta.pack.pack_format = options.formatVersion
    }

    if (!options.dryRun) {
      // Clean the old working directory
      if (rootPath !== null) {
        deleteDirectory(rootPath)
        createDirectory(rootPath)

        // Overwrite it
        promises.push(writeFileToDisk({
          packType: 'datapack',
          type: 'raw',
          resource: packMcMeta,
          content: JSON.stringify(packMcMeta, null, indentation),
          rootPath,
          relativePath: 'pack.mcmeta',
          saveOptions: options,
        }))
      }
    }

    for (const n of resources.namespaces.values()) {
    // Save functions
      for (const f of n.functions.values()) {
        promises.push(...saveResource(
          rootPath, 'functions', f, options,

          // To display a function, we join their arguments. If we're in a console display, we put comments in gray.
          (func, consoleDisplay) => {
            const repr = [...func.commands].map((command) => command.join(' ')).join('\n')
            if (consoleDisplay) {
              return repr.replace(/^#(.+)/gm, chalk.gray('#$1'))
            }

            return repr
          },
          (namespace, folders, fileName) => `Function ${namespace}:${[...folders, fileName].join('/')}`,
        ))
      }

      // Save tags
      for (const t of n.tags.values()) {
        promises.push(...saveResource(
          rootPath, 'tags', t, options,
          (r) => JSON.stringify({ replace: r.replace ?? false, values: r.values }, null, indentation),
          (namespace, folders, fileName) => `Tag[${folders[0]}] ${namespace}:${[...folders.slice(1), fileName].join('/')}`,
        ))
      }

      // Save advancements
      for (const a of n.advancements.values()) {
        promises.push(...saveResource(
          rootPath, 'advancements', a, options,
          (r) => JSON.stringify(r.advancement, null, indentation),
          (namespace, folders, fileName) => `Avancement ${namespace}:${[...folders, fileName].join('/')}`,
        ))
      }

      // Save predicates
      for (const p of n.predicates.values()) {
        promises.push(...saveResource(
          rootPath, 'predicates', p, options,
          (r) => JSON.stringify(r.predicate, null, indentation),
          (namespace, folders, fileName) => `Predicate ${namespace}:${[...folders, fileName].join('/')}`,
        ))
      }

      // Save loot tables
      for (const l of n.loot_tables.values()) {
        promises.push(...saveResource(
          rootPath, 'loot_tables', l, options,
          (r) => JSON.stringify(r.lootTable, null, indentation),
          (namespace, folders, fileName) => `Loot table ${namespace}:${[...folders, fileName].join('/')}`,
        ))
      }

      // Save recipe
      for (const r of n.recipes.values()) {
        promises.push(...saveResource(
          rootPath, 'recipes', r, options,
          (resource) => JSON.stringify(resource.recipe, null, indentation),
          (namespace, folders, fileName) => `Recipe ${namespace}:${[...folders, fileName].join('/')}`,
        ))
      }
    }

    // Wait until all files are written
    await Promise.all(promises)

    if (!options.dryRun && rootPath !== null) {
      console.log(chalk`{greenBright ✓ Successfully wrote data pack to "${rootPath}".} {gray (${promises.length.toLocaleString()} files - ${(Date.now() - start).toLocaleString()}ms)}`)
    } else {
      console.log(chalk`{greenBright ✓ Successfully compiled data pack.} {gray (${(Date.now() - start).toLocaleString()}ms)}`)
    }

    return {
      destination: rootPath,
    }
  } catch (e) {
    console.error(e)
    console.log(chalk`{redBright ✗ Failed to write datapack. See above for additional information.}`)
    throw e
  }
}
