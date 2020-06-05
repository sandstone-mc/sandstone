import path from 'path'
import fs from 'fs'
import os from 'os'

import {
  getWorldPath, saveDatapack, toMcFunctionName,
  McFunctionName, CommandArgs, SaveOptions,
} from './utils'


type McFunctionMethod = {
  /**
   * Creates a Minecraft Function.
   *
   * @param name The name of the function. If left unspecified, creates an anonymous Minecraft Function.
   * @param callback A callback containing the commands you want in the Minecraft Function.
   */
  (name: string, callback: () => void): () => void

  /**
   * Creates a Minecraft Function.
   *
   * @param name The name of the function. If left unspecified, creates an anonymous Minecraft Function.
   * @param callback A callback containing the commands you want in the Minecraft Function.
   */
  (callback: () => void): () => void
}

export default class Datapack {
  defaultNamespace: string

  currentFunction: McFunctionName | null

  /** Here, we use a "string" for the name because JS doesn't support objects as indexes.
   * We'll use the JSON representation. */
  functions: Map<McFunctionName, CommandArgs[]>

  constructor(namespace: string) {
    this.defaultNamespace = namespace
    this.currentFunction = null
    this.functions = new Map()
  }


  /**
   * Get the commands of the current function.
   */
  getCurrentFunctionCommands(): CommandArgs[] {
    if (!this.currentFunction) {
      throw new Error('Current function is undefined')
    }

    const commandsIds = this.functions.get(this.currentFunction)

    if (!commandsIds) {
      throw new Error('Current function does not exist in the commands map - this is an internal error.')
    }

    return commandsIds
  }

  /**
   * Enters a root Minecraft function.
   *
   * @param functionName The name of the function to enter
   */
  enterRootFunction(functionName: string): McFunctionName {
    let namespace = this.defaultNamespace
    let name = functionName

    if (functionName.includes(':')) {
      ([namespace, name] = functionName.split(':'))
    }

    [namespace, name] = this.getUniqueName([namespace, name])

    this.currentFunction = [namespace, name]
    this.functions.set(this.currentFunction, [])
    return this.currentFunction
  }

  /**
   * Check if the datapack contains a function with the given nam
   * @param functionName The name of the function
   */
  hasFunction(functionName: McFunctionName): boolean {
    /* Sadly, we can't directly check if an array is present as a key in the map
     * (because JS checks references, not if arrays have same elements)
     * Therefore, we compare the JSON representation */
    const jsonFunctionName = JSON.stringify(functionName)
    const jsonFunctions = Array.from(this.functions.keys()).map((key) => JSON.stringify(key))

    return jsonFunctions.includes(jsonFunctionName)
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
   * @param functionName The original name for the function
   */
  getUniqueName(functionName: McFunctionName): McFunctionName {
    // Get the namespace and the folders of the function
    const namespaceFolders = functionName.slice(0, -1)

    // By default, the "new name" is the original name.
    let newName = functionName[functionName.length - 1]

    const newNameTemplate = `${newName}_{}`
    let i = 2

    // If the current "new name" already exists in the Datapack, increment `i` and apply the template
    while (this.hasFunction([...namespaceFolders, newName])) {
      newName = newNameTemplate.replace('{}', i.toString())
      i += 1
    }

    return [...namespaceFolders, newName]
  }

  /**
   * Get a unique name for a child function of the current function, from an original name.
   * @param childName The original name for the child function.
   */
  getUniqueChildName(childName: string): string {
    if (!this.currentFunction) {
      throw new Error('Trying to get a unique child name outside a root function.')
    }

    const result = this.getUniqueName(this.currentFunction.concat([childName]))
    return result[result.length - 1]
  }

  /**
   * Enter a child function of the current function.
   * @param functionName The name of the child function.
   */
  enterChildFunction(functionName: string): string {
    if (!this.currentFunction) {
      throw Error('Entering child function without registering a root function')
    }

    const newName = this.getUniqueChildName(functionName)

    // Update the current function - it now is the child function.
    this.currentFunction.push(newName)

    // Set its commands as empty
    this.functions.set(this.currentFunction, [])

    // Return its full minecraft name
    return toMcFunctionName(this.currentFunction)
  }

  /**
   * Recursively exit the current function of the datapack.
   *
   * If we're in a child function of a root function (or a n-th child), it will exit them too.
   */
  exitRootFunction(): void {
    if (!this.currentFunction) {
      throw Error('Exiting a not-existing function')
    }

    this.currentFunction = null
  }

  /**
   * Exit the current child function, and enter the parent function.
   */
  exitChildFunction(): void {
    if (!this.currentFunction) {
      throw Error('Exiting a not-existing function')
    }

    this.currentFunction.pop()
  }

  /**
   * Register a new command in the current function.
   * @param commandArgs The arguments of the command to add.
   */
  registerNewCommand = (commandArgs: CommandArgs): void => {
    if (!this.currentFunction) {
      throw Error('Adding a command outside of a registered function')
    }

    this.getCurrentFunctionCommands().push(commandArgs)
  }

  /**
   * Remove the last command added to the current function.
   */
  unregisterLastCommand = (): void => {
    this.getCurrentFunctionCommands().pop()
  }

  mcfunction: McFunctionMethod = (nameOrCallback: string | (() => void), callbackOrUndefined: undefined | (() => void) = undefined) => {
    let name: string
    let callback: () => void

    // Get the name and the callback
    if (callbackOrUndefined === undefined) {
      callback = nameOrCallback as () => void
      name = callback.name || '__anonymous__'
    } else {
      callback = callbackOrUndefined
      name = nameOrCallback as string
    }

    const functionName = toMcFunctionName(this.enterRootFunction(name))
    callback()
    this.exitRootFunction()

    // When calling the result of mcfunction, it will be considered as the command /function functionName!
    return () => {
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
    this.functions,
    name,
    options,
  )
}
