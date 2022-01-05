import type { VectorClass } from '@variables'

type Coordinate = number | `${'' | '~' | '^'}${number}`;

export type Coordinates = [x: string, y: string, z: string] | VectorClass<[string, string, string]> | `${Coordinate} ${Coordinate} ${Coordinate}`
export type Rotation = [horizontal: string | VectorClass<[string]>, vertical: string | VectorClass<[string]>] | VectorClass<[string, string]>
export type ColumnCoordinates = [x: string, z: string] | VectorClass<[string, string]> | `${Coordinate} ${Coordinate}`
