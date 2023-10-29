/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AdmZip from 'adm-zip'
import fs from 'fs-extra'
import lodash from 'lodash'
import path from 'path'
import { fetch, safeWrite } from 'sandstone/utils'

export type MCMetaBranches = 'assets' | 'atlas' | 'data' | 'registries' | 'summary'

export class MCMetaCache {
  readonly base = '/misode/mcmeta/'

  readonly path = path.join(process.env.WORKING_DIR as string, '..', 'resources', 'cache', 'mcmeta')

  readonly manifest = path.join(this.path, '..', '..', 'mcmeta.json')

  readonly lockFile = path.join(this.path, '..', 'lock-mcmeta.json')

  version: string = 'latest'

  versionDate?: number

  branches: MCMetaBranches[] = []

  files: Map<string, { text: boolean, contents: Buffer | string | false }> = new Map()

  loaded = false

  async load() {
    this.loaded = true

    if (!(await fs.pathExists(this.manifest))) {
      return
    }

    const manifest = JSON.parse(await fs.readFile(this.manifest, 'utf-8'))

    let uncached = false

    this.version = manifest.version

    const getZip = async (branch: string) => new AdmZip(await (await fetch(`https://github.com${this.base}archive/refs/heads/${branch}.zip`)).buffer())

    if (!(await fs.pathExists(this.lockFile))) {
      if (manifest.files.length > 10) {
        const archives: Record<string, AdmZip> = {}
        for await (const branch of manifest.branches) {
          archives[branch] = await getZip(branch)
        }

        for await (const [file, text] of Object.entries(manifest.files)) {
          const _path = file.split('/')

          let contents: Buffer | string = await new Promise((res) => {
            archives[_path[0]].readFileAsync(_path.slice(1).join('/'), (data) => res(data as Buffer))
          })

          if (text) {
            contents = contents.toString('utf-8')
          }

          await safeWrite(path.join(this.path, file), contents)

          this.files.set(file, { contents, text: text as false })
        }
      } else {
        uncached = true

        for await (const [file, text] of Object.entries(manifest.files)) {
          const _path = file.split('/')
          await this.get(_path[0] as MCMetaBranches, _path.slice(1).join('/'), text as false)
        }
      }

      await safeWrite(this.lockFile, JSON.stringify({
        files: manifest.files,
        version: manifest.version === 'latest' ? await this.getVersion(false) : manifest.version as string,
        versionDate: this.versionDate,
      }))
    } else {
      const lockFile = JSON.parse(await fs.readFile(this.lockFile, 'utf-8'))

      this.versionDate = lockFile.versionDate

      const version: string = manifest.version === 'latest' ? await this.getVersion(lockFile) : manifest.version

      if (lockFile.version !== version) {
        if (manifest.files.length > 10) {
          const archives: Record<string, AdmZip> = {}
          for await (const branch of manifest.branches) {
            archives[branch] = await getZip(branch)
          }
          for await (const [file, text] of Object.entries(manifest.files)) {
            const _path = file.split('/')

            let contents: Buffer | string = await new Promise((res) => {
              archives[_path[0]].readFileAsync(_path.slice(1).join('/'), (data) => res(data as Buffer))
            })

            if (text) {
              contents = contents.toString('utf-8')
            }

            await safeWrite(path.join(this.path, file), contents)

            this.files.set(file, { contents, text: text as false })
          }
        } else {
          uncached = true

          for await (const [file, text] of Object.entries(manifest.files)) {
            const _path = file.split('/')
            await this.get(_path[0] as MCMetaBranches, _path.slice(1).join('/'), text as false)
          }
        }
      } else {
        const diff = lodash.difference(Object.entries(manifest.files), Object.entries(lockFile.files))

        if (diff.length !== 0) {
          if (diff.length > 10) {
            const archives: Record<string, AdmZip> = {}

            for await (const [file, text] of Object.entries(manifest.files)) {
              const _path = file.split('/')

              const branch = _path[0]

              if (!archives[branch]) {
                archives[branch] = await getZip(branch)
              }

              let contents: Buffer | string = await new Promise((res) => {
                archives[branch].readFileAsync(_path.slice(1).join('/'), (data) => res(data as Buffer))
              })

              if (text) {
                contents = contents.toString('utf-8')
              }

              await safeWrite(path.join(this.path, file), contents)

              this.files.set(file, { contents, text: text as false })
            }
          } else {
            uncached = true

            for await (const [file, text] of diff) {
              const _path = file.split('/')
              await this.get(_path[0] as MCMetaBranches, _path.slice(1).join('/'), text as false)
            }
          }
        }
      }

      await safeWrite(this.lockFile, JSON.stringify({
        files: manifest.files,
        version: manifest.version === 'latest' ? await this.getVersion(false) : manifest.version as string,
        versionDate: this.versionDate,
      }))
    }

    this.branches = manifest.branches

    if (!uncached) {
      for (const [file, text] of Object.entries(manifest.files)) {
        this.files.set(file, { contents: false, text: text as false })
      }
    }
  }

  async save() {
    if (this.files.size !== 0) {
      const files: Record<string, boolean> = {}

      for (const [_path, { text }] of this.files.entries()) {
        files[_path] = text
      }

      await safeWrite(this.manifest, JSON.stringify({
        files,
        branches: this.branches,
        version: this.version,
      }))

      await safeWrite(this.lockFile, JSON.stringify({
        files,
        version: this.version,
        versionDate: this.versionDate || Date.now(),
      }))
    }
  }

  async get(branch: MCMetaBranches, relativePath: string): Promise<string>

  async get(branch: MCMetaBranches, relativePath: string, text: true): Promise<string>

  async get(branch: MCMetaBranches, relativePath: string, text: false): Promise<Buffer>

  async get(branch: MCMetaBranches, relativePath: string, text = true) {
    console.log(branch, relativePath)
    if (!this.loaded) {
      await this.load()
    }

    if (!this.branches.includes(branch)) {
      this.branches.push(branch)
    }

    const fullPath = path.join(branch, relativePath)
    const existing = this.files.get(fullPath)

    if (existing) {
      return existing.contents
    }

    const req = await fetch(`https://raw.githubusercontent.com${this.base}${branch}/${relativePath}`)

    const file = await (text ? req.text() : req.buffer())

    const finalPath = path.join(this.path, fullPath)

    await safeWrite(finalPath, file)

    return (this.files.set(fullPath, { text, contents: file }).get(fullPath)!).contents as Buffer | string
  }

  async getVersion(lockFile?: any) {
    const fetchVersion = async () => (await (await fetch(`https://api.github.com/repos${this.base}commits?sha=summary`)).json() as any).sha as string

    const currentDate = Date.now()

    if (lockFile) {
      // If it has been over 6 hours since it was checked.
      if (((lockFile.versionDate - currentDate) / 36e5) > 6) {
        this.versionDate = currentDate

        return fetchVersion()
      }

      this.versionDate = lockFile.versionDate

      return lockFile.version as string
    }

    this.versionDate = currentDate

    return fetchVersion()
  }
}
