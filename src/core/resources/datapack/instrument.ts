import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

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

  getValue = () => JSON.stringify(this.resource.instrumentJSON)
}

export type InstrumentClassArguments = {
  /**
   * The instrument's JSON.
   */
  instrument: SymbolResource['instrument']
} & ResourceClassArguments<'default'>

export class InstrumentClass extends ResourceClass<InstrumentNode> {
  public instrumentJSON: NonNullable<InstrumentClassArguments['instrument']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: InstrumentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      InstrumentNode,
      sandstoneCore.pack.resourceToPath(name, ['instrument']),
      args,
    )

    this.instrumentJSON = args.instrument

    this.handleConflicts()
  }
}
