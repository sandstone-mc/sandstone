import { CommandNode } from '#core/nodes'
import { JSONTextComponentClass } from '#variables'

import { CommandArguments } from '../../helpers'

import type { JSONTextComponent, MultiplePlayersArgument } from '#arguments'

export class TellRawCommandNode extends CommandNode {
  command = 'tellraw' as const
}

export class TellRawCommand extends CommandArguments {
  protected NodeType = TellRawCommandNode

  tellraw = (targets: MultiplePlayersArgument, message: JSONTextComponent) => this.finalCommand([targets, new JSONTextComponentClass(message)])
}
