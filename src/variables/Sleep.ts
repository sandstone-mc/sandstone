import type { TimeArgument } from 'sandstone/arguments'
import type { SandstoneCore } from 'sandstone/core'
import { AwaitNode } from 'sandstone/core/nodes'
import { ObjectiveClass } from './Objective'

const SLEEP_CHILD_NAME = '__sleep'

export class SleepClass extends AwaitNode {
  command = 'schedule'

  public mcfunction

  protected inSleepFunction: boolean

  constructor(
    core: SandstoneCore,
    public delay: TimeArgument,
  ) {
    super(core.pack)

    const currentFunction = core.getCurrentMCFunctionOrThrow()

    // If we're already in a "sleep" child, go to the parent function. It avoids childs' names becoming namespace:function/__sleep/__sleep/__sleep etc...
    const { path } = currentFunction.resource
    this.inSleepFunction = path[path.length - 1].startsWith(SLEEP_CHILD_NAME)

    currentFunction.resource.nested += 1

    this.mcfunction = core.pack.MCFunction(
      `${currentFunction.resource.path.slice(2).join('/')}/${SLEEP_CHILD_NAME}`,
      () => {},
      {
        addToSandstoneCore: true,
        lazy: false,
        creator: 'sandstone',
        onConflict: 'rename',
        packType: currentFunction.resource.packType,
      },
    )

    let schedule = this.mcfunction.name

    let type = 'append'

    if (currentFunction.resource.asyncContext) {
      const Duration = (() => {
        if (typeof delay === 'number') {
          return delay + 1
        }
        const unit = delay.charAt(delay.length - 1)
        let value = Number(delay.replace(unit, ''))

        if (unit === 's') {
          value *= 20
        } else if (unit === 'd') {
          value *= 24000
        }

        return value
      })()

      type = 'replace'

      const { commands, MCFunction, Label, Selector } = core.pack

      const { execute } = commands

      const name = `__sandstone:asyncTimer.${currentFunction.resource.name.replace(/[:/]/g, '.')}` as `${string}:${string}`

      const timer = new ObjectiveClass(core.pack, name.replace(':', '.'), 'dummy', undefined, { creator: 'sandstone' })

      execute.store.result(timer('@s')).run.time.query('gametime')

      timer('@s').add(Duration)

      const label = Label(name)

      label('@s').add()

      this.mcfunction.unshift(() => label('@s').remove())

      schedule = MCFunction(
        `${this.mcfunction.name}/_context`,
        () => {
          execute.store.result(timer('#current')).run.time.query('gametime')

          execute
            .as(Selector('@e', { tag: label.fullName }))
            .if.score(timer('@s'), '=', timer('#current'))
            .at('@s')
            .run.functionCmd(this.mcfunction)
        },
        {
          packType: currentFunction.resource.packType,
        },
      ).name
    }

    this.args = ['function', schedule, this.delay, type]

    currentFunction.enterContext(this)

    core.awaitNodes.add(this)
  }

  promise() {
    return {
      // oxlint-disable-next-line no-thenable
      then: (async (onfullfilled?: () => void | Promise<void>) => {
        await onfullfilled?.()
        return this
      }) as any,
    }
  }
}
