/* eslint-disable @typescript-eslint/no-non-null-assertion */

import path from 'node:path'
import AdmZip from 'adm-zip'
import fs from 'fs-extra'
import { getSandstoneContext } from 'sandstone/context'
import type { PackData } from 'sandstone/utils'
import { fetch, safeWrite } from 'sandstone/utils'
import type { SandstoneCore } from './sandstoneCore'
import { DataPackDependencies, ResourcePackDependencies } from 'sandstone/pack'
import { SmithedDependencyClass } from './resources/dependency'

type Manifest = Record<string, string>

export type Dependency = {
  version: string
  date: number
  datapack: () => Promise<Buffer>
  resourcepack?: (() => Promise<Buffer>) | false
}

type LockFile = Record<string, { version: string; date: number; resourcepack: boolean }>

export class SmithedDependencyCache {
  readonly core: SandstoneCore

  constructor(core: SandstoneCore) {
    this.core = core
  }

  readonly baseURL = 'https://api.smithed.dev/v2/'

  get path() {
    return path.join(getSandstoneContext().workingDir, 'resources', 'cache', 'smithed')
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
    this.core.pack.packTypes.set(
      'datapack-dependencies',
      new DataPackDependencies()
    )
    let resourcePackDependencies = false

    for (const [id, dependency] of this.dependencies) {
      new SmithedDependencyClass(this.core, id, dependency, 'server')

      if (dependency.resourcepack !== false) {
        if (!resourcePackDependencies) {
          this.core.pack.packTypes.set(
            'resourcepack-dependencies',
            new ResourcePackDependencies()
          )
        }

        new SmithedDependencyClass(this.core, id, dependency, 'client')
      }
    }
  }

  async lock() {
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

  async get(dependency: string, version: string): Promise<Dependency | undefined> {
    const existing = this.dependencies.get(dependency)

    if (existing) {
      return existing
    }

    let result: Dependency | undefined

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
            datapack: async () => await fs.readFile(path.join(this.path, dependency, 'datapack.zip')),
            resourcepack: lockFile[dependency].resourcepack
              ? async () => await fs.readFile(path.join(this.path, dependency, 'resourcepack.zip'))
              : false,
          })
          .get(dependency)!
      }
    }

    if (download) {
      let url = `${this.baseURL}download?pack=${dependency}`

      let hasResourcePack = false

      let pack: PackData | null = null
      try {
        const response = await fetch(`${this.baseURL}packs/${dependency}`)
        if (!response.ok) {
          console.warn(`[SmithedDependencyCache#get] ${((await response.json()) as any).message} (HTTP ${response.status}). The pack may not be published yet.`)
          return undefined
        }
        pack = JSON.parse(await response.text()) as PackData
      } catch (error) {
        console.warn(`[SmithedDependencyCache#get] Failed to fetch metadata for "${dependency}":`, error)
        return undefined
      }

      if (!pack || !pack.versions || pack.versions.length === 0) {
        console.warn(`[SmithedDependencyCache#get] "${dependency}" has no versions available.`)
        return undefined
      }

      if (version === 'latest') {
        const { versions } = pack

        const ver = versions[versions.length - 1]

        if (ver.downloads.resourcepack) {
          hasResourcePack = true
        }
      } else {
        const ver = pack.versions.find((_ver) => _ver.name === version)

        if (!ver) {
          console.warn(`[SmithedDependencyCache#get] "${dependency}" version "${version}" not found.`)
          return undefined
        }

        if (ver.downloads.resourcepack) {
          hasResourcePack = true
        }

        url += `@${version}`
      }

      let zip: AdmZip | undefined = new AdmZip(Buffer.from(await (await fetch(url)).arrayBuffer()))

      let files: AdmZip.IZipEntry[] | undefined = zip.getEntries()

      await safeWrite(path.join(this.path, dependency, 'datapack.zip'), await new Promise((res) => {
        files![0].getDataAsync((data) => res(data as Buffer))
      }))

      if (hasResourcePack) {
        await safeWrite(path.join(this.path, dependency, 'resourcepack.zip'), await new Promise((res) => {
          files![1].getDataAsync((data) => res(data as Buffer))
        }))
      }

      zip = undefined
      files = undefined

      result = this.dependencies
        .set(dependency, {
          version,
          date: version === 'latest' ? Date.now() : 0,
          datapack: async () => await fs.readFile(path.join(this.path, dependency, 'datapack.zip')),
          resourcepack: hasResourcePack
            ? async () => await fs.readFile(path.join(this.path, dependency, 'resourcepack.zip'))
            : false,
        })
        .get(dependency)!

      await this.lock()
    }

    return result
  }

  has(dependency: string) {
    const depend = this.dependencies.get(dependency)
    return depend !== undefined
  }
}
