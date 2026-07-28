import type { TimeArgument } from 'sandstone/arguments'
import { FunctionCommandNode } from 'sandstone/commands'
import type { SandstoneCore } from 'sandstone/core'
import { AwaitNode } from 'sandstone/core/nodes'
import type { Condition } from 'sandstone/flow'
import { SleepClass } from './sleep'

const UNTIL_CHILD_NAME = '__until'

/**
 * `await until(condition, pollRate)` — pauses execution until the condition
 * is met, re-checking at `pollRate` intervals. Built on top of `SleepClass`
 * via `_.if(...).else(...)`:
 *
 *   - The poller MCFunction (`__until/_poller`) has `asyncContext: true` so
 *     `SleepClass` inside it can set up the async timer/label machinery.
 *     `_.if(condition, () => call continuation + return).else(() => sleep +
 *     re-poll)` runs the continuation immediately when the condition is
 *     true, otherwise sleeps for `pollRate` and re-polls.
 *   - The continuation MCFunction (`__until/_continuation`) has
 *     `asyncContext: true` so user code can itself `await`.
 *   - First poll is instant: the caller invokes `__until/_poller`
 *     synchronously (via `function`). The first `pollRate` delay only
 *     applies between subsequent polls.
 */
export class UntilClass extends AwaitNode {
  // `return` command — emits `return run function __until/_poller` so the
  // continuation's return value (if any) propagates back out of the
  // caller. The poller is invoked synchronously via `function`, no
  // `schedule` prefix and no async-timer setup on the caller side.
  command = 'return'

  public mcfunction

  public continuation

  public poller

  constructor(
    core: SandstoneCore,
    public condition: Condition,
    public pollRate: TimeArgument,
  ) {
    super(core.pack)

    const currentFunction = core.getCurrentMCFunctionOrThrow()

    currentFunction.resource.nested += 1

    const baseName = `${currentFunction.resource.path.slice(2).join('/')}/${UNTIL_CHILD_NAME}`

    // Continuation: receives whatever commands follow the `await until(...)`
    // call. asyncContext so user code can itself await — only if the
    // enclosing MCFunction has asyncContext.
    this.continuation = core.pack.MCFunction(
      `${baseName}/_continuation`,
      () => {},
      {
        addToSandstoneCore: true,
        lazy: false,
        creator: 'sandstone',
        onConflict: 'rename',
        packType: currentFunction.resource.packType,
        asyncContext: currentFunction.resource.asyncContext,
      },
    )

    this.poller = core.pack.MCFunction(
      `${baseName}/_poller`,
      () => {
        // When the condition is true, run the continuation and exit the
        // poller. When false, sleep + schedule the next poll.
        core.pack._
          .if(this.condition, () => {
            this.continuation()
          })
          .else(() => {
            // Reuse SleepClass — its mcfunction (`<poller>/__sleep`) is
            // what runs after the poll delay. Inject a re-poll into its
            // body so the loop keeps going until the condition is met.
            const sleep = new SleepClass(core, this.pollRate)
            sleep.mcfunction.node.body.push(
              new FunctionCommandNode(core.pack, this.poller.name),
            )
          })
      },
      {
        addToSandstoneCore: true,
        lazy: false,
        creator: 'sandstone',
        onConflict: 'rename',
        packType: currentFunction.resource.packType,
        asyncContext: currentFunction.resource.asyncContext,
      },
    )

    // First poll is instant: `return run function __until/_poller` runs
    // synchronously so the caller doesn't pay the first `pollRate` delay.
    // asyncContext propagates from the caller to the poller since
    // asyncContext is inherited by `function` calls. The outer `return`
    // makes the continuation's return value (if any) propagate back to
    // the caller.
    this.args = ['run', 'function', this.poller.name]

    currentFunction.enterContext(this)

    // The continuation is what the caller resumes into after the poller
    // returns. We don't actually need it to be the active context — the
    // poller calls it directly when the condition is true — but track it
    // so it survives save() and is serialized.
    this.mcfunction = this.continuation

    core.awaitNodes.add(this)
  }
}