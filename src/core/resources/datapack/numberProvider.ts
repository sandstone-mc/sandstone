import { RESOURCE_PATHS } from 'sandstone/arguments'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft float number provider.
 */
export class FloatNumberProviderNode extends ContainerNode implements ResourceNode<FloatNumberProviderClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: FloatNumberProviderClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () =>
    jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

type FloatNumberProviderJSON = JsonSymbolResource[(typeof FloatNumberProviderClass)['resourceType']]

export type FloatNumberProviderClassArguments = {
  /**
   * The number provider's JSON payload.
   */
  json: FloatNumberProviderJSON
} & ResourceClassArguments<'default'>

export class FloatNumberProviderClass extends ResourceClass<FloatNumberProviderNode> implements JsonResource {
  static readonly resourceType = 'context_float_provider' as const

  public json: FloatNumberProviderClassArguments['json']

  constructor(sandstoneCore: SandstoneCore, name: string, args: FloatNumberProviderClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      FloatNumberProviderNode,
      FloatNumberProviderClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[FloatNumberProviderClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}

/**
 * A node representing a Minecraft integer number provider.
 */
export class IntegerNumberProviderNode extends ContainerNode implements ResourceNode<IntegerNumberProviderClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: IntegerNumberProviderClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () =>
    jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

type IntegerNumberProviderJSON = JsonSymbolResource[(typeof IntegerNumberProviderClass)['resourceType']]

export type IntegerNumberProviderClassArguments = {
  /**
   * The number provider's JSON payload.
   */
  json: IntegerNumberProviderJSON
} & ResourceClassArguments<'default'>

export class IntegerNumberProviderClass extends ResourceClass<IntegerNumberProviderNode> implements JsonResource {
  static readonly resourceType = 'context_int_provider' as const

  public json: IntegerNumberProviderClassArguments['json']

  constructor(sandstoneCore: SandstoneCore, name: string, args: IntegerNumberProviderClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      IntegerNumberProviderNode,
      IntegerNumberProviderClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[IntegerNumberProviderClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}

