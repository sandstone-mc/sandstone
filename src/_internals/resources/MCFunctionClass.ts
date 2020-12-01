import type { LiteralUnion } from '@/generalTypes'
import type { Datapack } from '@datapack'
import hash from 'object-hash'
import { toMcFunctionName } from '@datapack/minecraft'
import type { FunctionResource } from '@datapack/resourcesTree'

export type McFunctionOptions = {
  /**
   * If true, then the function will only be created if it ??
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
    result: R,
  }>

  functionsFolderResource: FunctionResource

  datapack: Datapack

  callback: (...args: T) => R

  constructor(datapack: Datapack, name: string, callback: (...args: T) => R, options: McFunctionOptions) {
    const fullPath = name.split('/')
    const realName = fullPath[fullPath.length - 1]
    const path = fullPath.slice(-1)

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
    result: R,
  } => {
    const { commandsRoot } = this.datapack
    const hashed = hash(args)

    const isNewOverload = !this.alreadyInitializedParameters.has(hashed)

    if (isNewOverload) {
      // If it's the 1st time this mcfunction is called with these arguments, we create a new overload
      const { functionName, newFunction } = this.createFunctionOverload(args)

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
        this.datapack.commandsRoot.comment('Options:', JSON.stringify(this.options))

        try {
          this.datapack.commandsRoot.comment('Arguments:', JSON.stringify(args))
        } catch (e) {
          // JSON.stringify fails on recursive objects.
        }
      }

      const result = this.callback(...args)

      // If there is an unfinished command, register it
      this.datapack.commandsRoot.register(true)

      // Then back to the previous one
      this.datapack.currentFunction = previousFunction

      // Register this set of arguments as already initialized
      const returnValue = { mcFunction: newFunction, name: functionName, result }
      this.alreadyInitializedParameters.set(hashed, returnValue)

      return returnValue
    }

    // Else, we need to return the previous result
    return this.alreadyInitializedParameters.get(hashed)!
  }

  call = (...args: T): R => {
    const { commandsRoot } = this.datapack

    // Call without registering
    this.callOverload(args)

    const repr = hash(args)
    const { mcFunction, name, result } = this.alreadyInitializedParameters.get(repr)!

    // If the function didn't return anything, it was synchronous, so we register the /function call & stop there
    if (!result) {
      commandsRoot.functionCmd(name)
      return result
    }

    // Else, it was asynchronous. Awaiting this function should therefore add a callback.
    const childFunc = this.datapack.createChildFunction('await')
    commandsRoot.functionCmd(childFunc.functionName)

    return {
      then: async (onfulfilled) => {
        // This callback will be entered when the function is awaited: `await myAsyncFunc()`.
        this.datapack.currentFunction = childFunc.childFunction

        // Await the result. At the end,
        await result
        onfulfilled?.()
      },
    } as R
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
  generateInitialFunction = (): void | Promise<void> => {
    if (!this.options.lazy && !this.alreadyInitializedParameters.has('[]')) {
      return this.callOverload([] as any).result
    }
  }
}
