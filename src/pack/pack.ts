/* eslint-disable max-len */
/* eslint-disable no-plusplus */

import type {
  // eslint-disable-next-line max-len
  AtlasDefinition,
  BlockStateDefinition,
  BlockStateType,
  Coordinates,
  DamageTypeJSON,
  FontProvider,
  ItemModifierJSON,
  JSONTextComponent,
  LootTableJSON,
  NBTObject,
  PredicateJSON,
  REGISTRIES,
  RecipeJSON,
  RootNBT,
  SingleEntityArgument,
  SOUND_TYPES,
  TagValuesJSON,
  TEXTURE_TYPES,
  TimeArgument,
  TrimMaterialJSON,
  TrimPatternJSON,
  Registry,
  OBJECTIVE_CRITERIA,
} from 'sandstone/arguments'
import type { StoreType } from 'sandstone/commands'
import { SandstoneCommands } from 'sandstone/commands'
import type {
  _RawMCFunctionClass,
  // eslint-disable-next-line max-len
  AdvancementClassArguments,
  AtlasClassArguments,
  BlockStateArguments,
  DamageTypeClassArguments,
  DataPointPickClass,
  FontArguments,
  ItemModifierClassArguments,
  LanguageArguments,
  LootTableClassArguments,
  MacroArgument,
  MCFunctionClassArguments,
  ModelClassArguments,
  Node,
  PlainTextArguments,
  PredicateClassArguments,
  RecipeClassArguments,
  SoundEventArguments,
  TagClassArguments,
  TextureArguments,
  TrimMaterialClassArguments,
  TrimPatternClassArguments,
} from 'sandstone/core'
import {
  AdvancementClass,
  AtlasClass,
  BlockStateClass,
  DamageTypeClass,
  FontClass,
  ItemModifierClass,
  isMacroArgument,
  LanguageClass,
  LootTableClass,
  MacroLiteral,
  MCFunctionClass,
  ModelClass,
  PlainTextClass,
  PredicateClass,
  RecipeClass,
  SandstoneCore,
  SoundEventClass,
  TagClass,
  TextureClass,
  TrimMaterialClass,
  TrimPatternClass,
} from 'sandstone/core'
import { CustomResourceClass } from 'sandstone/core/resources/custom'
import { Flow, SandstoneConditions } from 'sandstone/flow'
import type { LiteralUnion, MakeInstanceCallable } from 'sandstone/utils'
import { makeCallable, randomUUID } from 'sandstone/utils'
import type {
  DATA_PATH,
  DATA_TARGET,
  DATA_TYPES,
  SelectorProperties,
  TriggerHandler,
  UUIDinNumber,
  UUIDinScore,
  UUIDOptions,
  UUIDSource,
} from 'sandstone/variables'
import {
  coordinatesParser,
  DataArray,
  DataClass,
  DataIndexMap,
  DataPointClass,
  LabelClass,
  LoopArgument,
  ObjectiveClass,
  Score,
  SelectorClass,
  SleepClass,
  TargetlessDataClass,
  TargetlessDataPointClass,
  TriggerClass,
  UUIDClass,
  VectorClass,
} from 'sandstone/variables'
import { ResolveNBTClass } from 'sandstone/variables/ResolveNBT'
import type { handlerReadFile, handlerWriteFile } from './packType'
import { PackType } from './packType'
import { AwaitBodyVisitor } from './visitors/addAwaitBodyToMCFunctions'
import {
  ContainerCommandsToMCFunctionVisitor,
  GenerateLazyMCFunction,
  IfElseTransformationVisitor,
  InitConstantsVisitor,
  InitObjectivesVisitor,
  InlineFunctionCallVisitor,
  LoopTransformationVisitor,
  OrTransformationVisitor,
  SimplifyExecuteFunctionVisitor,
  SimplifyReturnRunFunctionVisitor,
  UnifyChainedExecutesVisitor,
} from './visitors'
import { SymbolResource } from 'sandstone/arguments/generated/dispatcher'

export type ResourcePath = string[]

const conflictDefaults = (resourceType: string) =>
  (process.env[`${resourceType.toUpperCase()}_CONFLICT_STRATEGY`] || process.env.DEFAULT_CONFLICT_STRATEGY) as string

let tempStorage: DataClass<'storage'>

let startTickedLoops: MCFunctionClass<undefined, undefined>

type MCFunctionArgs = Exclude<Partial<MCFunctionClassArguments>, MCFunctionClassArguments['callback']>

const _foo: MCFunctionArgs = {
  addToSandstoneCore: false,
}

export class DataPack extends PackType {
  // TODO: typing. low priority
  readonly packMcmeta: any

  constructor(
    archiveOutput: boolean,
    options: {
      packFormat: number
      description: JSONTextComponent
      features?: string[]
      filter?: { namespace?: string; path?: string }[]
    },
  ) {
    super(
      'datapack',
      'saves/$worldName$/datapacks/$packName$',
      'world/datapacks/$packName$',
      'datapacks/$packName$',
      'server',
      archiveOutput,
      'data',
      true,
    )

    this.packMcmeta = {
      pack: {
        pack_format: options.packFormat,
        description: options.description,
      },
    }

    if (options.features) {
      this.packMcmeta.features = { enabled: options.features }
    }
    if (options.filter) {
      this.packMcmeta.filter = { block: options.filter }
    }
  }

  handleOutput = async (
    type: 'output' | 'client' | 'server',
    readFile: handlerReadFile,
    writeFile: handlerWriteFile,
  ) => {
    if (type === 'output') {
      await writeFile('pack.mcmeta', JSON.stringify(this.packMcmeta))
    }
  }
}

export class ResourcePack extends PackType {
  // TODO: typing. low priority
  readonly packMcmeta: any

  constructor(options: {
    packFormat: number
    description: JSONTextComponent
    features?: string[]
    filter?: { namespace?: string; path?: string }[]
  }) {
    super(
      'resourcepack',
      'saves/$worldName$/resources',
      'resource_pack',
      'resourcepacks/$packName$',
      'client',
      true,
      'assets',
      true,
    )

    this.packMcmeta = {
      pack: {
        pack_format: options.packFormat,
        description: options.description,
      },
    }

    if (options.filter) {
      this.packMcmeta.filter = { block: options.filter }
    }
  }

  handleOutput = async (
    type: 'output' | 'client' | 'server',
    readFile: handlerReadFile,
    writeFile: handlerWriteFile,
  ) => {
    if (type === 'output') {
      await writeFile('pack.mcmeta', JSON.stringify(this.packMcmeta))
    }
    /*
     * TODO: language
     *
     * language: Contains additional languages to add to the language menu
     * Language code for a language, corresponding to a .json file with the same name in the folder assets/<namespace>/lang.
     *  name: The full name of the language
     *  region: The country or region name
     *  bidirectional: If true, the language reads right to left.
     */
  }
}

export class SandstonePack {
  readonly core: SandstoneCore = new SandstoneCore(this)

  packTypes: Map<string, PackType>

  packOptions = process.env.PACK_OPTIONS
    ? JSON.parse(process.env.PACK_OPTIONS)
    : {
        datapack: {
          packFormat: 31,
        },
      }

  __initMCFunction?: MCFunctionClass<undefined, undefined>

  // Smithed Pack IDs
  dependencies: Map<string, boolean>

  readonly flow: Flow

  readonly commands: SandstoneCommands<false>

  readonly Macro: SandstoneCommands<true> &
    ((strings: TemplateStringsArray, ...macros: (string | number | MacroArgument)[]) => MacroLiteral)

  readonly conditions = SandstoneConditions

  objectives: Set<ObjectiveClass>

  anonymousScoreId = 0

  anonymousDataId = 0

  constants: Set<number>

  tickedLoops: Record<string, MakeInstanceCallable<_RawMCFunctionClass<undefined, undefined>>>

  loadTags: { preLoad: TagClass<'function'>; load: TagClass<'function'>; postLoad: TagClass<'function'> }

  __rootObjective?: ObjectiveClass

  constructor(
    public defaultNamespace: string,
    public packUid: string,
  ) {
    this.packTypes = new Map()

    this.commands = new SandstoneCommands(this)

    // SandstonePack.Macro is only a type hack
    this.Macro = makeCallable(
      this.commands,
      (strings: TemplateStringsArray, ...macros: (string | number | MacroArgument)[]) =>
        new MacroLiteral(this.core, strings, macros),
      true,
    ) as unknown as this['Macro']

    this.flow = new Flow(this.core)
    this.objectives = new Set()

    this.constants = new Set()
    this.tickedLoops = {}

    if (process.env.NAMESPACE) {
      this.defaultNamespace = process.env.NAMESPACE
    }

    this.loadTags = {
      preLoad: this.Tag('function', 'load:pre_load', []),
      load: this.Tag('function', 'load:load', []),
      postLoad: this.Tag('function', 'load:post_load', []),
    }
    this.setupLantern()
    this.dependencies = new Map()

    // ESM is funny

    for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      /* @ts-ignore */
      if (method !== 'constructor' && typeof this[method] === 'function' && typeof this[method].bind === 'function') {
        /* @ts-ignore */
        this[method] = this[method].bind(this)
      }
    }
  }

  /**
   * Performs a full reset of the pack.
   */
  reset = () => {
    this.core.reset()
    this.packTypes.clear()
    this.__rootObjective = undefined
    this.__initMCFunction = undefined
    this.objectives.clear()
    this.constants.clear()
    this.tickedLoops = {}
    this.dependencies.clear()
    this.loadTags = {
      preLoad: this.Tag('function', 'load:pre_load', []),
      load: this.Tag('function', 'load:load', []),
      postLoad: this.Tag('function', 'load:post_load', []),
    }
    this.setupLantern()
    if (process.env.NAMESPACE) {
      this.defaultNamespace = process.env.NAMESPACE
    }

    // Initialize getters
    this.rootObjective
    this.initMCFunction
  }

  dataPack() {
    let pack = this.packTypes.get('datapack') as DataPack

    if (!pack) {
      pack = this.packTypes.set('datapack', new DataPack(false, this.packOptions.datapack)).get('datapack') as DataPack
    }

    return pack
  }

  resourcePack() {
    let pack = this.packTypes.get('resourcepack') as ResourcePack

    if (!pack) {
      pack = this.packTypes
        .set('resourcepack', new ResourcePack(this.packOptions.resourcepack))
        .get('resourcepack') as ResourcePack
    }

    return pack
  }

  setupLantern = () => {
    const loadStatus = this.Objective.create('load.status')

    const privateInit = this.Tag('function', 'load:_private/init', [
      this.MCFunction('load:_private/init', () => {
        this.commands.comment('Reset scoreboards so packs can set values accurate for current load.')
        loadStatus.reset()
      }),
    ])

    const privateLoad = this.Tag('function', 'load:_private/load', [
      privateInit,
      { id: this.loadTags.preLoad, required: false },
      { id: this.loadTags.load, required: false },
      { id: this.loadTags.postLoad, required: false },
    ])

    this.Tag('function', 'minecraft:load', [privateLoad])

    this.initMCFunction.push(() => loadStatus(this.defaultNamespace).set(process.env.LOAD_VERSION || 1))
  }

  resourceToPath = (name: string, resourceFolders?: string[]): ResourcePath => {
    let namespace = this.defaultNamespace
    let fullName = name

    if (name.includes(':')) {
      ;[namespace, fullName] = name.split(':')
    }

    const fullPath = fullName.split('/')

    if (!resourceFolders) {
      return fullPath
    }

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
     * @param criteria The criteria for the objective
     * @param display The display information for the objective
     * @param options Optional. Options for the objective.
     * @param options.alreadyExists If true, the objective will not be registered as a new one. Defaults to false.
     * @param options.useDefaultNamespace If true (the default), the objective will be created in the default namespace. \
     *                            For example, if the default namespace is `sandstone`, then the objective will be created as `sandstone.objective_name`. \
     *                            If false, the objective will be created without a namespace. \
     *                            This argument is ignored if the `name` already contains a namespace (determined by the presence of a dot `"."` or a double underscore `"__"`).
     */
    create: (
      name: string,
      criteria: LiteralUnion<OBJECTIVE_CRITERIA> = 'dummy',
      display?: JSONTextComponent,
      options: {
        alreadyExists?: boolean
        useDefaultNamespace?: boolean
      } = {},
    ): ObjectiveClass => {
      let { alreadyExists = false, useDefaultNamespace = true } = options

      if (name.includes('.') || name.includes('__')) {
        useDefaultNamespace = false
      }

      if (useDefaultNamespace) {
        name = `${this.defaultNamespace}.${name}`
      }

      const objective = new ObjectiveClass(this, name, criteria, display, { creator: 'user' })

      if (!alreadyExists) {
        this.registerNewObjective(objective)
      }
      return objective
    },

    /**
     * Get an existing objective. Sandstone will not check if the objective really exists.
     * @param name The name of the objective
     */
    get: (name: string): ObjectiveClass => new ObjectiveClass(this, name, 'dummy', undefined, { creator: 'user' }),
  }

  get rootObjective() {
    if (this.__rootObjective) {
      return this.__rootObjective
    }
    this.__rootObjective = this.Objective.create('__sandstone', 'dummy', [
      { text: 'Sandstone', color: 'gold' },
      ' internals',
    ])
    return this.__rootObjective
  }

  Variable: /**
   * Creates a dynamic numeric variable, represented by an anonymous & unique score.
   *
   * @param initialValue The initial value of the variable. If left unspecified,
   * or if `undefined`, then the score will not be initialized.
   *
   * @param name A name that can be useful for debugging.
   */
  ((initialValue?: number | Score | undefined, name?: string) => Score) &
    /**
     * Creates a dynamic numeric variable, represented by an anonymous & unique score.
     *
     * @param nbt The NBT value to set the Variable to.
     *
     * @param scale The scale to multiply the value by. Defaults to 1.
     *
     * @param name A name that can be useful for debugging.
     */
    ((nbt: DataPointClass, scale?: number, name?: string) => Score) = (
    ...args:
      | [initialValue?: number | Score | undefined, name?: string]
      | [nbt: DataPointClass, scale?: number, name?: string]
  ) => {
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
    this.initMCFunction.push(() => anonymousScore.set(initialValue))

    return anonymousScore
  }

  get flowVariable() {
    return this.rootObjective('if_result')
  }

  Trigger = (name: string, callback: TriggerHandler, pollingEvery = 1) =>
    new TriggerClass(this.core, name, callback, pollingEvery)

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

  Data<T extends 'entity'>(type: T, target: SingleEntityArgument<false>): DataClass<T>

  Data<T extends 'storage'>(type: T, target: MacroArgument | string): DataClass<T>

  Data<T extends 'block'>(type: T, target: Coordinates<false>): DataClass<T>

  Data<T extends DATA_TYPES>(
    type: T,
    target: undefined,
    path: MacroArgument | DATA_PATH | DATA_PATH[],
  ): TargetlessDataPointClass<T>

  Data<T extends 'entity'>(
    type: T,
    target: SingleEntityArgument<false>,
    path: MacroArgument | DATA_PATH | DATA_PATH[],
  ): DataPointClass<T>

  Data<T extends 'storage'>(
    type: T,
    target: MacroArgument | string,
    path: MacroArgument | DATA_PATH | DATA_PATH[],
  ): DataPointClass<T>

  Data<T extends 'block'>(
    type: T,
    target: Coordinates<false>,
    path: MacroArgument | DATA_PATH | DATA_PATH[],
  ): DataPointClass<T>

  Data<T extends DATA_TYPES>(
    type: T,
    target?: SingleEntityArgument<false> | string | Coordinates<false> | MacroArgument,
    path?: MacroArgument | DATA_PATH | DATA_PATH[],
  ) {
    const dataPath = (path ?? typeof path === 'string') ? [path] : path

    // Since Macros technically don't need to be used with `Macro.`, this is fine. Its hacky. But whatever.

    if (!path && !target) {
      return new TargetlessDataClass(this, type)
    }
    if (!target) {
      return new TargetlessDataPointClass(this, type, dataPath as DATA_PATH[])
    }
    if (!path) {
      return new DataClass(
        this,
        type,
        (isMacroArgument(this.core, target) ||
          (type === 'block' ? coordinatesParser(target) : target)) as DATA_TARGET[T],
      )
    }

    return new DataPointClass(
      this,
      type,
      (target instanceof VectorClass ? coordinatesParser(target) : target) as DATA_TARGET[T],
      dataPath as DATA_PATH[],
    )
  }

  __rootStorage?: DataPointClass

  rootStorage() {
    if (!this.__rootStorage) {
      this.__rootStorage = new DataPointClass(this, 'storage', '__sandstone:variable', [])

      return this.__rootStorage
    }

    return this.__rootStorage
  }

  DataVariable: /**
   * Creates a dynamic data variable, represented by an anonymous & unique Data Point.
   *
   * @param initialValue Optional. The initial value of the variable. If left unspecified,
   * or if `undefined`, then the Data Point will not be initialized.
   *
   * @param name Optional. A name that can be useful for debugging.
   */
  ((initialValue?: NBTObject | DataPointClass<any> | DataPointPickClass, name?: string) => DataPointClass<'storage'>) &
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
    ((score: Score, storeType?: StoreType, scale?: number, name?: string) => DataPointClass<'storage'>) = (
    ...args:
      | [initialValue?: NBTObject | DataPointClass<any> | DataPointPickClass, name?: string]
      | [score: Score, storeType?: StoreType, scale?: number, name?: string]
  ) => {
    // Get the objective
    const data = this.rootStorage()

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
      return anonymousData.set(initialValue as never)
    }

    // Else, we should run it in the init MCFunction
    this.initMCFunction.push(() => anonymousData.set(initialValue as never))

    return anonymousData
  }

  DataIndexMap<INITIAL extends RootNBT | Record<string, DataPointClass | DataPointPickClass>>(
    initialize: INITIAL,
    dataPoint?: DataPointClass<'storage'>,
  ) {
    return DataIndexMap(this, initialize, dataPoint) as DataIndexMap<INITIAL>
  }

  DataArray<INITIAL extends readonly NBTObject[] | readonly [string, DataPointClass | DataPointPickClass]>(
    initialize: INITIAL,
    dataPoint?: DataPointClass<'storage'>,
  ) {
    return DataArray(this, initialize, dataPoint) as DataArray<INITIAL>
  }

  getTempStorage = (name: string) => {
    if (tempStorage) {
      return tempStorage.select(name)
    }
    tempStorage = this.Data('storage', '__sandstone:temp')
    return tempStorage.select(name)
  }

  /**
   * Resolve NBT containing Data Points & Score's.
   * @param nbt NBT with Data Points & Scores initialized with ResolveNBTPart.
   * @param dataPoint Optional. Data Point to resolve to.
   */
  ResolveNBT = (nbt: NBTObject, dataPoint?: DataPointClass<'storage'>) => new ResolveNBTClass(this, nbt, dataPoint)

  Selector(target: '@e'): SelectorClass<false, false, false>

  Selector(target: '@a'): SelectorClass<false, false, true>

  Selector(target: '@s' | '@n'): SelectorClass<false, true, false>

  Selector(target: '@p' | '@r', selectorArguments?: Omit<Omit<SelectorProperties<false, false, false>, 'type'>, 'limit'>): SelectorClass<false, true, true>

  Selector<PROPERTIES extends Omit<SelectorProperties<false, false, false>, 'limit'>>(target: '@s' | '@n', selectorArguments: PROPERTIES): 
    SelectorClass<false, true, PROPERTIES['type'] extends ('player' | 'minecraft:player') ? true : false>

  Selector<PROPERTIES extends Omit<SelectorProperties<false, false, false>, 'type'>>(target: '@a', selectorArguments: PROPERTIES): 
    SelectorClass<false, PROPERTIES['limit'] extends 1 ? true : false, true>

  Selector<PROPERTIES extends SelectorProperties<false, false, false>>(target: '@e', selectorArguments: PROPERTIES): 
    SelectorClass<false, PROPERTIES['limit'] extends 1 ? true : false, PROPERTIES['type'] extends ('player' | 'minecraft:player') ? true : false>

  Selector(target: '@s' | '@p' | '@a' | '@e' | '@n' | '@r', selectorArguments?: SelectorProperties<boolean, boolean, boolean>) {
    return new SelectorClass(this, target, selectorArguments)
  }

  UUID(): UUIDClass<'known'>

  /** Initializes with a static UUID. (you can use `import { randomUUID } from 'sandstone/utils'` to generate one) */
  UUID(source: string | UUIDinNumber, options?: UUIDOptions): UUIDClass<'known'>

  /** Initializes with `Score`'s. */
  UUID(source: UUIDinScore, options?: UUIDOptions): UUIDClass<'scores'>

  /** Initializes with a Data Point (to a UUID int array). */
  UUID(source: DataPointClass, options?: UUIDOptions): UUIDClass<'data'>

  /** Initializes with a Selector. */
  UUID(source: SelectorClass<true, boolean>, options?: UUIDOptions): UUIDClass<'selector'>

  UUID(source: UUIDSource = randomUUID(), options?: UUIDOptions) {
    return new UUIDClass(this.core, source, options)
  }

  MCFunction(name: string, options?: MCFunctionArgs): MCFunctionClass<undefined, undefined>

  MCFunction(
    name: string,
    callback: (loop: MCFunctionClass<undefined, undefined>) => void,
    options?: MCFunctionArgs,
  ): MCFunctionClass<undefined, undefined>

  MCFunction<PARAMS extends readonly MacroArgument[]>(
    name: string,
    callback: (loop: MCFunctionClass<PARAMS, undefined>, ...params: PARAMS) => void,
    options?: MCFunctionArgs,
  ): MCFunctionClass<PARAMS, undefined>

  MCFunction<ENV extends readonly MacroArgument[]>(
    name: string,
    environmentVariables: ENV,
    callback: (loop: MCFunctionClass<undefined, ENV>) => void,
    options?: MCFunctionArgs,
  ): MCFunctionClass<undefined, ENV>

  MCFunction<PARAMS extends readonly MacroArgument[], ENV extends readonly MacroArgument[]>(
    name: string,
    environmentVariables: ENV,
    callback: (loop: MCFunctionClass<PARAMS, ENV>, ...params: PARAMS) => void,
    options?: MCFunctionArgs,
  ): MCFunctionClass<PARAMS, ENV>

  MCFunction<PARAMS extends readonly MacroArgument[] | undefined, ENV extends readonly MacroArgument[] | undefined>(
    ...args:
      | [name: string, options?: MCFunctionArgs]
      | [
          name: string,
          callback: (
            this: MCFunctionClass<PARAMS, ENV>,
            ...params: PARAMS extends readonly MacroArgument[] ? PARAMS : []
          ) => void,
          options?: MCFunctionArgs,
        ]
      | [
          name: string,
          environmentVariables: ENV,
          callback: (
            this: MCFunctionClass<PARAMS, ENV>,
            ...params: PARAMS extends readonly MacroArgument[] ? PARAMS : []
          ) => void,
          options?: MCFunctionArgs,
        ]
  ) {
    return new MCFunctionClass(
      this.core,
      args[0],
      {
        callback: (typeof args[1] === 'function' ? args[1] : args[2]) as () => void,
        creator: 'user',
        addToSandstoneCore: true,
        onConflict: conflictDefaults('mcfunction') as MCFunctionClassArguments['onConflict'],
        ...(Array.isArray(args[1]) ? args[3] : args[2] || args[1]),
      },
      Array.isArray(args[1]) ? args[1] : undefined,
    ) as MCFunctionClass<PARAMS, ENV>
  }

  appendNode = (node: Node) => this.core.getCurrentMCFunctionOrThrow().appendNode(node)

  get initMCFunction() {
    if (!this.__initMCFunction) {
      this.__initMCFunction = new MCFunctionClass(this.core, `${this.defaultNamespace}:__init__`, {
        addToSandstoneCore: true,
        creator: 'sandstone',
      }) as MCFunctionClass<undefined, undefined>
      this.loadTags.load.push(this.__initMCFunction)

      return this.__initMCFunction
    }
    return this.__initMCFunction
  }

  /**
   * Register commands that will be ticked at the rate you specify
   */
  registerTickedCommands(runEvery: TimeArgument, callback: () => void) {
    if (typeof runEvery === 'number') {
      runEvery = `${runEvery}t` // Normalize map key
    }
    if (this.tickedLoops[runEvery]) {
      this.tickedLoops[runEvery].push(callback)
    } else {
      this.tickedLoops[runEvery] = this.MCFunction(`__sandstone:ticked/times/${runEvery}`, () => {
        this.tickedLoops[runEvery].schedule.function(runEvery, 'replace')
        callback()
      })
      if (!startTickedLoops) {
        startTickedLoops = this.MCFunction('__sandstone:ticked/start', () =>
          this.tickedLoops[runEvery].schedule.function(runEvery, 'replace'),
        )
        this.loadTags.load.push(startTickedLoops)
      } else {
        startTickedLoops.push(() => this.tickedLoops[runEvery].schedule.function(runEvery, 'replace'))
      }
    }
  }

  sleep = (delay: TimeArgument): PromiseLike<SleepClass> => new SleepClass(this.core, delay).promise()

  Loop = () => new LoopArgument(this)

  __customResourceTypes: string[] = []

  registerCustomResource(type: string) {
    if (this.__customResourceTypes.includes(type)) {
      throw new Error(`A custom resource of the type '${type}' has already been created!`)
    }
    this.__customResourceTypes.push(type)
  }

  get makeCustomResource(): [SandstoneCore, typeof CustomResourceClass] {
    return [this.core, CustomResourceClass]
  }

  /** Creates a resource in the datapack, path must include file extension. */
  RawResource(path: string, contents: string | Buffer | Promise<Buffer>): CustomResourceClass

  /** Creates a resource in the given pack, path must include file extension. */
  RawResource(pack: PackType, path: string, contents: string | Buffer | Promise<Buffer>): CustomResourceClass

  RawResource(
    ...args:
      | [path: string, contents: string | Buffer | Promise<Buffer>]
      | [pack: PackType, path: string, contents: string | Buffer | Promise<Buffer>]
  ) {
    const [core, CustomResource] = this.makeCustomResource

    if (args[0] instanceof PackType) {
      const _path = args[1] as string
      const path = _path.includes('/') ? _path.split('/') : [_path]
      const extension = path[path.length - 1].split('.')[1]

      path[path.length - 1] = path[path.length - 1].replace(`.${extension}`, '')

      class RawResource extends CustomResource {
        constructor() {
          super(core, path.join('/'), {
            type: `${Math.random()}`,
            packType: args[0] as PackType,
            extension,
            addToSandstoneCore: true,
            creator: 'user',
          })
        }

        getValue = () => args[2] as string | Buffer | Promise<Buffer>
      }

      return new RawResource()
    }
    const _path = args[0] as string
    const path = _path.includes('/') ? _path.split('/') : [_path]
    const extension = path[path.length - 1].split('.')[1]

    path[path.length - 1] = path[path.length - 1].replace(`.${extension}`, '')

    class RawResource extends CustomResource {
      constructor() {
        super(core, path.join('/'), {
          type: `${Math.random()}`,
          extension,
          addToSandstoneCore: true,
          creator: 'user',
        })
      }

      getValue = () => args[1]
    }

    return new RawResource()
  }

  Advancement<AdvancementJSON extends SymbolResource['advancement']>(
    name: string,
    advancement: AdvancementJSON,
    options?: Omit<Partial<AdvancementClassArguments>, 'advancement'>,
  ) {
    return new AdvancementClass(this.core, name, {
      advancement,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('advancement') as AdvancementClassArguments['onConflict'],
      ...options,
    })
  }

  DamageType = (name: string, damageType: DamageTypeJSON, options?: Partial<DamageTypeClassArguments>) =>
    new DamageTypeClass(this.core, name, {
      damageType,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('damage_type') as DamageTypeClassArguments['onConflict'],
      ...options,
    })

  ItemModifier = (name: string, itemModifier: ItemModifierJSON, options?: Partial<ItemModifierClassArguments>) =>
    new ItemModifierClass(this.core, name, {
      itemModifier,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('item_modifier') as ItemModifierClassArguments['onConflict'],
      ...options,
    })

  LootTable = (name: string, lootTable: LootTableJSON, options?: Partial<LootTableClassArguments>) =>
    new LootTableClass(this.core, name, {
      lootTable,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('loot_table') as LootTableClassArguments['onConflict'],
      ...options,
    })

  Predicate = (name: string, predicate: PredicateJSON, options?: Partial<PredicateClassArguments>) =>
    new PredicateClass(this.core, name, {
      predicate,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('predicate') as PredicateClassArguments['onConflict'],
      ...options,
    })

  Recipe = (name: string, recipe: RecipeJSON, options?: Partial<RecipeClassArguments>) =>
    new RecipeClass(this.core, name, {
      recipe,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('recipe') as RecipeClassArguments['onConflict'],
      ...options,
    })

  /** @ts-ignore */
  Tag = <T extends LiteralUnion<REGISTRIES>>(
    type: T,
    name: string,
    values: TagValuesJSON<T>,
    options?: Partial<TagClassArguments<T>>,
  ) =>
    new TagClass<T>(this.core, type, name, {
      values,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('tag') as TagClassArguments<T>['onConflict'],
      ...options,
    })

  TrimMaterial = (name: string, trimMaterial: TrimMaterialJSON, options?: Partial<TrimMaterialClassArguments>) =>
    new TrimMaterialClass(this.core, name, {
      trimMaterial,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('trim_material') as TrimMaterialClassArguments['onConflict'],
      ...options,
    })

  TrimPattern = (name: string, trimPattern: TrimPatternJSON, options?: Partial<TrimPatternClassArguments>) =>
    new TrimPatternClass(this.core, name, {
      trimPattern,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('trim_pattern') as TrimPatternClassArguments['onConflict'],
      ...options,
    })

  Atlas = (name: string, atlas: AtlasDefinition, options?: Partial<AtlasClassArguments>) =>
    new AtlasClass(this.core, name, {
      atlas,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('atlas') as AtlasClassArguments['onConflict'],
      ...options,
    })

  BlockState<Type extends BlockStateType>(
    type: Type,
    name: string,
    blockState: BlockStateDefinition<Type>,
    options?: Partial<BlockStateArguments<Type>>,
  ) {
    return new BlockStateClass(this.core, name, type, {
      blockState,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('blockstate') as BlockStateArguments<Type>['onConflict'],
      ...options,
    })
  }

  Font = (name: string, providers: FontProvider[], options?: Partial<FontArguments>) =>
    new FontClass(this.core, name, {
      providers,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('font') as FontArguments['onConflict'],
      ...options,
    })

  Language = (name: string, language: LanguageArguments['language'], options?: Partial<LanguageArguments>) =>
    new LanguageClass(this.core, name, {
      language,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('language') as LanguageArguments['onConflict'],
      ...options,
    })

  Model = (
    type: 'block' | 'item',
    name: string,
    model: ModelClassArguments['model'],
    options?: Partial<ModelClassArguments>,
  ) =>
    new ModelClass(this.core, type, name, {
      model,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('model') as ModelClassArguments['onConflict'],
      ...options,
    })

  SoundEvent<Type extends SOUND_TYPES>(
    type: Type,
    name: string,
    sound: SoundEventArguments['sound'],
    options?: Partial<SoundEventArguments>,
  ) {
    return new SoundEventClass(this.core, type, name, {
      sound,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('sound_event') as SoundEventArguments['onConflict'],
      ...options,
    })
  }

  PlainText = (name: string, text: PlainTextArguments['text'], options?: Partial<PlainTextArguments>) =>
    new PlainTextClass(this.core, name, {
      text,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('atlas') as PlainTextArguments['onConflict'],
      ...options,
    })

  Texture<Type extends TEXTURE_TYPES>(
    type: Type,
    name: string,
    texture: TextureArguments<Type>['texture'],
    options?: Partial<TextureArguments<Type>>,
  ) {
    return new TextureClass(this.core, type, name, {
      texture,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('sound_event') as TextureArguments<Type>['onConflict'],
      ...options,
    })
  }

  save = async (cliOptions: {
    fileHandler: (relativePath: string, content: any) => Promise<void>
    dry: boolean
    verbose: boolean
  }) => {
    await this.core.save(cliOptions, {
      visitors: [
        // Initialization visitors
        new InitObjectivesVisitor(this),
        new InitConstantsVisitor(this),
        new GenerateLazyMCFunction(this),

        // Transformation visitors
        new LoopTransformationVisitor(this),
        new OrTransformationVisitor(this),
        new IfElseTransformationVisitor(this),
        new ContainerCommandsToMCFunctionVisitor(this),

        // Special visitors
        new AwaitBodyVisitor(this),

        // Optimization
        new InlineFunctionCallVisitor(this),
        new UnifyChainedExecutesVisitor(this),
        new SimplifyExecuteFunctionVisitor(this),
        new SimplifyReturnRunFunctionVisitor(this),
      ],
    })

    return this.packTypes
  }
}
