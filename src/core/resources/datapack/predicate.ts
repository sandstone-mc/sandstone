import type { Dispatcher } from 'sandstone/arguments'
import type { ConditionClass } from 'sandstone/variables'
import { ContainerNode } from '../../nodes.js'
import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource.js'
import { ResourceClass } from '../resource.js'

/**
 * A node representing a Minecraft predicate.
 */
export class PredicateNode extends ContainerNode implements ResourceNode<PredicateClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: PredicateClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.predicateJSON)
}

type PredicateJSON = Dispatcher<'minecraft:resource'>['predicate']

export type PredicateClassArguments = {
  /**
   * The predicate's JSON.
   */
  predicate: PredicateJSON
} & ResourceClassArguments<'list'>

type Predicate = PredicateJSON | PredicateClass

export class PredicateClass extends ResourceClass<PredicateNode> implements ListResource, ConditionClass {
  public predicateJSON: NonNullable<PredicateClassArguments['predicate']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: PredicateClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      PredicateNode,
      sandstoneCore.pack.resourceToPath(name, ['predicate']),
      args,
    )

    this.predicateJSON = args.predicate

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
    return this.predicateJSON
  }
}
