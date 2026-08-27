import { RESOURCE_PATHS } from 'sandstone/arguments'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft number provider.
 */
export class NumberProviderNode extends ContainerNode implements ResourceNode<NumberProviderClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: NumberProviderClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () =>
    jsonStringify(this.resource.numberProviderJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

type NumberProviderJSON = JsonSymbolResource[(typeof NumberProviderClass)['resourceType']]

export type NumberProviderClassArguments = {
  /**
   * The number provider's JSON payload.
   */
  json: NumberProviderJSON
} & ResourceClassArguments<'default'>

export class NumberProviderClass extends ResourceClass<NumberProviderNode> {
  static readonly resourceType = 'number_provider' as const

  public numberProviderJSON: NumberProviderClassArguments['json']

  constructor(sandstoneCore: SandstoneCore, name: string, args: NumberProviderClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      NumberProviderNode,
      NumberProviderClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[NumberProviderClass.resourceType].path),
      args,
    )

    this.numberProviderJSON = args.json

    this.handleConflicts()
  }
}
