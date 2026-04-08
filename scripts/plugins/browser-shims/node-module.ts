// Shim for node:module - createRequire is not needed in browser
export function createRequire() {
  return function require() {
    throw new Error('require is not available in browser')
  }
}

export default { createRequire }
