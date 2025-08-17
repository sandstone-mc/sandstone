import type { MacroString } from 'sandstone/core'
import type { VectorClass } from 'sandstone/variables'

type AbsoluteFloat<MACRO extends boolean = false> = MacroString<`${number}`, MACRO>
type RelativeFloat<MACRO extends boolean = false> = `~${MacroString<number | '', MACRO>}`
type LocalFloat<MACRO extends boolean = false> = `^${MacroString<number | '', MACRO>}`
type AbsoluteOrRelativeFloat<MACRO extends boolean = false> = AbsoluteFloat<MACRO> | RelativeFloat<MACRO>

type AbsoluteOrRelativeVec3<MACRO extends boolean = false> =
  `${AbsoluteOrRelativeFloat<MACRO>} ${AbsoluteOrRelativeFloat<MACRO>} ${AbsoluteOrRelativeFloat<MACRO>}`
type LocalVec3<MACRO extends boolean = false> = `${LocalFloat<MACRO>} ${LocalFloat<MACRO>} ${LocalFloat<MACRO>}`

type AbsoluteOrRelativeVec2<MACRO extends boolean = false> =
  `${AbsoluteOrRelativeFloat<MACRO>} ${AbsoluteOrRelativeFloat<MACRO>}`
type LocalVec2<MACRO extends boolean = false> = `${LocalFloat<MACRO>} ${LocalFloat<MACRO>}`

export type Coordinates<MACRO extends boolean = false> =
  | [x: string, y: string, z: string]
  | VectorClass<[string, string, string]>
  | AbsoluteOrRelativeVec3<MACRO>
  | LocalVec3<MACRO>
export type Rotation<MACRO extends boolean = false> =
  | [
      horizontal: AbsoluteOrRelativeFloat<MACRO> | VectorClass<[string]>,
      vertical: AbsoluteOrRelativeFloat<MACRO> | VectorClass<[string]>,
    ]
  | VectorClass<[string, string]>
export type ColumnCoordinates<MACRO extends boolean = false> =
  | [x: string, z: string]
  | VectorClass<[string, string]>
  | AbsoluteOrRelativeVec2<MACRO>
  | LocalVec2<MACRO>
