/* eslint-disable @typescript-eslint/no-non-null-assertion */

import path from 'node:path'
import AdmZip from 'adm-zip'
import fs from 'fs-extra'
import { getSandstoneContext } from 'sandstone/context'
import type { PackData } from 'sandstone/utils'
import { fetch, safeWrite } from 'sandstone/utils'
import type { SandstoneCore } from './sandstoneCore'

type Manifest = Record<string, string>

export type Dependency = {
  version: string
  date: number
  added: boolean
  datapack: Buffer
  resourcepack?: Buffer | false
}

type LockFile = Record<string, { version: string; date: number; resourcepack: boolean }>

export class SmithedDependencyCache {
  readonly core: SandstoneCore

  constructor(core: SandstoneCore) {
    this.core = core
  }

  readonly baseURL = 'https://api.smithed.dev/v2/'

  get path() {
    return path.join(getSandstoneContext().workingDir, '../', 'resources', 'cache', 'smithed')
  }

  get manifest() {
    return path.join(this.path, '..', '..', 'smithed.json')
  }

  get lockFile() {
    return path.join(this.path, '..', 'lock-smithed.json')
  }

  dependencies: Map<string, Dependency> = new Map()

  loaded = false

  async load() {
    this.loaded = true

    if (!(await fs.pathExists(this.manifest))) {
      return
    }

    const manifest = JSON.parse(await fs.readFile(this.manifest, 'utf-8')) as Manifest

    for (const [id, version] of Object.entries(manifest)) {
      this.core.depend(id, version)
    }
  }

  async save() {
    if (this.dependencies.size !== 0) {
      const dependencies: Record<string, string> = {}

      for (const [dependency, { version }] of this.dependencies.entries()) {
        dependencies[dependency] = version
      }
      await safeWrite(this.manifest, JSON.stringify(dependencies))

      const lock: LockFile = {}

      for (const [name, { version, date, resourcepack }] of this.dependencies.entries()) {
        lock[name] = {
          version,
          date,
          resourcepack: !!resourcepack,
        }
      }

      await safeWrite(this.lockFile, JSON.stringify(lock))
    }
  }

  async get(dependency: string, version: string) {
    if (!this.loaded) {
      await this.load()
    }

    const existing = this.dependencies.get(dependency)

    if (existing && existing.version === version) {
      existing.added = true

      return existing
    }

    let result: Dependency

    const lockFile = await (async () => {
      try {
        return JSON.parse(await fs.readFile(this.lockFile, 'utf-8')) as LockFile
      } catch {
        return false
      }
    })()

    let download = false

    if (!lockFile || !lockFile[dependency] || lockFile[dependency].version !== version) {
      download = true
    } else {
      const date = Date.now()

      if (version === 'latest' && (lockFile[dependency].date - date) / 36e5 > 1) {
        lockFile[dependency].date = date

        download = true
      } else {
        result = this.dependencies
          .set(dependency, {
            version,
            date: lockFile[dependency].date,
            datapack: await fs.readFile(path.join(this.path, dependency, 'datapack.zip')),
            resourcepack: lockFile[dependency].resourcepack
              ? await fs.readFile(path.join(this.path, dependency, 'resourcepack.zip'))
              : false,
            added: false,
          })
          .get(dependency)!
      }
    }

    if (download) {
      let url = `${this.baseURL}download?pack=${dependency}`

      let hasResourcePack = false

      const pack = JSON.parse(await (await fetch(`${this.baseURL}packs/${dependency}`)).text()) as PackData

      if (version === 'latest') {
        const { versions } = pack

        const ver = versions[versions.length - 1]

        if (ver.downloads.resourcepack) {
          hasResourcePack = true
        }
      } else {
        const ver = pack.versions.find((_ver) => _ver.name === version) as PackData['versions'][0]

        if (ver.downloads.resourcepack) {
          hasResourcePack = true
        }

        url += `@${version}`
      }

      const files = new AdmZip(Buffer.from(await (await fetch(url)).arrayBuffer())).getEntries()

      const datapack: Buffer = await new Promise((res) => {
        files[0].getDataAsync((data) => res(data as Buffer))
      })

      await safeWrite(path.join(this.path, dependency, 'datapack.zip'), datapack as any)

      let resourcepack: Buffer | false = false

      if (hasResourcePack) {
        resourcepack = await new Promise((res) => {
          files[1].getDataAsync((data) => res(data as Buffer))
        })

        await safeWrite(path.join(this.path, dependency, 'resourcepack.zip'), resourcepack as any)
      }

      result = this.dependencies
        .set(dependency, {
          version,
          date: version === 'latest' ? Date.now() : 0,
          datapack,
          resourcepack,
          added: true,
        })
        .get(dependency)!

      await this.save()
    }

    return result!
  }

  has(dependency: string) {
    const depend = this.dependencies.get(dependency)
    return depend && depend.added
  }
}
