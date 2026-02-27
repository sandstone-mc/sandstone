/* eslint-disable no-lone-blocks */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */

import type { JSONTextComponent, NBTSerializable } from 'sandstone/arguments'
import type { ExecuteCommand } from 'sandstone/commands'
import { createDeferredMacroExecute, ExecuteCommand as ExecuteCommandClass } from 'sandstone/commands/implementations/entity/execute'
import type { SandstoneCore } from 'sandstone/core'
import type { ConditionTextComponentClass } from './abstractClasses'
import { SelectorPickClass } from './abstractClasses'
import type { DataPointClass } from './Data'
import { NBTIntArray } from './nbt'
import { ResolveNBTPart } from './ResolveNBT'
import type { Score } from './Score'
import { SelectorClass } from './Selector'

/**
 * guuid library constants.
 * This library converts UUID int arrays to string format at runtime.
 * @see https://smithed.dev/packs/sgu
 */
const GU = {
  /** Storage namespace for guuid */
  STORAGE: 'gu:main',
  /** Input path - set UUID int array here before conversion */
  INPUT: 'in',
  /** Output path - contains string UUID after conversion */
  OUTPUT: 'out',
} as const

/**
 * Sandstone UUID cache storage for converted UUIDs.
 */
const UUID_CACHE = {
  /** Storage namespace for cached UUID strings */
  STORAGE: '__sandstone:uuid_cache',
} as const

export type UUIDinNumber = [number, number, number, number]
export type UUIDinScore = [Score, Score, Score, Score]

export type UUIDSource = string | UUIDinNumber | UUIDinScore | SelectorPickClass<true, boolean> | DataPointClass

// Conversion methods ported from https://github.com/AjaxGb/mc-uuid-converter/blob/master/convert.js
const UUIDData = new DataView(new Uint8Array(16).buffer)
const UUID_GROUP_SIZES = [8, 4, 4, 4, 12]

export type UUIDOptions = {
  /** Can set source types for the UUID that you did not set in `source`. */
  sources?: {
    /**
     * Four `Score`'s representing the UUID.
     *
     * Options:
     * - `true` will automatically generate and set scores. If UUID is constructed within the context of a mcfunction commands will be called in-place, otherwise the commands will be added to __init__.
     * - `[UUIDinScore]` will automatically set the scores with the above rules.
     * - `UUIDinScore` will assume the UUID is already set to these scores.
     */
    scores?: true | [UUIDinScore] | UUIDinScore

    /**
     * `DataPoint` representing the UUID.
     *
     * Options:
     * - `true` will automatically generate and set a data point. If UUID is constructed within the context of a mcfunction the command will be called in-place, otherwise the command will be added to __init__.
     * - `[DataPointClass]` will automatically set the data point with the above rules.
     * - `DataPointClass` will assume the UUID is already set to these scores.
     */
    data?: true | [DataPointClass] | DataPointClass

    /** Selector for the entity with the UUID. If `known` is set this will go unused. */
    selector?: SelectorClass<false, true, boolean>
  }
}

export class UUIDClass<PrimarySource extends 'known' | 'scores' | 'selector' | 'data'>
implements ConditionTextComponentClass, SelectorPickClass<true, boolean>, NBTSerializable {
  /**
   * Phantom brand property for TypeScript type discrimination.
   * Uses `boolean` for player since a UUID can reference any entity type.
   */
  declare readonly __selectorPickBrand: { single: true; player: boolean }

  readonly primarySource: PrimarySource

  known!: PrimarySource extends 'known' ? UUIDinNumber : UUIDinNumber | undefined

  scores!: PrimarySource extends 'scores' ? UUIDinScore : UUIDinScore | undefined

  data!: PrimarySource extends 'data' ? DataPointClass : DataPointClass | undefined

  selector!: PrimarySource extends 'selector'
    ? SelectorClass<false, true, boolean>
    : SelectorClass<false, true, boolean> | undefined

  /**
   *
   * @param _source A primary source for the UUID. Either a UUID string, a UUID integer array, 4 scores set to the UUID, a selector, or a Data Point set to the UUID.
   */
  constructor(
    protected core: SandstoneCore,
    _source: UUIDSource,
    options?: UUIDOptions,
  ) {
    let source = _source

    if (typeof source === 'string') {
      source = this.stringToArray(_source as string)
    }

    if (Array.isArray(source)) {
      // Thanks Typescript
      if (typeof source[0] === 'number') {
        this.primarySource = 'known' as PrimarySource
        this.known = source as UUIDinNumber
      } else {
        this.primarySource = 'scores' as PrimarySource
        this.scores = source as UUIDinScore
      }
    } else if (source instanceof SelectorClass || source instanceof SelectorPickClass) {
      this.primarySource = 'selector' as PrimarySource
      const selectorResult = (source as SelectorPickClass<true, boolean>)._toSelector()
      if (typeof selectorResult !== 'string') {
        this.selector = selectorResult
      }
    } else {
      this.primarySource = 'data' as PrimarySource
      this.data = source as DataPointClass
    }

    if (options) {
      if (options.sources) {
        if (this.primarySource !== 'known' && options.sources[this.primarySource as 'scores' | 'data' | 'selector']) {
          throw new Error('Attempted to set UUID source of the same type as the primary source in options!')
        }
        if (options.sources.scores) {
          this.setScores(options.sources.scores === true ? undefined : options.sources.scores)
        }
        if (options.sources.data) {
          this.setData(options.sources.data === true ? undefined : options.sources.data)
        }
        if (options.sources.selector) {
          this.selector = options.sources.selector
        }
      }
    }
  }

  /**
   * Converts a string UUID to an integer array
   * @param uuid A UUID in string form
   */
  stringToArray(uuid: string) {
    uuid = uuid.trim()
    if (uuid.includes('-')) {
      uuid = uuid
        .split('-')
        .map((g, i) => g.padStart(UUID_GROUP_SIZES[i], '0'))
        .join('')
    } else {
      uuid = uuid.padStart(32, '0')
    }
    UUIDData.setBigUint64(0, BigInt(`0x${uuid.substring(0, 16)}`), false)
    UUIDData.setBigUint64(8, BigInt(`0x${uuid.substring(16)}`), false)

    const array: number[] = []

    for (let i = 0; i < 4; i++) {
      array.push(UUIDData.getInt32(i * 4, false))
    }

    return array as UUIDinNumber
  }

  /**
   * Converts an integer array to a string UUID
   * @param array Optional. An integer array. Defaults to contained UUID (known; this does not work at pack runtime)
   */
  arrayToString(array?: UUIDinNumber) {
    if (this.known || array) {
      if (!array) {
        array = this.known as UUIDinNumber
      }
      for (let i = 0; i < 4; i++) {
        UUIDData.setInt32(i * 4, array[i], false)
      }

      const hex =
        UUIDData.getBigUint64(0, false).toString(16).padStart(16, '0') +
        UUIDData.getBigUint64(8, false).toString(16).padStart(16, '0')
      const groups = []
      let groupStart = 0
      for (const groupSize of UUID_GROUP_SIZES) {
        groups.push(hex.substring(groupStart, groupStart + groupSize))
        groupStart += groupSize
      }
      return groups.join('-') as `${string}-${string}-${string}-${string}`
    }
    throw new Error('Cannot convert a non-existent UUID array to a string!')
  }

  setKnown(uuid: UUIDinNumber) {
    this.known = uuid

    return this
  }

  setScores(scores?: UUIDinScore | [UUIDinScore]) {
    const { core } = this
    const { Data, getTempStorage, initMCFunction, Variable } = core.pack

    const handleConversions = (_scores: UUIDinScore) => {
      switch (this.primarySource) {
        case 'known':
          {
            for (let i = 0; i < 4; i++) {
              _scores[i].set((this.known as UUIDinNumber)[i])
            }
          }
          break
        case 'data':
          {
            let dataPoint = this.data as DataPointClass<'storage'>

            // If the data point isn't storage type, copy to temp storage first
            if (dataPoint.type !== 'storage') {
              const tempPoint = getTempStorage('UUID')
              tempPoint.set(dataPoint)
              dataPoint = tempPoint
            }
            for (let i = 0; i < 4; i++) {
              _scores[i].set(dataPoint.select([i]))
            }
          }
          break
        case 'selector':
          {
            const storagePoint = getTempStorage('UUID')

            storagePoint.set(Data('entity', this.selector!, 'UUID'))

            for (let i = 0; i < 4; i++) {
              _scores[i].set(storagePoint.select([i]))
            }
          }
          break
        default:
          break
      }
    }

    // Generating & setting scores
    if (scores === undefined) {
      handleConversions([Variable(), Variable(), Variable(), Variable()])
      // Setting existing scores
    } else if (Array.isArray(scores[0])) {
      // UUIDClass is being constructed in an MCFunction
      if (core.mcfunctionStack.length !== 0) {
        core.getCurrentMCFunctionOrThrow().resource.push(() => handleConversions(scores[0] as UUIDinScore))
        // UUIDClass is being constructed outside of a MCFunction
      } else {
        initMCFunction.push(() => handleConversions(scores[0] as UUIDinScore))
      }
    } else {
      this.scores = scores as UUIDinScore
    }

    return this
  }

  setData(data?: DataPointClass | DataPointClass[]) {
    if (Array.isArray(data) || data === undefined) {
      const { Data, DataVariable, ResolveNBT } = this.core.pack

      // User doesn't want to set up a storage location
      if (data === undefined) {
        this.data = DataVariable(undefined, '__sandstone')
        // User has set a storage location
      } else {
        this.data = data[0]
      }

      switch (this.primarySource) {
        case 'known':
          {
            this.data.set(new NBTIntArray(this.known!))
          }
          break
        case 'scores':
          {
            ResolveNBT(
              (this.scores as UUIDinScore).map((score) => ResolveNBTPart(score)),
              this.data,
            )
          }
          break
        case 'selector':
          {
            this.data.set(Data('entity', this.selector as SelectorClass<false, true, false>, 'UUID'))
          }
          break
        default:
          break
      }
    } else {
      this.data = data
    }
    return this
  }

  /** Selector for the entity with the UUID. If `known` is set this will go unused. */
  setSelector(selector: SelectorClass<false, true, boolean>) {
    this.selector = selector
    return this
  }

  /**
   * Converts the UUID to a string at runtime using guuid and caches it in storage.
   *
   * The converted string UUID is stored in `__sandstone:uuid_cache` indexed by a unique key:
   * - For scores source: indexed by the first score value (most significant part of UUID)
   * - For data source: indexed by the stringified UUID int array
   *
   * After calling this, use `.execute` to run commands as the entity.
   *
   * @example
   * ```ts
   * MCFunction('use_stored_uuid', () => {
   *   const storedUUID = UUID(Data('storage', 'mypack:data', 'saved_uuid'))
   *   storedUUID.convertForMacro()
   *   storedUUID.execute.run.say('Hello!')
   * })
   * ```
   */
  convertForMacro(): this {
    if (this.known || this.selector) {
      // No conversion needed for known UUIDs or selectors
      return this
    }

    // Add guuid as a Smithed dependency
    this.core.depend('sgu')

    const pack = this.core.pack
    const { Data, MCFunction, getTempStorage, commands } = pack
    const { data } = commands

    // Get or create the data source
    let sourceData = this.data
    if (!sourceData && this.scores) {
      // If only scores are available, first convert to data
      this.setData()
      sourceData = this.data
    }

    if (!sourceData) {
      throw new Error('No data source available for UUID conversion')
    }

    // Copy UUID to temp storage so we have a consistent data point for the macro
    const tempUUID = getTempStorage('uuid')
    tempUUID.set(sourceData)

    // Copy to guuid input storage
    const guInput = Data('storage', GU.STORAGE, GU.INPUT)
    guInput.set(tempUUID)

    // Convert the UUID from int array to string
    commands.functionCmd('gu:generate_from_storage')

    // Determine the cache key variable - use first score for scores, data point for data
    const cacheKeyVar = this.primarySource === 'scores' && this.scores
      ? this.scores[0]  // First score (most significant part)
      : tempUUID        // The UUID int array

    // Create a child function with the cache key as an env variable to cache the result
    const currentFunction = this.core.getCurrentMCFunctionOrThrow()
    const cacheFunction = MCFunction(
      `${currentFunction.resource.name}/__uuid_cache`,
      [cacheKeyVar],
      () => {
        // Inside this function, $(env_0) is the cache key (score value or UUID array)
        // Cache: __sandstone:uuid_cache."$(env_0)" = gu:main out
        // Use quoted path since the key might be an array like [1, 2, 3, 4]
        data.modify.storage(UUID_CACHE.STORAGE, '"$(env_0)"').set.from.storage(GU.STORAGE, GU.OUTPUT)
      },
      { creator: 'sandstone', onConflict: 'rename' },
    )

    // Call the caching function
    cacheFunction()

    return this
  }

  /**
   * Partial execute command executing as (not at) the entity.
   *
   * Works when:
   * - UUID was created from a known string/array (can convert to string at build time)
   * - UUID was created from a selector (uses the selector for execute)
   * - UUID was created from data/scores (requires `convertForMacro()` to be called first)
   *
   * For data/scores-based UUIDs, you must call `convertForMacro()` before using this
   * property. This converts the UUID to string format using guuid and caches it.
   *
   * @example
   * ```ts
   * // Known UUID - works directly
   * const known = UUID('f81d4fae-7dec-11d0-a765-00a0c91e6bf6')
   * known.execute.run.say('Hello!')
   *
   * // Selector UUID - works directly
   * const player = UUID(Selector('@p'))
   * player.execute.run.say('Hello!')
   *
   * // Data UUID - must call convertForMacro() first
   * MCFunction('use_data_uuid', () => {
   *   const dataUUID = UUID(Data('storage', 'mypack:data', 'saved_uuid'))
   *   dataUUID.convertForMacro()  // Convert and cache the UUID
   *   dataUUID.execute.run.say('Hello!')  // Uses the cached value
   * })
   * ```
   */
  get execute(): ExecuteCommand<true> {
    const { commands } = this.core.pack

    // Known UUIDs can be converted to string at build time
    if (this.known) {
      return commands.execute.as(this.arrayToString()) as unknown as ExecuteCommand<true>
    }

    // Use selector if available (either as primary source or fallback)
    if (this.selector) {
      return commands.execute.as(this.selector) as unknown as ExecuteCommand<true>
    }

    // For data/scores-only UUIDs, use the cached converted value from convertForMacro()
    if (this.data || this.scores) {
      const pack = this.core.pack
      const { MCFunction, getTempStorage, commands, Macro, Data } = pack
      const { data } = commands

      // Get or create the data source
      let sourceData = this.data
      if (!sourceData && this.scores) {
        // If only scores are available, first convert to data
        this.setData()
        sourceData = this.data
      }

      if (!sourceData) {
        throw new Error('No data source available for UUID execute')
      }

      // Copy UUID to temp storage so we have a consistent data point
      const tempUUID = getTempStorage('uuid')
      tempUUID.set(sourceData)

      // Determine the cache key variable - use first score for scores, data point for data
      const cacheKeyVar = this.primarySource === 'scores' && this.scores
        ? this.scores[0]  // First score (most significant part)
        : tempUUID        // The UUID int array

      // STEP 1: Create and call a lookup function that copies from cache to temp.uuid_string
      // This function receives the cache key as env_0 and copies uuid_cache."$(env_0)" to temp
      const currentFunction = this.core.getCurrentMCFunctionOrThrow()

      const uuidLookup = Data('storage', '__sandstone:temp', 'uuid_lookup')

      MCFunction(
        `${currentFunction.resource.name}/__uuid_lookup`,
        [cacheKeyVar],
        () => {
          // $data modify storage __sandstone:temp uuid_string set from storage __sandstone:uuid_cache "$(env_0)"
          Macro.data.modify(uuidLookup.select('uuid_string')).set.from.storage(UUID_CACHE.STORAGE, Macro`"${cacheKeyVar}"`)
        },
        { creator: 'sandstone', onConflict: 'rename' },
      )()

      // STEP 2: Create a deferred execute that uses __sandstone:temp storage with $(uuid_string)
      const deferredExecute = new ExecuteCommandClass(pack, undefined, false)

      // Return a deferred macro execute that uses the temp storage
      // The looked-up UUID string is now at __sandstone:temp.uuid_string
      return createDeferredMacroExecute(pack, deferredExecute, {
        childFunctionName: '__uuid_execute',
        prependArgs: () => [['as', '$(uuid_string)']],
        macroStorage: uuidLookup,
      })
    }

    throw new Error(
      'Cannot use execute on a UUID with no available source. ' +
      'The UUID must have at least one of: known value, selector, data, or scores.',
    )
  }

  toString() {
    if (this.known) {
      return JSON.stringify(this.known)
    }
    return this.selector?.toString() || 'Stored in scores or data storage'
  }

  /**
   * @internal
   */
  _toChatComponent(): JSONTextComponent {
    if (this.known) {
      return { selector: this.arrayToString() as string }
    }
    if (this.selector) {
      return { selector: this.selector.toString() }
    }
    if (this.scores) {
      return [...this.scores]
    }
    return this.data as DataPointClass
  }

  /**
   * @internal
   */
  _toMinecraftCondition = () => new this.core.pack.conditions.UUID(this.core, this)

  /**
   * @internal
   */
  public _toSelector() {
    const selector = this.known ? this.arrayToString() : this.selector!
    if (!selector) {
      throw new Error('Cannot create a selector without a UUID or existing selector')
    }
    return selector
  }

  /**
   * @internal
   */
  toNBT() {
    const selector = this._toSelector()

    if (typeof selector === 'string') {
      return selector
    }
    return selector.toNBT()
  }
}
