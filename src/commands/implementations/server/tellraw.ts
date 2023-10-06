import { CommandNode } from 'sandstone/core/nodes.js'
import { JSONTextComponentClass } from 'sandstone/variables/index.js'

import { CommandArguments } from '../../helpers.js'

import type { JSONTextComponent, MultiplePlayersArgument } from 'sandstone/arguments/index.js'

export class TellRawCommandNode extends CommandNode {
  command = 'tellraw' as const
}

export class TellRawCommand extends CommandArguments {
  protected NodeType = TellRawCommandNode

  tellraw = (targets: MultiplePlayersArgument, message: JSONTextComponent) => this.finalCommand([targets, new JSONTextComponentClass(message)])
}
