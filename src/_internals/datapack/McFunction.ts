import type { Datapack } from '@datapack'
import { FolderOrFile, FunctionResource } from './resourcesTree'

type McFunctionOptions = {
  /**
   * If true, then the function will only be created if it ??
   */
  lazy?: boolean
}

class McFunction<T extends any[]> {
  name: string

  options: McFunctionOptions

  alreadyInitializedParameters: Set<string>

  functionsFolderResource: FunctionResource

  constructor(datapack: Datapack, name: string, options: McFunctionOptions) {
    this.name = name
    this.options = options
    this.alreadyInitializedParameters = new Set()

    // We "reserve" the folder by creating an empty folder there
    const functionsFolder = datapack.getFunctionAndNamespace(name)
    this.functionsFolderResource = datapack.resources.addResource('functions', {
      children: new Map(), isResource: false as const, path: functionsFolder,
    })
  }

  const call = (...args: T) => {
    const jsonRepresentation = JSON.stringify(args)

    if (!this.alreadyInitializedParameters.has(jsonRepresentation)) {
      // If it's the 1st time this mcfunction is called with these arguments, we create a new overload
      this.alreadyInitializedParameters.add(jsonRepresentation)

      callCallback(callbackArgs, (functionName) => {
        console.log('hh')
        if (schedule) {
          this.commandsRoot.arguments.push('schedule', 'function', functionName, schedule.delay, schedule.type)
        } else {
          this.commandsRoot.arguments.push('function', functionName)
        }

        this.commandsRoot.executable = true
        this.commandsRoot.register()
      })
    }
  }
}
