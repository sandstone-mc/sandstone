import { RESOURCE_PATHS } from 'sandstone/arguments'
import type { ConditionClass } from 'sandstone/variables'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { JsonResource, ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

type PredicateJSON = NonNullable<JsonSymbolResource['predicate']>

export type PredicateClassArguments = {
  /**
   * The predicate's JSON.
   */
  json: JsonSymbolResource[(typeof PredicateClass)['resourceType']]
} & ResourceClassArguments<'list'>

type Predicate = PredicateJSON | PredicateClass

export class PredicateClass extends ResourceClass<PredicateNode> implements ListResource, ConditionClass, JsonResource {
  declare readonly __conditionClassBrand: true

  static readonly resourceType = 'predicate' as const

  public json: NonNullable<PredicateClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: PredicateClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      PredicateNode,
      PredicateClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[PredicateClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }

  public push(...predicates: Predicate[]) {
    if (!Array.isArray(this.json)) {
      this.json = { type: 'all_of', terms: [this.json] }
    }

    for (const predicate of predicates) {
      let predicateJSON: PredicateJSON
      if (predicate instanceof PredicateClass) {
        predicateJSON = predicate.json
      } else {
        predicateJSON = predicate
      }
      if (Array.isArray(predicateJSON)) {
        ;(this.json as any).terms.push(...predicateJSON)
      } else {
        ;(this.json as any).terms.push(predicateJSON)
      }
    }
  }

  public unshift(...predicates: Predicate[]) {
    if (!Array.isArray(this.json)) {
      this.json = { type: 'all_of', terms: [this.json] }
    }

    for (const predicate of predicates) {
      let predicateJSON: PredicateJSON
      if (predicate instanceof PredicateClass) {
        predicateJSON = predicate.json
      } else {
        predicateJSON = predicate
      }
      if (Array.isArray(predicateJSON)) {
        ;(this.json as any).terms.unshift(...predicateJSON)
      } else {
        ;(this.json as any).terms.unshift(predicateJSON)
      }
    }
  }

  /** @internal */
  _toMinecraftCondition = () => new this.pack.conditions.Predicate(this.core, this.name)

  /** @internal */
  toJSON() {
    return this.json
  }
}
