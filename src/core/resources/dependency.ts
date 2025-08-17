import type { PackType } from 'sandstone/pack'
import { ContainerNode } from '../nodes.js'
import type { SandstoneCore } from '../sandstoneCore.js'
import type { Dependency } from '../smithed.js'
import type { ResourceNode } from './resource.js'
import { ResourceClass } from './resource.js'

/**
 * A node representing a custom resource.
 */
export class DependencyNode extends ContainerNode implements ResourceNode<SmithedDependencyClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: SmithedDependencyClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.getValue()
}

export class SmithedDependencyClass extends ResourceClass<DependencyNode> {
  side: 'client' | 'server'

  constructor(
    sandstoneCore: SandstoneCore,
    name: string,
    public dependency: Dependency,
    side: 'client' | 'server',
  ) {
    super(
      sandstoneCore,
      {
        packType: (side === 'client'
          ? sandstoneCore.pack.packTypes.get('resourcepack-dependencies')
          : sandstoneCore.pack.packTypes.get('datapack-dependencies')) as PackType,
        extension: 'zip',
        encoding: false,
      },
      DependencyNode,
      [name],
      {
        addToSandstoneCore: true,
        creator: 'sandstone',
      },
    )

    this.side = side

    this.handleConflicts()
  }

  getValue(): Buffer {
    if (this.side === 'client') {
      return this.dependency.resourcepack as Buffer
    }

    return this.dependency.datapack
  }
}
