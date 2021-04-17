import chalk from 'chalk'
import { CommandsRoot } from '@commands'
import { Flow } from '@flow'
import { ObjectiveClass, SelectorCreator } from '@variables'
import { DataInstance, TargetlessDataInstance } from '@variables/Data'

import { BasePathClass } from './BasePath'
import { toMCFunctionName } from './minecraft'
import { ResourcesTree } from './resourcesTree'
import { saveDatapack } from './saveDatapack'

import type { JSONTextComponent, OBJECTIVE_CRITERION, TimeArgument } from 'src/arguments'
import type { BASIC_CONFLICT_STRATEGIES, HideFunctionProperties, LiteralUnion } from '@/generalTypes'
import type {
  AdvancementOptions, LootTableOptions, MCFunctionClass, MCFunctionOptions, PredicateOptions, RecipeOptions, TagOptions,
} from '@resources'
import type { ObjectiveInstance } from '@variables'
import type { DATA_TARGET, DATA_TYPES } from '@variables/Data'
import type { Score } from '@variables/Score'
import type { BasePathInstance, BasePathOptions } from './BasePath'
import type { CommandArgs } from './minecraft'
import type {
  FunctionResource, ResourceConflictStrategy, ResourceOnlyTypeMap, ResourcePath, ResourceTypes,
} from './resourcesTree'
import type { SaveOptions } from './saveDatapack'

type ScriptArguments = {
  /** The name of the data pack. */
  dataPackName: string,
  /** The destination folder of the data pack. `null` if there is only a custom file handler, or nothing at all. */
  destination: string | null,
}

export interface SandstoneConfig {
  /**
   * The default namespace for the data pack.
   * It can be changed for each resources, individually or using Base Paths.
   */
  namespace: string

  /**
   * The name of the datapack.
   */
  name: string

  /**
   * The description of the datapack.
   * Can be a single string or a JSON Text Component
   * (like in /tellraw or /title).
   */
  description: JSONTextComponent

  /**
   * The format version of the data pack.
   * Can change depending on the versions of Minecraft.
   *
   * @see [https://minecraft.gamepedia.com/Data_Pack#pack.mcmeta](https://minecraft.gamepedia.com/Data_Pack#pack.mcmeta)
   */
  formatVersion: number

  /**
   * A custom path to your .minecraft folder,
   * in case you changed the default and Sandstone fails to find it.
   */
  minecraftPath?: string

  /**
   * A unique identifier that is used to distinguish your variables from other Sandstone data pack variables.
   *
   * It must be a string of valid scoreboard characters.
   */
  packUid: string

  /** All the options to save the data pack. */
  saveOptions: {
    /**
     * A custom handler for saving files. If specified, files won't be saved anymore, you will have to handle that yourself.
     */
    customFileHandler?: SaveOptions['customFileHandler']

    /**
     * The indentation to use for all JSON & MCMeta files. This argument is the same than `JSON.stringify` 3d argument.
     */
    indentation?: string | number

    /**
     * The world to save the data pack in.
     *
     * Incompatible with `root` and `path`.
     */
    world?: string

    /**
     * Whether to save the data pack in the `.minecraft/datapacks` folder.
     *
     * Incompatible with `world` and `path`.
     */
    root?: true

    /**
     * A custom path to save the data pack at.
     *
     * Incompatible with `root` and `world`.
     */
    path?: string
  }

  /** Some scripts that can run at defined moments. */
  scripts?: {
    /** A script running before Sandstone starts importing source files. */
    beforeAll?: (options: ScriptArguments) => (void | Promise<void>)

    /** A script running before Sandstone starts saving the files. */
    beforeSave?: (options: ScriptArguments) => (void | Promise<void>)

    /** A script running after Sandstone saved all files. */
    afterAll?: (options: ScriptArguments) => (void | Promise<void>)
  }

  /**
   * The strategy to use when 2 resources of the same type (Advancement, MCFunctions...) have the same name.
   */
  onConflict?: {
    /**
     * The default conflict strategy to use for all resources.
     *
     * @default
     * 'warn'
     */
    default?: BASIC_CONFLICT_STRATEGIES,

    /**
     * The conflict strategy to use for Advancements.
     * Will override the defined `default` strategy.
     */
    advancement?: AdvancementOptions['onConflict']

    /**
     * The conflict strategy to use for Loot Tables.
     * Will override the defined `default` strategy.
     */
    lootTable?: LootTableOptions['onConflict']
    /**
     * The conflict strategy to use for MCFunctions.
     * Will override the defined `default` strategy.
     */
    mcFunction?: MCFunctionOptions['onConflict']
    /**
     * The conflict strategy to use for Predicates.
     * Will override the defined `default` strategy.
     */
    predicate?: PredicateOptions['onConflict']
    /**
     * The conflict strategy to use for RecipeOptions.
     * Will override the defined `default` strategy.
     */
    recipe?: RecipeOptions['onConflict']
    /**
     * The conflict strategy to use for Tags.
     * Will override the defined `default` strategy.
     */
    tag?: TagOptions['onConflict']
  }
}

export type MCFunctionInstance<RETURN extends (void | Promise<void>) = (void | Promise<void>)> = HideFunctionProperties<{
  (): RETURN
} & Pick<MCFunctionClass, 'schedule' | 'generate' | 'toString' | 'toJSON'>>

export default class Datapack {
  basePath: BasePathClass<undefined, undefined>

  defaultNamespace: string

  currentFunction: FunctionResource | null

  resources: ResourcesTree

  objectives: Map<string, ObjectiveInstance<string>>

  commandsRoot: CommandsRoot

  constants: Set<number>

  rootFunctions: Set<MCFunctionClass>

  static anonymousScoreId = 0

  flow: Flow

  initCommands: CommandArgs[]

  packUid: string

  constructor(packUid: string, namespace: string) {
    this.packUid = packUid
    this.basePath = new BasePathClass(this, {})
    this.defaultNamespace = namespace
    this.currentFunction = null
    this.resources = new ResourcesTree()
    this.objectives = new Map()
    this.constants = new Set()
    this.rootFunctions = new Set()

    this.commandsRoot = new CommandsRoot(this)
    this.flow = new Flow(this)

    this.initCommands = []
  }

  /** Get information like the path, namespace etc... from a resource name */
  getResourcePath(resourceName: string): {
    /** The namespace of the resource */
    namespace: string

    /**
     * The path of the resource, EXCLUDING the resource name and the namespace.
     *
     * @example
     * getResourcePath('minecraft:test/myfunction').path === ['test']
     */
    path: string[]

    /**
     * The path of the resource, EXCLUDING the namespace.
     *
     * @example
     * getResourcePath('minecraft:test/myfunction').fullPath === ['test', 'myfunction']
     */
    fullPath: string[]

    /**
     * The path of the resource, INCLUDING the resource name and the namespace.
     *
     * @example
     * getResourcePath('minecraft:test/myfunction').fullPathWithNamespace === ['minecraft', 'test', 'myfunction']
     */
    fullPathWithNamespace: ResourcePath

    /**
     * The name of the resource itself. Does not include the path nor the namespace.
     *
     * @example
     * getResourcePath('minecraft:test/myfunction').name === 'myfunction'
     */
    name: string

    /**
     * The full name of the resource itself, as it should be refered in the datapack.
     *
     * @example
     * getResourcePath('minecraft:test/myfunction').name === 'minecraft:test/myfunction'
     */
    fullName: string
  } {
    let namespace = this.defaultNamespace
    let fullName = resourceName

    if (resourceName.includes(':')) {
      ([namespace, fullName] = resourceName.split(':'))
    }

    const fullPath = fullName.split('/')

    const name = fullPath[fullPath.length - 1]
    const path = fullPath.slice(0, -1)

    return {
      namespace, path, fullPath, name, fullPathWithNamespace: [namespace, ...fullPath], fullName: `${namespace}:${fullName}`,
    }
  }

  /**
   * Creates and enters a new root Minecraft function.
   *
   * @param functionName The name of the function to create
   */
  createEnterRootFunction(functionName: string, conflictStrategy: ResourceConflictStrategy<'functions'>): string {
    const functionPath = this.getResourcePath(functionName).fullPathWithNamespace

    this.currentFunction = this.resources.addResource('functions', {
      children: new Map(), commands: [], isResource: true, path: functionPath,
    }, conflictStrategy)

    return toMCFunctionName(functionPath)
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
   * Get a unique name for a child function of a parent function, from an original name.
   * @param childName The original name for the child function.
   * @param parentFunction The parent function to find a child's name for. Defaults to current function.
   */
  getUniqueChildName(childName: string, parentFunction = this.currentFunction) {
    if (!parentFunction) {
      throw new Error('Trying to get a unique child name outside a root function.')
    }

    const newName = this.getUniqueNameFromFolder(childName, parentFunction)
    const fullName = toMCFunctionName([...parentFunction.path, newName])
    return this.getResourcePath(fullName)
  }

  /**
   * Creates a new child function of the current function.
   * @param functionName The name of the child function.
   * @param parentFunction The function for which a child must be created. Defaults to the current function.
   */
  createChildFunction(functionName: string, parentFunction = this.currentFunction): { childFunction: FunctionResource, functionName: string } {
    if (!parentFunction) {
      throw Error('Entering child function without registering a root function')
    }

    const { name: childName, fullName, fullPathWithNamespace } = this.getUniqueChildName(functionName, parentFunction)

    // Update the current function - it now is the child function.
    const emptyFunction = {
      children: new Map(), isResource: true as const, commands: [], path: fullPathWithNamespace,
    }

    parentFunction.children.set(childName, emptyFunction as any)

    // Return its full minecraft name
    return {
      functionName: fullName,
      childFunction: emptyFunction,
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

  createCallbackMCFunction(name: string, callback: () => (void | Promise<void>), asChild: boolean): MCFunctionInstance {
    let fullName: string
    if (asChild) {
      fullName = toMCFunctionName(this.getUniqueChildName(name).fullPathWithNamespace)
    } else {
      fullName = name
    }
    return this.basePath.MCFunction(fullName, callback)
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
   * Get the parent function of the current function.
   */
  getParentFunction() {
    if (!this.currentFunction) {
      throw Error('Exiting a not-existing function')
    }

    const parentPath = this.currentFunction.path.slice(0, -1)

    return this.resources.getResource(parentPath as unknown as ResourcePath, 'functions')
  }

  /**
   * Exit the current child function, and enter the parent function.
   */
  exitChildFunction(): void {
    this.currentFunction = this.getParentFunction()
  }

  registerNewObjective = (objective: ObjectiveInstance<string>) => {
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
      throw Error(`Adding a command outside of a registered function: /${commandArgs.join(' ')}`)
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
   * Add a function to a given function tag
   */
  addFunctionToTag(mcfunction: string, tag: string, index?: number | undefined) {
    const { namespace, fullPath, name } = this.getResourcePath(tag)

    const tickResource = this.resources.getOrAddResource('tags', {
      children: new Map(),
      isResource: true,
      path: [namespace, 'functions', ...fullPath],
      values: [],
      replace: false,
    })

    const { fullName } = this.getResourcePath(mcfunction)
    if (index === undefined) {
      tickResource.values.push(fullName)
    } else {
      // Insert at given index
      tickResource.values.splice(index, 0, fullName)
    }
  }

  /** UTILS */
  Objective = {
    /**
     * Create a new objective. Defaults to `dummy` if unspecified.
     * @param name The name of the objective
     */
    create: (name: string, criteria: LiteralUnion<OBJECTIVE_CRITERION> = 'dummy', display?: JSONTextComponent): ObjectiveInstance => {
      if (name.length > 16) {
        throw new Error(`Objectives cannot have names with more than 16 characters. Got ${name.length} with objective "${name}".`)
      }

      const objective = new ObjectiveClass(this.commandsRoot, name, criteria as string, display)
      const value = objective.ScoreHolder

      const { name: _, ...objectiveExceptName } = objective
      const objectiveInstance = Object.assign(
        objective.ScoreHolder,
        objectiveExceptName,
      )

      const descriptor = Object.getOwnPropertyDescriptor(value, 'name')!
      descriptor.value = objective.name
      Object.defineProperty(value, 'name', descriptor)

      this.registerNewObjective(objectiveInstance)
      return objectiveInstance
    },

    /** Get an existing objective. */
    get: (name: string): ObjectiveInstance => {
      if (name.length > 16) {
        throw new Error(`Objectives cannot have names with more than 16 characters. Got ${name.length} with objective "${name}".`)
      }

      const objective = new ObjectiveClass(this.commandsRoot, name)
      return Object.assign(
        objective.ScoreHolder,
        objective,
      )
    },
  }

  /** Get an objective, and create it if it does not exists. */
  getCreateObjective(name: string, criteria: string, display?: JSONTextComponent) {
    try {
      return this.Objective.create(name, criteria, display)
    } catch (e) {
      return this.objectives.get(name)!
    }
  }

  get rootObjective() {
    return this.getCreateObjective('sandstone', 'dummy', [{ text: 'Sandstone', color: 'gold' }, ' internals'])
  }

  /**
   * Creates a dynamic numeric variable, represented by an anonymous & unique score.
   *
   * @param initialValue The initial value of the variable. If left unspecified,
   * or if `undefined`, then the score will not be initialized.
   *
   * @param name A name that can be useful for debugging.
   */
  Variable = (initialValue?: number | Score | undefined, name?: string) => {
    // Get the objective
    const datapack = this.commandsRoot.Datapack
    const score = datapack.rootObjective

    // Get the specific anonymous score
    const id = Datapack.anonymousScoreId
    Datapack.anonymousScoreId += 1
    const anonymousScore = score(`${name ?? 'anon'}_${datapack.packUid}_${id}`)

    if (initialValue !== undefined) {
      if (this.currentFunction !== null) {
        anonymousScore.set(initialValue)
      } else {
        this.initCommands.push(['scoreboard', 'players', 'set', anonymousScore.target, anonymousScore.objective, initialValue])
      }
    }

    return anonymousScore
  }

  Selector = SelectorCreator.bind(this)

  Data = <TYPE extends DATA_TYPES>(type: TYPE, target?: DATA_TARGET[TYPE]): typeof target extends undefined ? TargetlessDataInstance : DataInstance => {
    if (target) {
      return new DataInstance(this, type, target) as any
    }
    return new TargetlessDataInstance(this, type) as any
  }

  /** A BasePath changes the base namespace & directory of nested resources. */
  BasePath = <N extends string | undefined, D extends string | undefined>(basePath: BasePathOptions<N, D>): BasePathInstance<N, D> => {
    const basePathInstance = new BasePathClass(this, basePath)

    const returnFunction: any = basePathInstance.getResourceName
    Object.assign(returnFunction, basePathInstance)

    return returnFunction
  }

  addResource = <T extends ResourceTypes, U extends ResourceOnlyTypeMap[T] = ResourceOnlyTypeMap[T]>(
    name: string,
    type: T,
    resource: Omit<U, 'children' | 'isResource' | 'path'>,
    conflictStrategy: ResourceConflictStrategy<T>,
  ) => {
    this.resources.addResource(type, {
      ...resource,
      children: new Map(),
      isResource: true,
      path: this.getResourcePath(name).fullPathWithNamespace,
    } as U, conflictStrategy)
  }

  sleep = (delay: TimeArgument): PromiseLike<void> => {
    const SLEEP_CHILD_NAME = '__sleep'

    if (!this.currentFunction) {
      throw new Error('Cannot call `sleep` outside of a MCFunction.')
    }

    // If we're already in a "sleep" child, go to the parent function. It avoids childs' names becoming namespace:function/__sleep/__sleep/__sleep etc...
    const { fullPath } = this.getResourcePath(toMCFunctionName(this.currentFunction.path))
    const inSleepFunction = fullPath[fullPath.length - 1].startsWith(SLEEP_CHILD_NAME)

    let parentFunction: FunctionResource

    // If we're in a sleep function, the parent function of the new child is the current function's parent. Else, the parent is the current function.
    if (inSleepFunction) {
      parentFunction = this.getParentFunction()
    } else {
      parentFunction = this.currentFunction
    }

    const newFunction = this.createChildFunction(SLEEP_CHILD_NAME, parentFunction)
    this.commandsRoot.schedule.function(newFunction.functionName, delay, 'append')

    return ({
      then: (async (onfullfilled?: () => (void | Promise<void>)) => {
        // Enter child "sleep"
        this.currentFunction = newFunction.childFunction
        const result = await onfullfilled?.()
        return result
      }) as any,
    })
  }

  /**
   * Saves the datapack to the file system.
   *
   * @param name The name of the Datapack
   * @param options The save options
   */
  save = async (name: string, options: SaveOptions) => {
    console.log(chalk`⌛ {gray Starting compilation...}`)

    // First, generate all functions
    for (const mcfunction of this.rootFunctions) {
      // eslint-disable-next-line no-await-in-loop
      await mcfunction.generate()
    }

    // Then, generate the init function.
    this.createEnterRootFunction('__init__', 'ignore')

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

    // Then, add init commands
    for (const commandArgs of this.initCommands) {
      this.registerNewCommand(commandArgs)
    }

    // Delete __init__ function if it's empty
    if (this.currentFunction?.isResource && this.currentFunction.commands.length === 0) {
      this.resources.deleteResource(this.currentFunction.path, 'functions')
    } else {
      // Else, put the __init__ function in the minecraft:load tag
      this.addFunctionToTag(toMCFunctionName(this.currentFunction!.path), 'minecraft:load', 0)
    }

    this.exitRootFunction()

    return saveDatapack(
      this.resources,
      name,
      options,
    )
  }
}
