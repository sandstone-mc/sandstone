import { saveDatapack, SaveOptions } from './filesystem'
import { CommandArgs, toMcFunctionName } from './minecraft'
import { FunctionResource, ResourcePath, ResourcesTree } from './resourcesTree'

type McFunctionOptions = {
  /**
   * If true, then the function will only be created if it ??
   */
  lazy?: boolean
}

export default class Datapack {
  defaultNamespace: string

  currentFunction: FunctionResource | null

  resources: ResourcesTree

  constructor(namespace: string) {
    this.defaultNamespace = namespace
    this.currentFunction = null

    this.resources = new ResourcesTree()
  }


  private getFunctionAndNamespace(functionName: string): ResourcePath {
    let namespace = this.defaultNamespace
    let name = functionName

    if (functionName.includes(':')) {
      ([namespace, name] = functionName.split(':'))
    }

    return [namespace, name]
  }


  /**
   * Creates and enters a new root Minecraft function.
   *
   * @param functionName The name of the function to create
   */
  private createEnterRootFunction(functionName: string): ResourcePath {
    const functionFullPath = this.getFunctionAndNamespace(functionName)
    const rootFunctionPath = this.getUniqueName(functionFullPath)

    const emptyFunction = {
      children: new Map(), commands: [], isResource: true, path: rootFunctionPath,
    }

    this.resources.addResource(rootFunctionPath, 'functions', emptyFunction)

    return emptyFunction.path
  }

  /**
   * Check if the datapack contains a function with the given name
   * @param functionPath The name of the function
   */
  private hasFunction(functionPath: ResourcePath): boolean {
    try {
      this.resources.getResource(functionPath, 'functions')
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Returns a unique name for a function, from an original name, by checking if it already exists in the given folder.
   * @param functionName the original name for the function.
   * @param folder the folder to check into.
   */
  private getUniqueNameFromFolder(functionName: string, folder: FunctionResource): string {
    let newName = functionName

    const newNameTemplate = `${newName}_{}`
    let i = 2

    // If the current "new name" already exists in the Datapack, increment `i` and apply the template
    while (folder.children.has(newName)) {
      newName = newNameTemplate.replace('{}', i.toString())
      i += 1
    }

    return newName
  }

  /**
   * Returns a unique name for a function, from an original name.
   *
   * @example
   * // If there is no default:main function
   * getUniqueName(["default", "main"]) --> ["default", "main"]
   *
   * @example
   * // If there is already a default:main function
   * getUniqueName(["default", "main"]) --> ["default", "main_2"]
   *
   * @param functionPath The original path for the function
   */
  private getUniqueName(functionPath: ResourcePath): ResourcePath {
    // Get the namespace and the folders of the function
    const namespaceFolders = functionPath.slice(0, -1)

    const parentFolder = this.resources.getFolder(namespaceFolders, 'functions')

    // By default, the "new name" is the original name.
    const originalName = functionPath[functionPath.length - 1]

    const newName = this.getUniqueNameFromFolder(originalName, parentFolder)

    return [...namespaceFolders, newName]
  }

  /**
   * Get a unique name for a child function of the current function, from an original name.
   * @param childName The original name for the child function.
   */
  private getUniqueChildName(childName: string): string {
    if (!this.currentFunction) {
      throw new Error('Trying to get a unique child name outside a root function.')
    }

    return this.getUniqueNameFromFolder(childName, this.currentFunction)
  }

  /**
   * Creates and enters a new child function of the current function.
   * @param functionName The name of the child function.
   */
  private createEnterChildFunction(functionName: string): string {
    if (!this.currentFunction) {
      throw Error('Entering child function without registering a root function')
    }

    const childName = this.getUniqueChildName(functionName)

    // Update the current function - it now is the child function.
    const emptyFunction = {
      children: new Map(), isResource: true as const, commands: [], path: [...this.currentFunction.path, childName],
    }

    this.currentFunction.children.set(childName, emptyFunction)

    this.currentFunction = emptyFunction

    // Return its full minecraft name
    return toMcFunctionName(emptyFunction.path)
  }

  /**
   * Recursively exit the current function of the datapack.
   *
   * If we're in a child function of a root function (or a n-th child), it will exit them too.
   */
  private exitRootFunction(): void {
    if (!this.currentFunction) {
      throw Error('Exiting a not-existing function')
    }

    this.currentFunction = null
  }

  /**
   * Exit the current child function, and enter the parent function.
   */
  private exitChildFunction(): void {
    if (!this.currentFunction) {
      throw Error('Exiting a not-existing function')
    }

    const parentPath = this.currentFunction.path.slice(0, -1)

    try {
      this.currentFunction = this.resources.getResource(parentPath, 'functions')
    } catch (e) {
      this.currentFunction = null
    }
  }

  /**
   * Register a new command in the current function.
   * @param commandArgs The arguments of the command to add.
   */
  registerNewCommand = (commandArgs: CommandArgs): void => {
    if (!this.currentFunction || !this.currentFunction.isResource) {
      throw Error('Adding a command outside of a registered function')
    }

    this.currentFunction.commands.push(commandArgs)
  }

  /**
   * Remove the last command added to the current function.
   */
  private unregisterLastCommand = (): void => {
    if (!this.currentFunction || !this.currentFunction.isResource) {
      throw Error('Removing a command outside of a registered function')
    }

    this.currentFunction.commands.pop()
  }

  /**
   * Creates a Minecraft Function.
   *
   * @param name The name of the function. If left unspecified, creates an anonymous Minecraft Function.
   * @param callback A callback containing the commands you want in the Minecraft Function.
   */
  mcfunction = <T extends (...args: any[]) => void>(
    name: string, callback: T, options?: McFunctionOptions,
  ): ((...args: Parameters<T>) => void) => {
    const defaultOptions: McFunctionOptions = { lazy: false }
    const realOptions: McFunctionOptions = { ...defaultOptions, ...options }

    const alreadyInitializedParameters = new Set<string>()

    // We "reserve" the folder by creating an empty folder there
    const functionsFolder = this.getFunctionAndNamespace(name)
    const functionsFolderResource = this.resources.addResource(functionsFolder, 'functions', {
      children: new Map(), isResource: false as const, path: functionsFolder,
    })

    /**
     * This function is used to call the callback.
     */
    const callCallback = (...callbackArgs: Parameters<T>) => {
      // Keep the previous function
      const previousFunction = this.currentFunction

      /* We have 2 possibilities.
       * 1. For a no-parameter function, we directly write in the root function.
       * 2. For a function with parameters, we get a child
       */
      this.currentFunction = functionsFolderResource

      if (callbackArgs.length === 0) {
        // We initialized with "null", now we set to empty commands
        this.currentFunction = Object.assign(functionsFolderResource, { isResource: true as const, commands: [] })
      } else {
        // Parametrized function
        this.createEnterChildFunction('call')
      }

      const currentPath = this.currentFunction?.path as ResourcePath

      // Add the commands
      callback(...callbackArgs)

      // Go back to the previous function
      this.currentFunction = previousFunction
      return toMcFunctionName(currentPath)
    }

    let functionName: string

    if (!realOptions.lazy) {
      // If the mcfunction is not lazy, then we directly create it

      if (callback.length >= 1) {
        // However, if the callback requires arguments, but the function is not lazy, we can't create the function
        throw new Error(`Got a parametrized function "${name}" expecting at least ${callback.length} arguments, without being lazy.\n`
        + 'Since it is not lazy, Sandstone tried to create it without passing any arguments.\n'
        + 'This is not possible. Consider putting default values to the parameters, or setting the function as lazy.')
      }

      // We know our callback has NO arguments. It's fine TypeScript, it really is!

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      functionName = callCallback()

      alreadyInitializedParameters.add('[]')
    }

    // When calling the result of mcfunction, it will be considered as the command /function functionName!
    return (...callbackArgs) => {
      const jsonRepresentation = JSON.stringify(callbackArgs)

      if (!alreadyInitializedParameters.has(jsonRepresentation)) {
        // If it's the 1st time this mcfunction is called with these arguments, we create a new overload
        functionName = callCallback(...callbackArgs)

        alreadyInitializedParameters.add(jsonRepresentation)
      }

      this.registerNewCommand(['function', functionName])
    }
  }

  /**
   * Saves the datapack to the file system.
   *
   * @param name The name of the Datapack
   * @param options The save options
   */
  save = (name: string, options: SaveOptions = {}): void => saveDatapack(
    this.resources,
    name,
    options,
  )
}
