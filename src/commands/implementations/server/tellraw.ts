import { CommandNode } from 'sandstone/core/nodes'
import { JSONTextComponentClass } from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type { JSONTextComponent, MultiplePlayersArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/variables'

export class TellRawCommandNode extends CommandNode {
  command = 'tellraw' as const
}

export class TellRawCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TellRawCommandNode

  tellraw = (
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    message: Macroable<JSONTextComponent, MACRO>,
  /* @ts-ignore */
  ) => this.finalCommand([targets, typeof message === 'object' && message.toMacro ? message : new JSONTextComponentClass(message)])
}
