import type { SymbolResource } from 'sandstone/arguments'
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
  dialog: SymbolResource['dialog']
} & ResourceClassArguments<'default'>

export class DialogClass extends ResourceClass<DialogNode> {
  public dialogJSON: NonNullable<DialogClassArguments['dialog']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: DialogClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      DialogNode,
      sandstoneCore.pack.resourceToPath(name, ['dialog']),
      args,
    )

    this.dialogJSON = args.dialog

    this.handleConflicts()
  }
}
