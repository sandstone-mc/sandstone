import type { VectorClass } from '@variables'

type AbsoluteFloat = number | `${number}`;
type RelativeFloat = `~${number | ''}`;
type LocalFloat = `^${number | ''}`;
type AbsoluteOrRelativeFloat = AbsoluteFloat | RelativeFloat;

type AbsoluteOrRelativeVec3 = `${AbsoluteOrRelativeFloat} ${AbsoluteOrRelativeFloat} ${AbsoluteOrRelativeFloat}`;
type LocalVec3 = `${LocalFloat} ${LocalFloat} ${LocalFloat}`;

type AbsoluteOrRelativeVec2 = `${AbsoluteOrRelativeFloat} ${AbsoluteOrRelativeFloat}`;
type LocalVec2 = `${LocalFloat} ${LocalFloat}`;

export type Coordinates = [x: string, y: string, z: string] | VectorClass<[string, string, string]> | AbsoluteOrRelativeVec3 | LocalVec3
export type Rotation = [horizontal: string | VectorClass<[string]>, vertical: string | VectorClass<[string]>] | VectorClass<[string, string]>
export type ColumnCoordinates = [x: string, z: string] | VectorClass<[string, string]> | AbsoluteOrRelativeVec2 | LocalVec2