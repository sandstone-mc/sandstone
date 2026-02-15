import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'
import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'

export class ModelNode extends ContainerNode implements ResourceNode<ModelClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: ModelClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.modelJSON)
}

export type ModelClassArguments = {
  /**
   * The model's JSON.
   */
  json: SymbolResource[(typeof ModelClass)['resourceType']]
} & ResourceClassArguments<'default'>

/**
 * Helper class for modifying Minecraft model data
 */
export class ModelClass extends ResourceClass<ModelNode> {
  static readonly resourceType = 'model'

  modelJSON: NonNullable<ModelClassArguments['json']>

  constructor(
    core: SandstoneCore,
    public type: 'block' | 'item',
    name: string,
    args: ModelClassArguments,
  ) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      ModelNode,
      ModelClass.resourceType,
      core.pack.resourceToPath(name, [...RESOURCE_PATHS[ModelClass.resourceType].path, type]),
      args,
    )

    this.modelJSON = args.json

    this.handleConflicts()
  }

  // TODO: Helper methods for overrides

  // TODO: Consider building a separate Variable class for model manipulation

  toString = () => `${this.path[0]}:${this.path.slice(2)}`
}
