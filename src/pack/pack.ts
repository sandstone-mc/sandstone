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

const conflictDefaults = (resourceType: string) => (process.env.GENERAL_CONFLICT_STRATEGY ?? process.env[`${resourceType.toUpperCase()}_CONFLICT_STRATEGY`]) as string

/** relativePath can have variables $worldName$ & $packName$ */
export type handlerReadFile = (relativePath: string) => Promise<void>

/** relativePath & contents can have variables $worldName$ & $packName$ */
export type handlerWriteFile = (relativePath: string, contents: string) => Promise<void>
export abstract class PackType {
  readonly type: string

  readonly clientPath: string

  readonly serverPath: string

  readonly rootPath: string

  readonly networkSides: 'client' | 'server' | 'both'

  readonly resourceSubFolder: undefined | string

  readonly namespaced: boolean

  readonly archiveOutput: boolean

  /** `output` executes from `<workspace>/.sandstone/output/$packName$_<type>`*/
  readonly handleOutput: undefined | ((type: 'output' | 'client' | 'server', readFile: handlerReadFile, writeFile: handlerWriteFile) => Promise<void>)

  /**
   * @param type eg. datapack or resource_pack
   * @param clientPath from active client directory (eg. .minecraft), can use variables $worldName$ & $packName$; eg. 'saves/$worldName$/datapacks/$packName$' or 'saves/$worldName$/resources'
   * @param serverPath from active server directory, can use variable $packName$; eg. 'world/datapacks/$packName$'
   * @param rootPath from active client directory (eg. .minecraft), can use variable $packName$; eg. 'datapacks/$packName$' or 'resource_packs/$packName$'
   * @param networkSides which sides of the network the pack needs to be exported to; if both the client & server are defined which side this pack needs to be exported to
   * @param archiveOutput whether to archive the directory on output
   * @param resourceSubFolder Optional. Defines sub folder for resources to go; eg. data or assets (use handleOutput if you want to bypass this)
   */
  // eslint-disable-next-line max-len
  constructor(type: string, clientPath: string, serverPath: string, rootPath: string, networkSides: 'client' | 'server' | 'both', archiveOutput: boolean = false, resourceSubFolder?: string, namespaced: boolean = false) {
    this.type = type

    this.clientPath = clientPath
    this.serverPath = serverPath
    this.rootPath = rootPath

    this.networkSides = networkSides
    this.archiveOutput = archiveOutput

    if (resourceSubFolder) {
      this.resourceSubFolder = resourceSubFolder
    }
    this.namespaced = namespaced
  }
}

class DataPack extends PackType {
  resourceSubFolder = 'data'

  // TODO: typing. low priority
  readonly packMcmeta: any

  constructor(archiveOutput: boolean, options: { packFormat: number, packDescription: JSONTextComponent, features?: string[] }) {
    super('datapack', 'saves/$worldName$/datapacks/$packName$', 'world/datapacks/$packName$', 'datapacks/$packName$', 'server', archiveOutput, 'data', true)

    this.packMcmeta = {
      pack: {
        pack_format: options.packFormat,
        description: options.packDescription,
      },
    }

    if (options.features) {
      this.packMcmeta.features = { enabled: options.features }
    }
  }

  handleOutput = async (type: 'output' | 'client' | 'server', readFile: handlerReadFile, writeFile: handlerWriteFile) => {
    if (type === 'output') {
      await writeFile('pack.mcmeta', JSON.stringify(this.packMcmeta))
    }
  }
}

export class SandstonePack {
  readonly core: SandstoneCore

  readonly flow: Flow

  readonly commands: SandstoneCommands

  packTypes: Map<string, PackType>

  dataPack = () => this.packTypes.get('datapack') as DataPack

  objectives: Set<ObjectiveClass>

  anonymousScoreId = 0

  constants: Set<number>

  constructor(public defaultNamespace: string, public packUid: string) {
    this.core = new SandstoneCore(this)
    this.commands = new SandstoneCommands(this)

    this.packTypes = new Map()
    // TODO: Add options
    this.packTypes.set('datapack', new DataPack(false, JSON.parse(process.env.PACK_OPTIONS as string)))

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
    onConflict: conflictDefaults('mcfunction') as MCFunctionClassArguments['onConflict'],
    ...options,
  })

  addNode = (node: Node) => this.core.getCurrentMCFunctionOrThrow().addNode(node)

  Advancement = <T extends string>(name: string, advancement: AdvancementJSON<T>, options?: AdvancementClassArguments) => new AdvancementClass(this.core, this.resourceNameToPath(name), {
    advancement,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('advancement') as AdvancementClassArguments['onConflict'],
    ...options,
  })

  ItemModifier = (name: string, itemModifier: ItemModifierJSON, options?: ItemModifierClassArguments) => new ItemModifierClass(this.core, this.resourceNameToPath(name), {
    itemModifier,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('item_modifier') as ItemModifierClassArguments['onConflict'],
    ...options,
  })

  LootTable = (name: string, lootTable: LootTableJSON, options?: LootTableClassArguments) => new LootTableClass(this.core, this.resourceNameToPath(name), {
    lootTable,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('loot_table') as LootTableClassArguments['onConflict'],
    ...options,
  })

  Predicate = (name: string, predicate: PredicateJSON, options?: PredicateClassArguments) => new PredicateClass(this.core, this.resourceNameToPath(name), {
    predicate,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('predicate') as PredicateClassArguments['onConflict'],
    ...options,
  })

  Recipe = (name: string, recipe: RecipeJSON, options?: RecipeClassArguments) => new RecipeClass(this.core, this.resourceNameToPath(name), {
    recipe,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('recipe') as RecipeClassArguments['onConflict'],
    ...options,
  })

  /** @ts-ignore */
  Tag = <T extends REGISTRIES>(type: T, name: string, values: TagValuesJSON<T>, options?: TagClassArguments) => new TagClass<T>(this.core, type, this.resourceNameToPath(name), {
    values,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('tag') as TagClassArguments<T>['onConflict'],
    ...options,
  })

  TrimMaterial = (name: string, trimMaterial: TrimMaterialJSON, options?: TrimMaterialClassArguments) => new TrimMaterialClass(this.core, this.resourceNameToPath(name), {
    trimMaterial,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('trim_material') as TrimMaterialClassArguments['onConflict'],
    ...options,
  })

  TrimPattern = (name: string, trimPattern: TrimPatternJSON, options?: TrimPatternClassArguments) => new TrimPatternClass(this.core, this.resourceNameToPath(name), {
    trimPattern,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('trim_pattern') as TrimPatternClassArguments['onConflict'],
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

  save = async (cliOptions: { fileHandler: (relativePath: string, content: any, contentSummary: string) => Promise<void> }) => {
    await this.core.save(cliOptions, {
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

    return this.packTypes
  }
}
