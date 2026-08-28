import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../../nodes'
import type { SandstoneCore } from '../../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type TrialSpawnerClassArguments = {
  /**
   * The trial spawner configuration's JSON.
   */
  json: JsonSymbolResource[(typeof TrialSpawnerClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TrialSpawnerClass extends ResourceClass<TrialSpawnerNode> implements JsonResource {
  static readonly resourceType = 'trial_spawner' as const

  public json: NonNullable<TrialSpawnerClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrialSpawnerClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TrialSpawnerNode,
      TrialSpawnerClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TrialSpawnerClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
