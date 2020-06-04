import path from 'path'
import fs from 'fs'
import os from 'os'

import { getWorldPath } from './utils'

/**
 * A McFunction's name has at least 2 components: a namespace, then the different folders up to the function itself.
 */
type McFunctionName = string[]

type CommandArgs = readonly [any, ...any[]]

function minecraftFunctionName(functionName: McFunctionName | string[]): string {
  const [namespace, ...folders] = functionName
  return `${namespace}:${folders.join('/')}`
}

type McFunctionMethod = {
  (name: string, callback: () => void): () => void
  (callback: () => void): () => void
}

export default class Datapack {
  namespace: string

  currentFunction: McFunctionName | null

  /** Here, we use a "string" for the name because JS doesn't support objects as indexes.
   * We'll use the JSON representation. */
  functions: Map<McFunctionName, CommandArgs[]>

  constructor(namespace: string) {
    this.namespace = namespace
    this.currentFunction = null
    this.functions = new Map()
  }

  getCurrentFunctionMcName(): string {
    if (!this.currentFunction) {
      throw Error('Trying to get the name of a function without registering a root function')
    }

    return minecraftFunctionName(this.currentFunction)
  }

  getCurrentFunction(): CommandArgs[] {
    if (!this.currentFunction) {
      throw new Error('Current function is undefined')
    }


    const commandsIds = this.functions.get(this.currentFunction)

    if (!commandsIds) {
      throw new Error('Current function does not exist in the commands map - this is an internal error.')
    }

    return commandsIds
  }

  enterRootFunction(functionName: string): McFunctionName {
    this.currentFunction = [this.namespace, functionName]
    this.functions.set(this.currentFunction, [])
    return this.currentFunction
  }

  hasFunction(functionName: McFunctionName): boolean {
    return this.functions.has(functionName)
  }

  hasChildFunction(childName: string): boolean {
    if (!this.currentFunction) {
      return false
    }

    const childFullName = this.currentFunction.concat([childName])

    return this.hasFunction(childFullName)
  }

  enterChildFunction(functionName: string): string {
    if (!this.currentFunction) {
      throw Error('Entering child function without registering a root function')
    }

    let newName = functionName

    const newNameTemplate = `${functionName}_{}`
    let i = 2

    while (this.hasChildFunction(newName)) {
      newName = newNameTemplate.replace('{}', i.toString())
      i += 1
    }

    // Update the current function - it now is the child function.
    this.currentFunction.push(newName)

    // Set its commands as empty
    this.functions.set(this.currentFunction, [])

    // Return its full minecraft name
    return this.getCurrentFunctionMcName()
  }

  exitRootFunction(): void {
    if (!this.currentFunction) {
      throw Error('Exiting a not-existing function')
    }

    this.currentFunction = null
  }

  exitChildFunction(): void {
    if (!this.currentFunction) {
      throw Error('Exiting a not-existing function')
    }

    this.currentFunction.pop()
  }

  registerNewCommand = (commandArgs: CommandArgs): void => {
    if (!this.currentFunction) {
      throw Error('Adding a command outside of a registered function')
    }

    this.getCurrentFunction().push(commandArgs)
  }

  unregisterLastCommand = (): void => {
    this.getCurrentFunction().pop()
  }

  mcfunction: McFunctionMethod = (nameOrCallback: string | (() => void), callbackOrUndefined: undefined | (() => void) = undefined) => {
    let name: string
    let callback: () => void

    if (callbackOrUndefined === undefined) {
      callback = nameOrCallback as () => void
      name = callback.name || '__anonymous__'
    } else {
      callback = callbackOrUndefined
      name = nameOrCallback as string
    }

    const functionName = minecraftFunctionName(this.enterRootFunction(name))
    callback()
    this.exitRootFunction()

    return () => {
      this.registerNewCommand(['function', functionName])
    }
  }

  /**
   * Saves the datapack to the file system.
   *
   * @param name The name of the Datapack
   * @param worldName The name of the world to save the datapack in. If unspecified, the datapack will be saved in the current folder.
   * @param minecraftPath The path of the .minecraft folder. If unspecified, it is automatically discovered.
   */
  save = (name: string, worldName: string | undefined = undefined, minecraftPath: string | undefined = undefined): void => {
    let savePath

    if (worldName) {
      savePath = path.join(getWorldPath(worldName, minecraftPath), 'datapacks')
    } else {
      savePath = process.cwd()
    }

    savePath = path.join(savePath, name)

    try {
    // Make the directory
      fs.mkdirSync(savePath)
    } catch (e) {
      // The folder already exists - don't do anything
    }

    const dataPath = path.join(savePath, 'data')

    for (const [[namespace, ...foldersAndFile], commandsArgs] of this.functions) {
      const functionsPath = path.join(dataPath, namespace, 'functions')
      const fileName = foldersAndFile.pop()
      const folders = foldersAndFile

      const mcFunctionFolder = path.join(functionsPath, ...folders)

      // Create the path
      try {
        fs.mkdirSync(mcFunctionFolder, { recursive: true })
      } catch (e) {
        // Folder already exists
      }

      // Write the commands
      const mcFunctionPath = path.join(mcFunctionFolder, `${fileName}.mcfunction`)

      // Join the arguments of all commands to write them
      const commands = commandsArgs.map((arg) => arg?.join(' '))

      fs.writeFileSync(mcFunctionPath, commands.join('\n'))
    }

    // Write pack.mcmeta
    fs.writeFileSync(path.join(savePath, 'pack.mcmeta'), JSON.stringify({
      pack: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        pack_format: 5,
        description: 'Generated using Sandstone',
      },
    }))

    console.log('Successfully wrote commands to', savePath)
  }
}
