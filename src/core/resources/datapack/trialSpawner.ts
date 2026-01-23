import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

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

  getValue = () => JSON.stringify(this.resource.trialSpawnerJSON)
}

export type TrialSpawnerClassArguments = {
  /**
   * The trial spawner configuration's JSON.
   */
  trialSpawner: SymbolResource['trial_spawner']
} & ResourceClassArguments<'default'>

export class TrialSpawnerClass extends ResourceClass<TrialSpawnerNode> {
  public trialSpawnerJSON: NonNullable<TrialSpawnerClassArguments['trialSpawner']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrialSpawnerClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TrialSpawnerNode,
      sandstoneCore.pack.resourceToPath(name, ['trial_spawner']),
      args,
    )

    this.trialSpawnerJSON = args.trialSpawner

    this.handleConflicts()
  }
}
