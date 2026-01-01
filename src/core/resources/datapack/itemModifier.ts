import type {
  CONTAINER_SLOTS,
  Coordinates,
  ENTITY_SLOTS,
  MultipleEntitiesArgument,
  SymbolResource,
} from 'sandstone/arguments'
import { targetParser } from 'sandstone/variables/parsers'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

/**
 * A node representing a Minecraft item modifier.
 */
export class ItemModifierNode extends ContainerNode implements ResourceNode<ItemModifierClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: ItemModifierClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.itemModifierJSON)
}

type ItemModifierJSON = SymbolResource['item_modifier']

export type ItemModifierClassArguments = {
  /**
   * The item modifier's JSON.
   */
  itemModifier: ItemModifierJSON
} & ResourceClassArguments<'list'>

type Modifier = ItemModifierJSON | ItemModifierClass

export class ItemModifierClass extends ResourceClass<ItemModifierNode> implements ListResource {
  public itemModifierJSON: ItemModifierClassArguments['itemModifier']

  constructor(sandstoneCore: SandstoneCore, name: string, args: ItemModifierClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      ItemModifierNode,
      sandstoneCore.pack.resourceToPath(name, ['item_modifier']),
      args,
    )

    this.itemModifierJSON = args.itemModifier

    this.handleConflicts()
  }

  public push(...modifiers: Modifier[]) {
    if (!Array.isArray(this.itemModifierJSON)) {
      this.itemModifierJSON = [this.itemModifierJSON]
    }

    for (const modifier of modifiers) {
      let modifierJSON: ItemModifierJSON
      if (modifier instanceof ItemModifierClass) {
        modifierJSON = modifier.itemModifierJSON
      } else {
        modifierJSON = modifier
      }
      if (Array.isArray(modifierJSON)) {
        this.itemModifierJSON.push(...modifierJSON)
      } else {
        this.itemModifierJSON.push(modifierJSON)
      }
    }
  }

  public unshift(...modifiers: Modifier[]) {
    if (!Array.isArray(this.itemModifierJSON)) {
      this.itemModifierJSON = [this.itemModifierJSON]
    }

    for (const modifier of modifiers) {
      let modifierJSON: ItemModifierJSON
      if (modifier instanceof ItemModifierClass) {
        modifierJSON = modifier.itemModifierJSON
      } else {
        modifierJSON = modifier
      }
      if (Array.isArray(modifierJSON)) {
        this.itemModifierJSON.unshift(...modifierJSON)
      } else {
        this.itemModifierJSON.unshift(modifierJSON)
      }
    }
  }

  get modify() {
    return {
      /**
       * @param pos The position of the container containing the slot to apply the modifier to.
       * @param slot The slot to apply the modifier to.
       */
      block: (pos: Coordinates<false>, slot: CONTAINER_SLOTS) => {
        this.pack.commands.item.modify.block(pos, slot, this)
      },
      /**
       * @param targets The entity/entities containing the slot to apply the modifier to.
       * @param slot The slot to apply the modifier to.
       * @param modifier The name of the modifier.
       */
      entity: (targets: MultipleEntitiesArgument<false>, slot: ENTITY_SLOTS) => {
        this.pack.commands.item.modify.entity(targetParser(targets), slot, this)
      },
    }
  }
}
