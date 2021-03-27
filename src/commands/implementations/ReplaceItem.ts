import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { coordinatesParser } from '@variables'

import type {
  CONTAINER_SLOTS, Coordinates, ENTITY_SLOTS, ITEMS, MultipleEntitiesArgument,
} from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'

/** Replaces items in inventories. */
export class ReplaceItem extends Command {
    /**
     * Replaces items in the inventory of a block with the given item(s).
     *
     * @param pos Specifies the position of the block to be modified.
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
     * Other blocks which hold items but don't have inventory GUIs (flower pots and jukeboxes) can only be changed with /data.
     *
     * @param item Specifies the item to be placed in the block's inventory slot.
     *
     * @param count Specifies the number of items to be placed.
     */
    @command(['replaceitem', 'block'], { isRoot: true, parsers: { '0': coordinatesParser } })
    block = (pos: Coordinates, slot: CONTAINER_SLOTS, item: LiteralUnion<ITEMS>, count?: number) => { }

    /**
     * Replaces items in the inventories of entities (players or mobs) with the given item(s).
     *
     * @param targets Specifies one or more entities to modify.
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
     * @param item Specifies the item to be placed in the entities' inventory slot.
     *
     * @param count Specifies the number of items to be placed.
     */
    @command(['replaceitem', 'entity'], { isRoot: true })
    entity = (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS, item: LiteralUnion<ITEMS>, count?: number) => { }
}
