import { ContainerNode } from '../nodes.js'
import { ResourceClass } from './resource.js'

import type { SandstoneCore } from '../sandstoneCore.js'
import type { Dependency } from '../smithed.js'
import type { ResourceNode } from './resource.js'
import type { PackType } from 'sandstone/pack'

/**
 * A node representing a custom resource.
 */
export class DependencyNode extends ContainerNode implements ResourceNode<DependencyClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: DependencyClass) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.getValue()
}

export class DependencyClass extends ResourceClass<DependencyNode> {
  side: 'client' | 'server'

  constructor(sandstoneCore: SandstoneCore, public dependency: Dependency, side: 'client' | 'server') {
    super(
      sandstoneCore,
      {
        packType: (side === 'client' ? sandstoneCore.pack.packTypes.get('resourcepack-dependencies') : sandstoneCore.pack.packTypes.get('datapack-dependencies')) as PackType,
        extension: 'zip',
        encoding: false,
      },
      DependencyNode,
      ['/'],
      {
        addToSandstoneCore: true,
        creator: 'sandstone',
      },
    )

    this.side = side

    this.handleConflicts()
  }

  getValue() {
    if (this.side === 'client') {
      return this.dependency.datapack
    }

    return this.dependency.resourcepack as Buffer
  }
}
