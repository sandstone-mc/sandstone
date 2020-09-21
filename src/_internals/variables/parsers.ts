import util from 'util'

import type { Coordinates, NBT, Rotation } from '@arguments'
import { VectorClass } from './Coordinates'

// PARSERS
export function arrayToArgsParser(args: unknown): (
  typeof args extends string[] ? VectorClass<typeof args> : typeof args
) {
  if (Array.isArray(args) && args.length === 3 && args.every((a) => typeof a === 'string')) {
    return new VectorClass(args)
  }

  return args
}

export function coordinatesParser(coordinates: unknown): (
  typeof coordinates extends Coordinates ? VectorClass<[string, string, string]> : typeof coordinates
) {
  if (Array.isArray(coordinates) && coordinates.length === 3 && coordinates.every((c) => typeof c === 'string')) {
    return new VectorClass(coordinates)
  }

  return coordinates
}

export function rotationParser(rotation: unknown): (
  typeof rotation extends Rotation ? VectorClass<[string, string]> : typeof rotation
) {
  if (Array.isArray(rotation) && rotation.length === 2 && rotation.every((r) => typeof r === 'string')) {
    return new VectorClass(rotation)
  }

  return rotation
}

export const nbtParser = (nbt: NBT) => util.inspect(nbt, {
  depth: null,
  showHidden: false,
  compact: true,
  maxArrayLength: null,
  maxStringLength: null,
  breakLength: Infinity,
  colors: false,
})
