import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments, type FinalCommandOutput } from '../../commands/helpers'

export class SucceedCommandNode extends CommandNode {
  command = 'succeed' as const

  readonly testExclusive: boolean = true
}

export class SucceedCommand extends CommandArguments {
  protected NodeType = SucceedCommandNode

  /**
   * Succeeds the current test and returns from the function.
   *
   * Provided by the [PackTest](https://github.com/misode/packtest) server mod.
   *
   * @example
   * ```ts
   * succeed()
   * ```
   */
  succeed = (): FinalCommandOutput => this.finalCommand([])
}