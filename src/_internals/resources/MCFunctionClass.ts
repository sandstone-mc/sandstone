import util from 'util'

import type { LiteralUnion } from '@/generalTypes'
import type { TimeArgument } from '@arguments'
import type { Datapack } from '@datapack'
import type { FunctionResource } from '@datapack/resourcesTree'
import type { TagClass } from './Tag'

export type MCFunctionOptions = {
  /**
   * If true, then the function will only be created if it is called from another function.
   */
  lazy?: boolean

  /**
   * Whether to activate debugging features for the function.
   *
   * For the moment, it only adds some comments detailling what each function options & arguments are.
   *
   * It defaults to `true` if the environment variable NODE_ENV is set to `development`, else it defaults to `false`
   */
  debug?: boolean

  /**
   * Whether the function should run when the datapack loads.
   *
   * Defaults to `true` if `runEach` is specified, else `false`.
   */
  runOnLoad?: boolean

  /**
   * The function tags to put this function in.
   */
  tags?: readonly (string | TagClass<'functions'>)[]
} & (
  {
    /**
     * Whether the function should run each tick.
     */
    runEachTick?: boolean
  } | {
    /**
     * If specified, the function will run every given time.
     *
     * If `runOnLoad` is unspecified or `true`, then it will run on load too.
     *
     * If `runOnLoad` is `false`, you will have to manually start it.
     *
     * You can stop the automatic scheduling by running `theFunction.clearSchedule()`.
     *
     * @example
     *
     * // Run each 5 ticks, including on data pack load.
     * {
     *   runEach: 5,
     * }
     *
     * // Run each 5 ticks, but wait 5 ticks before data pack loads for 1st execution.
     * {
     *   runEach: 5,
     *   runOnLoad: false,
     * }
     *
     * // Run each 8 seconds
     * {
     *   runEach: '8s'
     * }
     */
    runEach?: TimeArgument
  }
)

export class MCFunctionClass<R extends void | Promise<void> = void | Promise<void>> {
  name: string

  options: MCFunctionOptions

  alreadyInitialized: boolean

  resource: FunctionResource

  datapack: Datapack

  callback: () => R

  constructor(datapack: Datapack, name: string, callback: () => R, options: MCFunctionOptions) {
    this.options = { lazy: false, debug: process.env.NODE_ENV === 'development', ...options }

    this.alreadyInitialized = false
    this.callback = callback
    this.datapack = datapack

    // We "reserve" the folder by creating an empty folder there. It can be later changed to be a resource.
    const functionsPaths = datapack.getResourcePath(name)

    this.resource = datapack.resources.addResource('functions', {
      children: new Map(), isResource: true, path: functionsPaths.fullPathWithNamespace, commands: [],
    })

    this.name = functionsPaths.fullName
  }

  /**
   * Call the actual function overload. Returns different informations about it.
   */
  generate = (): R => {
    const { commandsRoot } = this.datapack

    if (this.alreadyInitialized) {
      return undefined as any
    }

    // Get the given tags
    let tags = this.options.tags ?? []

    // If it should run each tick, add it to the tick.json function
    const { runEach: runEachDelay } = this.options as any
    if (runEachDelay !== undefined) {
      if (typeof runEachDelay && runEachDelay < 0) { throw new Error(`\`runEach\` argument must be greater than 0, got ${runEachDelay}`) }

      if (this.options.runOnLoad !== false) {
        // If run on load, call it directly
        this.datapack.initCommands.push(['function', this.name])
      }
    } else {
      // If runEachTick is specified, add to minecraft:tick
      if ((this.options as any).runEachTick) {
        tags = [...tags, 'minecraft:tick']
      }

      // Idem for load
      if (this.options.runOnLoad) {
        tags = [...tags, 'minecraft:load']
      }
    }

    for (const tag of tags) {
      if (typeof tag === 'string') {
        this.datapack.addFunctionToTag(this.name, tag)
      } else {
        tag.values.push(this.name)
      }
    }

    const previousFunction = this.datapack.currentFunction

    this.datapack.currentFunction = this.resource

    // Add some comments specifying the overload, and the options
    if (this.options.debug) {
      commandsRoot.comment('Options:', JSON.stringify(this.options))
    }

    const result = this.callback()

    // If the command was scheduled to run each n ticks, add the /schedule command
    if (runEachDelay) {
      this.datapack.commandsRoot.schedule.function(this.name, runEachDelay, 'append')
    }

    const afterCall = () => {
      // If there is an unfinished command, register it
      commandsRoot.register(true)

      // Then back to the previous one
      this.datapack.currentFunction = previousFunction
    }

    if (util.types.isAsyncFunction(this.callback)) {
      return (result as Promise<void>).then(afterCall) as any
    }

    return afterCall() as any
  }

  call = () => {
    this.datapack.commandsRoot.functionCmd(this.name)
  }

  schedule = (delay: TimeArgument, type?: 'replace' | 'append') => {
    this.datapack.commandsRoot.schedule.function(this.name, delay, type)
  }

  clearSchedule = () => {
    this.datapack.commandsRoot.schedule.clear(this.name)
  }

  toString = () => this.name

  toJSON = this.toString
}
