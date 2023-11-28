import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/core'

export class CommentCommandNode extends CommandNode<[unknown[]]> {
  command = '#' as const

  getValue() {
    return this.args[0].join(' ').split('\n').map((line) => `# ${line}`).join('\n')
  }
}

export class CommentCommand extends CommandArguments<typeof CommentCommandNode> {
  protected NodeType = CommentCommandNode

  /**
   * Adds a comment, starting with a `# `, to the function.
   */
  comment = (...comments: unknown[]) => this.finalCommand([comments])
}
