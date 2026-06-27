import type { Macroable } from 'sandstone/core'

export type Range<MACRO extends boolean = false> =
  | Macroable<number, MACRO>
  | `${number}`
  | `${number}..`
  | `${number}..${number}`
  | `..${number}`
  | [min: Macroable<number, MACRO>, max: Macroable<number, MACRO>]
  | [min: Macroable<number, MACRO>, max: null | undefined]
  | [min: null | undefined, max: Macroable<number, MACRO>]
  | [min: Macroable<number, MACRO>]
