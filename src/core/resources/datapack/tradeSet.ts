import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft trade set.
 */
export class TradeSetNode extends ContainerNode implements ResourceNode<TradeSetClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TradeSetClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.tradeSetJSON)
}

export type TradeSetClassArguments = {
  /**
   * The trade set's JSON.
   */
  tradeSet: SymbolResource['trade_set']
} & ResourceClassArguments<'default'>

export class TradeSetClass extends ResourceClass<TradeSetNode> {
  public tradeSetJSON: NonNullable<TradeSetClassArguments['tradeSet']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TradeSetClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TradeSetNode,
      sandstoneCore.pack.resourceToPath(name, ['trade_set']),
      args,
    )

    this.tradeSetJSON = args.tradeSet

    this.handleConflicts()
  }
}
