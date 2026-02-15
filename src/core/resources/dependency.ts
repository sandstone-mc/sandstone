import type { PackType } from 'sandstone/pack'
import { ContainerNode } from '../nodes'
import type { SandstoneCore } from '../sandstoneCore'
import type { Dependency } from '../smithed'
import type { ResourceNode } from './resource'
import { ResourceClass } from './resource'

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
      'dependency',
      [name],
      {
        addToSandstoneCore: true,
        creator: 'sandstone',
      },
    )

    this.side = side

    this.handleConflicts()
  }

  async getValue() {
    if (this.side === 'client' && this.dependency.resourcepack) {
      return await this.dependency.resourcepack()
    }

    return await this.dependency.datapack()
  }
}
