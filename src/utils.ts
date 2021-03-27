import util from 'util'

export function isAsyncFunction(func: ((...args: any[]) => void) | ((...args: any[]) => Promise<void>)): func is (...args: any[]) => Promise<void> {
  return util.types.isAsyncFunction(func)
}
