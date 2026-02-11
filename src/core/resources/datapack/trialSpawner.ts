import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft trial spawner configuration.
 */
export class TrialSpawnerNode extends ContainerNode implements ResourceNode<TrialSpawnerClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TrialSpawnerClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.trialSpawnerJSON)
}

export type TrialSpawnerClassArguments = {
  /**
   * The trial spawner configuration's JSON.
   */
  json: SymbolResource[(typeof TrialSpawnerClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TrialSpawnerClass extends ResourceClass<TrialSpawnerNode> {
  static readonly resourceType = 'trial_spawner' as const

  public trialSpawnerJSON: NonNullable<TrialSpawnerClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrialSpawnerClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TrialSpawnerNode,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TrialSpawnerClass.resourceType].path),
      args,
    )

    this.trialSpawnerJSON = args.json

    this.handleConflicts()
  }
}
