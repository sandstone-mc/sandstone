import * as util from 'util'

import type { UUIDinNumber } from './variables/UUID'

/**
 * Allows to get autocompletion on string unions, while still allowing generic strings.
 * @see https://github.com/microsoft/TypeScript/issues/29729#issuecomment-700527227
 */
export type LiteralUnion<T extends string> = T | string & Record<never, never>

export type AtLeastOne<T> = [T, ...T[]]

// eslint-disable-next-line @typescript-eslint/ban-types
export type HideFunctionProperties<T extends Function> = T & {
    /** @deprecated */
    call: T['call']
    /** @deprecated */
    apply: T['apply']
    /** @deprecated */
    bind: T['bind']
    /** @deprecated */
    prototype: T['prototype']
    /** @deprecated */
    length: T['length']
    /** @deprecated */
    arguments: T['arguments']
    /** @deprecated */
    caller: T['caller']
    /** @deprecated */
    readonly name: T['name']
    /** @deprecated */
    [Symbol.hasInstance]: (value: unknown) => boolean
  }

export type BASIC_CONFLICT_STRATEGIES = 'throw' | 'replace' | 'warn' | 'rename'

export type OmitFirst<T extends unknown[]> = (
    T extends [infer A, ...infer B] ? B : []
  )

export type InstanceOfClass<X extends (abstract new (...args: any[]) => any)> = (
    (new (..._args: [...one: ConstructorParameters<X>, ...two: any[]]) => InstanceType<X>)
  )

export function isAsyncFunction(func: ((...args: any[]) => void) | ((...args: any[]) => Promise<void>)): func is (...args: any[]) => Promise<void> {
  if (util.types) {
    // We are in NodeJS, so we can use the builtin check
    return util.types.isAsyncFunction(func)
  }

  /*
   * We might be in a browser, or another weird environment
   * Try a native way first.
   */
  if (func.constructor.name === 'AsyncFunction') {
    return true
  }

  // Okay, we need a stronger check.
  const string = func.toString().trim()

  return !!(
    // native
    string.match(/^async /)
    // babel (this may change, but hey...)
    || string.match(/return _ref[^.]*\.apply/)
  )
}

export function isPromise(promise: any): promise is Promise<unknown> {
  return promise && typeof promise.then === 'function' && promise[Symbol.toStringTag] === 'Promise'
}

export type Either<A extends Record<string, any>, B extends Record<string, any>> = {
  [K in (keyof A | keyof B)]?: K extends keyof A ? A[K] : never
} | {
    [K in (keyof A | keyof B)]?: K extends keyof B ? B[K] : never
  }

export type WithMCNamespace<T extends string> = `minecraft:${T}` | T

function makeCallableProxy(func: any, object: any) {
  return new Proxy(func, {
    get: (target, p, receiver) => object[p],
    set: (target, p, value, receiver) => {
      object[p] = value
      return value
    },
    getPrototypeOf: (target) => Object.getPrototypeOf(object),
  }) as any
}

export interface CallableInstance {
  __call__: (...args: any[]) => any
}
type CallableClass = new(...args: any[]) => CallableInstance

export function makeClassCallable<C extends CallableClass>(Class_: C): MakeClassCallable<C> {
  return new Proxy(Class_, {
    construct: (target, argArray, newTarget) => {
      const obj = new Class_(...argArray)
      const result = makeCallableProxy(obj.__call__, obj)
      result.makeCallable(result)
      return result
    },
  }) as any
}

export type MakeInstanceCallable<T extends CallableInstance> = T & T['__call__']
export type MakeClassCallable<T extends CallableClass> = new (...args: ConstructorParameters<T>) => MakeInstanceCallable<InstanceType<T>>

export function makeCallable<T, F extends((...args: any[]) => any)>(object: T, func: F, useProxy = false): T & F {
  if (useProxy) {
    return makeCallableProxy(func, object)
  }

  const { name, ...objectExceptName } = object as T & { name?: unknown }

  // Everything can be assigned except the name
  const result = Object.assign(func, objectExceptName as unknown as T)

  if (name !== undefined) {
    const descriptor = Object.getOwnPropertyDescriptor(func, 'name')!
    descriptor.value = name
    Object.defineProperty(func, 'name', descriptor)
  }

  return result
}

type TupleSplit<T, N extends number, O extends readonly any[] = readonly []> =
    O['length'] extends N ? [O, T] : T extends readonly [infer F, ...infer R] ?
    TupleSplit<readonly [...R], N, readonly [...O, F]> : [O, T]

type TakeFirst<T extends readonly any[], N extends number> =
    TupleSplit<T, N>[0];

type SkipFirst<T extends readonly any[], N extends number> =
    TupleSplit<T, N>[1];

type TupleSlice<T extends readonly any[], S extends number, E extends number> =
  SkipFirst<TakeFirst<T, E>, S>

export type SlicedArguments<
  T extends (...args: any[]) => any,
  FROM extends number | undefined = undefined,
  TO extends number | undefined = undefined,
> = (
  TupleSlice<Parameters<T>, FROM extends undefined ? 0 : FROM, TO extends undefined ? Parameters<T>['length'] : TO>
)

export type PartialFunction<
  T extends (...args: any[]) => any,
  FROM extends number | undefined = undefined,
  TO extends number | undefined = undefined,
> = (...args: SlicedArguments<T, FROM, TO>) => ReturnType<T>

export function toMinecraftResourceName(path: readonly string[], typeNested: number = 1): string {
  const [namespace, ...folders] = path

  folders.splice(1, typeNested)

  return `${namespace}:${folders.join('/')}`
}

/* Ported from https://github.com/AjaxGb/mc-uuid-converter/blob/master/convert.js */
const uuidBytes = new Uint8Array(16)
const uuid = new DataView(uuidBytes.buffer)

export function randomUUID() {
  crypto.getRandomValues(uuidBytes)

  // Set version to 4 (random)
  // eslint-disable-next-line no-bitwise
  uuidBytes[6] = (uuidBytes[6] & 0x0f) | (4 << 4)
  // Set variant to 1 (Leach–Salz)
  // eslint-disable-next-line no-bitwise
  uuidBytes[8] = (uuidBytes[8] & 0x3f) | 0x80

  const array: number[] = []
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 4; i++) {
    array.push(uuid.getInt32(i * 4, false))
  }

  return array as UUIDinNumber
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
