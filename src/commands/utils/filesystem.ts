import os from 'os'
import path from 'path'
import fs from 'fs'

import { toMcFunctionName, McFunctionName, CommandArgs } from './minecraft'

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
export function saveDatapack(functions: Map<McFunctionName, CommandArgs[]>, name: string, options: SaveOptions): void {
  const verbose = options?.verbose ?? false

  let savePath

  if (options?.world !== undefined) {
    savePath = path.join(getWorldPath(options?.world, options?.minecraftPath), 'datapacks')
  } else {
    savePath = process.cwd()
  }

  savePath = path.join(savePath, name)

  try {
    // Make the directory
    fs.mkdirSync(savePath)
  } catch (e) {
    // The folder already exists - don't do anything
  }

  const dataPath = path.join(savePath, 'data')

  for (const [fullFunctionName, commandsArgs] of functions) {
    const [namespace, ...foldersAndFile] = fullFunctionName
    const functionsPath = path.join(dataPath, namespace, 'functions')
    const fileName = foldersAndFile.pop()
    const folders = foldersAndFile

    const mcFunctionFolder = path.join(functionsPath, ...folders)

    // Create the path
    try {
      fs.mkdirSync(mcFunctionFolder, { recursive: true })
    } catch (e) {
      // Folder already exists
    }

    // Write the commands to the file system
    const mcFunctionPath = path.join(mcFunctionFolder, `${fileName}.mcfunction`)

    // Join the arguments of all commands with spaces
    const commands = commandsArgs.map((commandArgs) => commandArgs.join(' '))

    fs.writeFileSync(mcFunctionPath, commands.join('\n'))

    if (verbose) {
      const niceName = toMcFunctionName(fullFunctionName)
      console.log('=====', niceName, '=====')
      console.log(commands.join('\n'))
      console.log(`======${niceName.replace(/./g, '=')}======\n`)
    }
  }

  // Write pack.mcmeta
  fs.writeFileSync(path.join(savePath, 'pack.mcmeta'), JSON.stringify({
    pack: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      pack_format: 5,
      description: 'Generated using Sandstone',
    },
  }))

  console.log('Successfully wrote commands to', savePath)
}
