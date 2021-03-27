import type { VectorClass } from '@variables'

/** Ensure that a number is inside a given range. */
export function validateIntegerRange(integer: number, name: string, minimum: number, maximum: number) {
  if (integer && integer < 0) {
    throw new Error(`\`${name}\` must be greater or equal than ${minimum.toLocaleString()}, got \`${integer.toLocaleString()}\`.`)
  }
  if (integer && integer > 2_147_483_647) {
    throw new Error(`\`${name}\` must be lower or equal than ${maximum.toLocaleString()}, got \`${integer.toLocaleString()}\`.`)
  }
}
