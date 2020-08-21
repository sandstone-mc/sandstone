import { LiteralUnion } from '@/generalTypes'
import type { Datapack } from '@datapack'
import { toMcFunctionName } from './minecraft'
import { FolderOrFile, FunctionResource } from './resourcesTree'

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

  alreadyInitializedParameters: Set<string>

  functionsFolderResource: FunctionResource

  datapack: Datapack

  callback: (...args: T) => void

  constructor(datapack: Datapack, name: string, callback: (...args: T) => void, options: McFunctionOptions) {
    this.name = name
    this.options = { lazy: false, debug: process.env.NODE_ENV === 'development', ...options }

    this.alreadyInitializedParameters = new Set()
    this.callback = callback
    this.datapack = datapack

    // We "reserve" the folder by creating an empty folder there. It can be later changed to be a resource.
    const functionsFolder = datapack.getFunctionAndNamespace(name)
    this.functionsFolderResource = datapack.resources.addResource('functions', {
      children: new Map(), isResource: false as const, path: functionsFolder,
    })

    if (!options.lazy) {
      if (callback.length === 0) {
        this.callAndRegister([] as unknown as T)
      }
      else {
        throw new Error(
          `Got a parametrized function "${name}" expecting at least ${callback.length} arguments, without being lazy.\n`
          + 'Since it is not lazy, Sandstone tried to create it without passing any arguments.\n'
          + 'This is not possible. Consider putting default values to the parameters, or setting the function as lazy.',
        )
      }
    }
  }

  // Create an empty function, with the correct name given the overload
  private createFunctionOverload = (args: T) => {
    const previousFunction = this.datapack.currentFunction

    let newFunction: FunctionResource
    if (args.length === 0) {
      // Change the "folder" to specify it is a resource too.
      newFunction = Object.assign(this.functionsFolderResource, { isResource: true, commands: [] })
    }
    else {
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
    const commandsRoot = this.datapack.commandsRoot
    const jsonRepresentation = JSON.stringify(args)

    if (!this.alreadyInitializedParameters.has(jsonRepresentation)) {
      // If it's the 1st time this mcfunction is called with these arguments, we create a new overload
      this.alreadyInitializedParameters.add(jsonRepresentation)

      const { newFunction, functionName } = this.createFunctionOverload(args)

      if (addArgumentsCallback) {
        addArgumentsCallback(functionName)

        commandsRoot.executable = true
        commandsRoot.register()
      }

      // Finally call the function
      const previousFunction = this.datapack.currentFunction

      this.datapack.currentFunction = newFunction

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

  schedule = (delay: number | LiteralUnion<'1t' | '1s' | '1d'>, type: 'replace' | 'append', ...args: T) => {
    this.callAndRegister(args, (functionName) => {
      this.datapack.commandsRoot.arguments.push('schedule', 'function', functionName, delay, type)
    })
  }
}
