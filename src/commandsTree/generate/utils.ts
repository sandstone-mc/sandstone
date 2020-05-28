/**
 * This file contains utilities functions to auto-generate the commands tree.
 */

import util from 'util'
import path from 'path'

/**
 * Returns the string version of a Javascript object.
 * The representation will be valid Javascript, but invalid JSON.
 */
export function toJS(obj: any, compact = true): string {
  return util.inspect(
    obj,
    {
      depth: +Infinity,
      maxArrayLength: +Infinity,
      maxStringLength: +Infinity,
      breakLength: compact ? +Infinity : 80, // +Infinity,
      compact,
      colors: false,
    },
  )
}

/**
 * Get the folder of a path.
 */
export function getBasePath(filePath: string): string {
  return path.parse(filePath).dir
}

/**
 * Returns a safe version of a name. Safe means "can be used as a parameter name".
 */
export function safeName(name: string): string {
  if (['function'].includes(name)) {
    return `${name}_`
  }
  return name
}
