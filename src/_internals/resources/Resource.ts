import { toMcFunctionName } from '@datapack/minecraft'

import type { Datapack } from '@datapack'

export class Resource {
    protected datapack

    protected commandsRoot

    protected path

    constructor(datapack: Datapack, name: string) {
      this.datapack = datapack

      this.commandsRoot = datapack.commandsRoot

      this.path = datapack.getResourcePath(name)
    }

    get name(): string {
      return toMcFunctionName(this.path.fullPathWithNamespace)
    }

    toString() {
      return this.name
    }

    toJSON() { return this.toString() }
}
