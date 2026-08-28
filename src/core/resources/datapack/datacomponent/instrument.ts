import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../../nodes'
import type { SandstoneCore } from '../../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

/**
 * A node representing a Minecraft instrument (goat horn).
 */
export class InstrumentNode extends ContainerNode implements ResourceNode<InstrumentClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: InstrumentClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type InstrumentClassArguments = {
  /**
   * The instrument's JSON.
   */
  json: JsonSymbolResource[(typeof InstrumentClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class InstrumentClass extends ResourceClass<InstrumentNode> implements JsonResource {
  static readonly resourceType = 'instrument' as const

  public json: NonNullable<InstrumentClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: InstrumentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      InstrumentNode,
      InstrumentClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[InstrumentClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
