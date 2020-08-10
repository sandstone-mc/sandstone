/** A root class that can be used to defined a N-dimeension vector */
class VectorClass {
  protected values: string[]

  constructor(values: string[]) {
    this.values = values
  }

  toString() {
    return this.values.join(' ')
  }

  toJSON() {
    return this.toString()
  }
}

/**
 * A class containing 3 coordinates, that can be absolute, relative or local.
 */
export class CoordinatesClass extends VectorClass {
  constructor(x: string, y: string, z: string) {
    super([x, y, z])
  }

  get x() {
    return this.values[0]
  }

  set x(newValue: string) {
    this.values[0] = newValue
  }

  get y() {
    return this.values[1]
  }

  set y(newValue: string) {
    this.values[1] = newValue
  }

  get z() {
    return this.values[2]
  }

  set z(newValue: string) {
    this.values[2] = newValue
  }
}

export class RotationClass extends VectorClass {
  constructor(horizontal: string, vertical: string) {
    super([horizontal, vertical])
  }

  get horizontal() {
    return this.values[0]
  }

  set horizontal(value: string) {
    this.values[0] = value
  }

  get vertical() {
    return this.values[1]
  }

  set vertical(value: string) {
    this.values[1] = value
  }
}

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
export function absolute<T extends Tuple<number>>(...coordinates: T): MappedArray<T, string>

export function absolute<T extends Tuple<number>>(...coordinates: T): string | MappedArray<T, string> {
  if (coordinates.length === 1) {
    return coordinates[0].toString()
  }

  return coordinates.map(coord => coord.toString()) as unknown as MappedArray<T, string>
}

/**
 * Transforms a number into a relative coordinate, using the tilde notation `~`.
 *
 * @example
 *
 * relative(0) => '~'
 *
 * relative(5.5) => '~5.5'
 *
 * relative(-1) => '~-1'
 *
 * @see `absolute` for absolute coordinates (e.g. 10)
 * @see `local` for local coordinates (e.g. ^10)
 */
export function relative(coordinate: number): string

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
export function relative<T extends Tuple<number>>(...coordinates: T): MappedArray<T, string>

export function relative<T extends Tuple<number>>(...coordinates: T): string | MappedArray<T, string> {
  if (coordinates.length === 1) {
    return `~${coordinates[0] || ''}`
  }

  return coordinates.map((coord) => `~${coord || ''}`) as unknown as MappedArray<T, string>
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
 * @example
 *
 * relative(0, 0, 0) => ['^', '^', '^']
 *
 * relative(0, 180, 0) => ['^', '^180', '^']
 *
 * relative(-1, 10, 5) => ['^-1', '^10', '^5']
 *
 * @see `absolute` for absolute coordinates (e.g. 10)
 * @see `relative` for relative coordinates (e.g. ~10)
 */
export function local<T extends Tuple<number>>(...coordinates: T): MappedArray<T, string>

export function local<T extends Tuple<number>>(...coordinates: T): string | MappedArray<T, string> {
  if (coordinates.length === 1) {
    return `^${coordinates[0] || ''}`
  }

  return coordinates.map((coord) => `^${coord || ''}`) as unknown as MappedArray<T, string>
}
