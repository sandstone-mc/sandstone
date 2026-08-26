import type { TimeArgument } from 'sandstone/arguments'
import type { SandstoneCore, MCFunctionNode } from 'sandstone/core'
import type { Node } from 'sandstone/core/nodes'
import { AwaitNode } from 'sandstone/core/nodes'
import { ObjectiveClass } from 'sandstone/variables'
import type { TagCommandNode } from 'sandstone/commands'
import type { NamespacedString } from 'sandstone/utils'
import { FinalCommandOutput } from 'sandstone/commands'

const SLEEP_CHILD_NAME = '__sleep'

export class SleepClass extends AwaitNode {
  command = 'schedule'

  /** @internal */
  delay: TimeArgument

  /** @internal */
  public mcfunction

  /** @internal */
  public contextLeaf: FinalCommandOutput | undefined

  /** @internal */
  cleanupLabel: TagCommandNode | undefined

  protected inSleepFunction: boolean

  /** @internal */
  logPath: boolean

  /** @internal */
  stackTrace?: string

  constructor(
    core: SandstoneCore,
    delay: TimeArgument,
    logPath: boolean,
  ) {
    super(core.pack)

    this.delay = delay
    this.logPath = logPath

    if (this.logPath) {
      this.stackTrace = Error().stack
    }

    const currentFunction = core.getCurrentMCFunctionOrThrow()
    this.parentMCFunction = currentFunction

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

      const name = `__sandstone:asyncTimer.${this.mcfunction.name.replace(/[:/]/g, '.')}` as NamespacedString

      const timer = new ObjectiveClass(core.pack, name.replace(':', '.'), 'dummy', undefined, { creator: 'sandstone' })

      core.pack.registerNewObjective(timer)

      execute.store.result(timer('@s')).run.time.query('gametime')

      timer('@s').add(Duration)

      const label = Label(name)

      label('@s').add()

      this.mcfunction.unshift(() => label('@s').remove())

      this.cleanupLabel = this.mcfunction.node.body[0] as TagCommandNode

      schedule = MCFunction(
        `${this.mcfunction.name}/_context`,
        () => {
          execute.store.result(timer('#current')).run.time.query('gametime')

          this.contextLeaf = (
            execute
              .as(Selector('@e', { tag: label.fullName }))
              .if.score(timer('@s'), '=', timer('#current'))
              .at('@s')
              .run.functionCmd(this.mcfunction)
          )
        },
        {
          packType: currentFunction.resource.packType,
          // Tag as sandstone-created so visitors that iterate helpers
          // (e.g. `AwaitBodyVisitor.collectTransientHelpers`) can find it
          // via path matching, and so the parent/child registration in
          // `ContainerCommandsToMCFunctionVisitor` correctly classifies it.
          creator: 'sandstone',
        },
      ).name
    }

    this.args = ['function', schedule, this.delay, type]

    currentFunction.enterContext(this)

    core.awaitNodes.add(this)
  }
}
