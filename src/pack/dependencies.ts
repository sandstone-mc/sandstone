import { PackType } from './packType'

import type { handlerReadFile, handlerWriteFile } from './packType'

class DataPackDependencies extends PackType {
  constructor() {
    super('datapack_dependencies', 'saves/$worldName$/datapacks', 'world/datapacks', 'datapacks', 'server', false, undefined, false)
  }

  handleOutput = async (type: 'output' | 'client' | 'server', readFile: handlerReadFile, writeFile: handlerWriteFile) => {
    if (type === 'output') {
      // TODO: run weld
    }
  }
}

class ResourcePackDependencies extends PackType {
  constructor() {
    super('resource_pack_dependencies', 'saves/$worldName$/resources', 'resources', 'resourcepacks', 'client', true, undefined, false)
  }

  handleOutput = async (type: 'output' | 'client' | 'server', readFile: handlerReadFile, writeFile: handlerWriteFile) => {
    if (type === 'output') {
      // TODO: run weld
    }
  }
}

export async function handleDependencies(dependencies: Map<string, boolean>) {
  // TODO
}
