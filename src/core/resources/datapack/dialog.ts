import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.dialogJSON)
}

export type DialogClassArguments = {
  /**
   * The dialog's JSON.
   */
  json: SymbolResource[(typeof DialogClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class DialogClass extends ResourceClass<DialogNode> {
  static readonly resourceType = 'dialog' as const

  public dialogJSON: NonNullable<DialogClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: DialogClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      DialogNode,
      DialogClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[DialogClass.resourceType].path),
      args,
    )

    this.dialogJSON = args.json

    this.handleConflicts()
  }
}
