import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/variables'

export class SeedCommandNode extends CommandNode {
  command = 'seed' as const
}

export class SeedCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = SeedCommandNode

  /** Displays the world seed. */
  seed = () => this.finalCommand([])
}
