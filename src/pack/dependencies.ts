import { PackType } from './packType.js'

export class DataPackDependencies extends PackType {
  constructor() {
    super('datapack_dependencies', 'saves/$worldName$/datapacks', 'world/datapacks', 'datapacks', 'server', false, undefined, false)
  }

  handleOutput = async (type: 'output' | 'client' | 'server') => {
    if (type === 'output') {
      // TODO: run weld
    }
  }
}

export class ResourcePackDependencies extends PackType {
  constructor() {
    super('resourcepack_dependencies', 'saves/$worldName$/resources', 'resources', 'resourcepacks/$packName$_dependencies', 'client', true, undefined, false)
  }

  handleOutput = async (type: 'output' | 'client' | 'server') => {
    if (type === 'output') {
      // TODO: run weld
    }
  }
}
