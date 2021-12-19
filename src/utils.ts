import * as util from 'util'

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
