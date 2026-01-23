import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

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

  getValue = () => JSON.stringify(this.resource.villagerTradeJSON)
}

export type VillagerTradeClassArguments = {
  /**
   * The villager trade's JSON.
   */
  villagerTrade: SymbolResource['villager_trade']
} & ResourceClassArguments<'default'>

export class VillagerTradeClass extends ResourceClass<VillagerTradeNode> {
  public villagerTradeJSON: NonNullable<VillagerTradeClassArguments['villagerTrade']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: VillagerTradeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      VillagerTradeNode,
      sandstoneCore.pack.resourceToPath(name, ['villager_trade']),
      args,
    )

    this.villagerTradeJSON = args.villagerTrade

    this.handleConflicts()
  }
}
