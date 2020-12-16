import path from 'path'
import fs from 'fs'

export function getConfigFile(): Record<string, string> {
  try {
  // eslint-disable-next-line
  return require(path.resolve('./sandstone.config.ts')).default
  } catch (e) {
    return {}
  }
}
