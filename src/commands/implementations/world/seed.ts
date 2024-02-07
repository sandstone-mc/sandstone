import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

export class SeedCommandNode extends CommandNode {
  command = 'seed' as const
}

export class SeedCommand extends CommandArguments {
  protected NodeType = SeedCommandNode

  /** Displays the world seed. */
  seed = () => this.finalCommand([])
}
