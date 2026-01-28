import type {
  CONTAINER_SLOTS,
  Coordinates,
  ENTITY_SLOTS,
  Registry,
  MultipleEntitiesArgument,
  SingleEntityArgumentOf,
  MultiplePlayersArgumentOf,
} from 'sandstone/arguments'
import { validateIntegerRange } from 'sandstone/commands/validators'
import type { LootTableClass, Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

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
    tool: Macroable<Registry['minecraft:item'], MACRO>,
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
  kill<T extends string>(target: SingleEntityArgumentOf<MACRO, T>) {
    return this.finalCommand(['kill', targetParser(target)])
  }

  /**
   * Drops items that would be dropped by mining the given block, with the given tool.
   *
   * @param pos Specifies the position of a block.
   *
   * @param tool Specifies an tool to mine. If unspecified, defaults to `mainhand`.
   */
  mine = (pos: Macroable<Coordinates<MACRO>, MACRO>, tool?: Macroable<Registry['minecraft:item'], MACRO>) =>
    this.finalCommand(['mine', coordinatesParser(pos), tool])
}

export class LootCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = LootCommandNode

  /**
   * Drop loot items in the world.
   *
   * @param targetPos Coordinates where items will be dropped.
   *                 Examples: [100, 70, 200], abs(0, 64, 0), rel(0, 1, 0)
   *
   * @example
   * ```ts
   * loot.spawn([100, 70, 200]).loot('minecraft:chests/simple_dungeon')
   * loot.spawn(rel(0, 1, 0)).kill('@e[type=zombie,limit=1]')
   * loot.spawn(abs(0, 64, 0)).mine(rel(0, -1, 0), 'minecraft:diamond_pickaxe')
   * ```
   */
  spawn = (targetPos: Macroable<Coordinates<MACRO>, MACRO>) =>
    this.subCommand(['spawn', coordinatesParser(targetPos)], LootSourceCommand, false)

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
    entity: (
      entities: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<ENTITY_SLOTS>, MACRO>,
      count?: Macroable<number, MACRO>,
    ) => {
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
    block: (
      targetPos: Macroable<Coordinates<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<CONTAINER_SLOTS>, MACRO>,
      count?: Macroable<number, MACRO>,
    ) => {
      if (count) validateIntegerRange(count, 'count', 0, 2_147_483_647)

      return this.subCommand(['replace', 'block', coordinatesParser(targetPos), slot, count], LootSourceCommand, false)
    },
  }

  /**
   * Give loot items to players.
   *
   * @param players Player selector to give items to.
   *               Examples: '@p', '@a', 'PlayerName'
   *
   * @example
   * ```ts
   * loot.give('@a').loot('minecraft:chests/end_city_treasure')
   * loot.give('@p').fish('minecraft:gameplay/fishing', rel(0, 0, 0), 'minecraft:fishing_rod')
   * ```
   */
  give<T extends string>(players: Macroable<MultiplePlayersArgumentOf<MACRO, T>, MACRO>) {
    return this.subCommand(['give', targetParser(players)], LootSourceCommand<MACRO>, false)
  }

  /**
   * Insert loot items into container block.
   *
   * @param targetPos Container block coordinates.
   *                 Examples: [100, 70, 200], abs(0, 64, 0)
   *
   * @example
   * ```ts
   * loot.insert([100, 70, 200]).loot('minecraft:chests/village_blacksmith')
   * loot.insert(abs(0, 64, 0)).mine(rel(0, -1, 0))
   * ```
   */
  insert = (targetPos: Macroable<Coordinates<MACRO>, MACRO>) =>
    this.subCommand(['insert', coordinatesParser(targetPos)], LootSourceCommand<MACRO>, false)
}
