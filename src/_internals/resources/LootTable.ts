import { ResourceClass } from './Resource'

import type { LiteralUnion } from '@/generalTypes'
import type {
  Coordinates, ENTITY_SLOTS, LootTableType, MultipleEntitiesArgument, MultiplePlayersArgument,
} from '@arguments'
import type { Datapack } from '@datapack'

export class LootTableClass extends ResourceClass {
  lootTableJson

  constructor(datapack: Datapack, name: string, lootTable: LootTableType) {
    super(datapack, name)

    this.lootTableJson = lootTable

    datapack.addResource(name, 'loot_tables', { lootTable })
  }

  /** Gives items to players, ignoring empty item stacks. */
  give = (players: MultiplePlayersArgument) => this.datapack.commandsRoot.loot.give(players).loot(this.name)

  /**
   * Distributes items to a container block.
   * @param targetPos Specifies the position of a block.
   */
  insert = (targetPos: Coordinates) => this.datapack.commandsRoot.loot.insert(targetPos).loot(this.name)

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
  replaceBlock = (targetPos: Coordinates, slot: string, count?: number) => this.datapack.commandsRoot.loot.replaceBlock(targetPos, slot, count).loot(this.name)

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
  replaceEntity = (entities: MultipleEntitiesArgument, slot: LiteralUnion<ENTITY_SLOTS>, count?: number) => this.datapack.commandsRoot.loot.replaceEntity(entities, slot, count).loot(this.name)
}
