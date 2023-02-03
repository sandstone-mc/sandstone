import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type { PredicateJSON } from '#arguments'
import type { ResourcePath } from '#pack'

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
  predicate: PredicateJSON
} & ResourceClassArguments

export class PredicateClass extends ResourceClass<PredicateNode> {
  public predicateJSON: NonNullable<PredicateClassArguments['predicate']>

  constructor(sandstoneCore: SandstoneCore, path: ResourcePath, args: PredicateClassArguments) {
    super(sandstoneCore, sandstoneCore.pack.dataPack(), 'json', 'utf8', PredicateNode, path, args)

    this.predicateJSON = args.predicate
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
