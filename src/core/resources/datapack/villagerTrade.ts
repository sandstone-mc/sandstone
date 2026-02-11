import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft villager trade.
 */
export class VillagerTradeNode extends ContainerNode implements ResourceNode<VillagerTradeClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: VillagerTradeClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.villagerTradeJSON)
}

export type VillagerTradeClassArguments = {
  /**
   * The villager trade's JSON.
   */
  json: SymbolResource[(typeof VillagerTradeClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class VillagerTradeClass extends ResourceClass<VillagerTradeNode> {
  static readonly resourceType = 'villager_trade' as const

  public villagerTradeJSON: NonNullable<VillagerTradeClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: VillagerTradeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      VillagerTradeNode,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[VillagerTradeClass.resourceType].path),
      args,
    )

    this.villagerTradeJSON = args.json

    this.handleConflicts()
  }
}

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
  json: SymbolResource[(typeof TradeSetClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TradeSetClass extends ResourceClass<TradeSetNode> {
  static readonly resourceType = 'trade_set' as const

  public tradeSetJSON: NonNullable<TradeSetClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TradeSetClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TradeSetNode,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TradeSetClass.resourceType].path),
      args,
    )

    this.tradeSetJSON = args.json

    this.handleConflicts()
  }
}
