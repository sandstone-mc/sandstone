import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../../nodes'
import type { SandstoneCore } from '../../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type VillagerTradeClassArguments = {
  /**
   * The villager trade's JSON.
   */
  json: JsonSymbolResource[(typeof VillagerTradeClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class VillagerTradeClass extends ResourceClass<VillagerTradeNode> implements JsonResource {
  static readonly resourceType = 'villager_trade' as const

  public json: NonNullable<VillagerTradeClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: VillagerTradeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      VillagerTradeNode,
      VillagerTradeClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[VillagerTradeClass.resourceType].path),
      args,
    )

    this.json = args.json

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type TradeSetClassArguments = {
  /**
   * The trade set's JSON.
   */
  json: JsonSymbolResource[(typeof TradeSetClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TradeSetClass extends ResourceClass<TradeSetNode> implements JsonResource {
  static readonly resourceType = 'trade_set' as const

  public json: NonNullable<TradeSetClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TradeSetClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TradeSetNode,
      TradeSetClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TradeSetClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
