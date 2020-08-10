type Rotation = {
  value: number,
  type: 'absolute' | 'relative' | 'local'
}

type Coordinate = {
  value: number
  type: 'absolute' | 'relative' | 'local'
}

/** A root class that can be used to defined a N-dimeension vector */
class VectorClass {
  protected values: Coordinate[]

  constructor(values: (Coordinate | number)[]) {
    this.values = values.map((value) => (typeof value === 'number' ? { value, type: 'relative' } : value))
  }

  toString() {
    const signs = {
      absolute: '',
      relative: '~',
      local: '^',
    }

    const results = this.values.map(({ value, type }) => signs[type] + value)

    return results.join(' ')
  }

  toJSON() {
    return this.toString()
  }
}

/**
 * A class containing 3 coordinates, that can be absolute, relative or local.
 */
export class CoordinatesClass extends VectorClass {
  constructor(x: Coordinate | number, y: Coordinate | number, z: Coordinate | number) {
    super([x, y, z])
  }

  get x() {
    return this.values[0]
  }

  set x(newValue: Coordinate) {
    this.values[0] = newValue
  }

  get y() {
    return this.values[1]
  }

  set y(newValue: Coordinate) {
    this.values[1] = newValue
  }

  get z() {
    return this.values[2]
  }

  set z(newValue: Coordinate) {
    this.values[2] = newValue
  }
}

export class RotationClass extends VectorClass {
  constructor(horizontal: Rotation | number, vertical: Rotation | number) {
    super([horizontal, vertical])
  }

  get horizontal() {
    return this.values[0]
  }

  set horizontal(value: Rotation) {
    this.values[0] = value
  }

  get vertical() {
    return this.values[1]
  }

  set vertical(value: Rotation) {
    this.values[1] = value
  }
}

/**
 * Creates a coordinates vector.
 *
 * For each coordinate, you can give either a number or an object.
 * If a number is given, it defaults to relative coordinates.
 * If an object is given, you can specify the type of coordinates.
 *
 * @example
 *
 * Vector`0 0 0` => '0 0 0'
 * Vector(0, { value: 128, type: 'absolute' }, 0) => '~0 128 ~0'
 * Vector({ value: 10, type: 'local' }, 0, { value: 128, type: 'absolute' }) => '^10 ~0 128'
 *
 * @see
 *
 * `Absolute` to create absolute-only coordinates
 *
 * `Relative` to create relative-only coordinates
 *
 * `Local` to create local-only coordinates
 */
export function Vector(template: TemplateStringsArray, ...values: unknown[]): CoordinatesClass & RotationClass


/**
 * Creates a coordinates vector.
 *
 * For each coordinate, you can give either a number or an object.
 * If a number is given, it defaults to relative coordinates.
 * If an object is given, you can specify the type of coordinates.
 *
 * @example
 *
 * Vector(0, 0, 0) => '~0 ~0 ~0'
 * Vector(0, { value: 128, type: 'absolute' }, 0) => '~0 128 ~0'
 * Vector({ value: 10, type: 'local' }, 0, { value: 128, type: 'absolute' }) => '^10 ~0 128'
 *
 * @see
 *
 * `Absolute` to create absolute-only coordinates
 *
 * `Relative` to create relative-only coordinates
 *
 * `Local` to create local-only coordinates
 */
export function Vector(x: Coordinate | number, y: Coordinate | number, z: Coordinate | number): CoordinatesClass

/**
 * Creates a rotation vector.
 *
 * For both horizontal & vertical rotation, you can give either a number or an object.
 * If a number is given, it defaults to relative rotation.
 * If an object is given, you can specify the type of rotation.
 *
 * @example
 *
 * Vector(0, 0) => '~0 ~0'
 * Vector(0, { value: 180, type: 'absolute' }) => '~0 128'
 * Vector({ value: 0, type: 'absolute' }, { value: 90, type: 'absolute' }) => '0 90'
 *
 * @see
 *
 * `Absolute` to create absolute-only rotation
 *
 * `Relative` to create relative-only rotation
 */
export function Vector(horizontal: Rotation | number, vertical: Rotation | number): RotationClass
export function Vector(...args: [(Coordinate | Rotation | number), (Coordinate | Rotation | number), (Coordinate | number)?] | [TemplateStringsArray, ...unknown[]]) {
  if (!Array.isArray(args[0])) {
    const [first, second, third] = args as [(Coordinate | Rotation | number), (Coordinate | Rotation | number), (Coordinate | number)?]

    if (third !== undefined) {
      return new CoordinatesClass(first, second, third)
    }
    return new RotationClass(first, second)
  }

  const [strings, ...values] = args as [TemplateStringsArray, ...unknown[]]

  let result = ''
  strings.forEach((string, i) => {
      if(values[i]) {
        result += string + values[i]
      }
  })

  result.trim().split(/ +/).map((valueAsString) => {
    let type = 'absolute'
    let value: number

    if (valueAsString.match(/\~\d*/)) {
      type = 'relative'
      value = parseInt(valueAsString.substr(1), 10)
    }
    else if (valueAsString.match(/\^\d*/)) {
      type = 'local'
      value = parseInt(valueAsString.substr(1), 10)
    }

  })
}

type TwoOrThreeTuple<T> = [T, T] | [T, T, T]

function createSingleTypeVector(type: string, args: TwoOrThreeTuple<number>) {
  const parsedValues = args.map(value => ({type, value}))

  const [first, second, third] = args
  if (third !== undefined) {
    return Vector(first, second, third)
  }

  return Vector(first, second)
}

/**
 * Creates absolute coordinates.
 *
 * @example
 *
 * Absolute(0, 128, 0) => '0 128 0'
 */
export function Absolute(x: number, y: number, z: number): CoordinatesClass
/**
 * Creates absolute rotation.
 *
 * @example
 *
 * Absolute(90, -180) => '90 -180'
 */
export function Absolute(horizontal: number, vertical: number): RotationClass
export function Absolute(...args: TwoOrThreeTuple<number>) {
  return createSingleTypeVector('absolute', args)
}

/**
 * Creates relative coordinates, using the tilde notation.
 *
 * @example
 *
 * Relative(0, 10, 0) => '~0 ~10 ~0'
 */
export function Relative(x: number, y: number, z: number): CoordinatesClass

/**
 * Creates relative rotation, using the tilde notation.
 *
 * @example
 *
 * Relative(-90, 180) => '~-90 ~180'
 */
export function Relative(horizontal: number, y: number): RotationClass

export function Relative(...args: TwoOrThreeTuple<number>) {
  return createSingleTypeVector('relative', args)
}


/**
 * Creates local coordinates, using the caret notation.
 *
 * @example
 *
 * Local(0, 10, 0) => '^0 ^10 ^0'
 */
export function Local(leftward: number, upward: number, frontward: number) {
  return createSingleTypeVector('local', [leftward, upward, frontward])
}
