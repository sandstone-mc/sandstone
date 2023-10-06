import { CommandNode } from 'sandstone/core/nodes.js'

import { CommandArguments } from '../../helpers.js'

export class SetIdleTimeoutCommandNode extends CommandNode {
  command = 'setidletimeout' as const
}

export class SetIdleTimeoutCommand extends CommandArguments {
  protected NodeType = SetIdleTimeoutCommandNode

  setidletimeout = (minutes: number) => this.finalCommand([minutes])
}
