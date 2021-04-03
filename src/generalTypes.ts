/* eslint-disable @typescript-eslint/ban-types */
/**
 * Allows to get autocompletion on string unions, while still allowing generic strings.
 * @see https://github.com/microsoft/TypeScript/issues/29729#issuecomment-700527227
 */
export type LiteralUnion<T extends string> = T | (Omit<string, keyof string> & {
  /**
   * Ignore this property.
   * @deprecated
   * @internal
   * @hidden
   * @ignore
   */
  trimStart: string['trimStart']
});

export type AtLeastOne<T> = [T, ...T[]]

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

export type BASIC_CONFLICT_STRATEGIES = 'throw' | 'replace' | 'ignore' | 'warn'
