import { LiteralUnion } from '@/generalTypes'
import type { Datapack } from '@datapack'
import { toMcFunctionName } from './minecraft'
import { FunctionResource } from './resourcesTree'

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
    this.name = name
    this.options = { lazy: false, debug: process.env.NODE_ENV === 'development', ...options }

    this.alreadyInitializedParameters = new Map()
    this.callback = callback
    this.datapack = datapack

    // We "reserve" the folder by creating an empty folder there. It can be later changed to be a resource.
    const functionsFolder = datapack.getFunctionAndNamespace(name)
    this.functionsFolderResource = datapack.resources.addResource('functions', {
      children: new Map(), isResource: false as const, path: functionsFolder,
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
   * If addArgumentsCallback is not set, then no function call will be registered.
   */
  private callAndRegister = (args: T, addArgumentsCallback?: (functionName: string) => void) => {
    const { commandsRoot } = this.datapack
    const jsonRepresentation = JSON.stringify(args)

    const isNewOverload = !this.alreadyInitializedParameters.has(jsonRepresentation)

    let name: string
    let mcFunction: FunctionResource

    if (isNewOverload) {
      // If it's the 1st time this mcfunction is called with these arguments, we create a new overload
      const result = this.createFunctionOverload(args)

      mcFunction = result.newFunction
      name = result.functionName

      this.alreadyInitializedParameters.set(jsonRepresentation, { mcFunction, name })
    } else {
      const result = this.alreadyInitializedParameters.get(jsonRepresentation)
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
        this.datapack.commandsRoot.comment('Arguments:', jsonRepresentation)
      }

      this.callback(...args)

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
    this.callAndRegister(args, (functionName) => {
      this.datapack.commandsRoot.arguments.push('schedule', 'function', functionName, delay, type)
    })
  }

  clearSchedule = (...args: T) => {
    const name = this.getNameFromArgs(...args)

    this.datapack.commandsRoot.arguments.push('clear', name)
    this.datapack.commandsRoot.executable = true
    this.datapack.commandsRoot.register()
  }

  getNameFromArgs = (...args: T): string => {
    const jsonRepresentation = JSON.stringify(args)
    const mcfunction = this.alreadyInitializedParameters.get(jsonRepresentation)

    if (mcfunction) {
      return mcfunction.name
    }

    this.callAndRegister(args)
    return this.alreadyInitializedParameters.get(jsonRepresentation)?.name as string
  }

  generateInitialFunction = () => {
    if (!this.options.lazy && !this.alreadyInitializedParameters.has('[]')) {
      this.callAndRegister([] as any)
    }
  }
}
