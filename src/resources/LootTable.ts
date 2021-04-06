import { CONFLICT_STRATEGIES } from '@/env'

import { ResourceInstance } from './Resource'

import type {
  Coordinates, ENTITY_SLOTS, LootTableJSON, MultipleEntitiesArgument, MultiplePlayersArgument,
} from 'src/arguments'
import type { BASIC_CONFLICT_STRATEGIES, LiteralUnion } from '@/generalTypes'
import type { Datapack } from '@datapack'

export type LootTableOptions = {
  /**
   * What to do if another LootTable has the same name.
   *
   * - `throw`: Throw an error.
   * - `replace`: Replace silently the old LootTable with the new one.
   * - `ignore`: Keep silently the old LootTable, discarding the new one.
   */
  onConflict?: BASIC_CONFLICT_STRATEGIES
}

export class LootTableInstance extends ResourceInstance {
  lootTableJSON

  constructor(datapack: Datapack, name: string, lootTable: LootTableJSON, options?: LootTableOptions) {
    super(datapack, name)

    this.lootTableJSON = lootTable

    datapack.addResource(name, 'loot_tables', { lootTable }, options?.onConflict ?? CONFLICT_STRATEGIES.LOOT_TABLE)
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
