import * as os from 'os'
import * as path from 'path'

/**
 * Get the .minecraft path
 */
export function getMinecraftPath(): string {
  // eslint-disable-next-line
  const fs = require('fs')

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

  // eslint-disable-next-line
  const fs = require('fs')

  if (minecraftPath) {
    mcPath = minecraftPath
  } else {
    mcPath = getMinecraftPath()
  }

  const savesPath = path.join(mcPath, 'saves')
  const worldPath = path.join(savesPath, worldName)

  if (!fs.existsSync(worldPath)) {
    const existingWorlds = fs.readdirSync(savesPath, { withFileTypes: true }).filter((f: any) => f.isDirectory).map((f: {name: string}) => f.name) as string[]

    throw new Error(`Unable to locate the "${worldPath}" folder. Word ${worldName} does not exists. List of existing worlds: ${JSON.stringify(existingWorlds, null, 2)}`)
  }

  return worldPath
}

/**
 * Create a directory.
 */
export function createDirectory(directory: string) {
  // eslint-disable-next-line
  const fs = require('fs')

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
export function deleteDirectory(directory: string) {
  // eslint-disable-next-line
  const fs = require('fs')

  // Delete the path
  try {
    fs.rmSync(directory, { recursive: true })
  } catch (e) {
    // Folder already deleted
  }
}
