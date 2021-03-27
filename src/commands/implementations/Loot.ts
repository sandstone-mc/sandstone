import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { validateIntegerRange } from '@commands/validators'
import { coordinatesParser } from '@variables'

import type {
  CONTAINER_SLOTS,
  Coordinates, ENTITY_SLOTS, MultipleEntitiesArgument, MultiplePlayersArgument, SingleEntityArgument,
} from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'

class LootSource extends Command {
  /**
   * Drops items that would be dropped by fishing with the given loot table, and the given tool.
   *
   * @param lootTable Specifies which loot table to use.
   *
   * @param pos Specifies the position of a block.
   *
   * @param tool Specifies an tool to fish.
   */
  @command('fish', { parsers: { '0': coordinatesParser } })
  fish = (lootTable: string, pos: Coordinates, tool: LiteralUnion<'mainhand' | 'offhand'>) => { }

  /**
   * Drops items that would be dropped by the given loot table.
   *
   * @param lootTable Specifies which loot table to use.
   */

  @command('loot')
  loot = (lootTable: string) => { }

  /**
   * Drops items that would be dropped by killing the given entity.
   *
   * @param target Specifies one entity to kill simulatively.
   */
  @command('kill')
  kill = (target: SingleEntityArgument) => { }

  /**
   * Drops items that would be dropped by mining the given block, with the given tool.
   *
   * @param pos Specifies the position of a block.
   *
   * @param tool Specifies an tool to mine.
   */
  @command('mine', { parsers: { '0': coordinatesParser } })
  mine = (pos: Coordinates, tool: LiteralUnion<'mainhand' | 'offhand'>) => { }
}

/** Drops the given loot table into the specified inventory or into the world. */
export class Loot extends Command {
  /**
   * Spawns item entities.
   * @param targetPos Specifies the location where item drops.
   */
  @command(['loot', 'spawn'], {
    isRoot: true, hasSubcommands: true, executable: false, parsers: { '0': coordinatesParser },
  })
  spawn = (targetPos: Coordinates) => new LootSource(this.commandsRoot)

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
  @command(['loot', 'replace', 'entity'], { isRoot: true, hasSubcommands: true, executable: false })
  replaceEntity = (entities: MultipleEntitiesArgument, slot: LiteralUnion<ENTITY_SLOTS>, count?: number) => {
    if (count) validateIntegerRange(count, 'count', 0, 2_147_483_647)

    return new LootSource(this.commandsRoot)
  }

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
  @command(['loot', 'replace', 'block'], {
    isRoot: true, hasSubcommands: true, executable: false, parsers: { '0': coordinatesParser },
  })
  replaceBlock = (targetPos: Coordinates, slot: LiteralUnion<CONTAINER_SLOTS>, count?: number) => {
    if (count) validateIntegerRange(count, 'count', 0, 2_147_483_647)

    return new LootSource(this.commandsRoot)
  }

  /**
   * Gives items to players, ignoring empty item stacks.
   *
   * @param players Specifies one or more players to give.
   */
  @command(['loot', 'give'], { isRoot: true, hasSubcommands: true, executable: false })
  give = (players: MultiplePlayersArgument) => new LootSource(this.commandsRoot)

  /**
   * Distributes items to a container block.
   *
   * @param targetPos Specifies the position of a block.
   */
  @command(['loot', 'insert'], {
    isRoot: true, hasSubcommands: true, executable: false, parsers: { '0': coordinatesParser },
  })
  insert = (targetPos: Coordinates) => new LootSource(this.commandsRoot)
}
