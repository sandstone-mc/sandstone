import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments } from '../../helpers'

export class CommentCommandNode extends CommandNode<[unknown[]]> {
  command = '#' as const

  getValue() {
    return this.args[0]
      .join(' ')
      .split('\n')
      .map((line) => `# ${line}`)
      .join('\n')
  }
}

export class CommentCommand extends CommandArguments<typeof CommentCommandNode> {
  protected NodeType = CommentCommandNode

  /**
   * Add comments to generated functions.
   *
   * @param comments Text to include as comments in the function.
   *                Multiple arguments are joined with spaces.
   *                Supports multi-line comments.
   *
   * @example
   * ```ts
   * comment('This is a helpful comment')         // # This is a helpful comment
   * comment('Setup phase', 'for minigame')      // # Setup phase for minigame
   * comment('Multi\nline\ncomment')            // # Multi
   *                                              // # line
   *                                              // # comment
   * ```
   */
  comment = (...comments: unknown[]) => this.finalCommand([comments])
}
