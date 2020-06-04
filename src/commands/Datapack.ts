// OLD STUFF

/**
 * A McFunction's name has at least 2 components: a namespace, then the different folders up to the function itself.
 */
type McFunctionName = [string, string, ...string[]]

type CommandArgs = readonly [any, ...any[]]

function minecraftFunctionName(functionName: McFunctionName | string[]): string {
  const [namespace, ...folders] = functionName
  return `${namespace}:${folders.join('/')}`
}

export default class Datapack {
  namespace: string

  currentFunction: McFunctionName | null

  /** Here, we use a "string" for the name because JS doesn't support objects as indexes.
   * We'll use the JSON representation. */
  functions: Map<string, CommandArgs[]>

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
    const commandsIds = this.functions.get(this.getCurrentFunctionMcName())

    if (!commandsIds) {
      throw new Error('Current function is undefined')
    }

    return commandsIds
  }

  enterRootFunction(functionName: string): void {
    this.currentFunction = [this.namespace, functionName]
    this.functions.set(this.getCurrentFunctionMcName(), [])
  }

  hasChildFunction(childName: string): boolean {
    if (!this.currentFunction) {
      return false
    }

    const possibleChildFullName = this.currentFunction.concat([childName])
    const mcName = minecraftFunctionName(possibleChildFullName)

    return this.functions.has(mcName)
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

    this.currentFunction.push(newName)

    const fullName = this.getCurrentFunctionMcName()
    this.functions.set(fullName, [])

    return fullName
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

  mcfunction = (name: string, callback: () => void) => {
    this.enterRootFunction(name)
    callback()
    this.exitRootFunction()
  }

  save = (): void => {
    for (const [functionName, commandsArgs] of this.functions) {
      console.log('====', functionName, '====\n')

      console.log(
        commandsArgs.map((commandArgs) => commandArgs?.join(' ')).join('\n'),
      )

      console.log('\n================\n')
    }
  }
}
