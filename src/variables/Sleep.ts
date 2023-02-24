import { AwaitNode } from 'sandstone/core/nodes'

import type { TimeArgument } from 'sandstone/arguments/basics'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore'

const SLEEP_CHILD_NAME = '__sleep'

export class SleepClass extends AwaitNode {
  public mcfunction

  protected inSleepFunction: boolean

  constructor(core: SandstoneCore, delay: TimeArgument) {
    super(core)

    const currentFunction = core.getCurrentMCFunctionOrThrow()

    // If we're already in a "sleep" child, go to the parent function. It avoids childs' names becoming namespace:function/__sleep/__sleep/__sleep etc...
    const { path } = currentFunction.resource
    this.inSleepFunction = path[path.length - 1].startsWith(SLEEP_CHILD_NAME)

    currentFunction.resource.nested += 1

    this.mcfunction = this.sandstoneCore.pack.MCFunction(`${currentFunction.resource.path.slice(2).join('/')}/${SLEEP_CHILD_NAME}`, () => {}, {
      addToSandstoneCore: true,
      creator: 'sandstone',
      onConflict: 'rename',
    })

    core.pack.commands.schedule.function(this.mcfunction, delay, 'append')

    currentFunction.enterContext(this)

    core.awaitNodes.add(this)
  }

  getValue() {
    return ({
      then: (async (onfullfilled?: () => (void | Promise<void>)) => {
        await onfullfilled?.()
        return this
      }) as any,
    })
  }
}
