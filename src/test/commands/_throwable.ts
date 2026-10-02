import { CommandNode } from 'sandstone/core/nodes'
import type { TestMCFunctionNode } from '../mcfunction'

/**
 * Base class for any `CommandNode` whose `getValue` should register a
 * `(method, index, trace, outputLine)` entry into the enclosing
 * `TestMCFunctionClass.throwableStack`.
 *
 * Used by the test-pack assertion/await/fail command nodes. Subclasses
 * just declare their `command` and `args` shape; the recording logic
 * lives here so all the throwable bookkeeping is in one place.
 *
 * @internal
 */
export abstract class ThrowableCommandNode<ARGS extends unknown[] = unknown[]> extends CommandNode<ARGS> {
  readonly testExclusive: boolean = true

  /**
   * The test mcfunction node this command was created inside. Set by
   * the command's `finalCommand` override via `setParentTestMCFunction`.
   * `undefined` if the command was created outside any test mcfunction
   * — in that case `getValue` just serializes without recording.
   */
  parentTestMCFunction?: TestMCFunctionNode

  getValue() {
    const parent = this.parentTestMCFunction!
    const trace = this.commandStackTrace?.[0]
    if (trace) {
      // Match the convention of the error trace.
      const line = parent.currentIndex + 1
      parent.throwableStack.set(
        `${parent.resource.name}@${this.command}:${line}`,
        {
          trace,
          command: this.command,
          line,
        },
      )
    } else {
      console.warn(`[ThrowableCommandNode#getValue] Failed to generate a stack trace for ${this.constructor.name}`)
    }
    return CommandNode.prototype.getValue.call(this)
  }
}

/**
 * Tag a just-committed test-command node with the test mcfunction it
 * was created inside, so its later `getValue` can register itself.
 *
 * Pass the `FinalCommandOutput` returned from the parent's
 * `finalCommandWithStackTrace` and the active mcfunction (if it's a
 * test mcfunction). No-op for non-test contexts.
 *
 * @internal
 */
export function setParentTestMCFunction(
  out: unknown,
  currentMC: unknown,
): void {
  // `currentMC` is `TestMCFunctionNode | MCFunctionNode | undefined`.
  // The `throwableStack`/`currentIndex`/`currentOutputLine` fields
  // live on the TestMCFunctionNode, not on the resource class — duck
  // type the node directly.
  const node = currentMC as { resource?: { _resourceType?: string }; throwableStack?: unknown } | undefined
  if (
    node
    && node.resource?._resourceType === 'test_function'
    && 'throwableStack' in node
  ) {
    ;(out as { node: { parentTestMCFunction?: TestMCFunctionNode } }).node.parentTestMCFunction
      = node as TestMCFunctionNode
  }
}