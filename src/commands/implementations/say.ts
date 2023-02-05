import { CommandNode } from '#core/nodes'

import { CommandArguments } from '../helpers'

// Say command

export class SayCommandNode extends CommandNode<['string']> {
  command = 'say' as const
}

export class SayCommand extends CommandArguments {
  protected NodeType = SayCommandNode

  /**
   * /say a message.
   * @param message The message to say.
   */
  say = (message: string) => this.finalCommand([message])
}
