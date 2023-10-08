import { CommandNode } from 'sandstone/core/nodes'
import { JSONTextComponentClass } from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type { JSONTextComponent, MultiplePlayersArgument } from 'sandstone/arguments'

export class TellRawCommandNode extends CommandNode {
  command = 'tellraw' as const
}

export class TellRawCommand extends CommandArguments {
  protected NodeType = TellRawCommandNode

  tellraw = (targets: MultiplePlayersArgument, message: JSONTextComponent) => this.finalCommand([targets, new JSONTextComponentClass(message)])
}
