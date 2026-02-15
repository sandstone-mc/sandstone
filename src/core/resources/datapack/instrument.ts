import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.instrumentJSON)
}

export type InstrumentClassArguments = {
  /**
   * The instrument's JSON.
   */
  json: SymbolResource[(typeof InstrumentClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class InstrumentClass extends ResourceClass<InstrumentNode> {
  static readonly resourceType = 'instrument' as const

  public instrumentJSON: NonNullable<InstrumentClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: InstrumentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      InstrumentNode,
      InstrumentClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[InstrumentClass.resourceType].path),
      args,
    )

    this.instrumentJSON = args.json

    this.handleConflicts()
  }
}
