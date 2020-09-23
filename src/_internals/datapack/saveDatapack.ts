import path from 'path'
import fs from 'fs'
import {
  createDirectory, deleteDirectory, getMinecraftPath, getWorldPath,
} from './filesystem'
import packMcMeta from './packMcMeta.json'
import type {
  AdvancementResource, FunctionResource, PredicateResource, ResourcesTree, TagsResource,
} from './resourcesTree'

const GRAY = '\x1b[90m'
const CYAN = '\x1b[36m'
const LIGHT_RED = '\x1b[91m'
const GREEN = '\x1b[32m'
const LIGHT_GREEN = '\x1b[92m'
const RESET = '\x1b[0m'

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
   * Pack description.
   */
  description?: string
} & (
    {
      /**
       * Whether to put the datapack in the .minecraft/datapacks folder, or not.
       *
       * Incompatible with the `world` parameter.
       */
      asRootDatapack?: boolean
    } | {
      /**
       * The name of the world to save the datapack in.
       * If unspecified, the datapack will be saved to the current folder.
       *
       * Incompatible with the `asRootDatapack` folder.
       */
      world?: string
    }
  )

function hasWorld(arg: SaveOptions): arg is { world: string } & SaveOptions {
  return Object.prototype.hasOwnProperty.call(arg, 'world')
}

function hasRoot(arg: SaveOptions): arg is { asRootDatapack: string } & SaveOptions {
  return Object.prototype.hasOwnProperty.call(arg, 'asRootDatapack')
}

function saveFunction(dataPath: string, resource: FunctionResource, options: SaveOptions) {
  if (resource.isResource) {
    const [namespace, ...folders] = resource.path
    const commands = resource.commands.map((args) => args.join(' '))

    const functionsPath = path.join(dataPath, namespace, 'functions')
    const fileName = folders.pop()

    const mcFunctionFolder = path.join(functionsPath, ...folders)

    if (!options.dryRun) {
      createDirectory(mcFunctionFolder)

      // Write the commands to the file system
      const mcFunctionPath = path.join(mcFunctionFolder, `${fileName}.mcfunction`)

      fs.writeFileSync(mcFunctionPath, commands.join('\n'))
    }

    const commandsRepresentation = commands.map((command) => {
      if (command.startsWith('#')) {
        return GRAY + command + RESET
      }
      return command
    }).join('\n')

    if (options.verbose) {
      console.log(`${CYAN}## Function`, `${namespace}:${[...folders, fileName].join('/')}${RESET}`)
      console.log(commandsRepresentation)
      console.log()
    }
  }

  Array.from(resource.children.values()).forEach((v) => saveFunction(dataPath, v, options))
}

function saveTag(dataPath: string, resource: TagsResource, options: SaveOptions) {
  if (resource.isResource) {
    const [namespace, ...folders] = resource.path

    const basePath = path.join(dataPath, namespace, 'tags')
    const fileName = folders.pop()
    const resourceFolder = path.join(basePath, ...folders)

    const representation = JSON.stringify({
      replace: resource.replace ?? false,
      values: resource.values,
    }, null, 2)

    if (!options.dryRun) {
      createDirectory(resourceFolder)

      // Write the commands to the file system
      const resourcePath = path.join(resourceFolder, `${fileName}.json`)

      fs.writeFileSync(resourcePath, representation)
    }

    if (options.verbose) {
      console.log(`${CYAN}##`, `Tag[${folders[0]}] ${namespace}:${[...folders.slice(1), fileName].join('/')}`, RESET)
      console.log(representation)
      console.log()
    }
  }

  Array.from(resource.children.values()).forEach((r) => saveTag(dataPath, r as TagsResource, options))
}

function saveAdvancement(dataPath: string, resource: AdvancementResource, options: SaveOptions) {
  if (resource.isResource) {
    const [namespace, ...folders] = resource.path

    const basePath = path.join(dataPath, namespace, 'advancements')
    const fileName = folders.pop()
    const resourceFolder = path.join(basePath, ...folders)

    const representation = JSON.stringify(resource.advancement, null, 2)

    if (!options.dryRun) {
      createDirectory(resourceFolder)

      // Write the commands to the file system
      const resourcePath = path.join(resourceFolder, `${fileName}.json`)

      fs.writeFileSync(resourcePath, representation)
    }

    if (options.verbose) {
      console.log(`${CYAN}##`, `Avancement ${namespace}:${[...folders, fileName].join('/')}`, RESET)
      console.log(representation)
      console.log()
    }
  }

  Array.from(resource.children.values()).forEach((r) => saveAdvancement(dataPath, r as AdvancementResource, options))
}

function savePredicate(dataPath: string, resource: PredicateResource, options: SaveOptions) {
  if (resource.isResource) {
    const [namespace, ...folders] = resource.path

    const basePath = path.join(dataPath, namespace, 'predicates')
    const fileName = folders.pop()
    const resourceFolder = path.join(basePath, ...folders)

    const representation = JSON.stringify(resource.predicate, null, 2)

    if (!options.dryRun) {
      createDirectory(resourceFolder)

      // Write the commands to the file system
      const resourcePath = path.join(resourceFolder, `${fileName}.json`)

      fs.writeFileSync(resourcePath, representation)
    }

    if (options.verbose) {
      console.log(`${CYAN}##`, `Predicate ${namespace}:${[...folders, fileName].join('/')}`, RESET)
      console.log(representation)
      console.log()
    }
  }

  Array.from(resource.children.values()).forEach((r) => savePredicate(dataPath, r as PredicateResource, options))
}

/**
 * Saves the datapack to the file system.
 *
 * @param functions A mapping between function full names and their commands.
 * @param name The name of the Datapack
 * @param options The save options.
 */
export function saveDatapack(resources: ResourcesTree, name: string, options: SaveOptions): void {
  try {
    // Start by clearing the console
    let savePath

    if (hasWorld(options)) {
      savePath = path.join(getWorldPath(options?.world, options?.minecraftPath), 'datapacks')
    } else if (hasRoot(options)) {
      savePath = path.join(getMinecraftPath(), 'datapacks/')
    } else {
      savePath = process.cwd()
    }

    savePath = path.join(savePath, name)
    const dataPath = path.join(savePath, 'data')

    if (options.description !== undefined) {
      packMcMeta.pack.description = options.description
    }

    if (!options.dryRun) {
      deleteDirectory(savePath)
      createDirectory(savePath)

      fs.writeFileSync(path.join(savePath, 'pack.mcmeta'), JSON.stringify(packMcMeta))
    }

    for (const n of resources.namespaces.values()) {
    // Save functions
      for (const f of n.functions.values()) {
        saveFunction(dataPath, f, options)
      }

      // Save tags
      for (const t of n.tags.values()) {
        saveTag(dataPath, t, options)
      }

      for (const a of n.advancements.values()) {
        saveAdvancement(dataPath, a, options)
      }
    }

    if (!options.dryRun) {
      console.log(`${LIGHT_GREEN}✓ Successfully wrote datapack to "${savePath}"${RESET}`)
    }
  } catch (e) {
    console.log(`${LIGHT_RED}✗ Failed to write datapack. See above for additional information.${RESET}`)
  }
}
