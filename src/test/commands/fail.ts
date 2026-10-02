import type { JSONTextComponent } from 'sandstone/arguments'
import { parseJSONText } from 'sandstone/variables/JSONTextComponentClass'
import { CommandArguments, type FinalCommandOutput } from '../../commands/helpers'
import { setParentTestMCFunction, ThrowableCommandNode } from './_throwable'

export class FailCommandNode extends ThrowableCommandNode<[unknown]> {
  command = 'fail' as const
}

export class FailCommand extends CommandArguments {
  protected NodeType = FailCommandNode

  /**
   * Wraps `CommandArguments.finalCommand` to capture the call site for
   * the failure's stack trace, and to associate the resulting node with
   * the currently-active test mcfunction so `getValue()` knows where to
   * register its throwable entry. See `AssertCommand.finalCommand`.
   */
  protected finalCommand = (
    args?: unknown[],
    currentNode?: unknown,
  ): FinalCommandOutput => {
    const out = this.finalCommandWithStackTrace(args, currentNode as never)
    setParentTestMCFunction(out, this.sandstoneCore.currentMCFunction as any)
    return out
  }

  /**
   * Fails the current test and returns from the function.
   *
   * Provided by the [PackTest](https://github.com/misode/packtest) server mod.
   *
   * @param message Text component describing the failure.
   *
   * @example
   * ```ts
   * fail({ text: 'Oh no' })
   * fail({ text: 'Something went wrong', color: 'red' })
   * ```
   */
  fail = (message: JSONTextComponent): FinalCommandOutput =>
    this.finalCommand([parseJSONText(this.sandstoneCore, message)])
}