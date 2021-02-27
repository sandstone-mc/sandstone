import { toMCFunctionName } from '@datapack/minecraft'

import type { Datapack } from '@datapack'

export class ResourceClass {
    protected datapack

    protected commandsRoot

    protected path

    constructor(datapack: Datapack, name: string) {
      this.datapack = datapack

      this.commandsRoot = datapack.commandsRoot

      this.path = datapack.getResourcePath(name)
    }

    get name(): string {
      return toMCFunctionName(this.path.fullPathWithNamespace)
    }

    toString() {
      return this.name
    }

    toJSON() { return this.toString() }
}
