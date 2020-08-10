import { VectorClass } from "../variables"

export type Coordinates = [x: string, y: string, z: string] | VectorClass<[string, string, string]>
export type Rotation = [horizontal: string, vertical: string] | VectorClass<[string, string]>
