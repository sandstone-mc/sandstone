/* eslint-disable no-plusplus */
import { ResolveNBTClass } from 'sandstone/variables/ResolveNBT'
import { SandstoneCommands } from '#commands'
import {
  AdvancementClass, ItemModifierClass, LootTableClass, MCFunctionClass, PredicateClass, RecipeClass, SandstoneCore, TagClass, TrimMaterialClass, TrimPatternClass,
} from '#core'
import { Flow } from '#flow'
import {
  coordinatesParser,
  DataClass, DataPointClass, LabelClass, ObjectiveClass, SelectorClass, TargetlessDataClass, TargetlessDataPointClass, VectorClass,
} from '#variables'
import { Score } from '#variables/Score'

import {
  ContainerCommandsToMCFunctionVisitor, GenerateLazyMCFunction, IfElseTransformationVisitor, InitConstantsVisitor, InitObjectivesVisitor,
  InlineFunctionCallVisitor,
  LogVisitor,
  SimplifyExecuteFunctionVisitor, UnifyChainedExecutesVisitor,
} from './visitors'

import type {
  // eslint-disable-next-line max-len
  AdvancementJSON, Coordinates, ItemModifierJSON, JSONTextComponent, LootTableJSON, NBTObject, OBJECTIVE_CRITERION, PredicateJSON, RecipeJSON, REGISTRIES, SingleEntityArgument, TagValuesJSON, TimeArgument, TrimMaterialJSON, TrimPatternJSON,
} from '#arguments'
import type { StoreType } from '#commands'
import type {
  _RawMCFunctionClass,
  // eslint-disable-next-line max-len
  AdvancementClassArguments, ItemModifierClassArguments, LootTableClassArguments, MCFunctionClassArguments, Node, PredicateClassArguments, RecipeClassArguments, TagClassArguments, TrimMaterialClassArguments, TrimPatternClassArguments,
} from '#core'
import type { LiteralUnion, MakeInstanceCallable } from '#utils'
import type {
  DATA_PATH, DATA_TARGET, DATA_TYPES, SelectorCreator, SelectorProperties,
} from '#variables'

export type ResourcePath = string[]

const conflictDefaults = (resourceType: string) => (process.env.GENERAL_CONFLICT_STRATEGY ?? process.env[`${resourceType.toUpperCase()}_CONFLICT_STRATEGY`]) as string

let tempStorage: DataClass<'storage'>

let startTickedLoops: MCFunctionClass

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

  packTypes: Map<string, PackType>

  dataPack = () => this.packTypes.get('datapack') as DataPack

  // Smithed Pack IDs
  dependencies: Map<string, boolean>

  readonly flow: Flow

  readonly commands: SandstoneCommands

  objectives: Set<ObjectiveClass>

  anonymousScoreId = 0

  anonymousDataId = 0

  constants: Set<number>

  tickedLoops: Record<string, MakeInstanceCallable<_RawMCFunctionClass>>

  loadTags: { preLoad: TagClass<'functions'>, load: TagClass<'functions'>, postLoad: TagClass<'functions'> }

  constructor(public defaultNamespace: string, public packUid: string) {
    this.core = new SandstoneCore(this)

    this.packTypes = new Map()
    this.packTypes.set('datapack', new DataPack(false, JSON.parse(process.env.PACK_OPTIONS as string)))

    this.loadTags = {
      preLoad: this.Tag('functions', 'load:pre_load', []),
      load: this.Tag('functions', 'load:load', []),
      postLoad: this.Tag('functions', 'load:post_load', []),
    }
    this.setupLantern()
    this.dependencies = new Map()

    this.commands = new SandstoneCommands(this)

    this.flow = new Flow(this.core)
    this.objectives = new Set()
    this.constants = new Set()
    this.tickedLoops = {}

    if (process.env.NAMESPACE) {
      this.defaultNamespace = process.env.NAMESPACE
    }
  }

  protected setupLantern = () => {
    const loadStatus = this.Objective.create('load.status')

    const privateInit = this.Tag('functions', 'load:_private/init', [this.MCFunction('load:_private/init', () => {
      this.commands.comment('Reset scoreboards so packs can set values accurate for current load.')
      loadStatus.reset()
    })])

    const privateLoad = this.Tag('functions', 'load:_private/load', [
      privateInit,
      { id: this.loadTags.preLoad, required: false },
      { id: this.loadTags.load, required: false },
      { id: this.loadTags.postLoad, required: false },
    ])

    this.Tag('functions', 'minecraft:load', [privateLoad])

    this.core.insideMCFunction(this.getInitMCFunction(), () => {
      // TODO: Add this to CLI
      loadStatus(this.defaultNamespace).set(process.env.LOAD_VERSION || 1)
    })
  }

  resourceToPath = (name: string, resourceFolders: string[]): ResourcePath => {
    let namespace = this.defaultNamespace
    let fullName = name

    if (name.includes(':')) {
      ([namespace, fullName] = name.split(':'))
    }

    const fullPath = fullName.split('/')

    return [namespace, ...resourceFolders, ...fullPath]
  }

  /** UTILS */
  get _() {
    return new Flow(this.core)
  }

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
    create: (name: string, criteria: LiteralUnion<OBJECTIVE_CRITERION> = 'dummy', display?: JSONTextComponent, alreadyExists?: true): ObjectiveClass => {
      let namespace: boolean = false

      if (name.includes('.')) {
        namespace = true
      }

      const objective = new ObjectiveClass(this, namespace ? name : `${this.defaultNamespace}.${name}`, criteria as string, display, { creator: 'user' })

      if (!alreadyExists) {
        this.registerNewObjective(objective)
      }
      return objective
    },

    /** Get an existing objective. */
    get: (name: string): ObjectiveClass => new ObjectiveClass(this, name, undefined, undefined, { creator: 'user' }),
  }

  get rootObjective() {
    return this.Objective.create('sandstone', 'dummy', [{ text: 'Sandstone', color: 'gold' }, ' internals'])
  }

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
      const anonymousScore = score(`${name ?? 'anon'}_${this.packUid}_${this.anonymousScoreId++}`)

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

  /**
   * Creates a new label
   * @param label Label/tag name
   * @param description Label description (optional)
   */
  Label = (label: string, description?: string) => new LabelClass(this, label, description)

  /**
   * Creates a new Data Class Instance
   * @param type Source type
   * @param target Optional. Target for data
   * @param path Optional. Path for data
   */
  Data<T extends DATA_TYPES>(type: T): TargetlessDataClass<T>

  Data<T extends 'entity'>(type: T, target: SingleEntityArgument): DataClass<T>

  Data<T extends 'storage'>(type: T, target: string): DataClass<T>

  Data<T extends 'block'>(type: T, target: Coordinates): DataClass<T>

  Data<T extends DATA_TYPES>(type: T, target: undefined, path: DATA_PATH | DATA_PATH[]): TargetlessDataPointClass<T>

  Data<T extends 'entity'>(type: T, target: SingleEntityArgument, path: DATA_PATH | DATA_PATH[]): DataPointClass<T>

  Data<T extends 'storage'>(type: T, target: string, path: DATA_PATH | DATA_PATH[]): DataPointClass<T>

  Data<T extends 'block'>(type: T, target: Coordinates, path: DATA_PATH | DATA_PATH[]): DataPointClass<T>

  Data<T extends DATA_TYPES>(type: T, target?: SingleEntityArgument | string | Coordinates, path?: DATA_PATH | DATA_PATH[]) {
    const dataPath = path ?? typeof path === 'string' ? [path] : path
    if (!path && !target) {
      return new TargetlessDataClass(this, type)
    }
    if (!target) {
      return new TargetlessDataPointClass(this, type, dataPath as DATA_PATH[])
    }
    if (!path) {
      return new DataClass(this, type, (type === 'block' ? coordinatesParser(target) : target) as DATA_TARGET[T])
    }

    return new DataPointClass(this, type, (target instanceof VectorClass ? coordinatesParser(target) : target) as DATA_TARGET[T], dataPath as DATA_PATH[])
  }

  get rootStorage() {
    const variableStorage = new DataPointClass(this, 'storage', '__sandstone:variable', [])
    this.commands.data.merge.storage('__sandstone:variable', {})
    return variableStorage
  }

  DataVariable: (
    (
      /**
       * Creates a dynamic data variable, represented by an anonymous & unique Data Point.
       *
       * @param initialValue Optional. The initial value of the variable. If left unspecified,
       * or if `undefined`, then the Data Point will not be initialized.
       *
       * @param name Optional. A name that can be useful for debugging.
       */
      (initialValue?: NBTObject | DataPointClass<any>, name?: string) => DataPointClass<'storage'>
    ) & (
      /**
       * Creates a dynamic data variable, represented by an anonymous & unique Data Point.
       *
       * @param score The Score to set the data variable to.
       *
       * @param storeType Optional. The number type you want to store. Defaults to int.
       *
       * @param scale Optional. The scale to multiply the value by. Defaults to 1.
       *
       * @param name Optional. A name that can be useful for debugging.
       */
      (score: Score, storeType?: StoreType, scale?: number, name?: string) => DataPointClass<'storage'>
    )
  ) = (...args: [initialValue?: NBTObject | DataPointClass<any>, name?: string] | [score: Score, storeType?: StoreType, scale?: number, name?: string]) => {
    // Get the objective
      const data = this.rootStorage

      if (args[0] instanceof Score) {
        const [score, storeType, scale, name] = args
        // If the value is a score, leverage the .set method
        return this.DataVariable(undefined, name).set(score, (storeType || 'int') as StoreType, scale || 1)
      }

      const [initialValue, name] = args

      // Get the specific anonymous data point
      const anonymousData = data.select(`${name ?? 'anon'}_${this.packUid}_${this.anonymousDataId++}`)

      // No initial value => we can directly return the data point
      if (initialValue === undefined) {
        return anonymousData
      }

      // We currently are in a MCFunction => that's where the initialization should take place
      if (this.core.currentMCFunction) {
        return anonymousData.set(initialValue)
      }

      // Else, we should run it in the init MCFunction
      this.core.insideMCFunction(this.getInitMCFunction(), () => {
        anonymousData.set(initialValue)
      })

      return anonymousData
    }

  getTempStorage = (name: string) => {
    if (tempStorage) {
      return tempStorage.select(name)
    }
    tempStorage = this.Data('storage', '__sandstone:temp')
    this.commands.data.merge.storage('__sandstone:temp', {})
    return tempStorage.select(name)
  }

  /**
   * Resolve NBT containing Data Points & Score's.
   * @param nbt NBT with Data Points & Scores initialized with ResolveNBTPart.
   * @param dataPoint Optional. Data Point to resolve to.
   */
  ResolveNBT = (nbt: NBTObject, dataPoint?: DataPointClass<'storage'>) => new ResolveNBTClass(this, nbt, dataPoint)

  Selector: SelectorCreator = ((target: '@s' | '@p' | '@a' | '@e' | '@r', properties: SelectorProperties<false, false>) => new SelectorClass(this, target, properties)) as any

  MCFunction = (name: string, callback: (this: MCFunctionClass) => void, options?: MCFunctionClassArguments) => new MCFunctionClass(this.core, name, {
    callback,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('mcfunction') as MCFunctionClassArguments['onConflict'],
    ...options,
  })

  appendNode = (node: Node) => this.core.getCurrentMCFunctionOrThrow().appendNode(node)

  getInitMCFunction = () => new MCFunctionClass(this.core, `${this.defaultNamespace}:__init__`, {
    addToSandstoneCore: true,
    creator: 'sandstone',
    onConflict: 'append',
  })

  /**
   * Register commands that will be ticked at the rate you specify
   */
  registerTickedCommands(runEvery: TimeArgument, callback: () => void) {
    if (this.tickedLoops[runEvery]) {
      this.core.insideMCFunction(this.tickedLoops[runEvery], callback)
    } else {
      this.tickedLoops[runEvery] = this.MCFunction(`__sandstone:ticked/times/${runEvery}`, () => {
        this.tickedLoops[runEvery].schedule.function(runEvery, 'replace')
        callback()
      })
      if (!startTickedLoops) {
        startTickedLoops = this.MCFunction('__sandstone:ticked/start', () => this.tickedLoops[runEvery].schedule.function(runEvery, 'replace'))
        this.loadTags.load.push(startTickedLoops)
      } else {
        this.core.insideMCFunction(startTickedLoops, () => this.tickedLoops[runEvery].schedule.function(runEvery, 'replace'))
      }
    }
  }

  Advancement = <T extends string>(name: string, advancement: AdvancementJSON<T>, options?: AdvancementClassArguments) => new AdvancementClass(this.core, name, {
    advancement,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('advancement') as AdvancementClassArguments['onConflict'],
    ...options,
  })

  ItemModifier = (name: string, itemModifier: ItemModifierJSON, options?: ItemModifierClassArguments) => new ItemModifierClass(this.core, name, {
    itemModifier,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('item_modifier') as ItemModifierClassArguments['onConflict'],
    ...options,
  })

  LootTable = (name: string, lootTable: LootTableJSON, options?: LootTableClassArguments) => new LootTableClass(this.core, name, {
    lootTable,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('loot_table') as LootTableClassArguments['onConflict'],
    ...options,
  })

  Predicate = (name: string, predicate: PredicateJSON, options?: PredicateClassArguments) => new PredicateClass(this.core, name, {
    predicate,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('predicate') as PredicateClassArguments['onConflict'],
    ...options,
  })

  Recipe = (name: string, recipe: RecipeJSON, options?: RecipeClassArguments) => new RecipeClass(this.core, name, {
    recipe,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('recipe') as RecipeClassArguments['onConflict'],
    ...options,
  })

  /** @ts-ignore */
  Tag = <T extends REGISTRIES>(type: T, name: string, values: TagValuesJSON<T>, options?: TagClassArguments) => new TagClass<T>(this.core, type, name, {
    values,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('tag') as TagClassArguments<T>['onConflict'],
    ...options,
  })

  TrimMaterial = (name: string, trimMaterial: TrimMaterialJSON, options?: TrimMaterialClassArguments) => new TrimMaterialClass(this.core, name, {
    trimMaterial,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('trim_material') as TrimMaterialClassArguments['onConflict'],
    ...options,
  })

  TrimPattern = (name: string, trimPattern: TrimPatternJSON, options?: TrimPatternClassArguments) => new TrimPatternClass(this.core, name, {
    trimPattern,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('trim_pattern') as TrimPatternClassArguments['onConflict'],
    ...options,
  })

  save = async (cliOptions: { fileHandler: (relativePath: string, content: any) => Promise<void> }) => {
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

        // Optimization
        new InlineFunctionCallVisitor(this),
        new UnifyChainedExecutesVisitor(this),
        new SimplifyExecuteFunctionVisitor(this),
      ],
    })

    return this.packTypes
  }
}
