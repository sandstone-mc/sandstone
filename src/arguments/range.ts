export type Range =
    | number
    | `${number}`
    | `${number}..`
    | `${number}..${number}`
    | `..${number}`
    | [min: number, max: number]
    | [min: number, max: null | undefined]
    | [min: null | undefined, max: number]
    | [min: number]
