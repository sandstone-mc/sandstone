import { CommandNode } from '@/next/core/nodes'

import { CommandArguments } from '../helpers'

export class SayNode extends CommandNode<['string']> {
  command = 'say' as const
}

export class SayCommand extends CommandArguments {
  NodeType = SayNode

  /**
   * /say a message.
   * @param message The message to say.
   */
  say = (message: string) => this.command([message])
}
