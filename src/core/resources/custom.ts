/* eslint-disable max-len */
import { toMinecraftResourceName } from 'sandstone/utils.js'

import { ContainerNode } from '../nodes.js'
import { ResourceClass } from './resource.js'

import type fs from 'fs-extra'
import type { PackType } from 'sandstone/pack/packType.js'
import type { SandstoneCore } from '../sandstoneCore.js'
import type { ResourceClassArguments, ResourceNode } from './resource.js'

/**
 * A node representing a custom resource.
 */
export class CustomResourceNode extends ContainerNode implements ResourceNode<CustomResourceClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: CustomResourceClass) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.getValue()
}

export type CustomResourceClassArguments = {
  /** The custom resource type. */
  type: string,

  /** Optional. The Pack this resource is exported into. Defaults to the datapack. */
  packType?: PackType,

  /** Optional. The folder in the pack where the resource gets stored. Defaults to the root of the pack without a namespace. */
  folder?: string[]

  /** Optional. File extension of the resource. Defaults to `json`. */
  extension?: string

  /** Optional. How `SandstoneCore.getExistingResource` should read this resource. If `false` the encoding will not be provided to `fs.readFile`. Defaults to `'utf8'`. */
  encoding?: false | fs.EncodingOption
} & ResourceClassArguments<'default'>

export abstract class CustomResourceClass extends ResourceClass<CustomResourceNode> {
  public type: string

  public folder?: string[]

  constructor(sandstoneCore: SandstoneCore, name: string, args: CustomResourceClassArguments) {
    sandstoneCore.pack.registerCustomResource(args.type)

    super(
      sandstoneCore,
      { packType: args.packType || sandstoneCore.pack.dataPack(), extension: args.extension || 'json', encoding: args.encoding },
      CustomResourceNode,
      // eslint-disable-next-line no-nested-ternary
      args.folder ? name.includes('/') ? name.split('/') : [name] : sandstoneCore.pack.resourceToPath(name, args.folder),
      args,
    )

    this.type = args.type

    this.folder = args.folder

    this.handleConflicts()
  }

  getValue(): string | Buffer | Promise<Buffer> {
    throw new Error(`Custom Resource '${this.type}' getValue function is not defined!`)
  }

  toString = () => (this.folder ? toMinecraftResourceName(this.path, this.folder.length) : this.name)
}
