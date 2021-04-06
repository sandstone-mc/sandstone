import { CONFLICT_STRATEGIES } from '@/env'

import { ResourceInstance } from './Resource'

import type { PredicateJSON } from 'src/arguments'
import type { BASIC_CONFLICT_STRATEGIES } from '@/generalTypes'
import type { Datapack } from '@datapack'
import type { ConditionClass } from '@variables'

export type PredicateOptions = {
  /**
   * What to do if another Predicate has the same name.
   *
   * - `throw`: Throw an error.
   * - `replace`: Replace silently the old Predicate with the new one.
   * - `ignore`: Keep silently the old Predicate, discarding the new one.
   */
  onConflict?: BASIC_CONFLICT_STRATEGIES
}

export class PredicateInstance extends ResourceInstance implements ConditionClass {
  predicateJSON

  constructor(datapack: Datapack, name: string, predicate: PredicateJSON, options?: PredicateOptions) {
    super(datapack, name)

    this.predicateJSON = predicate

    this.commandsRoot.Datapack.addResource(name, 'predicates', { predicate }, options?.onConflict ?? CONFLICT_STRATEGIES.PREDICATE)
  }

  /**
   * @internal
   */
  _toMinecraftCondition(): {value: any[]} {
    return {
      value: ['if', 'predicate', this.name],
    }
  }
}
