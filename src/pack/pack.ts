import { SandstoneCommands } from '#commands'
import {
  AdvancementClass, ItemModifierClass, LootTableClass, MCFunctionClass, PredicateClass, RecipeClass, SandstoneCore, TagClass, TrimMaterialClass, TrimPatternClass,
} from '#core'
import { Flow } from '#flow'
import { ObjectiveClass } from '#variables'
import { DataPointClass } from '#variables/Data'

import {
  ContainerCommandsToMCFunctionVisitor, GenerateLazyMCFunction, IfElseTransformationVisitor, InitConstantsVisitor, InitObjectivesVisitor,
  InlineFunctionCallVisitor,
  LogVisitor,
  MergeSimilarResourcesVisitor, MinifySandstoneResourcesNamesVisitor, SimplifyExecuteFunctionVisitor, UnifyChainedExecutesVisitor,
} from './visitors'

import type {
  AdvancementJSON, ItemModifierJSON, JSONTextComponent, LootTableJSON, OBJECTIVE_CRITERION, PredicateJSON, RecipeJSON, REGISTRIES, TagValuesJSON, TrimMaterialJSON, TrimPatternJSON,
} from '#arguments'
import type {
  // eslint-disable-next-line max-len
  AdvancementClassArguments, ItemModifierClassArguments, LootTableClassArguments, MCFunctionClassArguments, Node, PredicateClassArguments, RecipeClassArguments, TagClassArguments, TrimMaterialClassArguments, TrimPatternClassArguments,
} from '#core'
import type { LiteralUnion } from '#utils'
import type { Score } from '#variables/Score'

export type ResourcePath = string[]

export class SandstonePack {
  readonly core: SandstoneCore

  readonly flow: Flow

  readonly commands: SandstoneCommands

  objectives: Set<ObjectiveClass>

  anonymousScoreId = 0

  constants: Set<number>

  constructor(public defaultNamespace: string, public packUid: string) {
    this.core = new SandstoneCore(this)
    this.commands = new SandstoneCommands(this)

    this.flow = new Flow(this.core)
    this.objectives = new Set()
    this.constants = new Set()
  }

  resourceNameToPath = (resourceName: string): ResourcePath => {
    let namespace = this.defaultNamespace
    let fullName = resourceName

    if (resourceName.includes(':')) {
      ([namespace, fullName] = resourceName.split(':'))
    }

    const fullPath = fullName.split('/')

    return [namespace, ...fullPath]
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

  /** UTILS */
  get _() {
    return new Flow(this.core)
  }

  getInitMCFunction = () => new MCFunctionClass(this.core, [this.defaultNamespace, '__init__'], {
    addToSandstoneCore: true,
    creator: 'sandstone',
    onConflict: 'append',
  })

  registerNewObjective = (objective: ObjectiveClass) => {
    this.objectives.add(objective)
  }

  /**
   * Register a new numeric constant.
   */
  registerNewConstant(amount: number) {
    this.constants.add(amount)
  }

  Objective = {
    /**
     * Create a new objective. Defaults to `dummy` if unspecified.
     * @param name The name of the objective
     */
    create: (name: string, criteria: LiteralUnion<OBJECTIVE_CRITERION> = 'dummy', display?: JSONTextComponent): ObjectiveClass => {
      const objective = new ObjectiveClass(this, name, criteria as string, display, { creator: 'user' })

      this.registerNewObjective(objective)
      return objective
    },

    /** Get an existing objective. */
    get: (name: string): ObjectiveClass => new ObjectiveClass(this, name, undefined, undefined, { creator: 'user' }),
  }

  get rootObjective() {
    return this.Objective.create('sandstone', 'dummy', [{ text: 'Sandstone', color: 'gold' }, ' internals'])
  }

  MCFunction = (name: string, callback: (this: MCFunctionClass) => void, options?: MCFunctionClassArguments) => new MCFunctionClass(this.core, this.resourceNameToPath(name), {
    callback,
    creator: 'user',
    addToSandstoneCore: true,
    ...options,
  })

  addNode = (node: Node) => this.core.getCurrentMCFunctionOrThrow().addNode(node)

  // TODO: Add options
  Advancement = <T extends string>(name: string, advancement: AdvancementJSON<T>, options?: AdvancementClassArguments) => new AdvancementClass(this.core, this.resourceNameToPath(name), {
    advancement,
    creator: 'user',
    addToSandstoneCore: true,
    ...options,
  })

  ItemModifier = (name: string, itemModifier: ItemModifierJSON, options?: ItemModifierClassArguments) => new ItemModifierClass(this.core, this.resourceNameToPath(name), {
    itemModifier,
    creator: 'user',
    addToSandstoneCore: true,
    ...options,
  })

  LootTable = (name: string, lootTable: LootTableJSON, options?: LootTableClassArguments) => new LootTableClass(this.core, this.resourceNameToPath(name), {
    lootTable,
    creator: 'user',
    addToSandstoneCore: true,
    ...options,
  })

  Predicate = (name: string, predicate: PredicateJSON, options?: PredicateClassArguments) => new PredicateClass(this.core, this.resourceNameToPath(name), {
    predicate,
    creator: 'user',
    addToSandstoneCore: true,
    ...options,
  })

  Recipe = (name: string, recipe: RecipeJSON, options?: RecipeClassArguments) => new RecipeClass(this.core, this.resourceNameToPath(name), {
    recipe,
    creator: 'user',
    addToSandstoneCore: true,
    ...options,
  })

  /** @ts-ignore */
  Tag = <T extends REGISTRIES>(type: T, name: string, values: TagValuesJSON<T>, options?: TagClassArguments) => new TagClass<T>(this.core, type, this.resourceNameToPath(name), {
    values,
    creator: 'user',
    addToSandstoneCore: true,
    ...options,
  })

  TrimMaterial = (name: string, trimMaterial: TrimMaterialJSON, options?: TrimMaterialClassArguments) => new TrimMaterialClass(this.core, this.resourceNameToPath(name), {
    trimMaterial,
    creator: 'user',
    addToSandstoneCore: true,
    ...options,
  })

  TrimPattern = (name: string, trimPattern: TrimPatternJSON, options?: TrimPatternClassArguments) => new TrimPatternClass(this.core, this.resourceNameToPath(name), {
    trimPattern,
    creator: 'user',
    addToSandstoneCore: true,
    ...options,
  })

  Variable: (
    (
      /**
       * Creates a dynamic numeric variable, represented by an anonymous & unique score.
       *
       * @param initialValue The initial value of the variable. If left unspecified,
       * or if `undefined`, then the score will not be initialized.
       *
       * @param name A name that can be useful for debugging.
       */
      (initialValue?: number | Score | undefined, name?: string) => Score
    ) & (
      /**
       * Creates a dynamic numeric variable, represented by an anonymous & unique score.
       *
       * @param nbt The NBT value to set the Variable to.
       *
       * @param scale The scale to multiply the value by. Defaults to 1.
       *
       * @param name A name that can be useful for debugging.
       */
      (nbt: DataPointClass, scale?: number, name?: string) => Score
    )
  ) = (...args: [initialValue?: number | Score | undefined, name?: string] | [nbt: DataPointClass, scale?: number, name?: string]) => {
    // Get the objective
      const score = this.rootObjective

      if (args[0] instanceof DataPointClass) {
        const [nbt, scale, name] = args
        // If the value is a data point, leverage the .set method
        return this.Variable(undefined, name).set(nbt, scale as number)
      }

      const [initialValue, name] = args

      // Get the specific anonymous score
      const anonymousScore = score(`${name ?? 'anon'}_${this.packUid}_${this.anonymousScoreId}`)
      this.anonymousScoreId += 1

      // No initial value => we can directly return the score
      if (initialValue === undefined) {
        return anonymousScore
      }

      // We currently are in a MCFunction => that's where the initialization should take place
      if (this.core.currentMCFunction) {
        return anonymousScore.set(initialValue)
      }

      // Else, we should run it in the init MCFunction
      this.core.insideMCFunction(this.getInitMCFunction(), () => {
        anonymousScore.set(initialValue)
      })

      return anonymousScore
    }

  save = () => this.core.save({
    visitors: [
      // Initialization visitors
      new LogVisitor(this),
      new InitObjectivesVisitor(this),
      new InitConstantsVisitor(this),
      new GenerateLazyMCFunction(this),

      // Transformation visitors
      new IfElseTransformationVisitor(this),
      new ContainerCommandsToMCFunctionVisitor(this),
      new MergeSimilarResourcesVisitor(this),

      // Optimization
      new InlineFunctionCallVisitor(this),
      new UnifyChainedExecutesVisitor(this),
      new SimplifyExecuteFunctionVisitor(this),
      new MinifySandstoneResourcesNamesVisitor(this),
    ],
  })
}
