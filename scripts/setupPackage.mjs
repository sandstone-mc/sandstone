// @ts-check
import { join } from 'path/posix'
import fs from 'fs/promises'

/**
 * @param {string} pathNoLib
 */
function getExportsObject(pathNoLib) {
    const realPath = './' + pathNoLib

    return {
      types: realPath + '.d.ts',
      import: realPath + '.mjs',
      require: realPath + '.cjs',
    }
}

// Only include exports for subpaths that have built bundles
const subpaths = ['arguments', 'commands', 'core', 'flow', 'pack', 'variables']

const exports = { '.': getExportsObject('index') }

for (const subpath of subpaths) {
    try {
        // Check if the built file exists
        await fs.access(join('dist', subpath, 'index.mjs'))
        exports['./' + subpath] = getExportsObject(join(subpath, 'index'))
    } catch {
        // Skip if not built
    }
}

const packageJson = JSON.parse((await fs.readFile('package.json')).toString('utf-8'))
delete packageJson.exports
packageJson.exports = exports
packageJson.scripts = {};
packageJson.devDependencies = {};

// Fix paths for dist package (remove ./dist/ prefix)
packageJson.main = './index.cjs'
packageJson.module = './index.mjs'
packageJson.types = './index.d.ts'

// Remove sandstone from dependencies
delete packageJson.dependencies.sandstone

await fs.writeFile('dist/package.json', JSON.stringify(packageJson, null, 2))
await fs.writeFile('dist/version.txt', Buffer.from(packageJson.version, "utf-8"))
await fs.copyFile('README.md', 'dist/README.md')
await fs.copyFile('LICENSE', 'dist/LICENSE')
await fs.copyFile('tsconfig.json', 'dist/tsconfig.json')
