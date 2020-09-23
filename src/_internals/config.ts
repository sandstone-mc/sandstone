import path from 'path'
import fs from 'fs'

export function getConfigFile(): Record<string, string> {
// Directory of the file that's being ran
  const fileDir = path.dirname(process.argv[1])

  const configPath = path.join(fileDir, 'sandstone.json')

  try {
    const configFile = fs.readFileSync(configPath)
    return JSON.parse(configFile.toString())
  } catch (e) {
    return {}
  }
}
