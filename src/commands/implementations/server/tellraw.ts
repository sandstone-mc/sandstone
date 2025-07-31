import type { JSONTextComponent, MultiplePlayersArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { parseJSONText } from 'sandstone/variables/JSONTextComponentClass'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class TellRawCommandNode extends CommandNode {
  command = 'tellraw' as const
}

export class TellRawCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TellRawCommandNode

  tellraw = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>, message: Macroable<JSONTextComponent, MACRO>) =>
    this.finalCommand([targetParser(targets), parseJSONText(this.sandstoneCore, message)])
}
