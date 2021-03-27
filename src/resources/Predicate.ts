import { ResourceInstance } from './Resource'

import type { PredicateJSON } from 'src/arguments'
import type { Datapack } from '@datapack'
import type { ConditionClass } from '@variables'

export class PredicateInstance extends ResourceInstance implements ConditionClass {
  predicateJson

  constructor(datapack: Datapack, name: string, predicate: PredicateJSON) {
    super(datapack, name)

    this.predicateJson = predicate

    this.commandsRoot.Datapack.addResource(name, 'predicates', { predicate })
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
