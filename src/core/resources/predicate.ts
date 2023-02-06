import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type { PredicateJSON } from '#arguments'

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
} & ResourceClassArguments<'list'>

export class PredicateClass extends ResourceClass<PredicateNode> {
  public predicateJSON: NonNullable<PredicateClassArguments['predicate']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: PredicateClassArguments) {
    super(sandstoneCore, sandstoneCore.pack.dataPack(), 'json', PredicateNode, sandstoneCore.pack.resourceToPath(name, ['predicates']), args)

    this.predicateJSON = args.predicate
  }

  // TODO: Add list methods

  /**
   * @internal
   */
  _toMinecraftCondition(): {value: any[]} {
    return {
      value: ['if', 'predicate', this.name],
    }
  }
}
