import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/variables'

// Say command

export class SayCommandNode extends CommandNode<['string']> {
  command = 'say' as const
}

export class SayCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SayCommandNode

  /**
   * /say a message.
   * @param message The message to say.
   */
  say = (message: string) => this.finalCommand([message])
}
