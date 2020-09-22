import { LiteralUnion } from '@/generalTypes'
import type {
  AdvancementType, JsonTextComponent, OBJECTIVE_CRITERION, PredicateType,
} from '@arguments'
import { CommandsRoot } from '@commands'
import { Flow } from '@flow'
import { McFunction, McFunctionOptions } from '@resources/McFunction'
import { Objective, ObjectiveClass, SelectorCreator } from '@variables'
import { AdvancementCommand } from '@commands/implementations'
import { Advancement } from '@resources'
import { Predicate } from '@resources/Predicate'
import { saveDatapack, SaveOptions } from './saveDatapack'
import { CommandArgs, toMcFunctionName } from './minecraft'
import {
  FolderOrFile,
  FunctionResource, ResourceOnlyTypeMap, ResourcePath, ResourcesTree, ResourceTypeMap, ResourceTypes,
} from './resourcesTree'

export interface McFunctionReturn<T extends unknown[]> {
  (...args: T): void

  schedule: (delay: number | LiteralUnion<'1t' | '1s' | '1d'>, type?: 'append' | 'replace', ...callbackArgs: T) => void

  getNameFromArgs: (...args: T) => string

  clearSchedule: (...args: T) => void
}

export default class Datapack {
  defaultNamespace: string

  currentFunction: FunctionResource | null

  resources: ResourcesTree

  objectives: Map<string, ObjectiveClass>

  commandsRoot: CommandsRoot

  constants: Set<number>

  rootFunctions: Set<McFunction<any[]>>

  static anonymousScoreId = 0

  flow: Flow

  constructor(namespace: string) {
    this.defaultNamespace = namespace
    this.currentFunction = null
    this.resources = new ResourcesTree()
    this.objectives = new Map()
    this.constants = new Set()
    this.rootFunctions = new Set()

    this.commandsRoot = new CommandsRoot(this)
    this.flow = new Flow(this.commandsRoot)
  }

  getResourcePath(functionName: string): {
    namespace: string
    path: string[]
    name: string
    fullPath: string[]
    fullPathWithNamespace: ResourcePath
  } {
    let namespace = this.defaultNamespace
    let fullName = functionName

    if (functionName.includes(':')) {
      ([namespace, fullName] = functionName.split(':'))
    }

    const fullPath = fullName.split('/')

    const name = fullPath[fullPath.length - 1]
    const path = fullPath.slice(0, -1)

    return {
      namespace, path, fullPath, name, fullPathWithNamespace: [namespace, ...fullPath],
    }
  }

  /**
   * Creates and enters a new root Minecraft function.
   *
   * @param functionName The name of the function to create
   */
  private createEnterRootFunction(functionName: string): ResourcePath {
    const functionPath = this.getResourcePath(functionName).fullPathWithNamespace

    this.currentFunction = this.resources.addResource('functions', {
      children: new Map(), commands: [], isResource: true, path: functionPath,
    })

    return functionPath
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
   * Creates a new child function of the current function.
   * @param functionName The name of the child function.
   */
  createChildFunction(functionName: string): { childFunction: FunctionResource, functionName: string } {
    if (!this.currentFunction) {
      throw Error('Entering child function without registering a root function')
    }

    const childName = this.getUniqueChildName(functionName)

    // Update the current function - it now is the child function.
    const emptyFunction = {
      children: new Map(), isResource: true as const, commands: [], path: [...this.currentFunction.path, childName],
    }

    this.currentFunction.children.set(childName, emptyFunction as any)

    // Return its full minecraft name
    return {
      functionName: toMcFunctionName(emptyFunction.path),
      childFunction: emptyFunction as any,
    }
  }

  /**
   * Creates and enters a new child function of the current function.
   * @param functionName The name of the child function.
   */
  createEnterChildFunction(functionName: string): string {
    const { childFunction, functionName: realFunctionName } = this.createChildFunction(functionName)

    this.currentFunction = childFunction

    // Return its full minecraft name
    return realFunctionName
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
  exitChildFunction(): void {
    if (!this.currentFunction) {
      throw Error('Exiting a not-existing function')
    }

    const parentPath = this.currentFunction.path.slice(0, -1)

    this.currentFunction = this.resources.getResource(parentPath as unknown as ResourcePath, 'functions')
  }

  registerNewObjective = (objective: ObjectiveClass) => {
    if (this.objectives.has(objective.name)) {
      throw new Error(`An objective named "${objective.name}" already exists.`)
    }
    this.objectives.set(objective.name, objective)
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
   * Register a new numeric constant.
   */
  registerNewConstant(amount: number) {
    this.constants.add(amount)
  }

  /**
   * Add a function that must be run each tick
   */
  addTickFunction(mcfunction: string) {
    const tickResource = this.resources.getOrAddResource('tags', {
      children: new Map(),
      isResource: true,
      path: ['minecraft', 'functions', 'tick'],
      values: [],
      replace: false,
    })

    tickResource.values.push(mcfunction)
  }

  /**
   * Add a function that must be run on each datapack load
   */
  addLoadFunction(mcfunction: string) {
    const tickResource = this.resources.getOrAddResource('tags', {
      children: new Map(),
      isResource: true,
      path: ['minecraft', 'functions', 'load'],
      values: [],
      replace: false,
    })

    tickResource.values.push(mcfunction)
  }

  /** UTILS */
  /** Create a new objective */
  createObjective = (name: string, criteria: LiteralUnion<OBJECTIVE_CRITERION>, display?: JsonTextComponent) => {
    if (name.length > 16) {
      throw new Error(`Objectives cannot have names with more than 16 characters. Got ${name.length} with objective "${name}".`)
    }

    const objective = Objective(this.commandsRoot, name, criteria, display)
    this.registerNewObjective(objective)
    return objective
  }

  /** Get an objective, and create it if it does not exists. */
  getCreateObjective(name: string, criteria: string, display?: JsonTextComponent) {
    try {
      return this.createObjective(name, criteria, display)
    } catch (e) {
      return this.objectives.get(name) as ObjectiveClass
    }
  }

  /**
   * Creates an anonymous, unique score
   */
  createAnonymousScore() {
    const sandstoneAnonymousName = 'sand_anonymous'
    const score = this.getCreateObjective(sandstoneAnonymousName, 'dummy', 'Sandstone Anonymous Scores')

    const id = Datapack.anonymousScoreId
    Datapack.anonymousScoreId += 1

    return score.ScoreHolder(`anonymous_${id}`)
  }

  Selector = SelectorCreator.bind(this)

  addResource = <T extends ResourceTypes>(name: string, type: T, resource: ResourceOnlyTypeMap[T]) => {
    this.resources.addResource(type, {
      ...resource,
      children: new Map(),
      isResource: true,
      path: this.getResourcePath(name).fullPathWithNamespace,
    })
  }

  /**
   * Creates a Minecraft Function.
   *
   * @param name The name of the function.
   * @param callback A callback containing the commands you want in the Minecraft Function.
   */
  mcfunction = <T extends any[]>(
    name: string, callback: (...args: T) => void, options?: McFunctionOptions,
  ): McFunctionReturn<T> => {
    const mcfunction = new McFunction(this, name, callback, options ?? {})

    this.rootFunctions.add(mcfunction as McFunction<any[]>)

    const returnFunction: any = mcfunction.call
    returnFunction.schedule = mcfunction.schedule
    returnFunction.getNameFromArgs = mcfunction.getNameFromArgs
    returnFunction.clearSchedule = mcfunction.clearSchedule

    return returnFunction
  }

  Advancement = <T extends string>(name: string, advancement: AdvancementType<T>) => new Advancement(this.commandsRoot, name, advancement)

  Predicate = (name: string, predicate: PredicateType) => new Predicate(this.commandsRoot, name, predicate)

  /**
   * Saves the datapack to the file system.
   *
   * @param name The name of the Datapack
   * @param options The save options
   */
  save = (name: string, options: SaveOptions = {}): void => {
    // First, generate all functions
    for (const mcfunction of this.rootFunctions) {
      mcfunction.generateInitialFunction()
    }

    // Then, generate the init function.
    this.createEnterRootFunction('__init__')

    // Start by generating constants
    if (this.constants.size > 0) {
      this.commandsRoot.scoreboard.objectives.add('sandstone_const', 'dummy', [{ text: 'Sandstone Constants' }])

      this.constants.forEach((constant) => {
        this.commandsRoot.scoreboard.players.set(constant, 'sandstone_const', constant)
      })
    }

    // Then, generate objectives
    if (this.objectives.size > 0) {
      this.objectives.forEach((objective) => {
        this.commandsRoot.scoreboard.objectives.add(objective.name, objective.criterion, objective._displayRaw)
      })
    }

    // Delete __init__ function if it's empty
    if (this.currentFunction?.isResource && this.currentFunction.commands.length === 0) {
      this.resources.deleteResource(this.currentFunction.path, 'functions')
    } else {
      // Else, put the __init__ function in the minecraft:load tag
      this.addLoadFunction(toMcFunctionName(this.currentFunction!.path))
    }

    this.exitRootFunction()

    saveDatapack(
      this.resources,
      name,
      options,
    )
  }
}
