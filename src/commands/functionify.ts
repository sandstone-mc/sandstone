/**
 * Create an object with the same properties as the base and has the call signature provided
 * @param base The object to be used as the base
 * @param callback The call signature to be added
 * @param excludeKeys The keys to not be copied over to the callback
 */
export function functionify<BASE, CALLBACK extends (...args: any) => any>(base: BASE, callback: CALLBACK, excludeKeys: string[] = []) {
  const toBeExcluded = new Set([
    ...excludeKeys,
    ...Object.getOwnPropertyNames(callback),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(callback))
  ])

  const keys = [
    ...Object.getOwnPropertyNames(base),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(base))
  ].filter(v => !toBeExcluded.has(v))
  for (const key of keys) {
    (callback as any)[key] = (base as any)[key]
  }
  return callback as BASE & CALLBACK
}
