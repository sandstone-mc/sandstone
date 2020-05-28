/**
 * A McFunction's name has at least 2 components: a namespace, then the different folders up to the function itself.
 */
type McFunctionName = [string, string, ...string[]]

function minecraftFunctionName(functionName: McFunctionName | string[]): string {
  const [namespace, ...folders] = functionName
  return `${namespace}:${folders.join('/')}`
}

export default class Datapack {
  namespace: string

  currentFunction: McFunctionName | null

  /** Here, we use a "string" for the name because JS doesn't support objects as indexes.
   * We'll use the JSON representation. */
  functions: { [functionName: string]: string[] }

  constructor(namespace: string) {
    this.namespace = namespace
    this.currentFunction = null
    this.functions = {}
  }

  getCurrentFunctionMcName(): string {
    if (!this.currentFunction) {
      throw Error('Trying to get the name of a function without registering a root function')
    }

    return minecraftFunctionName(this.currentFunction)
  }

  enterRootFunction(functionName: string): void {
    this.currentFunction = [this.namespace, functionName]
    this.functions[this.getCurrentFunctionMcName()] = []
  }

  hasChildFunction(childName: string): boolean {
    if (!this.currentFunction) {
      return false
    }

    const possibleChildFullName = this.currentFunction.concat([childName])
    const mcName = minecraftFunctionName(possibleChildFullName)
    return mcName in this.functions
  }

  enterChildFunction(functionName: string): string {
    if (!this.currentFunction) {
      throw Error('Entering child function without registering a root function')
    }

    let i = 0
    let newName: string
    const newNameTemplate = `${functionName}_{}`

    do {
      newName = newNameTemplate.replace('{}', i.toString())
      i += 1
    } while (this.hasChildFunction(newName))

    this.currentFunction.push(newName)

    const fullName = this.getCurrentFunctionMcName()
    this.functions[fullName] = []

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

  addCommand(args: any[]): void {
    if (!this.currentFunction) {
      throw Error('Creating COMMANDS_TREE outside registered function')
    }

    const command = args.map((arg) => {
      if (typeof arg === 'object') {
        return JSON.stringify(arg)
      }
      return arg.toString()
    }).join(' ')

    this.functions[this.getCurrentFunctionMcName()].push(command)
  }

  save(): void {
    console.log(this.functions)
  }
}
