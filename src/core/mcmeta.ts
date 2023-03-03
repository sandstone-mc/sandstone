import fs from 'fs-extra'
import path from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = import('node-fetch')

export type MCMetaBranches = 'assets' | 'atlas' | 'data' | 'registries' | 'summary'

export class MCMetaCache {
  readonly baseURL = 'https://raw.githubusercontent.com/misode/mcmeta/'

  readonly path = path.join(process.env.WORKING_DIR as string, 'resources', 'cache', 'mcmeta')

  readonly manifest = path.join(this.path, 'manifest.json')

  readonly lockFile = path.join(this.path, 'cache.lock')

  branches: MCMetaBranches[] = []

  files: Map<string, Buffer | string | false> = new Map()

  loaded = false

  async load() {
    this.loaded = true

    if (await fs.pathExists(this.manifest)) {
      return
    }

    const cache = JSON.parse(await fs.readFile(this.manifest, 'utf-8'))

    let uncached = false

    if (!(await fs.pathExists(this.lockFile))) {
      if (cache.list.length > 10) {
        for (const branch of cache.branches) {
          // Download the full branch zip
        }
      } else {
        uncached = true

        for (const file of cache.list) {
          const _path = file.split('/')
          this.get(_path[0], _path.slice(1).join('/')) // Switch cache list to a map that includes whether its text or not
        }
      }
    }

    this.branches = cache.branches

    if (!uncached) {
      for (const file of cache.list) {
        this.files.set(file as string, false)
      }
    }
  }

  async save() {
    const cache: string[] = []

    for (const file of this.files) {
      cache.push(file[0])
    }

    await fs.writeFile(this.manifest, JSON.stringify({
      branches: this.branches,
      list: cache,
    }))
  }

  async get(branch: MCMetaBranches, relativePath: string): Promise<string>

  async get(branch: MCMetaBranches, relativePath: string, text: true): Promise<string>

  async get(branch: MCMetaBranches, relativePath: string, text: false): Promise<Buffer>

  async get(branch: MCMetaBranches, relativePath: string, text = true) {
    if (!this.loaded) {
      await this.load()
    }

    if (!this.branches.includes(branch)) {
      this.branches.push(branch)
    }

    const fullPath = path.join(branch, relativePath)
    const existing = this.files.get(fullPath)

    if (existing) {
      return existing
    }

    const req = await (await fetch).default(`${this.baseURL}/${branch}/${relativePath}`)

    const file = await (text ? req.text() : req.buffer())

    return this.files.set(fullPath, file).get(fullPath) as Buffer | string
  }
}
