import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { LiteralUnion } from 'sandstone/utils'
import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type {
  Coordinates, ENTITY_SLOTS, LootTableJSON, MultipleEntitiesArgument, MultiplePlayersArgument,
} from '#arguments'

/**
 * A node representing a Minecraft loot table.
 */
export class LootTableNode extends ContainerNode implements ResourceNode<LootTableClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: LootTableClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.lootTableJSON)
}

export type LootTableClassArguments = {
  /**
   * The loot table's JSON.
   */
  lootTable: LootTableJSON
} & ResourceClassArguments<'default'>

export class LootTableClass extends ResourceClass<LootTableNode> {
  public lootTableJSON: NonNullable<LootTableClassArguments['lootTable']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: LootTableClassArguments) {
    super(sandstoneCore, sandstoneCore.pack.dataPack(), 'json', LootTableNode, sandstoneCore.pack.resourceToPath(name, ['loot_tables']), args)

    this.lootTableJSON = args.lootTable
  }

  /**
   * Gives items, ignoring empty item stacks.
   * @param players Optional. Specifies the player(s). Defaults to `@s`.
   */
  give = (players: MultiplePlayersArgument = '@s') => this.pack.commands.loot.give(players).loot(this.name)

  /**
   * Distributes items to container.
   * @param targetPos Optional. Specifies the position of the block. Defaults to `~ ~ ~`.
   */
  insert = (targetPos: Coordinates = '~ ~ ~') => this.pack.commands.loot.insert(targetPos).loot(this.name)

  /**
   * Replace a container block slot with the items.
   * @param targetPos Specifies the position of a block.
   *
   * @param slot Specifies the inventory slot to be modified.
   * Must be must be `container.<slot_number>` where `<slot_number>` is replaced with a number specifying the slot.
   *
   * - Chests, dispensers, droppers, hoppers, and trapped chests are numbered 0 for the top-left slot and then increase
   *   first horizontally, then vertically (so, for example, a chest's top row slots are numbered 0 to 8 from left to right).
   *   Double chests and double trapped chests are treated as two single container blocks.
   * - A brewing stand's bottom slots are numbered 0 to 2 from left to right, its top slot is 3 and the fuel slot is 4.
   * - A furnace's slots are numbered 0 for the input slot, 1 for the fuel slot, and 2 for the output slot.
   *
   * @param count Specifies the number of consecutive slots to be filled. Must be between 0 and 2147483647 (inclusive).
   */
  replaceBlock = (targetPos: Coordinates, slot: string, count?: number) => this.pack.commands.loot.replace.block(targetPos, slot, count).loot(this.name)

  /**
   * Replace an entity slot with the items.
   *
   * @param targetPos Specifies the position of a block.
   *
   * @param slot Specifies the inventory slot to be modified.
   * Must be must be `container.<slot_number>` where `<slot_number>` is replaced with a number specifying the slot.
   *
   * - Chests, dispensers, droppers, hoppers, and trapped chests are numbered 0 for the top-left slot and then increase
   *   first horizontally, then vertically (so, for example, a chest's top row slots are numbered 0 to 8 from left to right).
   *   Double chests and double trapped chests are treated as two single container blocks.
   * - A brewing stand's bottom slots are numbered 0 to 2 from left to right, its top slot is 3 and the fuel slot is 4.
   * - A furnace's slots are numbered 0 for the input slot, 1 for the fuel slot, and 2 for the output slot.
   *
   * @param count Specifies the number of consecutive slots to be filled. Must be between 0 and 2147483647 (inclusive).
   */
  replaceEntity = (entities: MultipleEntitiesArgument, slot: LiteralUnion<ENTITY_SLOTS>, count?: number) => this.pack.commands.loot.replace.entity(entities, slot, count).loot(this.name)

  toString = () => this.name

  toJSON = this.toString
}
