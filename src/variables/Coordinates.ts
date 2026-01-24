import type { NBTSerializable } from 'sandstone/arguments'
import { inspect } from 'util'

/** A root class that can be used to defined a N-dimension vector */
export class VectorClass<T extends readonly unknown[]> implements NBTSerializable {
  values: T

  constructor(values: T) {
    if (!Array.isArray(values) || !values.every((i) => typeof i === 'string')) {
      throw new Error(`Expected array of string for Vector values, got ${inspect(values)}`)
    }

    this.values = values
  }

  toString() {
    return this.values.join(' ')
  }

  toJSON() {
    return this.toString()
  }

  toNBT() {
    return this.toString()
  }

  [Symbol.iterator](): Iterator<T[0]> {
    return this.values[Symbol.iterator]()
  }
}

// SHORTCUTS

type Tuple<T> = readonly [T, ...T[]]
type MappedArray<T, U> = { [key in keyof T]: U }

/**
 * Transforms a number into an absolute coordinate.
 *
 * @example
 *
 * abs(0) => '0'
 *
 * abs(5.5) => '5.5'
 *
 * @alias {@link absolute}
 * @see {@link relative} for relative coordinates (e.g. `~10`)
 * @see {@link local} for local coordinates (e.g. `^10`)
 */
export function absolute(coordinate?: number): string

/**
 * Transforms numbers into absolute coordinates.
 *
 * @example
 *
 * abs(0, 0, 0) => ['0', '0', '0']
 *
 * abs(0, 180) => ['0', '180']
 *
 * abs(-1, 10, 5) => ['-1', '10', '5']
 *
 * @alias {@link absolute}
 * @see {@link relative} for relative coordinates (e.g. `~10`)
 * @see {@link local} for local coordinates (e.g. `^10`)
 */
export function absolute<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, string>>

export function absolute<T extends Tuple<number>>(...coordinates: T): string | VectorClass<MappedArray<T, string>> {
  if (coordinates.length === 1) {
    return coordinates[0].toString()
  }

  return new VectorClass(coordinates.map((coord) => coord.toString()) as unknown as MappedArray<T, string>)
}

/**
 * Transforms numbers into relative coordinates, using the tilde notation `~`.
 *
 * @example
 *
 * rel() => ['~', '~', '~']
 *
 * rel(0, 0, 0) => ['~', '~', '~']
 *
 * rel(0, 180) => ['~', '~180']
 *
 * rel(-1, 10, 5) => ['~-1', '~10', '~5']
 *
 * @alias {@link relative}
 * @see {@link absolute} for absolute coordinates (e.g. `10`)
 * @see {@link local} for local coordinates (e.g. `^10`)
 */
export function relative<T extends [0, 0, 0]>(): VectorClass<MappedArray<T, '~'>>

/**
 * Transforms a number into a relative coordinate, using the tilde notation `~`.
 *
 * @example
 *
 * rel(0) => '~'
 *
 * rel(5.5) => '~5.5'
 *
 * rel(-1) => '~-1'
 *
 * @alias {@link relative}
 * @see {@link absolute} for absolute coordinates (e.g. `10`)
 * @see {@link local} for local coordinates (e.g. `^10`)
 */
export function relative(coordinate: number): `~${string}`

/**
 * Transforms numbers into relative coordinates, using the tilde notation `~`.
 *
 * @example
 *
 * rel() => ['~', '~', '~']
 *
 * rel(0, 0, 0) => ['~', '~', '~']
 *
 * rel(0, 180) => ['~', '~180']
 *
 * rel(-1, 10, 5) => ['~-1', '~10', '~5']
 *
 * @alias {@link relative}
 * @see {@link absolute} for absolute coordinates (e.g. `10`)
 * @see {@link local} for local coordinates (e.g. `^10`)
 */
export function relative<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, `~${string}`>>

export function relative<T extends Tuple<number>>(...coordinates: T): string | VectorClass<MappedArray<T, string>> {
  if (coordinates.length === 0) {
    return new VectorClass(['~', '~', '~'] as unknown as MappedArray<T, string>)
  }

  if (coordinates.length === 1) {
    return `~${coordinates[0] || ''}`
  }

  return new VectorClass(coordinates.map((coord) => `~${coord || ''}`) as unknown as MappedArray<T, string>)
}

/**
 * Transforms numbers into local coordinates, using the caret notation `^`.
 *
 * First coordinate is leftward, second is upward, third is frontward.
 *
 * @example
 *
 * loc() => ['^', '^', '^']
 *
 * loc(0, 0, 0) => ['^', '^', '^']
 *
 * loc(0, 180, 0) => ['^', '^180', '^']
 *
 * loc(-1, 10, 5) => ['^-1', '^10', '^5']
 *
 * @alias {@link local}
 * @see {@link absolute} for absolute coordinates (e.g. `10`)
 * @see {@link relative} for relative coordinates (e.g. `~10`)
 */
export function local<T extends [0, 0, 0]>(): VectorClass<MappedArray<T, '^'>>

/**
 * Transforms a number into a local coordinate, using the caret notation `^`.
 *
 * @example
 *
 * loc(0) => '^'
 *
 * loc(5.5) => '^5.5'
 *
 * loc(-1) => '^-1'
 *
 * @alias {@link local}
 * @see {@link absolute} for absolute coordinates (e.g. `10`)
 * @see {@link relative} for relative coordinates (e.g. `~10`)
 */
export function local(coordinate: number): `^${string}`

/**
 * Transforms numbers into local coordinates, using the tilde notation `^`.
 *
 * First coordinate is leftward, second is upward, third is frontward.
 *
 * @example
 *
 * loc() => ['^', '^', '^']
 *
 * loc(0, 0, 0) => ['^', '^', '^']
 *
 * loc(0, 180, 0) => ['^', '^180', '^']
 *
 * loc(-1, 10, 5) => ['^-1', '^10', '^5']
 *
 * @alias {@link local}
 * @see {@link absolute} for absolute coordinates (e.g. `10`)
 * @see {@link relative} for relative coordinates (e.g. `~10`)
 */
export function local<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, `^${string}`>>

export function local<T extends Tuple<number>>(...coordinates: T): string | VectorClass<MappedArray<T, string>> {
  if (coordinates.length === 0) {
    return new VectorClass(['^', '^', '^'] as unknown as MappedArray<T, string>)
  }

  if (coordinates.length === 1) {
    return `^${coordinates[0] || ''}`
  }

  return new VectorClass(coordinates.map((coord) => `^${coord || ''}`) as unknown as MappedArray<T, string>)
}
