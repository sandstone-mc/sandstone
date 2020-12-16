import type { LiteralUnion } from '@/generalTypes'
import type { Datapack } from '@datapack'
import { toMcFunctionName } from '@datapack/minecraft'
import type { FunctionResource } from '@datapack/resourcesTree'
import hash from 'object-hash'

export type McFunctionOptions = {
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

export class MCFunctionClass<T extends any[], R extends void | Promise<void> = void | Promise<void>> {
  name: string

  options: McFunctionOptions

  alreadyInitializedParameters: Map<string, {
    mcFunction: FunctionResource,
    name: string,
    result: R | null, // Null mean the value isn't currently defined
  }>

  functionsFolderResource: FunctionResource

  datapack: Datapack

  callback: (...args: T) => R

  constructor(datapack: Datapack, name: string, callback: (...args: T) => R, options: McFunctionOptions) {
    this.name = name
    this.options = { lazy: false, debug: process.env.NODE_ENV === 'development', ...options }

    this.alreadyInitializedParameters = new Map()
    this.callback = callback
    this.datapack = datapack

    // We "reserve" the folder by creating an empty folder there. It can be later changed to be a resource.
    const functionsPaths = datapack.getResourcePath(name)

    this.functionsFolderResource = datapack.resources.addResource('functions', {
      children: new Map(), isResource: false as const, path: functionsPaths.fullPathWithNamespace,
    })

    if (!options.lazy && callback.length !== 0) {
      throw new Error(
        `Got a parametrized function "${name}" expecting at least ${callback.length} arguments, without being lazy.\n`
        + 'Since it is not lazy, Sandstone tried to create it without passing any arguments.\n'
        + 'This is not possible. Consider putting default values to the parameters, or setting the function as lazy.',
      )
    }
  }

  // Create an empty function, with the correct name given the overload
  private createFunctionOverload = (args: T) => {
    const previousFunction = this.datapack.currentFunction

    let newFunction: FunctionResource
    if (args.length === 0) {
      // Change the "folder" to specify it is a resource too.
      newFunction = Object.assign(this.functionsFolderResource, { isResource: true, commands: [] })
    } else {
      // Set the "folder" as the current function, and create a child of it
      this.datapack.currentFunction = this.functionsFolderResource
      newFunction = this.datapack.createChildFunction('call').childFunction
    }

    // Go back to the previous function
    this.datapack.currentFunction = previousFunction

    // Return the new function
    return { newFunction, functionName: toMcFunctionName(newFunction.path) }
  }

  /**
   * Call the actual function overload. Returns different informations about it.
   */
  private callOverload = (args: T): {
    mcFunction: FunctionResource,
    name: string,
    result: R | null,
  } => {
    const { commandsRoot } = this.datapack
    const hashed = hash(args)

    const existing = this.alreadyInitializedParameters.get(hashed)

    if (!existing) {
      // If it's the 1st time this mcfunction is called with these arguments, we create a new overload
      const { functionName, newFunction } = this.createFunctionOverload(args)

      // We also set it as currently in initialization.
      this.alreadyInitializedParameters.set(hashed, { name: functionName, mcFunction: newFunction, result: null })

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
        this.datapack.addFunctionToTag(functionName, tag)
      }

      const previousFunction = this.datapack.currentFunction

      this.datapack.currentFunction = newFunction

      // Add some comments specifying the overload, and the options
      if (this.options.debug) {
        commandsRoot.comment('Options:', JSON.stringify(this.options))

        try {
          commandsRoot.comment('Arguments:', JSON.stringify(args))
        } catch (e) {
          // JSON.stringify fails on recursive objects.
        }
      }

      const result = this.callback(...args)

      // If there is an unfinished command, register it
      commandsRoot.register(true)

      // Then back to the previous one
      this.datapack.currentFunction = previousFunction

      // Register this set of arguments as already initialized
      const returnValue = { mcFunction: newFunction, name: functionName, result }
      this.alreadyInitializedParameters.set(hashed, returnValue)

      return returnValue
    }

    // Else, we need to return the previous result
    return existing
  }

  call = (...args: T): R | null => {
    const { commandsRoot } = this.datapack

    // Call without registering
    const { name, result } = this.callOverload(args)

    commandsRoot.functionCmd(name)
    return result
  }

  schedule = (delay: number | LiteralUnion<'1t' | '1s' | '1d'>, type?: 'replace' | 'append', ...args: T) => {
    const name = this.getNameFromArgs(...args)

    this.datapack.commandsRoot.schedule.function(name, delay, type)
  }

  clearSchedule = (...args: T) => {
    const name = this.getNameFromArgs(...args)

    this.datapack.commandsRoot.schedule.clear(name)
  }

  getNameFromArgs = (...args: T): string => {
    const repr = hash(args)
    const mcfunction = this.alreadyInitializedParameters.get(repr)

    if (mcfunction) {
      return mcfunction.name
    }

    throw new Error('Function has never been generated before!')
  }

  // eslint-disable-next-line consistent-return
  generateInitialFunction = (): void | Promise<void> | null => {
    if (!this.options.lazy && !this.alreadyInitializedParameters.has('[]')) {
      return this.callOverload([] as any).result
    }
  }
}
