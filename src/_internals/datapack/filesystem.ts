import fs from 'fs'
import os from 'os'
import path from 'path'

import packMcMeta from './packMcMeta.json'
import { FunctionResource, ResourcesTree } from './resourcesTree'

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

  const worldPath = path.join(mcPath, 'saves', worldName)

  if (!fs.existsSync(worldPath)) {
    throw new Error(`Unable to locate the "${worldPath}" folder. Word ${worldName} does not exists.`)
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

export type SaveOptions = {
  /**
   * The location of the `.minecraft` folder.
   * If unspecified, the location of the `.minecraft` folder will be automatically discovered.
   */
  minecraftPath?: string

  /**
   * If true, will display the resulting commands in the console.
   * Defaults to false.
   */
  verbose?: boolean

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
      rootDatapacks?: boolean
    } | {
      /**
       * The name of the world to save the datapack in.
       * If unspecified, the datapack will be saved to the current folder.
       *
       * Incompatible with the `rootDatapacks` folder.
       */
      world?: string
    }
  )

/**
 * Saves the datapack to the file system.
 *
 * @param functions A mapping between function full names and their commands.
 * @param name The name of the Datapack
 * @param options The save options.
 */
export function saveDatapack(resources: ResourcesTree, name: string, options: SaveOptions): void {
  const verbose = options?.verbose ?? false

  let savePath

  function hasWorld(arg: SaveOptions): arg is { world: string } & SaveOptions {
    return Object.prototype.hasOwnProperty.call(arg, 'world')
  }

  function hasRoot(arg: SaveOptions): arg is { rootDatapacks: string } & SaveOptions {
    return Object.prototype.hasOwnProperty.call(arg, 'rootDatapacks')
  }

  if (hasWorld(options)) {
    savePath = path.join(getWorldPath(options?.world, options?.minecraftPath), 'datapacks')
  } else if (hasRoot(options)) {
    savePath = path.join(getMinecraftPath(), 'datapacks/')
  } else {
    savePath = process.cwd()
  }

  savePath = path.join(savePath, name)

  createDirectory(savePath)

  const dataPath = path.join(savePath, 'data')

  if (options.description !== undefined) {
    packMcMeta.pack.description = options.description
  }

  fs.writeFileSync(path.join(savePath, 'pack.mcmeta'), JSON.stringify(packMcMeta))

  function saveFunction(resource: FunctionResource) {
    if (resource.isResource) {
      const [namespace, ...folders] = resource.path
      const commands = resource.commands.map((args) => args.join(' '))

      const functionsPath = path.join(dataPath, namespace, 'functions')
      const fileName = folders.pop()

      const mcFunctionFolder = path.join(functionsPath, ...folders)

      createDirectory(mcFunctionFolder)

      // Write the commands to the file system
      const mcFunctionPath = path.join(mcFunctionFolder, `${fileName}.mcfunction`)

      fs.writeFileSync(mcFunctionPath, commands.join('\n'))


      const GRAY = '\x1b[90m'
      const GREEN = '\x1b[32m'
      const RESET = '\x1b[0m'

      const commandsRepresentation = commands.map(command => {
        if (command.startsWith('#')) {
          return GRAY + command + RESET
        }
        return command
      }).join('\n')

      if (options.verbose) {
        console.log(`${GREEN}## Function`, `${namespace}:${[...folders, fileName].join('/')}${RESET}`)
        console.log(commandsRepresentation)
        console.log()
      }
    }

    Array.from(resource.children.values()).forEach(saveFunction)
  }

  for (const n of resources.namespaces.values()) {
    for (const f of n.functions.values()) {
      saveFunction(f)
    }
  }

  console.log(`Successfully wrote commands to "${savePath}"`)
}
