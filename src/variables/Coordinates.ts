import { inspect } from 'util'

/** A root class that can be used to defined a N-dimeension vector */
export class VectorClass<T extends readonly unknown[]> {
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
 * absolute(0) => '0'
 *
 * absolute(5.5) => '5.5'
 *
 * @see `relative` for relative coordinates (e.g. ~10)
 * @see `local` for local coordinates (e.g. ^10)
 */
export function absolute(coordinate: number): string

/**
 * Transforms numbers into absolute coordinates.
 *
 * @example
 *
 * relative(0, 0, 0) => ['0', '0', '0']
 *
 * relative(0, 180) => ['0', '180']
 *
 * relative(-1, 10, 5) => ['-1', '10', '5']
 *
 * @see `relative` for relative coordinates (e.g. ~10)
 * @see `local` for local coordinates (e.g. ^10)
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
 * relative(0, 0, 0) => ['~', '~', '~']
 *
 * relative(0, 180) => ['~', '~180']
 *
 * relative(-1, 10, 5) => ['~-1', '~10', '~5']
 *
 * @see `absolute` for absolute coordinates (e.g. 10)
 * @see `local` for local coordinates (e.g. ^10)
 */
export function relative<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, string>>

export function relative<T extends Tuple<number>>(...coordinates: T): string | VectorClass<MappedArray<T, string>> {
  if (coordinates.length === 1) {
    return `~${coordinates[0] || ''}`
  }

  return new VectorClass(coordinates.map((coord) => `~${coord || ''}`) as unknown as MappedArray<T, string>)
}

/**
 * Transforms a number into a local coordinate, using the caret notation `^`.
 *
 * @example
 *
 * local(0) => '~'
 *
 * local(5.5) => '^5.5'
 *
 * local(-1) => '^-1'
 *
 * @see `absolute` for absolute coordinates (e.g. 10)
 * @see `relative` for relative coordinates (e.g. ~10)
 */
export function local(coordinate: number): string

/**
 * Transforms numbers into local coordinates, using the tilde notation `^`.
 *
 * First coordinate is leftward, second is upward, third is frontward.
 *
 * @example
 *
 * local(0, 0, 0) => ['^', '^', '^']
 *
 * local(0, 180, 0) => ['^', '^180', '^']
 *
 * local(-1, 10, 5) => ['^-1', '^10', '^5']
 *
 * @see `absolute` for absolute coordinates (e.g. 10)
 * @see `relative` for relative coordinates (e.g. ~10)
 */
export function local<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, string>>

export function local<T extends Tuple<number>>(...coordinates: T): string | VectorClass<MappedArray<T, string>> {
  if (coordinates.length === 1) {
    return `^${coordinates[0] || ''}`
  }

  return new VectorClass(coordinates.map((coord) => `^${coord || ''}`) as unknown as MappedArray<T, string>)
}
