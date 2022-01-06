import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { coordinatesParser } from '@variables'

import type {
  CONTAINER_SLOTS, Coordinates, ENTITY_SLOTS, ITEMS, MultipleEntitiesArgument,
} from '@arguments'
import type { ItemModifierInstance } from '@resources'

export class ItemSource extends Command {
  /**
   * Replace the slot with a specific item.
   * @param item The item to replace the slot with.
   * @param count The amount of items.
   */
  @command('with')
    with = (item: ITEMS, count: number) => { }

  /**
   * Replace the slot with a specific item.
   * @param item The item to replace the slot with.
   * @param count The amount of items.
   */
  @command(['from', 'block'])
  private fromBlock = (...args: unknown[]) => { }

  @command(['from', 'entity'])
  private fromEntity = (...args: unknown[]) => { }

  /**
   * Replace the slot with a block or an entity's item
   */
  from: {
    /**
     * @param pos The coordinates of the container to copy items from.
     * @param slot The slot to copy the items from.
     * @param [modifier] An optional modifier to apply.
     */
    block: (pos: Coordinates, slot: CONTAINER_SLOTS, modifier?: string | ItemModifierInstance) => void

    /**
     * @param targets The entity to copy items from.
     * @param slot The slot to copy the items from.
     * @param [modifier] An optional modifier to apply.
     */
    entity: (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS, modifier?: string | ItemModifierInstance) => void
  } = {
    block: this.fromBlock,
    entity: this.fromEntity,
  }
}

export class ModifyItem extends Command {
  /**
   * @param pos The position of the container containing the slot to apply the modifier to.
   * @param slot The slot to apply the modifier to.
   * @param modifier The name of the modifier.
   */
  @command(['item', 'modify', 'block'], { isRoot: true, parsers: { '0': coordinatesParser } })
    block = (pos: Coordinates, slot: CONTAINER_SLOTS, modifier: string | ItemModifierInstance) => { }

  /**
   * @param targets The entity/entities containing the slot to apply the modifier to.
   * @param slot The slot to apply the modifier to.
   * @param modifier The name of the modifier.
   */
  @command(['item', 'modify', 'entity'], { isRoot: true })
    entity = (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS, modifier: string | ItemModifierInstance) => { }
}

export class ReplaceItem extends Command {
  /**
   * @param pos The position of the container containing the slot to be replaced.
   * @param slot The slot to be replaced.
   */
  @command(['item', 'replace', 'block'], {
    isRoot: true, hasSubcommands: true, executable: false, parsers: { '0': coordinatesParser },
  })
    block = (pos: Coordinates, slot: CONTAINER_SLOTS) => new ItemSource(this.commandsRoot)

  /**
   * @param targets one or more entities to modify.
   *.
   * @param slot The slot to be replaced.
   */
  @command(['item', 'replace', 'entity'], { isRoot: true, hasSubcommands: true, executable: false })
    entity = (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS) => new ItemSource(this.commandsRoot)
}

/** Replaces or modifies items in inventories */
export class Item extends Command {
  /** Applies a modifier to a slot in an inventory. */
  modify = new ModifyItem(this.commandsRoot)

  /** Replaces the content of a specific slot of an inventory with another. */
  replace = new ReplaceItem(this.commandsRoot)
}
