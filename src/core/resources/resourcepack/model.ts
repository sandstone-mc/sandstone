import { LiteralUnion } from 'sandstone'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'
import { RESOURCE_PATHS, type MCDocToJSON, type SymbolResource } from 'sandstone/arguments'

export class ModelNode<Type extends LiteralUnion<'block' | 'item'>> extends ContainerNode implements ResourceNode<ModelClass<Type>> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: ModelClass<Type>,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.modelJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type ModelClassArguments = {
  /**
   * The model's JSON.
   */
  json: MCDocToJSON<SymbolResource[(typeof ModelClass)['resourceType']]>
} & ResourceClassArguments<'default'>


// TODO: Remove `= 'block'` from this and update mcdoc-ts-generator
/**
 * Helper class for modifying Minecraft model data
 */
export class ModelClass<Type extends LiteralUnion<'block' | 'item'> = 'block'> extends ResourceClass<ModelNode<Type>> {
  static readonly resourceType = 'model'

  modelJSON: NonNullable<ModelClassArguments['json']>

  constructor(
    core: SandstoneCore,
    public type: Type,
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

  toString = () => `${this.path[0]}:${this.path.slice(2).join('/')}`
}
