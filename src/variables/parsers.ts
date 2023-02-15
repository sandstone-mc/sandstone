import { VectorClass } from './Coordinates'

import type {
  Coordinates, Range, Rotation, STRUCTURE_MIRROR, STRUCTURE_ROTATION,
} from '#arguments'
// PARSERS
export function arrayToArgsParser(args: unknown): (
  typeof args extends string[] ? VectorClass<readonly unknown[]> : typeof args
) {
  if (Array.isArray(args) && args.length === 3) {
    return new VectorClass(args.map((arg) => arg.toString()))
  }

  return args
}

function isRawCoordinates(arg: unknown): arg is [string, string, string] | [string, string] {
  return Array.isArray(arg) && (arg.length === 3 || arg.length === 2) && arg.every((c) => typeof c === 'string')
}

function isRawRotation(arg: unknown): arg is [string, string] {
  return Array.isArray(arg) && arg.length === 2 && arg.every((c) => typeof c === 'string')
}

export function coordinatesParser<T>(coordinates: T): (
  T extends Coordinates ? VectorClass<[string, string, string]> : T
) {
  return isRawCoordinates(coordinates) ? new VectorClass(coordinates) : coordinates as any
}

export function rotationParser<T>(rotation: T): (
  T extends Rotation ? VectorClass<[string, string]> : T
) {
  return isRawRotation(rotation) ? new VectorClass(rotation) : rotation as any
}

// Sanitize score values. null => '', Infinity => '', any number => itself
export const sanitizeValue = (value: number | null | undefined): string => {
  if (value === undefined || value === null) {
    return ''
  }

  if (Number.isFinite(value)) {
    return value.toString()
  }

  // Value is Infinity or -Infinity
  return ''
}

// Returns the string representation of a range. [0, null] => '0..', [-Infinity, 5] => '..5', 8 => '8'
export const rangeParser = (range: Range): string => {
  if (Array.isArray(range)) {
    return `${sanitizeValue(range[0])}..${sanitizeValue(range[1])}`
  }
  return range.toString()
}

export type StructureRotation = STRUCTURE_ROTATION | number | `${90 | 180 | 270}` | `-${90 | 180 | 270}`

export const structureRotationParser = (rotation?: StructureRotation) => {
  if (!rotation) {
    return 'none'
  }
  const numToLiteral = (angle: number): STRUCTURE_ROTATION => {
    switch (angle) {
      case 0: return 'none'
      case 90: return 'clockwise_90'
      case 180: return '180'
      case 270: return 'counterclockwise_90'
      case -90: return 'counterclockwise_90'
      case -180: return '180'
      case -270: return 'clockwise_90'
      default: {
        if (!Number.isInteger(angle / 90)) {
          throw new Error('Structure rotation must be in increments of 90!')
        }

        // reduce the angle
        angle %= 360

        // force it to be the positive remainder, so that 0 <= angle < 360
        angle = (angle + 360) % 360

        // force into the minimum absolute value residue class, so that -180 < angle <= 180
        if (angle > 180) angle -= 360

        return numToLiteral(angle)
      }
    }
  }
  if (typeof rotation === 'number') {
    return numToLiteral(rotation)
  }

  if (rotation === 'clockwise_90' || rotation === 'counterclockwise_90') {
    return rotation
  }

  return numToLiteral(Number(rotation))
}

export type StructureMirror = STRUCTURE_MIRROR | '^x' | '^z' | 'x' | 'z' | boolean

export const structureMirrorParser = (mirror?: StructureMirror): STRUCTURE_MIRROR => {
  if (typeof mirror === 'string') {
    const lastCharacter = mirror.slice(0, -1)
    if (lastCharacter === 'x') {
      return 'left_right'
    }
    if (lastCharacter === 'z') {
      return 'front_back'
    }
    return mirror as STRUCTURE_MIRROR
  }
  if (mirror) {
    return 'left_right'
  }
  return 'none'
}
