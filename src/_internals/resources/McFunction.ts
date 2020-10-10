import type { LiteralUnion } from '@/generalTypes'
import type { Datapack } from '@datapack'
import hash from 'object-hash'
import { toMcFunctionName } from '../datapack/minecraft'
import type { FunctionResource } from '../datapack/resourcesTree'

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

export class McFunction<T extends any[]> {
  name: string

  options: McFunctionOptions

  alreadyInitializedParameters: Map<string, {
    mcFunction: FunctionResource,
    name: string,
  }>

  functionsFolderResource: FunctionResource

  datapack: Datapack

  callback: (...args: T) => void

  constructor(datapack: Datapack, name: string, callback: (...args: T) => void, options: McFunctionOptions) {
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
   * Call the actual function, and triggers the given callback to add the arguments to the command.
   *
   * If `addArgumentsCallback` is not set, then no function call will be registered.
   */
  private callAndRegister = (args: T, addArgumentsCallback?: (functionName: string) => void) => {
    const { commandsRoot } = this.datapack
    const hashed = hash(args)

    const isNewOverload = !this.alreadyInitializedParameters.has(hashed)

    let name: string
    let mcFunction: FunctionResource

    if (isNewOverload) {
      // If it's the 1st time this mcfunction is called with these arguments, we create a new overload
      const result = this.createFunctionOverload(args)

      mcFunction = result.newFunction
      name = result.functionName

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
        this.datapack.addFunctionToTag(name, tag)
      }

      this.alreadyInitializedParameters.set(hashed, { mcFunction, name })
    } else {
      const result = this.alreadyInitializedParameters.get(hashed)
      mcFunction = result?.mcFunction as FunctionResource
      name = result?.name as string
    }

    if (addArgumentsCallback) {
      addArgumentsCallback(name)

      commandsRoot.executable = true
      commandsRoot.register()
    }

    // Finally, if it was a new overload, we need to run the actual function
    if (isNewOverload) {
      const previousFunction = this.datapack.currentFunction

      this.datapack.currentFunction = mcFunction

      // Add some comments specifying the overload, and the options
      if (this.options.debug) {
        this.datapack.commandsRoot.comment('Options:', JSON.stringify(this.options))

        try {
          this.datapack.commandsRoot.comment('Arguments:', JSON.stringify(args))
        } catch (e) {
          // JSON.stringify fails on recursive objects.
        }
      }

      this.callback(...args)

      // If there is an unfinished command, register it
      this.datapack.commandsRoot.register(true)

      // Then back to the previous one
      this.datapack.currentFunction = previousFunction
    }
  }

  call = (...args: T) => {
    this.callAndRegister(args, (functionName) => {
      this.datapack.commandsRoot.arguments.push('function', functionName)
    })
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

    this.callAndRegister(args)
    return this.alreadyInitializedParameters.get(repr)?.name as string
  }

  generateInitialFunction = () => {
    if (!this.options.lazy && !this.alreadyInitializedParameters.has('[]')) {
      this.callAndRegister([] as any)
    }
  }
}
