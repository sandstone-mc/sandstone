import type { MacroArgument } from 'sandstone/core'

/** Ensure that a number is inside a given range. */
export function validateIntegerRange(integer: number | MacroArgument, name: string, minimum = 0, maximum = 2_147_483_647) {
  if (typeof integer !== 'number') {
    return integer
  }

  if (integer && integer <= minimum) {
    throw new Error(`\`${name}\` must be greater than or equal to ${minimum.toLocaleString()}, got \`${integer.toLocaleString()}\`.`)
  }
  if (integer && integer >= maximum) {
    throw new Error(`\`${name}\` must be lower than or equal to ${maximum.toLocaleString()}, got \`${integer.toLocaleString()}\`.`)
  }

  return integer
}
