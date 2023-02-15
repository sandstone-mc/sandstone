import { nbtStringifier } from 'sandstone/variables/index'

import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { LiteralUnion } from 'sandstone/utils'
import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type { BLOCKS, ENTITY_TYPES, NBTObject } from '#arguments'

/**
 * A node representing a Minecraft trim material.
 */
export class StructureNode extends ContainerNode implements ResourceNode<StructureClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: StructureClass) {
    super(sandstoneCore)
  }

  getValue = () => (this.resource.structure.then ? this.resource.structure : nbtStringifier(this.resource.structure as NBTObject))
}

type StructureEntry = {
  block?: {
    Name: LiteralUnion<BLOCKS>,
    Properties?: { [key: string]: string }
  },
  entities?: [{
    id: LiteralUnion<ENTITY_TYPES>,
    nbt: NBTObject,
    offset: [number, number, number]
  }]
}

export type StructureClassArguments = {
  /**
   * The structure's buffer or NBTObject.
   */
  structure?: string | { [key: string]: NBTObject } | [[[StructureEntry]]] | StructureClass
} & ResourceClassArguments<'default'> & {
  /**
   * Optional. Defaults to true. Automatically adds trim material to #minecraft:trim_materials.
   */
  registerMaterial?: boolean
}

export class StructureClass extends ResourceClass<StructureNode> {
  structureBuffer?: Promise<Buffer>

  structureNBT?: { [key: string]: NBTObject }

  constructor(sandstoneCore: SandstoneCore, name: string, args: StructureClassArguments) {
    super(sandstoneCore, sandstoneCore.pack.dataPack(), 'nbt', StructureNode, sandstoneCore.pack.resourceToPath(name, ['structures']), args)

    if (args.structure === undefined) {
      this.structureNBT = {} // TODO
    } else if (typeof args.structure === 'string') {
      this.structureBuffer = sandstoneCore.getExistingResource(true, args.structure)
    } else if (args.structure instanceof StructureClass) {
      if (args.structure.structureNBT) {
        this.structureNBT = args.structure.structureNBT
      } else if (args.structure.structureBuffer) {
        this.structureBuffer = args.structure.structureBuffer
      } else {
        this.structureBuffer = args.structure.structure as Promise<Buffer>
      }
    } else if (Array.isArray(args.structure)) {
      this.structureNBT = this.arrayToNBT(args.structure)
    } else {
      this.structureNBT = args.structure
    }
  }

  get structure(): { [key: string]: NBTObject } | Promise<Buffer> {
    if (this.structureNBT) {
      return this.structureNBT
    }
    if (this.structureBuffer) {
      return this.structureBuffer
    }
    this.structureBuffer = this.node.sandstoneCore.getExistingResource(true, this.name)
    return this.structureBuffer as Promise<Buffer>
  }

  // TODO: Add combined mirroring
  load() {}
}
