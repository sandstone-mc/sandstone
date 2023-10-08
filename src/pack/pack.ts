/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import { SandstoneCommands } from 'sandstone/commands'
import {
  AdvancementClass, AtlasClass, BlockStateClass, DamageTypeClass, FontClass, ItemModifierClass, LanguageClass, LootTableClass, MCFunctionClass, ModelClass, PlainTextClass, PredicateClass, RecipeClass, SandstoneCore, SoundEventClass, TagClass, TextureClass, TrimMaterialClass, TrimPatternClass,
} from 'sandstone/core'
import { CustomResourceClass } from 'sandstone/core/resources/custom'
import { Flow, SandstoneConditions } from 'sandstone/flow'
import { randomUUID } from 'sandstone/utils'
import {
  absolute,
  coordinatesParser,
  DataClass, DataPointClass, LabelClass, NBTIntArray, ObjectiveClass, SelectorClass, TargetlessDataClass, TargetlessDataPointClass, VectorClass,
} from 'sandstone/variables'
import { ResolveNBTClass } from 'sandstone/variables/ResolveNBT'
import { Score } from 'sandstone/variables/Score'
import { SleepClass } from 'sandstone/variables/Sleep'
import { DimensionChunkClass, RootChunkClass, UtilityChunkClass } from 'sandstone/variables/UtilityChunk'
import { UUIDClass } from 'sandstone/variables/UUID'

import { PackType } from './packType.js'
import { AwaitBodyVisitor } from './visitors/addAwaitBodyToMCFunctions.js'
import {
  ContainerCommandsToMCFunctionVisitor, GenerateLazyMCFunction, IfElseTransformationVisitor, InitConstantsVisitor, InitObjectivesVisitor,
  InlineFunctionCallVisitor,
  LogVisitor,
  SimplifyExecuteFunctionVisitor, UnifyChainedExecutesVisitor,
} from './visitors/index.js'

import type {
  // eslint-disable-next-line max-len
  AdvancementJSON, AtlasDefinition, BlockStateDefinition, BlockStateType, Coordinates, DamageTypeJSON, DIMENSIONS, FontProvider, ItemModifierJSON, JSONTextComponent, LootTableJSON, NBTObject, OBJECTIVE_CRITERION, PredicateJSON, RecipeJSON, REGISTRIES, SingleEntityArgument, SOUND_TYPES, TagValuesJSON, TEXTURE_TYPES, TimeArgument, TrimMaterialJSON, TrimPatternJSON,
} from 'sandstone/arguments'
import type { ExecuteCommand, StoreType } from 'sandstone/commands'
import type {
  _RawMCFunctionClass,
  // eslint-disable-next-line max-len
  AdvancementClassArguments, AtlasClassArguments, BlockStateArguments, DamageTypeClassArguments, FontArguments, ItemModifierClassArguments, LanguageArguments, LootTableClassArguments, MCFunctionClassArguments, ModelClassArguments, Node, PlainTextArguments, PredicateClassArguments, RecipeClassArguments, SoundEventArguments, TagClassArguments, TextureArguments, TrimMaterialClassArguments, TrimPatternClassArguments,
} from 'sandstone/core'
import type { LiteralUnion, MakeInstanceCallable } from 'sandstone/utils'
import type {
  DATA_PATH, DATA_TARGET, DATA_TYPES, SelectorCreator, SelectorProperties,
} from 'sandstone/variables'
import type {
  UUIDinNumber, UUIDinScore, UUIDOptions, UUIDSource,
} from 'sandstone/variables/UUID'
import type { handlerReadFile, handlerWriteFile } from './packType.js'

export type ResourcePath = string[]

const conflictDefaults = (resourceType: string) => (process.env[`${resourceType.toUpperCase()}S_CONFLICT_STRATEGY`] || process.env.DEFAULT_CONFLICT_STRATEGY) as string

let tempStorage: DataClass<'storage'>

let startTickedLoops: MCFunctionClass

export class DataPack extends PackType {
  // TODO: typing. low priority
  readonly packMcmeta: any

  constructor(archiveOutput: boolean, options: { packFormat: number, description: JSONTextComponent, features?: string[], filter?: { namespace?: string, path?: string }[] }) {
    super('datapack', 'saves/$worldName$/datapacks/$packName$', 'world/datapacks/$packName$', 'datapacks/$packName$', 'server', archiveOutput, 'data', true)

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

  handleOutput = async (type: 'output' | 'client' | 'server', readFile: handlerReadFile, writeFile: handlerWriteFile) => {
    if (type === 'output') {
      await writeFile('pack.mcmeta', JSON.stringify(this.packMcmeta))
    }
  }
}

export class ResourcePack extends PackType {
  // TODO: typing. low priority
  readonly packMcmeta: any

  constructor(options: { packFormat: number, description: JSONTextComponent, features?: string[], filter?: { namespace?: string, path?: string }[] }) {
    super('resourcepack', 'saves/$worldName$/resources', 'resource_pack', 'resourcepacks/$packName$', 'client', true, 'assets', true)

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

  handleOutput = async (type: 'output' | 'client' | 'server', readFile: handlerReadFile, writeFile: handlerWriteFile) => {
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

export type DimensionID = ['minecraft', DIMENSIONS] | [string, string]

export type ChunkTuple = [number, number]

export type UtilityChunksIndex<Chunk extends ChunkTuple, ID extends DimensionID> = `${Chunk[0]},${Chunk[1]};${ID[0]}:${ID[1]}`

type ChunkMap<C extends ChunkTuple, ID extends DimensionID> = Map<UtilityChunksIndex<C, ID>, UtilityChunkClass<C, ID>>

export class SandstonePack {
  readonly core: SandstoneCore

  packTypes: Map<string, PackType>

  packOptions = JSON.parse(process.env.PACK_OPTIONS as string)

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
      pack = this.packTypes.set('resourcepack', new ResourcePack(this.packOptions.resourcepack)).get('resourcepack') as ResourcePack
    }

    return pack
  }

  // Smithed Pack IDs
  dependencies: Map<string, boolean>

  readonly flow: Flow

  readonly commands: SandstoneCommands

  readonly conditions = SandstoneConditions

  objectives: Set<ObjectiveClass>

  anonymousScoreId = 0

  anonymousDataId = 0

  constants: Set<number>

  tickedLoops: Record<string, MakeInstanceCallable<_RawMCFunctionClass>>

  loadTags: { preLoad: TagClass<'functions'>, load: TagClass<'functions'>, postLoad: TagClass<'functions'> }

  utilityChunks: ChunkMap<ChunkTuple, DimensionID>

  constructor(public defaultNamespace: string, public packUid: string) {
    this.core = new SandstoneCore(this)

    this.packTypes = new Map()

    this.commands = new SandstoneCommands(this)

    this.flow = new Flow(this.core)
    this.objectives = new Set()

    this.constants = new Set()
    this.tickedLoops = {}
    this.utilityChunks = new Map()

    if (process.env.NAMESPACE) {
      this.defaultNamespace = process.env.NAMESPACE
    }

    this.loadTags = {
      preLoad: this.Tag('functions', 'load:pre_load', []),
      load: this.Tag('functions', 'load:load', []),
      postLoad: this.Tag('functions', 'load:post_load', []),
    }
    this.setupLantern()
    this.dependencies = new Map()
  }

  setupLantern = () => {
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

    this.initMCFunction.push(() => loadStatus(this.defaultNamespace).set(process.env.LOAD_VERSION || 1))
  }

  resourceToPath = (name: string, resourceFolders?: string[]): ResourcePath => {
    let namespace = this.defaultNamespace
    let fullName = name

    if (name.includes(':')) {
      ([namespace, fullName] = name.split(':'))
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
     */
    create: (name: string, criteria: LiteralUnion<OBJECTIVE_CRITERION> = 'dummy', display?: JSONTextComponent, alreadyExists?: true): ObjectiveClass => {
      let namespace: boolean = false

      if (name.includes('.') || name.includes('__')) {
        namespace = true
      }

      const objective = new ObjectiveClass(this, namespace ? name : `${this.defaultNamespace}.${name}`, criteria as string, display, { creator: 'user' })

      if (!alreadyExists) {
        this.registerNewObjective(objective)
      }
      return objective
    },

    /** Get an existing objective. */
    get: (name: string): ObjectiveClass => new ObjectiveClass(this, name, 'dummy', undefined, { creator: 'user' }),
  }

  __rootObjective?: ObjectiveClass

  get rootObjective() {
    if (this.__rootObjective) {
      return this.__rootObjective
    }
    this.__rootObjective = this.Objective.create('__sandstone', 'dummy', [{ text: 'Sandstone', color: 'gold' }, ' internals'])
    return this.__rootObjective
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
      this.initMCFunction.push(() => anonymousScore.set(initialValue))

      return anonymousScore
    }

  get flowVariable() {
    return this.rootObjective('if_result')
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

  __rootStorage?: DataPointClass

  rootStorage() {
    if (!this.__rootStorage) {
      this.__rootStorage = new DataPointClass(this, 'storage', '__sandstone:variable', [])

      this.initMCFunction.push.data.merge.storage('__sandstone:variable', {})

      return this.__rootStorage
    }

    return this.__rootStorage
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
        return anonymousData.set(initialValue)
      }

      // Else, we should run it in the init MCFunction
      this.initMCFunction.push(() => anonymousData.set(initialValue))

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

  /** Creates a randomly generated static UUID. (changes on pack compile, should only use this if it is killed) */
  UUID(): UUIDClass<'known', 'permanent'>

  /** Initializes with a static UUID. (you can use `import { randomUUID } from 'sandstone/utils'` to generate one) */
  UUID(source: string | UUIDinNumber): UUIDClass<'known', 'permanent'>

  /** Initializes with `Score`'s. */
  UUID(source: UUIDinScore): UUIDClass<'scores', 'permanent'>

  /** Initializes with a Data Point (to a UUID int array). */
  UUID(source: DataPointClass): UUIDClass<'data', 'permanent'>

  /** Initializes with a Selector. */
  UUID(source: SelectorClass<true, boolean>): UUIDClass<'selector', 'permanent'>

  /** Initializes with a static UUID. (you can use `import { randomUUID } from 'sandstone/utils'` to generate one) */
  UUID(source: string | UUIDinNumber, holderState: 'permanent', options?: UUIDOptions): UUIDClass<'known', 'permanent'>

  /** Initializes with `Score`'s. */
  UUID(source: UUIDinScore, holderState: 'permanent', options?: UUIDOptions): UUIDClass<'scores', 'permanent'>

  /** Initializes with a Data Point (to a UUID int array). */
  UUID(source: DataPointClass, holderState: 'permanent', options?: UUIDOptions): UUIDClass<'data', 'permanent'>

  /** Initializes with a Selector. */
  UUID(source: SelectorClass<true, boolean>, holderState: 'permanent', options?: UUIDOptions): UUIDClass<'selector', 'permanent'>

  /** Initializes with a static UUID. (you can use `import { randomUUID } from 'sandstone/utils'` to generate one) */
  UUID(source: string | UUIDinNumber, holderState: 1, options?: UUIDOptions): UUIDClass<'known', 'singleTick'>

  /** Initializes with 4 `Score`'s. */
  UUID(source: UUIDinScore, holderState: 1, options?: UUIDOptions): UUIDClass<'scores', 'singleTick'>

  /** Initializes with a Data Point (to a UUID int array). */
  UUID(source: DataPointClass, holderState: 1, options?: UUIDOptions): UUIDClass<'data', 'singleTick'>

  /** Initializes with a Selector. */
  UUID(source: SelectorClass<true, boolean>, holderState: 1, options?: UUIDOptions): UUIDClass<'selector', 'singleTick'>

  /** Initializes with a static UUID. (you can use `import { randomUUID } from 'sandstone/utils'` to generate one) */
  UUID(source: string | UUIDinNumber, holderState: Omit<number, 1> | Score, options?: UUIDOptions): UUIDClass<'known', 'timed'>

  /** Initializes with 4 `Score`'s. */
  UUID(source: UUIDinScore, holderState: Omit<number, 1> | Score, options?: UUIDOptions): UUIDClass<'scores', 'timed'>

  /** Initializes with a Data Point (to a UUID int array). */
  UUID(source: DataPointClass, holderState: Omit<number, 1> | Score, options?: UUIDOptions): UUIDClass<'data', 'timed'>

  /** Initializes with a Selector. */
  UUID(source: SelectorClass<true, boolean>, holderState: Omit<number, 1> | Score, options?: UUIDOptions): UUIDClass<'selector', 'timed'>

  UUID(source: UUIDSource = randomUUID(), holderState: 1 | Omit<number, 1> | Score | 'permanent' = 'permanent', options?: UUIDOptions) { return new UUIDClass(this.core, source, holderState as number, options) }

  /** **Waiting on Smithed Dimensions to be functional.** */
  rootChunk(): RootChunkClass {
    const root = this.utilityChunks.get('0,0;smithed:void')

    if (root) {
      return root as RootChunkClass
    }

    return this.utilityChunks.set('0,0;smithed:void', new RootChunkClass(this)).get('0,0;smithed:void') as RootChunkClass
  }

  __dimensionEntryPoints: {
    markerMissing?: TagClass<'functions'>
    commandBlock?: TagClass<'functions'>
    setup?: TagClass<'functions'>
    init?: TagClass<'functions'>
    ready?: TagClass<'functions'>
  } = {}

  /** **Waiting on Smithed Dimensions to be functional.** */
  dimensionChunk<ID extends DimensionID, IDString extends `${ID[0]}:${ID[1]}` | ID[1], Chunk extends UtilityChunkClass<[-1875000, 200], ID>>(id: IDString, create: false | { name?: JSONTextComponent, uuid: string | UUIDinNumber }) {
    const _id = id.includes(':') ? id.split(':') as ID : [this.defaultNamespace, id] as [string, ID[1]]
    const index: UtilityChunksIndex<[-1875000, 200], ID> = `-1875000,200;${_id[0]}:${_id[1]}`
    if (this.utilityChunks.get(index)) {
      return this.utilityChunks.get(index) as Chunk
    }
    this.utilityChunks.set(index, new DimensionChunkClass(this, _id, create))
    return this.utilityChunks.get(index) as Chunk
  }

  get dimensionID() {
    return this.Objective.create('smithed.dimensions.id', 'dummy', undefined, true)
  }

  get dimensionTarget() {
    return this.dimensionID('#target')
  }

  /** **Waiting on Smithed Dimensions & MC-260322 to be functional.** */
  dimensionMarker(): ExecuteCommand {
    // TODO: Set dimension target to current dimension some how

    return this.rootChunk().armorStand.execute.on('passengers').if.score(this.dimensionID('@s'), '=', this.dimensionTarget).on('origin')
  }

  UtilityChunk<ID extends DimensionID, IDString extends `${ID[0]}:${ID[1]}`, ChunkLoc extends ChunkTuple, Chunk extends UtilityChunkClass<ChunkLoc, ID>>(id: IDString, chunk: ChunkLoc, marker?: UUIDClass<'known', 'permanent'>) {
    const _id = id.split(':') as ID
    const index: UtilityChunksIndex<ChunkLoc, ID> = `${chunk[0]},${chunk[1]};${_id[0]}:${_id[1]}`

    if (this.utilityChunks.get(index)) {
      return this.utilityChunks.get(index) as Chunk
    }
    let _marker = marker
    if (!marker) {
      const UUID = this.UUID()
      const summon = () => this.commands.summon('marker', absolute(chunk[0] * 16, 0, chunk[1] * 16), { UUID: new NBTIntArray(UUID.known), Tags: [`sandstone.uc.${chunk.join('.')}.${_id.join('.')}`] })

      // We currently are in a MCFunction => that's where the initialization should take place
      if (this.core.currentMCFunction) {
        summon()
        // Else, we should run it in the init MCFunction
      } else {
        this.initMCFunction.push(() => summon())
      }
      _marker = UUID
    }
    this.utilityChunks.set(index, new UtilityChunkClass(this, _id, chunk, _marker as UUIDClass<'known', 'permanent'>))

    const forceload = () => {
      this.commands.forceload.remove(absolute(chunk[0], chunk[1]))
      this.commands.forceload.add(absolute(chunk[0], chunk[1]))
    }

    // We currently are in a MCFunction => that's where the initialization should take place
    if (this.core.currentMCFunction) {
      forceload()
      // Else, we should run it in the init MCFunction
    } else {
      this.initMCFunction.push(() => forceload())
    }

    return this.utilityChunks.get(index) as Chunk
  }

  MCFunction = (name: string, callback: (this: MCFunctionClass) => void, options?: Partial<MCFunctionClassArguments>) => new MCFunctionClass(this.core, name, {
    callback,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('mcfunction') as MCFunctionClassArguments['onConflict'],
    ...options,
  })

  appendNode = (node: Node) => this.core.getCurrentMCFunctionOrThrow().appendNode(node)

  __initMCFunction?: MCFunctionClass

  get initMCFunction() {
    if (!this.__initMCFunction) {
      this.__initMCFunction = new MCFunctionClass(this.core, `${this.defaultNamespace}:__init__`, {
        addToSandstoneCore: true,
        creator: 'sandstone',
      })
      this.loadTags.load.push(this.__initMCFunction)

      return this.__initMCFunction
    }
    return this.__initMCFunction
  }

  /**
   * Register commands that will be ticked at the rate you specify
   */
  registerTickedCommands(runEvery: TimeArgument, callback: () => void) {
    if (this.tickedLoops[runEvery]) {
      this.tickedLoops[runEvery].push(callback)
    } else {
      this.tickedLoops[runEvery] = this.MCFunction(`__sandstone:ticked/times/${runEvery}`, () => {
        this.tickedLoops[runEvery].schedule.function(runEvery, 'replace')
        callback()
      })
      if (!startTickedLoops) {
        startTickedLoops = this.MCFunction('__sandstone:ticked/start', () => this.tickedLoops[runEvery].schedule.function(runEvery, 'replace'))
        this.loadTags.load.push(startTickedLoops)
      } else {
        startTickedLoops.push(() => this.tickedLoops[runEvery].schedule.function(runEvery, 'replace'))
      }
    }
  }

  sleep = (delay: TimeArgument): PromiseLike<SleepClass> => (new SleepClass(this.core, delay)).promise()

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

  RawResource(...args: [path: string, contents: string | Buffer | Promise<Buffer>] | [pack: PackType, path: string, contents: string | Buffer | Promise<Buffer>]) {
    if (args[0] instanceof PackType) {
      const _path = args[1] as string
      const path = _path.includes('/') ? _path.split('/') : [_path]
      const extension = path[path.length - 1].split('.')[1]

      path[path.length - 1] = path[path.length - 1].replace(`.${extension}`, '')

      const { core } = this

      class RawResource extends this.makeCustomResource[1] {
        constructor() {
          super(core, path.join('/'), {
            type: `${Math.random()}`, packType: args[0] as PackType, extension, addToSandstoneCore: true, creator: 'user',
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

    const { core, dataPack } = this

    class RawResource extends this.makeCustomResource[1] {
      constructor() {
        super(core, path.join('/'), {
          type: `${Math.random()}`, packType: dataPack(), extension, addToSandstoneCore: true, creator: 'user',
        })
      }

      getValue = () => args[1]
    }

    return new RawResource()
  }

  Advancement = <T extends string>(name: string, advancement: AdvancementJSON<T>, options?: Partial<AdvancementClassArguments>) => new AdvancementClass(this.core, name, {
    advancement,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('advancement') as AdvancementClassArguments['onConflict'],
    ...options,
  })

  DamageType = (name: string, damageType: DamageTypeJSON, options?: Partial<DamageTypeClassArguments>) => new DamageTypeClass(this.core, name, {
    damageType,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('damage_type') as DamageTypeClassArguments['onConflict'],
    ...options,
  })

  ItemModifier = (name: string, itemModifier: ItemModifierJSON, options?: Partial<ItemModifierClassArguments>) => new ItemModifierClass(this.core, name, {
    itemModifier,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('item_modifier') as ItemModifierClassArguments['onConflict'],
    ...options,
  })

  LootTable = (name: string, lootTable: LootTableJSON, options?: Partial<LootTableClassArguments>) => new LootTableClass(this.core, name, {
    lootTable,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('loot_table') as LootTableClassArguments['onConflict'],
    ...options,
  })

  Predicate = (name: string, predicate: PredicateJSON, options?: Partial<PredicateClassArguments>) => new PredicateClass(this.core, name, {
    predicate,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('predicate') as PredicateClassArguments['onConflict'],
    ...options,
  })

  Recipe = (name: string, recipe: RecipeJSON, options?: Partial<RecipeClassArguments>) => new RecipeClass(this.core, name, {
    recipe,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('recipe') as RecipeClassArguments['onConflict'],
    ...options,
  })

  /** @ts-ignore */
  Tag = <T extends LiteralUnion<REGISTRIES>>(type: T, name: string, values: TagValuesJSON<T>, options?: Partial<TagClassArguments>) => new TagClass<T>(this.core, type, name, {
    values,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('tag') as TagClassArguments<T>['onConflict'],
    ...options,
  })

  TrimMaterial = (name: string, trimMaterial: TrimMaterialJSON, options?: Partial<TrimMaterialClassArguments>) => new TrimMaterialClass(this.core, name, {
    trimMaterial,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('trim_material') as TrimMaterialClassArguments['onConflict'],
    ...options,
  })

  TrimPattern = (name: string, trimPattern: TrimPatternJSON, options?: Partial<TrimPatternClassArguments>) => new TrimPatternClass(this.core, name, {
    trimPattern,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('trim_pattern') as TrimPatternClassArguments['onConflict'],
    ...options,
  })

  Atlas = (name: string, atlas: AtlasDefinition, options?: Partial<AtlasClassArguments>) => new AtlasClass(this.core, name, {
    atlas,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('atlas') as AtlasClassArguments['onConflict'],
    ...options,
  })

  BlockState<Type extends BlockStateType>(type: Type, name: string, blockState: BlockStateDefinition<Type>, options?: Partial<BlockStateArguments<Type>>) {
    return new BlockStateClass(this.core, name, type, {
      blockState,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('blockstate') as BlockStateArguments<Type>['onConflict'],
      ...options,
    })
  }

  Font = (name: string, providers: FontProvider[], options?: Partial<FontArguments>) => new FontClass(this.core, name, {
    providers,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('font') as FontArguments['onConflict'],
    ...options,
  })

  Language = (name: string, language: LanguageArguments['language'], options?: Partial<LanguageArguments>) => new LanguageClass(this.core, name, {
    language,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('language') as LanguageArguments['onConflict'],
    ...options,
  })

  Model = (type: 'block' | 'item', name: string, model: ModelClassArguments['model'], options?: Partial<ModelClassArguments>) => new ModelClass(this.core, type, name, {
    model,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('model') as ModelClassArguments['onConflict'],
    ...options,
  })

  SoundEvent<Type extends SOUND_TYPES>(type: Type, name: string, sound: SoundEventArguments['sound'], options?: Partial<SoundEventArguments>) {
    return new SoundEventClass(this.core, type, name, {
      sound,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('sound_event') as SoundEventArguments['onConflict'],
      ...options,
    })
  }

  PlainText = (name: string, text: PlainTextArguments['text'], options?: Partial<PlainTextArguments>) => new PlainTextClass(this.core, name, {
    text,
    creator: 'user',
    addToSandstoneCore: true,
    onConflict: conflictDefaults('atlas') as PlainTextArguments['onConflict'],
    ...options,
  })

  Texture<Type extends TEXTURE_TYPES>(type: Type, name: string, texture: TextureArguments<Type>['texture'], options?: Partial<TextureArguments<Type>>) {
    return new TextureClass(this.core, type, name, {
      texture,
      creator: 'user',
      addToSandstoneCore: true,
      onConflict: conflictDefaults('sound_event') as TextureArguments<Type>['onConflict'],
      ...options,
    })
  }

  save = async (cliOptions: { fileHandler: (relativePath: string, content: any) => Promise<void>, dry: boolean, verbose: boolean }) => {
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

        // Special visitors
        new AwaitBodyVisitor(this),
      ],
    })

    return this.packTypes
  }
}
