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
