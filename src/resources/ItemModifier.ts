import { CONFLICT_STRATEGIES } from '@/env'

import { ResourceInstance } from './Resource'

import type { BASIC_CONFLICT_STRATEGIES } from '@/generalTypes'
import type { Datapack } from '@datapack'
import { CONTAINER_SLOTS, Coordinates, ItemModifierJSON } from '@arguments'
import { ENTITY_SLOTS, item, MultipleEntitiesArgument } from '..'

export type ItemModifierOptions = {
  /**
   * What to do if another Item modifier has the same name.
   *
   * - `throw`: Throw an error.
   * - `replace`: Replace silently the old Predicate with the new one.
   * - `ignore`: Keep silently the old Predicate, discarding the new one.
   */
  onConflict?: BASIC_CONFLICT_STRATEGIES
}

export class ItemModifierInstance extends ResourceInstance {
  modifierJSON

  constructor(datapack: Datapack, name: string, modifier: ItemModifierJSON, options?: ItemModifierOptions) {
    super(datapack, name)

    this.modifierJSON = modifier

    this.commandsRoot.Datapack.addResource(name, 'item_modifiers', { modifier }, options?.onConflict ?? CONFLICT_STRATEGIES.PREDICATE)
  }

  get modify() {
    return {
      /**
       * @param pos The position of the container containing the slot to apply the modifier to.
       * @param slot The slot to apply the modifier to.
       */
      block: (pos: Coordinates, slot: CONTAINER_SLOTS) => {
        item.modify.block(pos, slot, this)
      },
      /**
       * @param targets The entity/entities containing the slot to apply the modifier to.
       * @param slot The slot to apply the modifier to.
       * @param modifier The name of the modifier.
       */
      entity: (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS) => {
        item.modify.entity(targets, slot, this)
      }
    }
  }
}
