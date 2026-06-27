import type { Macroable } from 'sandstone/core'
import type { VectorClass } from 'sandstone/variables'

type AbsoluteFloat<MACRO extends boolean = false> = Macroable<`${number}` | number, MACRO>
type RelativeFloat<MACRO extends boolean = false> = Macroable<`~${number | ''}`, MACRO>
type LocalFloat<MACRO extends boolean = false> = Macroable<`^${number | ''}`, MACRO>
type AbsoluteOrRelativeFloat<MACRO extends boolean = false> = AbsoluteFloat<MACRO> | RelativeFloat

type AbsoluteVec3<MACRO extends boolean = false> = Macroable<`${number} ${number} ${number}`, MACRO>

type AbsoluteOrRelativeVec3<MACRO extends boolean = false> =
  Macroable<`${number | RelativeFloat} ${number | RelativeFloat} ${number | RelativeFloat}`, MACRO>
type LocalVec3<MACRO extends boolean = false> = Macroable<`${LocalFloat} ${LocalFloat} ${LocalFloat}`, MACRO>

type AbsoluteOrRelativeVec2<MACRO extends boolean = false> =
  Macroable<`${AbsoluteOrRelativeFloat} ${AbsoluteOrRelativeFloat}`, MACRO>
type LocalVec2<MACRO extends boolean = false> = Macroable<`${LocalFloat} ${LocalFloat}`, MACRO>

type VectorArrayComponent<MACRO extends boolean = false> = Macroable<AbsoluteOrRelativeFloat<MACRO> | LocalFloat<MACRO> | number, MACRO>

export type AbsoluteCoordinates<MACRO extends boolean = false> =
  | [x: AbsoluteFloat<MACRO>, y: AbsoluteFloat<MACRO>, z: AbsoluteFloat<MACRO>]
  | VectorClass<[string, string, string]>
  | AbsoluteVec3<MACRO>

export type Coordinates<MACRO extends boolean = false> =
  | [x: VectorArrayComponent<MACRO>, y: VectorArrayComponent<MACRO>, z: VectorArrayComponent<MACRO>]
  | VectorClass<[string, string, string]>
  | AbsoluteOrRelativeVec3<MACRO>
  | LocalVec3<MACRO>
export type Rotation<MACRO extends boolean = false> =
  | [
      horizontal: Macroable<AbsoluteOrRelativeFloat<MACRO> | number, MACRO>,
      vertical: Macroable<AbsoluteOrRelativeFloat<MACRO> | number, MACRO>,
    ]
  | VectorClass<[string, string]>
export type ColumnCoordinates<MACRO extends boolean = false> =
  | [x: VectorArrayComponent<MACRO>, z: VectorArrayComponent<MACRO>]
  | VectorClass<[string, string]>
  | AbsoluteOrRelativeVec2<MACRO>
  | LocalVec2<MACRO>
