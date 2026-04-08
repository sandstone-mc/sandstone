/**
 * Browser shims for Node.js modules that don't work in the browser.
 * Used by the browser bundle build target.
 */

import { join } from 'path'

const shimsDir = import.meta.dir

/**
 * Map of module names to their shim file paths.
 */
export const shimMap: Record<string, string> = {
  'node:module': join(shimsDir, 'node-module.ts'),
  'node:path': join(shimsDir, 'node-path.ts'),
  util: join(shimsDir, 'util.ts'),
  'fs-extra': join(shimsDir, 'fs-extra.ts'),
  'adm-zip': join(shimsDir, 'adm-zip.ts'),
  'prismarine-nbt': join(shimsDir, 'prismarine-nbt.ts'),
  path: join(shimsDir, 'path.ts'),
}

/**
 * Bun build plugin that redirects Node.js modules to browser shims.
 */
export const browserShimPlugin: import('bun').BunPlugin = {
  name: 'browser-shims',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      const shimPath = shimMap[args.path]
      if (shimPath) {
        return { path: shimPath }
      }
      return undefined
    })
  },
}

/**
 * Modules that should be marked external (not bundled).
 * These are Node.js built-ins that can't be shimmed.
 */
export const browserExternals = [
  'node-fetch',
  'crypto',
  'zlib',
]

/**
 * Default environment variables for browser runtime.
 */
export const defaultBrowserEnv = {
  PROJECT_FOLDERS: JSON.stringify({
    absProjectFolder: '/',
    projectFolder: '/src',
    rootFolder: '/',
    sandstoneConfigFolder: '/',
  }),
  CLI_OPTIONS: JSON.stringify({}),
  WORKING_DIR: '/',
  PACK_OPTIONS: JSON.stringify({
    datapack: {
      description: ['A ', { text: 'Sandstone', color: 'gold' }, ' datapack.'],
      packFormat: 98,
    },
    resourcepack: {
      description: ['A ', { text: 'Sandstone', color: 'gold' }, ' resource pack.'],
      packFormat: 79,
    },
  }),
}

/**
 * Generate a banner that sets up the browser environment.
 */
export function generateBrowserBanner(env = defaultBrowserEnv): string {
  return `(()=>{globalThis.global||=globalThis;globalThis.process||={};globalThis.process.env=${JSON.stringify(env)}})();`
}
