import util from 'util'

import type { LiteralUnion } from '@/generalTypes'
import type { Datapack } from '@datapack'
import type { FunctionResource } from '@datapack/resourcesTree'

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
   * Whether the function should run each tick.
   */
  runEachTick?: boolean

  /**
   * Whether the function should run when the datapack loads.
   */
  runOnLoad?: boolean

  /**
   * The function tags to put this function in.
   */
  tags?: readonly string[]
}

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
    if (this.options.runEachTick) {
      tags = [...tags, 'minecraft:tick']
    }

    // Idem for load
    if (this.options.runOnLoad) {
      tags = [...tags, 'minecraft:load']
    }

    for (const tag of tags) {
      this.datapack.addFunctionToTag(this.name, tag)
    }

    const previousFunction = this.datapack.currentFunction

    this.datapack.currentFunction = this.resource

    // Add some comments specifying the overload, and the options
    if (this.options.debug) {
      commandsRoot.comment('Options:', JSON.stringify(this.options))
    }

    const result = this.callback()

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

  schedule = (delay: number | LiteralUnion<'1t' | '1s' | '1d'>, type?: 'replace' | 'append') => {
    this.datapack.commandsRoot.schedule.function(this.name, delay, type)
  }

  clearSchedule = () => {
    this.datapack.commandsRoot.schedule.clear(this.name)
  }

  toString = () => this.name

  toJSON = this.toString
}
