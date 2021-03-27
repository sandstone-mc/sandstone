import fs from 'fs'
import os from 'os'
import path from 'path'

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
export function createDirectory(directory: string): void {
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
export function deleteDirectory(directory: string): void {
  // Delete the path
  try {
    fs.rmdirSync(directory, { recursive: true })
  } catch (e) {
    // Folder already deleted
  }
}
