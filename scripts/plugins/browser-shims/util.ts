// Shim for util module

export function inspect(obj: unknown, _options?: unknown) {
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj)
  }
}

export function promisify<T extends (...args: unknown[]) => void>(fn: T) {
  return function (...args: unknown[]) {
    return new Promise((resolve, reject) => {
      fn(...args, (err: unknown, result: unknown) => {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }
}

export function format(fmt: string, ...args: unknown[]) {
  let i = 0
  return String(fmt).replace(/%[sdjifoO%]/g, (match) => {
    if (match === '%%') return '%'
    if (i >= args.length) return match
    const arg = args[i++]
    switch (match) {
      case '%s': return String(arg)
      case '%d':
      case '%i': return String(parseInt(String(arg), 10))
      case '%f': return String(parseFloat(String(arg)))
      case '%j': return JSON.stringify(arg)
      case '%o':
      case '%O': return inspect(arg)
      default: return match
    }
  })
}

export function inherits(ctor: { prototype: object, super_?: unknown }, superCtor: { prototype: object }) {
  ctor.super_ = superCtor
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype)
}

export function deprecate<T extends (...args: unknown[]) => unknown>(fn: T, msg: string) {
  let warned = false
  return function (this: unknown, ...args: unknown[]) {
    if (!warned) {
      console.warn(msg)
      warned = true
    }
    return fn.apply(this, args)
  }
}

export function isDeepStrictEqual(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const types = {
  isDate: (v: unknown): v is Date => v instanceof Date,
  isRegExp: (v: unknown): v is RegExp => v instanceof RegExp,
  isArray: Array.isArray,
  isMap: (v: unknown): v is Map<unknown, unknown> => v instanceof Map,
  isSet: (v: unknown): v is Set<unknown> => v instanceof Set,
  isPromise: (v: unknown): v is Promise<unknown> => v instanceof Promise,
}

export default {
  inspect,
  promisify,
  format,
  inherits,
  deprecate,
  isDeepStrictEqual,
  types,
}
