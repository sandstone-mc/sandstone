import { VectorClass } from '@variables'

export type Coordinates = [x: string, y: string, z: string] | VectorClass<[string, string, string]>
export type Rotation = [horizontal: string, vertical: string] | VectorClass<[string, string]>

export function arrayToArgsParser(args: unknown): (
    typeof args extends string[] ? VectorClass<typeof args> : typeof args
) {
    if (Array.isArray(args) && args.length === 3 && args.every(a => typeof a === 'string')) {
        return new VectorClass(args)
    }

    return args
}

export function coordinatesParser(coordinates: unknown): (
    typeof coordinates extends Coordinates ? VectorClass<[string, string, string]> : typeof coordinates
) {
    if (Array.isArray(coordinates) && coordinates.length === 3 && coordinates.every(c => typeof c === 'string')) {
        return new VectorClass(coordinates)
    }

    return coordinates
}

export function rotationParser(rotation: unknown): (
    typeof rotation extends Rotation ? VectorClass<[string, string]> : typeof rotation
) {
    if (Array.isArray(rotation) && rotation.length === 2 && rotation.every(r => typeof r === 'string')) {
        return new VectorClass(rotation)
    }

    return rotation
}