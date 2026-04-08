// Shim for fs-extra - filesystem operations not available in browser
export default {
  pathExists: async (_path: string) => false,
}
