import os from 'os'
import path from 'path'
import fs from 'fs'

import { toMcFunctionName, CommandArgs } from './minecraft'
import { ResourcesTree, FunctionResource } from './resourcesTree'

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
   * The name of the world to save the datapack in.
   * If unspecified, the datapack will be saved to the current folder.
   */
  world?: string

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
}

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

  if (options?.world !== undefined) {
    savePath = path.join(getWorldPath(options?.world, options?.minecraftPath), 'datapacks')
  } else {
    savePath = process.cwd()
  }

  savePath = path.join(savePath, name)

  createDirectory(savePath)

  const dataPath = path.join(savePath, 'data')

  function logFunction(resource: FunctionResource) {
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

      if (options.verbose) {
        console.log('#', `${namespace}:${[...folders, fileName].join('/')}`)
        console.log(commands.join('\n'))
        console.log()
      }
    }

    Array.from(resource.children.values()).forEach(logFunction)
  }

  for (const n of resources.namespaces.values()) {
    for (const f of n.functions.values()) {
      logFunction(f)
    }
  }

  console.log(`Successfully wrote commands to "${savePath}"`)
}
