/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AdmZip from 'adm-zip'
import fs from 'fs-extra'
import path from 'path'
import { iterateEntries } from 'sandstone/utils.js'

import type { PackData } from 'sandstone/utils.js'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = import('node-fetch')

type Manifest = Record<string, string>

export type Dependency = { version: string, date: number, datapack: Buffer, resourcepack?: Buffer | false }

export class SmithedDependencyCache {
  readonly baseURL = 'https://api.smithed.dev/v2/'

  readonly path = path.join(process.env.WORKING_DIR as string, 'resources', 'cache', 'smithed')

  readonly manifest = path.join(this.path, '..', '..', 'smithed.json')

  readonly lockFile = path.join(this.path, '..', 'lock-smithed.json')

  dependencies: Map<string, Dependency> = new Map()

  loaded = false

  async load() {
    this.loaded = true

    if (!(await fs.pathExists(this.manifest))) {
      return
    }

    const manifest = JSON.parse(await fs.readFile(this.manifest, 'utf-8')) as Manifest

    if (!(await fs.pathExists(this.lockFile))) {
      for await (const [id, version] of Object.entries(manifest)) {
        await this.get(id, version)
      }

      await fs.writeFile(this.lockFile, JSON.stringify(manifest))
    } else {
      const lockFile = JSON.parse(await fs.readFile(this.lockFile, 'utf-8')) as Record<string, { version: string, date: number, resourcepack: boolean }>

      for await (const [id, version] of Object.entries(manifest)) {
        if (!lockFile[id]) {
          await this.get(id, version)
        } else if (lockFile[id].version !== version) {
          await this.get(id, version)
        } else {
          const date = Number(Date())

          if (version === 'latest' && ((lockFile[id].date - date) / 36e5) > 1) {
            lockFile[id].date = date

            await this.get(id, version)
          } else {
            this.dependencies.set(id, {
              version,
              date: lockFile[id].date,
              datapack: await fs.readFile(path.join(this.path, id, 'datapack.zip')),
              resourcepack: lockFile[id].resourcepack ? await fs.readFile(path.join(this.path, id, 'resourcepack.zip')) : false,
            })
          }
        }
      }

      await fs.writeFile(this.lockFile, JSON.stringify(lockFile))
    }
  }

  async save() {
    if (this.dependencies.size !== 0) {
      await fs.writeFile(this.manifest, JSON.stringify(iterateEntries(this.dependencies, (val) => val.version)))
    }
  }

  async get(dependency: string, version: string) {
    if (!this.loaded) {
      await this.load()
    }

    const existing = this.dependencies.get(dependency)

    if (existing && existing.version === version) {
      return existing
    }

    let url = `${this.baseURL}download?pack=${dependency}`

    let hasResourcePack = false

    const pack = JSON.parse(await (await (await fetch).default(`${this.baseURL}packs/${dependency}`)).text()) as PackData

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

    const files = (new AdmZip(await (await (await fetch).default(url)).buffer())).getEntries()

    const datapack: Buffer = await new Promise((res) => {
      files[0].getDataAsync((data) => res(data as Buffer))
    })

    await fs.writeFile(path.join(this.path, dependency, 'datapack.zip'), datapack)

    let resourcepack: Buffer | false = false

    if (hasResourcePack) {
      resourcepack = await new Promise((res) => {
        files[1].getDataAsync((data) => res(data as Buffer))
      })

      await fs.writeFile(path.join(this.path, dependency, 'resourcepack.zip'), datapack)
    }

    return (this.dependencies.set(dependency, {
      version, date: version === 'latest' ? 0 : Number(Date()), datapack, resourcepack,
    }).get(dependency)!)
  }

  has(dependency: string) {
    return this.dependencies.has(dependency)
  }
}
