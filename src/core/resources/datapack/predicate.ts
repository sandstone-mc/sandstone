import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import type { ConditionClass } from 'sandstone/variables'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.predicateJSON)
}

type PredicateJSON = NonNullable<SymbolResource['predicate']>

export type PredicateClassArguments = {
  /**
   * The predicate's JSON.
   */
  json: SymbolResource[(typeof PredicateClass)['resourceType']]
} & ResourceClassArguments<'list'>

type Predicate = PredicateJSON | PredicateClass

export class PredicateClass extends ResourceClass<PredicateNode> implements ListResource, ConditionClass {
  static readonly resourceType = 'predicate' as const

  public predicateJSON: NonNullable<PredicateClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: PredicateClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      PredicateNode,
      PredicateClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[PredicateClass.resourceType].path),
      args,
    )

    this.predicateJSON = args.json

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
