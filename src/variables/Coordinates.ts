import type { NBTSerializable } from 'sandstone/arguments'
import { AllowConst, BuildTuple } from 'sandstone/utils'
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
    return `'${this.toString()}'`
  }

  [Symbol.iterator](): Iterator<T[0]> {
    return this.values[Symbol.iterator]()
  }

  static subtractedFrom<V extends string[]>(
    a: VectorClass<V>,
    b: VectorClass<string[]> | string[]
  ) {
    if (b instanceof VectorClass ? b.values.length > a.values.length : b.length > a.values.length) {
      throw new Error('[VectorClass#subtractedFrom] Attempted to subtract with in-balanced components')
    }
    const bComponents = b instanceof VectorClass ? b.values : b

    const components: string[] = []
    
    for (const [_i, component] of Object.entries(a.values)) {
      const i = Number(_i)
      if (bComponents[i] === undefined) {
        components.push(component)
        continue
      }
      if (component.startsWith('~')) {
        if (bComponents[i].startsWith('~')) {
          components.push(
            component.slice(1) === '' ? `~${Number(bComponents[i].slice(1)) * -1}` : `~${Number(component.slice(1)) - Number(bComponents[i].slice(1))}`
          )
          continue
        }
        throw new Error(`[VectorClass#subtractedFrom] Attempted to subtract ${bComponents[i]} from ${component} (a[${i}]). Incompatible plane.`)
      }
      if (component.startsWith('^')) {
        if (bComponents[i].startsWith('^')) {
          components.push(
            component.slice(1) === '' ? `^${Number(bComponents[i].slice(1)) * -1}` : `^${Number(component.slice(1)) - Number(bComponents[i].slice(1))}`
          )
          continue
        }
        throw new Error(`[VectorClass#subtractedFrom] Attempted to subtract ${bComponents[i]} from ${component} (a[${i}]). Incompatible plane.`)
      }
      if (bComponents[i].startsWith('~') || bComponents[i].startsWith('^')) {
        throw new Error(`[VectorClass#subtractedFrom] Attempted to subtract ${bComponents[i]} from ${component} (a[${i}]). Incompatible plane.`)
      }
      components.push(
        `${Number(component) - Number(bComponents[i])}`
      )
    }
    return new VectorClass([...components] as const) as VectorClass<BuildTuple<string, V['length']>>
  }

  static addedTo<V extends string[]>(
    a: VectorClass<V>,
    b: VectorClass<string[]> | string[]
  ) {
    if (b instanceof VectorClass ? b.values.length > a.values.length : b.length > a.values.length) {
      throw new Error('[VectorClass#addedTo] Attempted to add with in-balanced components')
    }
    const bComponents = b instanceof VectorClass ? b.values : b

    const components: string[] = []
    
    for (const [_i, component] of Object.entries(a.values)) {
      const i = Number(_i)
      if (bComponents[i] === undefined) {
        components.push(component)
        continue
      }
      if (component.startsWith('~')) {
        if (bComponents[i].startsWith('~')) {
          components.push(
            component.slice(1) === '' ? bComponents[i] : `~${Number(component.slice(1)) + Number(bComponents[0].slice(1))}`
          )
          continue
        }
        throw new Error(`[VectorClass#addedTo] Attempted to add ${bComponents[i]} to ${component} (a[${i}]). Incompatible plane.`)
      }
      if (component.startsWith('^')) {
        if (bComponents[i].startsWith('^')) {
          components.push(
            component.slice(1) === '' ? bComponents[i] : `^${Number(component.slice(1)) + Number(bComponents[0].slice(1))}`
          )
          continue
        }
        throw new Error(`[VectorClass#addedTo] Attempted to add ${bComponents[i]} to ${component} (a[${i}]). Incompatible plane.`)
      }
      if (bComponents[i].startsWith('~') || bComponents[i].startsWith('^')) {
        throw new Error(`[VectorClass#addedTo] Attempted to add ${bComponents[i]} to ${component} (a[${i}]). Incompatible plane.`)
      }
      components.push(
        `${Number(component) + Number(bComponents)}`
      )
    }
    return new VectorClass([...components] as const) as VectorClass<BuildTuple<string, V['length']>>
  }

  static multipliedBy<V extends string[]>(
    a: VectorClass<V>,
    b: VectorClass<string[]> | string[]
  ) {
    if (b instanceof VectorClass ? b.values.length > a.values.length : b.length > a.values.length) {
      throw new Error('[VectorClass#addedTo] Attempted to add with in-balanced components')
    }
    const bComponents = b instanceof VectorClass ? b.values : b

    const components: string[] = []
    
    for (const [_i, component] of Object.entries(a.values)) {
      const i = Number(_i)
      if (bComponents[i] === undefined) {
        components.push(component)
        continue
      }
      if (component.startsWith('~')) {
        if (bComponents[i].startsWith('~')) {
          components.push(
            component.slice(1) === '' ? bComponents[i] : `~${Number(component.slice(1)) * Number(bComponents[0].slice(1))}`
          )
          continue
        }
        throw new Error(`[VectorClass#addedTo] Attempted to multiply ${component} (a[${i}]) by ${bComponents[i]}. Incompatible plane.`)
      }
      if (component.startsWith('^')) {
        if (bComponents[i].startsWith('^')) {
          components.push(
            component.slice(1) === '' ? bComponents[i] : `^${Number(component.slice(1)) * Number(bComponents[0].slice(1))}`
          )
          continue
        }
        throw new Error(`[VectorClass#addedTo] Attempted to multiply ${component} (a[${i}]) by ${bComponents[i]}. Incompatible plane.`)
      }
      if (bComponents[i].startsWith('~') || bComponents[i].startsWith('^')) {
        throw new Error(`[VectorClass#addedTo] Attempted to multiply ${component} (a[${i}]) by ${bComponents[i]}. Incompatible plane.`)
      }
      components.push(
        `${Number(component) * Number(bComponents)}`
      )
    }
    return new VectorClass([...components] as const) as VectorClass<BuildTuple<string, V['length']>>
  }

  static dividedBy<V extends string[]>(
    a: VectorClass<V>,
    b: VectorClass<string[]> | string[]
  ) {
    if (b instanceof VectorClass ? b.values.length > a.values.length : b.length > a.values.length) {
      throw new Error('[VectorClass#addedTo] Attempted to add with in-balanced components')
    }
    const bComponents = b instanceof VectorClass ? b.values : b

    const components: string[] = []
    
    for (const [_i, component] of Object.entries(a.values)) {
      const i = Number(_i)
      if (bComponents[i] === undefined) {
        components.push(component)
        continue
      }
      if (component.startsWith('~')) {
        if (bComponents[i].startsWith('~')) {
          components.push(
            component.slice(1) === '' ? bComponents[i] : `~${Number(component.slice(1)) / Number(bComponents[0].slice(1))}`
          )
          continue
        }
        throw new Error(`[VectorClass#addedTo] Attempted to divide ${component} (a[${i}]) by ${bComponents[i]}. Incompatible plane.`)
      }
      if (component.startsWith('^')) {
        if (bComponents[i].startsWith('^')) {
          components.push(
            component.slice(1) === '' ? bComponents[i] : `^${Number(component.slice(1)) / Number(bComponents[0].slice(1))}`
          )
          continue
        }
        throw new Error(`[VectorClass#addedTo] Attempted to divide ${component} (a[${i}]) by ${bComponents[i]}. Incompatible plane.`)
      }
      if (bComponents[i].startsWith('~') || bComponents[i].startsWith('^')) {
        throw new Error(`[VectorClass#addedTo] Attempted to divide ${component} (a[${i}]) by ${bComponents[i]}. Incompatible plane.`)
      }
      components.push(
        `${Number(component) / Number(bComponents)}`
      )
    }
    return new VectorClass([...components] as const) as VectorClass<BuildTuple<string, V['length']>>
  }

  /**
   * Convert absolute base coordinates to relative coordinates using an absolute anchor as the origin.
   * 
   * (subtracts an absolute vector (anchor) from another absolute vector (base) and returns the result in relative (~))
   */
  static relativeTo<V extends string[]>(
    base: VectorClass<V>,
    anchor: AllowConst<BuildTuple<number, V['length']>> | VectorClass<BuildTuple<`${number}`, V['length']>>
  ) {
    if (base.values.find((component) => component.startsWith('~') || component.startsWith('^')) !== undefined) {
       throw new Error('[VectorClass#relativeTo] Attempted use on non-absolute coordinates')
    }
    const anchorIsArray = Array.isArray(anchor)
    if (
      !anchorIsArray
      && ((anchor as VectorClass<BuildTuple<`${number}`, V['length']>>).values as Array<string>)
        .find((component: string) => component.startsWith('~') || component.startsWith('^')) !== undefined
    ) {
      throw new Error('[VectorClass#relativeTo] Attempted use with a non-absolute anchor')
    }

    const newVector = base.values.map((component, i) => {
      const baseN = Number(component)
      const anchorN = Number(anchorIsArray ? 
        (anchor as number[])[i]
        : ((anchor as VectorClass<BuildTuple<`${number}`, V['length']>>).values as Array<string>)[i]
      )

      return baseN - anchorN
    })

    return relative(newVector[0], ...newVector.slice(1)) as VectorClass<BuildTuple<`~${number}` | '~', V['length']>>
  }

  /**
   * Convert relative base coordinates into absolute coordinates using an absolute origin.
   * 
   * (adds a relative (~) vector (base) to an absolute vector (origin) and returns the result in absolute)
   */
  static fromRelative<V extends string[]> (
    base: VectorClass<V>,
    origin: AllowConst<BuildTuple<number, V['length']>> | VectorClass<BuildTuple<`${number}`, V['length']>>,
  ) {
    if (base.values.filter((component) => component.startsWith('~')).length !== base.values.length) {
       throw new Error('[VectorClass#fromRelative] Attempted use on non-relative coordinates')
    }
    const originIsArray = Array.isArray(origin) 
    if (
      !originIsArray
      && ((origin as VectorClass<BuildTuple<`${number}`, V['length']>>).values as Array<string>)
        .find((component: string) => component.startsWith('~') || component.startsWith('^')) !== undefined
    ) {
      throw new Error('[VectorClass#fromRelative] Attempted use with a non-absolute origin')
    }

    const newVector = base.values.map((component, i) => {
      const baseN = Number(component)
      const originN = Number(originIsArray ? 
        (origin as number[])[i]
        : ((origin as VectorClass<BuildTuple<`${number}`, V['length']>>).values as Array<string>)[i]
      )

      return originN + baseN
    })

    return absolute(newVector[0], ...newVector.slice(1)) as VectorClass<BuildTuple<`${number}`, V['length']>>
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
export function absolute<T extends number>(coordinate?: T): `${T}`

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
export function absolute<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, `${number}`>>

export function absolute<T extends Tuple<number>>(...coordinates: T): `${T[0]}`| VectorClass<MappedArray<T, `${number}`>> {
  if (coordinates.length === 1) {
    return coordinates[0].toString() as `${T[0]}`
  }

  return new VectorClass(coordinates.map((coord) => coord.toString()) as unknown as MappedArray<T, `${number}`>)
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
export function relative<T extends number>(coordinate: T): `~${T}`

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
export function relative<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, `~${number | ''}`>>

export function relative<T extends Tuple<number>>(...coordinates: T): '~' | `~${T[0]}`| VectorClass<MappedArray<T, `~${number | ''}`>> {
  if (coordinates.length === 0) {
    return new VectorClass(['~', '~', '~'] as unknown as MappedArray<T, `~${number | ''}`>)
  }

  if (coordinates.length === 1) {
    return `~${coordinates[0]}` as `~${T[0]}`
  }

  return new VectorClass(coordinates.map((coord) => `~${coord || ''}`) as unknown as MappedArray<T, `~${number | ''}`>)
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
export function local<T extends number>(coordinate: T): `^${T}`

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
export function local<T extends Tuple<number>>(...coordinates: T): VectorClass<MappedArray<T, `^${number | ''}`>>

export function local<T extends Tuple<number>>(...coordinates: T): `^${T[0]}` | VectorClass<MappedArray<T, `^${number | ''}`>> {
  if (coordinates.length === 0) {
    return new VectorClass(['^', '^', '^'] as unknown as MappedArray<T, '^'>)
  }

  if (coordinates.length === 1) {
    return `^${coordinates[0]}` as `^${T[0]}`
  }

  return new VectorClass(coordinates.map((coord) => `^${coord || ''}`) as unknown as MappedArray<T, `^${number | ''}`>)
}
