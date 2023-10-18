import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/variables'

export class SetIdleTimeoutCommandNode extends CommandNode {
  command = 'setidletimeout' as const
}

export class SetIdleTimeoutCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SetIdleTimeoutCommandNode

  setidletimeout = (minutes: number) => this.finalCommand([minutes])
}
