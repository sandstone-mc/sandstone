import type { MultiplePlayersArgument } from 'sandstone/arguments'
import type { Dialog } from 'sandstone/arguments/generated/data/dialog'
import type { DIALOGS } from 'sandstone/arguments/generated/_registry/dialogs'
import type { DialogClass, Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { ResourceClass } from 'sandstone/core/resources/resource'
import { nbtStringifier } from 'sandstone/variables'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments, type FinalCommandOutput } from '../../helpers'

export class DialogCommandNode extends CommandNode {
  command = 'dialog' as const
}

/**
 * Manages dialog screens displayed to players.
 *
 * @see https://minecraft.wiki/w/Commands/dialog
 */
export class DialogCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = DialogCommandNode

  /**
   * Shows a dialog screen to players.
   *
   * @param dialog Can be a registry ID, DialogClass, or inline dialog definition.
   */
  show(
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    dialog: Macroable<DIALOGS | DialogClass | Dialog, MACRO>,
  ): FinalCommandOutput {
    const dialogArg = typeof dialog === 'string' || dialog instanceof ResourceClass
      ? dialog
      : nbtStringifier(dialog as Dialog)
    return this.finalCommand(['show', targetParser(targets), dialogArg])
  }

  /**
   * Clears currently displayed dialogs for players.
   */
  clear = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>): FinalCommandOutput =>
    this.finalCommand(['clear', targetParser(targets)])
}
