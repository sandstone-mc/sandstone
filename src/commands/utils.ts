import os from 'os'
import path from 'path'
import fs from 'fs'

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
    throw new Error('Unable to locate the .minecraft folder.')
  }

  return mcPath
}


export function getWorldPath(worldName: string, minecraftPath: string | undefined = undefined): string {
  let mcPath: string

  if (minecraftPath) {
    mcPath = minecraftPath
  } else {
    mcPath = getMinecraftPath()
  }

  const worldPath = path.join(mcPath, 'saves', worldName)

  if (!fs.existsSync(mcPath)) {
    throw new Error(`Unable to locate the "${worldPath}" folder in ${path.join(mcPath, 'saves')}.`)
  }

  return worldPath
}
