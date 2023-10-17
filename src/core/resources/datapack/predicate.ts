import { ContainerNode } from '../../nodes.js'
import { ResourceClass } from '../resource.js'

import type { ConditionClass } from 'sandstone/variables'
import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource.js'
import type { PredicateJSON } from 'sandstone/arguments'

/**
 * A node representing a Minecraft predicate.
 */
export class PredicateNode extends ContainerNode implements ResourceNode<PredicateClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: PredicateClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.predicateJSON)
}

export type PredicateClassArguments = {
  /**
   * The predicate's JSON.
   */
  predicate?: PredicateJSON
} & ResourceClassArguments<'list'>

type Predicate = PredicateJSON | PredicateClass

export class PredicateClass extends ResourceClass<PredicateNode> implements ListResource, ConditionClass {
  public predicateJSON: NonNullable<PredicateClassArguments['predicate']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: PredicateClassArguments) {
    super(sandstoneCore, { packType: sandstoneCore.pack.dataPack(), extension: 'json' }, PredicateNode, sandstoneCore.pack.resourceToPath(name, ['predicates']), args)

    this.predicateJSON = args.predicate as PredicateJSON

    this.handleConflicts()
  }

  public push(...predicates: Predicate[]) {
    if (!Array.isArray(this.predicateJSON)) {
      this.predicateJSON = [this.predicateJSON]
    }

    for (const predicate of predicates) {
      let predicateJSON: PredicateJSON
      if (predicate instanceof PredicateClass) {
        predicateJSON = predicate.predicateJSON
      } else {
        predicateJSON = predicate
      }
      if (Array.isArray(predicateJSON)) {
        this.predicateJSON.push(...predicateJSON)
      } else {
        this.predicateJSON.push(predicateJSON)
      }
    }
  }

  public unshift(...predicates: Predicate[]) {
    if (!Array.isArray(this.predicateJSON)) {
      this.predicateJSON = [this.predicateJSON]
    }

    for (const predicate of predicates) {
      let predicateJSON: PredicateJSON
      if (predicate instanceof PredicateClass) {
        predicateJSON = predicate.predicateJSON
      } else {
        predicateJSON = predicate
      }
      if (Array.isArray(predicateJSON)) {
        this.predicateJSON.unshift(...predicateJSON)
      } else {
        this.predicateJSON.unshift(predicateJSON)
      }
    }
  }

  /** @internal */
  _toMinecraftCondition = () => new this.pack.conditions.Predicate(this.core, this.name)

  /** @internal */
  toJSON() {
    if (Array.isArray(this.predicateJSON)) {
      return {
        condition: 'minecraft:all_of',
        terms: this.predicateJSON,
      } as PredicateJSON
    }
    return this.predicateJSON
  }
}
