import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type fs from 'fs-extra'
import type { PackType } from 'sandstone/pack/packType'
import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = import('node-fetch')

/**
 * A node representing a custom resource.
 */
export class DependencyNode extends ContainerNode implements ResourceNode<DependencyClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: DependencyClass) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.getValue()
}

export type DependencyClassArguments = {
  /** Whether this is a resource pack (client) or a datapack (server) dependency. Defaults to the datapack (server). */
  side?: 'client' | 'server',
} & ResourceClassArguments<'default'>

export abstract class DependencyClass extends ResourceClass<DependencyNode> {
  constructor(sandstoneCore: SandstoneCore, name: string, args: DependencyClassArguments) {
    super(
      sandstoneCore,
      {
        packType: (args.side === 'client' ? sandstoneCore.pack.packTypes.get('resourcepack-dependencies') : sandstoneCore.pack.packTypes.get('datapack-dependencies')) as PackType,
        extension: 'zip',
        encoding: false,
      },
      DependencyNode,
      ['/'],
      args,
    )

    this.handleConflicts()
  }

  getValue() {
    // implement
  }
}
