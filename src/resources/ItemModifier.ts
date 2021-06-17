import { CONFLICT_STRATEGIES } from '@/env'

import { ResourceInstance } from './Resource'

import type { BASIC_CONFLICT_STRATEGIES } from '@/generalTypes'
import type { Datapack } from '@datapack'
import { ItemModifierJSON } from '@arguments'

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
}
