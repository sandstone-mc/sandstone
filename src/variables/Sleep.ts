import { AwaitNode } from '#core/nodes'

import { NBTIntArray } from './nbt'

import type { DataPointClass } from './Data'
import type { TimeArgument } from '#arguments'
import type { SandstoneCore } from '#core'

const SLEEP_CHILD_NAME = '__sleep'

export class SleepClass extends AwaitNode {
  command = 'schedule'

  public mcfunction

  protected inSleepFunction: boolean

  constructor(core: SandstoneCore, public delay: TimeArgument) {
    super(core.pack)

    const currentFunction = core.getCurrentMCFunctionOrThrow()

    // If we're already in a "sleep" child, go to the parent function. It avoids childs' names becoming namespace:function/__sleep/__sleep/__sleep etc...
    const { path } = currentFunction.resource
    this.inSleepFunction = path[path.length - 1].startsWith(SLEEP_CHILD_NAME)

    currentFunction.resource.nested += 1

    this.mcfunction = core.pack.MCFunction(`${currentFunction.resource.path.slice(2).join('/')}/${SLEEP_CHILD_NAME}`, () => {}, {
      addToSandstoneCore: true,
      creator: 'sandstone',
      onConflict: 'rename',
    })

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

        return value + 1
      })()

      type = 'replace'

      const stack = core.pack.UUID()

      let current: DataPointClass<'storage'> = undefined as unknown as DataPointClass<'storage'>

      core.pack.initMCFunction.push(() => {
        core.pack.rootChunk.createMember('armor_stand', { UUID: new NBTIntArray(stack.known) })

        current = core.pack.DataVariable({ Duration, Tags: [`${core.pack.defaultNamespace}.__asyncTimer`] })
      })

      current.select('Owner').set(core.pack.Data('entity', '@s', 'UUID'))

      const timer = core.pack.Objective.create('__sandstone.asyncTimer')

      core.pack.commands.execute.summon('area_effect_cloud').run(() => {
        core.pack.Data('entity', '@s', '{}').set(current)

        core.pack.commands.execute.store.result.score(timer('@s')).run.time.query('gametime')

        timer('@s').add(Duration - 1)

        core.pack.commands.ride('@s').mount(stack)
      })

      schedule = core.pack.MCFunction(`${this.mcfunction.name}/_context`, () => {
        core.pack.commands.execute.store.result.score(timer('#current')).run.time.query('gametime')

        stack.execute.on('passengers').if.score(timer('@s'), '=', timer('#current')).on('origin').at('@s').run.functionCmd(this.mcfunction)
      }).name
    }

    this.args = ['function', schedule, this.delay, type]

    currentFunction.enterContext(this)

    core.awaitNodes.add(this)
  }

  promise() {
    return ({
      then: (async (onfullfilled?: () => (void | Promise<void>)) => {
        await onfullfilled?.()
        return this
      }) as any,
    })
  }
}
