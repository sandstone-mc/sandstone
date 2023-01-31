// @ts-check
import { resolve, join, relative, parse } from 'path/posix'
import fs from 'fs/promises'

/**
 * @param {string} pathNoLib 
 */
function getExportsObject(pathNoLib) {
    const realPath = './' + join('dist', pathNoLib)

    const types = realPath + '.d.ts'

    return {
      types,
      // ESM imports will match this
      import:  realPath + '.mjs',
      // Everything else will match this
      default: realPath + '.js',
    }
}

/**
 * @param {string} path
 */
async function getExportsForDirectory(path) {
    try {
        const relPath = relative('src', path)

        const p = parse(relPath)
        const importPath = './' + join(p.dir, p.name)

        await fs.access(join(path, 'index.ts'))
        exports[importPath] = getExportsObject(join(importPath, 'index'))
    }
    catch (e) {
        // Index doesn't exist
    }
}

/**
 * @param {string} dir
 * @yields {{path: string, isDirectory: boolean}}
 */
async function* getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    const isDirectory = dirent.isDirectory();

    if (isDirectory) {
      yield getExportsForDirectory(res)
      yield* getFiles(res)
    }
  }
}

const exports = { '.': getExportsObject('index'), './*': getExportsObject('*') }

// Await all the files
for await (const _ of getFiles('src')) {}

const packageJson = JSON.parse((await fs.readFile('package.json')).toString('utf-8'))
delete packageJson.exports
packageJson.exports = exports
await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2))
