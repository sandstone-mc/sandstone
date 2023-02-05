import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type {
  CONTAINER_SLOTS, Coordinates, ENTITY_SLOTS, ItemModifierJSON, MultipleEntitiesArgument,
} from '#arguments'
import type { ResourcePath } from '#pack'

/**
 * A node representing a Minecraft item modifier.
 */
export class ItemModifierNode extends ContainerNode implements ResourceNode<ItemModifierClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: ItemModifierClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.itemModifierJSON)
}

export type ItemModifierClassArguments = {
  /**
   * The item modifier's JSON.
   */
  itemModifier: ItemModifierJSON
} & ResourceClassArguments

export class ItemModifierClass extends ResourceClass<ItemModifierNode> {
  public itemModifierJSON: NonNullable<ItemModifierClassArguments['itemModifier']>

  constructor(sandstoneCore: SandstoneCore, path: ResourcePath, args: ItemModifierClassArguments) {
    super(sandstoneCore, sandstoneCore.pack.dataPack(), 'json', 'utf8', ItemModifierNode, path, args)

    this.itemModifierJSON = args.itemModifier
  }

  get modify() {
    return {
      /**
       * @param pos The position of the container containing the slot to apply the modifier to.
       * @param slot The slot to apply the modifier to.
       */
      block: (pos: Coordinates, slot: CONTAINER_SLOTS) => {
        this.pack.commands.item.modify.block(pos, slot, this)
      },
      /**
       * @param targets The entity/entities containing the slot to apply the modifier to.
       * @param slot The slot to apply the modifier to.
       * @param modifier The name of the modifier.
       */
      entity: (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS) => {
        this.pack.commands.item.modify.entity(targets, slot, this)
      },
    }
  }
}
