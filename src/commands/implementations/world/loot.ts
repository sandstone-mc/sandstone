import { validateIntegerRange } from 'sandstone/commands/validators'
import { CommandNode } from 'sandstone/core'
import { coordinatesParser, targetParser } from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type {
  CONTAINER_SLOTS,
  Coordinates, ENTITY_SLOTS, ITEMS, MultipleEntitiesArgument, MultiplePlayersArgument, SingleEntityArgument,
} from 'sandstone/arguments'
import type { LootTableClass } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'
import type { Macroable } from 'sandstone/variables'

type LootTableArgument<MACRO extends boolean> = Macroable<LootTableClass | string, MACRO>

export class LootCommandNode extends CommandNode {
  command = 'loot' as const
}

class LootSourceCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Drops items that would be dropped by fishing with the given loot table, and the given tool.
   *
   * @param lootTable Specifies which loot table to use.
   *
   * @param pos Specifies the position of a block.
   *
   * @param tool Specifies an tool to fish.
   */
  fish = (
    lootTable: LootTableArgument<MACRO>,
    pos: Macroable<Coordinates<MACRO>, MACRO>,
    tool: Macroable<LiteralUnion<ITEMS>, MACRO>,
  ) => this.finalCommand(['fish', lootTable, coordinatesParser(pos), tool])

  /**
   * Drops items that would be dropped by the given loot table.
   *
   * @param lootTable Specifies which loot table to use.
   */
  loot = (lootTable: LootTableArgument<MACRO>) => this.finalCommand(['loot', lootTable])

  /**
   * Drops items that would be dropped by killing the given entity.
   *
   * @param target Specifies one entity to kill simulatively.
   */
  kill = (target: SingleEntityArgument<MACRO>) => this.finalCommand(['kill', targetParser(target)])

  /**
   * Drops items that would be dropped by mining the given block, with the given tool.
   *
   * @param pos Specifies the position of a block.
   *
   * @param tool Specifies an tool to mine.
   */
  mine = (pos: Macroable<Coordinates<MACRO>, MACRO>, tool: Macroable<LiteralUnion<ITEMS>, MACRO>) => this.finalCommand(['mine', coordinatesParser(pos), tool])
}

/** Drops the given loot table into the specified inventory or into the world. */
export class LootCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = LootCommandNode

  /**
   * Spawns item entities.
   * @param targetPos Specifies the location where item drops.
   */
  spawn = (targetPos: Macroable<Coordinates<MACRO>, MACRO>) => this.subCommand(['spawn', coordinatesParser(targetPos)], LootCommand, false)

  replace = {

    /**
     * Distributes items to entities.
     *
     * @param entities Specifies one or more entities to modify
     *
     * @param slot Specifies the inventory slot to be modified. Must be one of the following:
     *
     * - `armor.chest`, `armor.feet`, `armor.head`, `armor.legs`, `weapon.mainhand`, `weapon.offhand`:
     *   for armor stands, mobs, and players only (though not all mobs show or make use of the items).
     *
     * - `container.<slot_number>`: for players, item frames (slot 0), and minecarts only.
     *
     * - `enderchest.slot_number`, `hotbar.slot_number`, `inventory.slot_number`: for players only.
     *
     * - `horse.saddle`: horses, donkeys, and mules only; *item* must be a saddle.
     *
     * - `horse.chest`: donkeys, and mules only; *item* must be a chest.
     *
     * - `horse.armor`: horses and llamas only; *item* must be a type of horse armor (if a horse) or a carpet (if a llama).
     *
     * - `horse.slot_number`: donkeys and mules with chests only.
     *
     * - `villager.slot_number`: villagers only.
     *
     * @param count Specifies the number of consecutive slots to be filled. Must be between 0 and 2147483647 (inclusive).
     */
    entity: (entities: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>, slot: Macroable<LiteralUnion<ENTITY_SLOTS>, MACRO>, count?: Macroable<number, MACRO>) => {
      if (count) validateIntegerRange(count, 'count', 0, 2_147_483_647)

      return this.subCommand(['replace', 'entity', targetParser(entities), slot, count], LootSourceCommand, false)
    },

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
    block: (targetPos: Macroable<Coordinates<MACRO>, MACRO>, slot: Macroable<LiteralUnion<CONTAINER_SLOTS>, MACRO>, count?: Macroable<number, MACRO>) => {
      if (count) validateIntegerRange(count, 'count', 0, 2_147_483_647)

      return this.subCommand(['replace', 'block', coordinatesParser(targetPos), slot, count], LootSourceCommand, false)
    },
  }

  /**
   * Gives items to players, ignoring empty item stacks.
   *
   * @param players Specifies one or more players to give.
   */
  give = (players: Macroable<MultiplePlayersArgument<MACRO>, MACRO>) => this.subCommand(['give', targetParser(players)], LootSourceCommand<MACRO>, false)

  /**
   * Distributes items to a container block.
   *
   * @param targetPos Specifies the position of a block.
   */
  insert = (targetPos: Macroable<Coordinates<MACRO>, MACRO>) => this.subCommand(['insert', coordinatesParser(targetPos)], LootSourceCommand<MACRO>, false)
}
