import { VectorClass } from '@variables';
export declare type Coordinates = [x: string, y: string, z: string] | VectorClass<[string, string, string]>;
export declare type Rotation = [horizontal: string, vertical: string] | VectorClass<[string, string]>;
export declare function arrayToArgsParser(args: unknown): (typeof args extends string[] ? VectorClass<typeof args> : typeof args);
export declare function coordinatesParser(coordinates: unknown): (typeof coordinates extends Coordinates ? VectorClass<[string, string, string]> : typeof coordinates);
export declare function rotationParser(rotation: unknown): (typeof rotation extends Rotation ? VectorClass<[string, string]> : typeof rotation);
