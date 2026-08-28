import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

/**
 * A node representing a Minecraft dialog.
 */
export class DialogNode extends ContainerNode implements ResourceNode<DialogClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: DialogClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type DialogClassArguments = {
  /**
   * The dialog's JSON.
   */
  json: JsonSymbolResource[(typeof DialogClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class DialogClass extends ResourceClass<DialogNode> implements JsonResource {
  static readonly resourceType = 'dialog' as const

  public json: NonNullable<DialogClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: DialogClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      DialogNode,
      DialogClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[DialogClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
