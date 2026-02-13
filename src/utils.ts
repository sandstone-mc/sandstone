/* eslint-disable operator-linebreak */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { Static } from '@sinclair/typebox'
import { FormatRegistry, Type } from '@sinclair/typebox'
import fs from 'fs-extra'
import type FetchType from 'node-fetch'
import type { Response } from 'node-fetch'
import { coerce } from 'semver'
import * as util from 'util'
import type { MultipleEntitiesArgument } from './arguments/selector'
import type { Node } from './core/nodes'
import type { UUIDinNumber } from './variables/UUID'

/* @ts-ignore */
export const fetch: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response> = Object.hasOwn(
  globalThis,
  'fetch',
)
  ? globalThis.fetch
  : async (...args: Parameters<typeof FetchType>) =>
    (await import('node-fetch')).default(...args) as unknown as Promise<Response>

/**
 * Allows to get autocompletion on string unions, while still allowing generic strings.
 * @see https://github.com/microsoft/TypeScript/issues/29729#issuecomment-700527227
 */
export type LiteralUnion<T extends string> = T | (`${any}${string}` & Record<never, never>)

export type NamespacedLiteralUnion<T extends string> = T | (`${string}:${string}` & Record<never, never>)

export type AtLeastOne<T> = [T, ...T[]]

// biome-ignore lint/complexity/noBannedTypes: It can take any function, including constructors.
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

export type BASIC_CONFLICT_STRATEGIES = 'throw' | 'replace' | 'warn' | 'rename' | 'ignore'

export type OmitFirst<T extends unknown[]> = T extends [infer _, ...infer B] ? B : []

export type InstanceOfClass<X extends abstract new (...args: any[]) => any> = new (
  ..._args: [...one: ConstructorParameters<X>, ...two: any[]]
) => InstanceType<X>

export function isAsyncFunction(
  func: ((...args: any[]) => void) | ((...args: any[]) => Promise<void>),
): func is (...args: any[]) => Promise<void> {
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
    (
      string.match(/^async /) ||
      // babel (this may change, but hey...)
      string.match(/return _ref[^.]*\.apply/)
    )
  )
}

export function isPromise(promise: any): promise is Promise<unknown> {
  return promise && typeof promise.then === 'function' && promise[Symbol.toStringTag] === 'Promise'
}

export type Either<A extends Record<string, any>, B extends Record<string, any>> = (
  | {
      [K in keyof A | keyof B]?: K extends keyof A ? A[K] : never
    }
  | {
      [K in keyof A | keyof B]?: K extends keyof B ? B[K] : never
    }
)

export type WithMCNamespace<T extends string> = `minecraft:${T}` | T

export function makeCallableProxy(func: any, object: any) {
  return new Proxy(func, {
    get: (_t, p, _r) => object[p],
    set: (_t, p, value, _r) => {
      object[p] = value
      return value
    },
    getPrototypeOf: (_t) => Object.getPrototypeOf(object),
  }) as any
}

export interface CallableInstance {
  __call__: (...args: any[]) => any
}
type CallableClass = new (...args: any[]) => CallableInstance

export function makeClassCallable<C extends CallableClass>(Class_: C): MakeClassCallable<C> {
  return new Proxy(Class_, {
    construct: (_t, argArray, _nt) => {
      const obj = new Class_(...argArray)
      const result = makeCallableProxy(obj.__call__, obj)
      // TODO: Figure this out

      // result.makeCallable(result)
      return result
    },
  }) as any
}

export type MakeInstanceCallable<T extends CallableInstance> = T & T['__call__']
export type MakeClassCallable<T extends CallableClass> = new (
  ...args: ConstructorParameters<T>
) => MakeInstanceCallable<InstanceType<T>>

export function makeCallable<T, F extends (...args: any[]) => any>(object: T, func: F, useProxy = false): T & F {
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

type TupleSplit<T, N extends number, O extends readonly any[] = readonly []> = O['length'] extends N
  ? [O, T]
  : T extends readonly [infer F, ...infer R]
    ? TupleSplit<readonly [...R], N, readonly [...O, F]>
    : [O, T]

type TakeFirst<T extends readonly any[], N extends number> = TupleSplit<T, N>[0]

type SkipFirst<T extends readonly any[], N extends number> = TupleSplit<T, N>[1]

type TupleSlice<T extends readonly any[], S extends number, E extends number> = SkipFirst<TakeFirst<T, E>, S>

export type SlicedArguments<
  T extends (...args: any[]) => any,
  FROM extends number | undefined = undefined,
  TO extends number | undefined = undefined,
> = TupleSlice<Parameters<T>, FROM extends undefined ? 0 : FROM, TO extends undefined ? Parameters<T>['length'] : TO>

export type PartialFunction<
  T extends (...args: any[]) => any,
  FROM extends number | undefined = undefined,
  TO extends number | undefined = undefined,
> = (...args: SlicedArguments<T, FROM, TO>) => ReturnType<T>

export function toMinecraftResourceName(path: readonly string[], typeNested: number = 1): `${string}:${string}` {
  const [namespace, ...folders] = path

  folders.splice(0, typeNested)

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

type InputObject<ValueType extends any | NonNullable<any>, Input extends Record<string, ValueType>> = Input

/** Returns a modified object with only entries that are not undefined. If the input is undefined, {} is returned instead. */
export function add<Value extends any | NonNullable<any>, Input extends InputObject<Value, Record<string, Value>>>(
  object: Input | undefined,
): InputObject<NonNullable<any>, Input> {
  if (object === undefined) {
    return {} as InputObject<NonNullable<any>, Input>
  }
  const output: any = {}
  for (const [key, value] of (object as { [key: string]: any }).entries()) {
    if (value !== undefined) {
      output[key] = value
    }
  }

  return output
}

export type RemoveArrayRepeats<T extends readonly any[]> = {
  [K in keyof T]: T[number] extends { [P in keyof T]: P extends K ? never : T[P] }[number] ? never : T[K]
}

export function iterateEntries(node: Map<string, any>, fn: (val: any) => any) {
  const newNode: Record<string, any> = {}
  node.forEach(([key, val]) => {
    newNode[key] = fn(val)
  })
  return newNode
}

export interface PackEntry {
  added: number
  downloads: { [key: string]: number }
  updated: number
  owner: string
}

FormatRegistry.Set('semver', (v) => coerce(v) != null)

export const supportedMinecraftVersions = ['1.18', '1.18.1', '1.18.2', '1.19']
export const latestMinecraftVersion = '1.19'

export const MinecraftVersionSchema = Type.Union(supportedMinecraftVersions.map((v) => Type.Literal(v)))

export const packCategories = [
  'Extensive',
  'Lightweight',
  'QoL',
  'Vanilla+',
  'Tech',
  'Magic',
  'Library',
  'Exploration',
  'World Overhaul',
  'No Resource Pack',
]

const PackDependencySchema = Type.Object({
  id: Type.String(),
  version: Type.String(),
})

export const PackVersionSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  downloads: Type.Object({
    datapack: Type.String({ minLength: 1 }),
    resourcepack: Type.String(),
  }),
  supports: Type.Array(MinecraftVersionSchema, { minItems: 1 }),
  dependencies: Type.Array(PackDependencySchema),
})

export const PackDataSchema = Type.Object({
  id: Type.String({ minLength: 3 }),
  display: Type.Object({
    name: Type.String({ minLength: 3 }),
    description: Type.String({ minLength: 3 }),
    icon: Type.String({ default: '' }),
    hidden: Type.Boolean({ default: false }),
    webPage: Type.Optional(Type.String()),
  }),
  versions: Type.Array(PackVersionSchema, { minItems: 1 }),
  categories: Type.Array(Type.Union(packCategories.map((c) => Type.Literal(c)))),
})

export const MetaDataSchema = Type.Object({
  docId: Type.String(),
  rawId: Type.String(),
  stats: Type.Object({
    updated: Type.Optional(Type.Number()),
    added: Type.Number(),
    downloads: Type.Object({
      total: Type.Number(),
      today: Type.Number(),
    }),
  }),
  owner: Type.String(),
  contributors: Type.Array(Type.String(), { default: [] }),
})

export type PackMetaData = Static<typeof MetaDataSchema>
export type MinecraftVersion = Static<typeof MinecraftVersionSchema>
export type PackDependency = Static<typeof PackDependencySchema>
export type PackVersion = Static<typeof PackVersionSchema>
export type PackData = Static<typeof PackDataSchema>

export interface UserData {
  displayName: string
}

// eslint-disable-next-line no-shadow
export enum HTTPResponses {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

export type ReviewState = 'verified' | 'pending' | 'unsubmitted' | 'rejected'

export async function safeWrite(...args: Partial<Parameters<(typeof fs)['writeFile']>>) {
  if (typeof args[0] !== 'string') throw new Error('unimplemented')

  await fs.ensureDir(args[0].replace(/(?:\/|\\)(?:.(?!(?:\/|\\)))+$/, ''))

  return fs.writeFile(...(args as Parameters<(typeof fs)['writeFile']>))
}

export function sanitizeTarget(target: MultipleEntitiesArgument<false>) {
  return `${target}`.toLowerCase().replaceAll(/-|=|\[|\]|\{|\}|:|"|'|,|@/g, '_')
}

/**
 * Formats a debug string for a class instance, including its arguments and body.
 * Must be called from the [util.inspect.custom] method.
 *
 * @param className The name of the class.
 * @param args The arguments passed to the class instance. It can be an array or an object.
 * @param body The body of the class instance, typically an array of nodes.
 * @param currentIndent The current indentation level.
 */
export function formatDebugString(
  className: string,
  args: undefined | any[] | Record<string, any> | string,
  body: Node[] | undefined,
  currentIndent: string | undefined,
) {
  const FIXED_INDENT = '  '
  const indent = currentIndent || ''
  const nextIndent = indent + FIXED_INDENT
  const options = { indent: nextIndent } as any

  let argsString
  if (typeof args === 'string') {
    argsString = args
  } else if (Array.isArray(args)) {
    argsString = args.map((arg) => util.inspect(arg, options)).join(', ')
  } else if (args && typeof args === 'object') {
    argsString = Object.entries(args)
      .map(([key, value]) => `${key}: ${util.inspect(value, options)}`)
      .join(', ')
  } else {
    argsString = ''
  }

  const bodyString =
    typeof body === 'undefined'
      ? ''
      : body
        .map((node) => {
          return util.inspect(node, options)
        })
        .join(`\n${nextIndent}`)

  const rainbowBracketColors = [
    'yellow',
    'green',
    'cyan',
    'blue',
    'magenta',
    'redBright',
    'yellowBright',
    'greenBright',
    'cyanBright',
    'blueBright',
    'magentaBright',
  ] as const
  const bracketColor = rainbowBracketColors[(indent.length / FIXED_INDENT.length) % rainbowBracketColors.length]

  const realArgsString = argsString.length === 0 ? '' : `(${argsString})`
  const realBodyString =
    bodyString.length === 0
      ? ''
      : ` ${util.styleText(bracketColor, '{')}\n${nextIndent}${bodyString}\n${indent}${util.styleText(bracketColor, '}')}`

  const classNameString = (util as any).styleText('green', className)

  return `${classNameString}${realArgsString}${realBodyString}`
}

export type AllKeys<T> = T extends T ? keyof T : never

type GetConstructorArgs<T> = T extends new (...args: infer U) => any ? U : never
export class Set<T> extends global.Set<T> {
  // oxlint-disable-next-line
  constructor(...args: GetConstructorArgs<typeof global.Set<T>>) {
    super(...args)
  }

  has(value: unknown) {
    return super.has(value as any)
  }
}

export type SetType<T> = T extends Set<infer U> ? U : never

type TestMembers<T, TestDispatcher> = {
  [K in keyof T]: TestDispatcher[K extends keyof TestDispatcher ? K : never]
}

type NegatedMembers<T> = {
  [K in keyof T as `!${Extract<K, string>}`]?: Record<string, never>
}

export type MemberModifiers<T> = Partial<T> & NegatedMembers<T>

type UnknownKey<UnknownValue> = {
  [K in `${string}:${string}`]?: UnknownValue
}

type UnknownNegatableKey<UnknownValue> = ({
  [K in `!${string}:${string}`]?: Record<string, never>
} & {
  [K in `${string}:${string}`]?: UnknownValue | Record<string, never>
})

type McdocIDMapBase<Dispatcher, UnknownValue> = Dispatcher & UnknownKey<UnknownValue>

/**
 * A mapping of dispatcher IDs to their corresponding value types.
 * 
 * Also supports unknown namespaced IDs.
 * 
 * Must specify at least one key.
 * 
 * ----
 * 
 * Disclaimers:
 * - Do not reference an ID multiple times. Multiple keys for the same ID (e.g. `acacia_button` and `minecraft:acacia_button`) will not cause a Typescript error due to limitations, but will cause an error in-game.
 * - Unknown IDs will not satisfy the Typed requirement of specifying at least one key, so either a known key must be also specified or `as any` must be placed at the end of the object.
 */
export type McdocIDMap<Dispatcher, UnknownValue> = Partial<McdocIDMapBase<Dispatcher, UnknownValue>> & {
  [K in keyof Dispatcher]-?: Record<K, McdocIDMapBase<Dispatcher, UnknownValue>[K]>
}[keyof Dispatcher]

type McdocIDTestMapBase<Dispatcher, TestDispatcher, UnknownValue> = TestMembers<Dispatcher, TestDispatcher> & UnknownKey<UnknownValue>

/**
 * A mapping of dispatcher IDs to their corresponding value types.
 * 
 * Also supports unknown namespaced IDs.
 * 
 * Must specify at least one key.
 * 
 * ----
 * 
 * Disclaimers:
 * - Do not reference an ID multiple times. Multiple keys for the same ID (e.g. `acacia_button` and `minecraft:acacia_button`) will not cause a Typescript error due to limitations, but will cause an error in-game.
 * - Unknown IDs will not satisfy the Typed requirement of specifying at least one key, so either a known key must be also specified or `as any` must be placed at the end of the object.
 */
export type McdocIDTestMap<Dispatcher, TestDispatcher, UnknownValue> = Partial<McdocIDTestMapBase<Dispatcher, TestDispatcher, UnknownValue>> & {
  [K in keyof TestMembers<Dispatcher, TestDispatcher>]-?: Record<K, McdocIDTestMapBase<Dispatcher, TestDispatcher, UnknownValue>[K]>
}[keyof TestMembers<Dispatcher, TestDispatcher>]

type McdocNegatableIDMapBase<Dispatcher, UnknownValue> = MemberModifiers<Dispatcher> & UnknownNegatableKey<UnknownValue>

/**
 * A mapping of dispatcher IDs to their corresponding value types, with support for negated keys that equal an empty object.
 * 
 * Also supports unknown namespaced IDs and negated unknown namespaced IDs.
 * 
 * Must specify at least one key.
 * 
 * ----
 * 
 * Disclaimers:
 * - Do not reference an ID multiple times. Multiple keys for the same ID (e.g. `acacia_button` and `minecraft:acacia_button` and `!acacia_button`) will not cause a Typescript error due to limitations, but will cause an error in-game.
 * - Unknown IDs will not satisfy the Typed requirement of specifying at least one key, so either a known key must be also specified or `as any` must be placed at the end of the object.
 * - The object type will allow non-negated Unknown IDs specified to an empty object, this is due to a types limitation, but will cause an error in-game.
 */
export type McdocNegatableIDMap<Dispatcher, UnknownValue> = Partial<McdocNegatableIDMapBase<Dispatcher, UnknownValue>> & {
  [K in keyof MemberModifiers<Dispatcher>]-?: Record<K, McdocNegatableIDMapBase<Dispatcher, UnknownValue>[K]>
}[keyof MemberModifiers<Dispatcher>]
