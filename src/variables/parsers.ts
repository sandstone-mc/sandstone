import { type MacroArgument, isMacroArgument } from '../core/Macro.js'
import { VectorClass } from './Coordinates.js'

import type {
  Coordinates, Range, Rotation, STRUCTURE_MIRROR, STRUCTURE_ROTATION,
} from 'sandstone/arguments'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore.js'
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
  T extends Coordinates<boolean> ? VectorClass<[string, string, string]> : T
) {
  return isRawCoordinates(coordinates) ? new VectorClass(coordinates) : coordinates as any
}

export function rotationParser<T>(rotation: T): (
  T extends Rotation<boolean> ? VectorClass<[string, string]> : T
) {
  return isRawRotation(rotation) ? new VectorClass(rotation) : rotation as any
}

// Sanitize score values. null => '', Infinity => '', any number => itself
export const sanitizeValue = (core: SandstoneCore, value: MacroArgument | number | string | null | undefined): string => {
  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  if (isMacroArgument(core, value)) {
    return (value as MacroArgument).toMacro()
  }

  if (Number.isFinite(value)) {
    return value.toString()
  }

  // Value is Infinity or -Infinity
  return ''
}

// Returns the string representation of a range. [0, null] => '0..', [-Infinity, 5] => '..5', 8 => '8'
export const rangeParser = (core: SandstoneCore, range: Range<boolean> | MacroArgument): string => {
  if (Array.isArray(range)) {
    return `${sanitizeValue(core, range[0])}..${sanitizeValue(core, range[1])}`
  }
  return range.toString()
}

export type StructureRotation = STRUCTURE_ROTATION | number | `${90 | 180 | 270}` | `-${90 | 180 | 270}`

export const structureRotationParser = (rotation?: StructureRotation | MacroArgument) => {
  if (!rotation) {
    return 'none'
  }

  if (typeof rotation === 'object') {
    return rotation
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

export const structureMirrorParser = (mirror?: StructureMirror | MacroArgument): STRUCTURE_MIRROR => {
  if (typeof mirror === 'object') {
    return mirror.toMacro() as STRUCTURE_MIRROR
  }

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

export function targetParser(target: any): string {
  if (typeof target === 'string') {
    return target
  }
  if (target._toSelector) {
    return target._toSelector()
  }
  if (target.toMacro) {
    return target
  }
  return target.toString()
}
