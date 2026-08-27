import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../../nodes'
import type { SandstoneCore } from '../../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../../resource'
import { ResourceClass, jsonStringify } from '../../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

/**
 * A node representing a Minecraft sulfur cube archetype.
 */
export class SulfurCubeArchetypeNode extends ContainerNode implements ResourceNode<SulfurCubeArchetypeClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: SulfurCubeArchetypeClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.sulfurCubeArchetypeJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type SulfurCubeArchetypeClassArguments = {
  /**
   * The sulfur cube archetype's JSON.
   */
  json: JsonSymbolResource[(typeof SulfurCubeArchetypeClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class SulfurCubeArchetypeClass extends ResourceClass<SulfurCubeArchetypeNode> {
  static readonly resourceType = 'sulfur_cube_archetype' as const

  public sulfurCubeArchetypeJSON: NonNullable<SulfurCubeArchetypeClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: SulfurCubeArchetypeClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      SulfurCubeArchetypeNode,
      SulfurCubeArchetypeClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[SulfurCubeArchetypeClass.resourceType].path),
      args,
    )

    this.sulfurCubeArchetypeJSON = args.json

    this.handleConflicts()
  }
}