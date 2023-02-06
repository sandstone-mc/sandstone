import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type {
  CONTAINER_SLOTS, Coordinates, ENTITY_SLOTS, ItemModifierJSON, MultipleEntitiesArgument,
} from '#arguments'

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
} & ResourceClassArguments<'list'>

export class ItemModifierClass extends ResourceClass<ItemModifierNode> {
  public itemModifierJSON: NonNullable<ItemModifierClassArguments['itemModifier']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: ItemModifierClassArguments) {
    super(sandstoneCore, sandstoneCore.pack.dataPack(), 'json', ItemModifierNode, sandstoneCore.pack.resourceToPath(name, ['item_modifiers']), args)

    this.itemModifierJSON = args.itemModifier
  }

  // TODO: Add list methods

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
