import fs from 'fs'
import os from 'os'
import path from 'path'
import packMcMeta from './packMcMeta.json'

import { FunctionResource, ResourcesTree, TagsResource } from './resourcesTree'

/**
 * Get the .minecraft path
 */
export function getMinecraftPath(): string {
  function getMCPath(): string {
    switch (os.platform()) {
      case 'win32':
        return path.join(os.homedir(), 'AppData/Roaming/.minecraft')
      case 'darwin':
        return path.join(os.homedir(), 'Library/Application Support/minecraft')
      case 'linux':
      default:
        return path.join(os.homedir(), '.minecraft')
    }
  }

  const mcPath = getMCPath()

  if (!fs.existsSync(mcPath)) {
    throw new Error('Unable to locate the .minecraft folder. Please specify it manually.')
  }

  return mcPath
}

/**
 *
 * @param worldName The name of the world
 * @param minecraftPath The optional location of the .minecraft folder.
 * If left unspecified, the .minecraft will be found automatically.
 */
export function getWorldPath(worldName: string, minecraftPath: string | undefined = undefined): string {
  let mcPath: string

  if (minecraftPath) {
    mcPath = minecraftPath
  } else {
    mcPath = getMinecraftPath()
  }

  const savesPath = path.join(mcPath, 'saves')
  const worldPath = path.join(savesPath, worldName)

  if (!fs.existsSync(worldPath)) {
    const existingWorlds = fs.readdirSync(savesPath, { withFileTypes: true }).filter((f) => f.isDirectory).map((f) => f.name)

    throw new Error(`Unable to locate the "${worldPath}" folder. Word ${worldName} does not exists. List of existing worlds: ${JSON.stringify(existingWorlds, null, 2)}`)
  }

  return worldPath
}

/**
 * Create a directory.
 */
function createDirectory(directory: string): void {
  // Create the path
  try {
    fs.mkdirSync(directory, { recursive: true })
  } catch (e) {
    // Folder already exists
  }
}

/**
 * Delete a directory.
 */
function deleteDirectory(directory: string): void {
  // Delete the path
  try {
    fs.rmdirSync(directory, { recursive: true })
  } catch (e) {
    // Folder already deleted
  }
}

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

const GRAY = '\x1b[90m'
const CYAN = '\x1b[36m'
const GREEN = '\x1b[32m'
const LIGHT_GREEN = '\x1b[92m'
const RESET = '\x1b[0m'

/**
 * Saves the datapack to the file system.
 *
 * @param functions A mapping between function full names and their commands.
 * @param name The name of the Datapack
 * @param options The save options.
 */
export function saveDatapack(resources: ResourcesTree, name: string, options: SaveOptions): void {
  // Start by clearing the console
  console.clear()

  let savePath

  function hasWorld(arg: SaveOptions): arg is { world: string } & SaveOptions {
    return Object.prototype.hasOwnProperty.call(arg, 'world')
  }

  function hasRoot(arg: SaveOptions): arg is { asRootDatapack: string } & SaveOptions {
    return Object.prototype.hasOwnProperty.call(arg, 'asRootDatapack')
  }

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

  function saveFunction(resource: FunctionResource) {
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

    Array.from(resource.children.values()).forEach(saveFunction)
  }

  function saveTag(resource: TagsResource) {
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
        console.log(`${GREEN}##`, `Tag[${folders[0]}] ${namespace}:${[...folders.slice(1), fileName].join('/')}`, RESET)
        console.log(representation)
        console.log()
      }
    }

    Array.from(resource.children.values()).forEach((r) => saveTag(r as TagsResource))
  }

  for (const n of resources.namespaces.values()) {
    // Save functions
    for (const f of n.functions.values()) {
      saveFunction(f)
    }

    // Save tags
    for (const t of n.tags.values()) {
      saveTag(t)
    }
  }

  if (!options.dryRun) {
    console.log(`${LIGHT_GREEN}✓ Successfully wrote commands to "${savePath}"${RESET}`)
  }
}
