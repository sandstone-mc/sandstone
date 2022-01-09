export type Range = (
  | number
  | [min: number, max: number]
  | [min: number, max: null | undefined]
  | [min: null | undefined, max: number]
  | [min: number]
  | `${number}`
  | `${number}..`
  | `..${number}`
  | `${number}..${number}`
)
