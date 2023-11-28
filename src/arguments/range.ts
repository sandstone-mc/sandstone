import type { MacroString } from 'sandstone/core'

export type Range<MACRO extends boolean> =
    | MacroString<number, MACRO>
    | `${number}`
    | `${MacroString<number, MACRO>}..`
    | `${MacroString<number, MACRO>}..${MacroString<number, MACRO>}`
    | `..${MacroString<number, MACRO>}`
    | [min: MacroString<number, MACRO>, max: MacroString<number, MACRO>]
    | [min: MacroString<number, MACRO>, max: null | undefined]
    | [min: null | undefined, max: MacroString<number, MACRO>]
    | [min: MacroString<number, MACRO>]
