/* eslint-disable no-lone-blocks */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import { SelectorPickClass } from './abstractClasses.js'
import { DataPointClass } from './Data.js'
import {
  NBT, NBTIntArray, NBTShort, parseNBT,
} from './nbt/index.js'
import { ResolveNBTPart } from './ResolveNBT.js'
import { Score } from './Score.js'

import type {
  ENTITY_TYPES, JSONTextComponent, NBTObject, SingleEntityArgument,
} from 'sandstone/arguments'
import type { ExecuteCommand } from 'sandstone/commands'
import type { MCFunctionClass, SandstoneCore } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'
import type { ConditionTextComponentClass } from './abstractClasses.js'
import type { SelectorClass } from './Selector.js'
import type { UtilityChunkMember } from './UtilityChunk.js'

export type UUIDinNumber = [number, number, number, number]
export type UUIDinScore = [Score, Score, Score, Score]

export type UUIDSource = string | UUIDinNumber | UUIDinScore | SelectorPickClass<true, boolean> | DataPointClass

// Conversion methods ported from https://github.com/AjaxGb/mc-uuid-converter/blob/master/convert.js
const UUIDData = new DataView((new Uint8Array(16)).buffer)
const UUID_GROUP_SIZES = [8, 4, 4, 4, 12]

export type UUIDOptions = {
  /** Used for `on relation origin` links. Usually an Area Effect Cloud, must be a projectile. Will be automatically generated if needed. */
  holder?: SelectorClass<true, boolean> | UUIDClass<any, any>

  /** Used for holder's that are on a stack */
  stack?: UUIDStackClass<boolean>

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
    selector?: SelectorClass<true, boolean>
  }
}

export class UUIDClass<PrimarySource extends 'known' | 'scores' | 'selector' | 'data', RelationLasts extends 'singleTick' | 'timed' | 'permanent'> implements ConditionTextComponentClass, SelectorPickClass<true, false> {
  relationLasts: RelationLasts

  readonly primarySource: PrimarySource

  known!: PrimarySource extends 'known' ? UUIDinNumber : (UUIDinNumber | undefined)

  scores!: PrimarySource extends 'scores' ? UUIDinScore : (UUIDinScore | undefined)

  data!: PrimarySource extends 'data' ? DataPointClass : (DataPointClass | undefined)

  selector!: PrimarySource extends 'selector' ? SelectorClass<true, boolean> : (SelectorClass<true, boolean> | undefined)

  timer!: RelationLasts extends 'timed' ? (number | Score) : RelationLasts extends 'singleTick' ? 1 : undefined

  stack?: UUIDStackClass<boolean>

  /** Used for `on relation origin` links. Usually an Area Effect Cloud, always a projectile. Will be automatically generated if needed. */
  holder?: SingleEntityArgument

  /**
   *
   * @param _source A primary source for the UUID. Either a UUID string, a UUID integer array, 4 scores set to the UUID, a selector, or a Data Point set to the UUID.
   * @param holderState Whether a holder for the origin relation will be permanent or last a certain amount of ticks.
   */
  constructor(protected core: SandstoneCore, _source: UUIDSource, holderState: number | Score | 'permanent', options?: UUIDOptions) {
    let source = _source

    if (typeof holderState === 'number') {
      if (holderState === 1) {
        this.relationLasts = 'singleTick' as RelationLasts
      } else {
        this.relationLasts = 'timed' as RelationLasts
      }
    } else if (holderState === 'permanent') {
      this.relationLasts = holderState as RelationLasts
    } else {
      this.relationLasts = 'timed' as RelationLasts
    }

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
    } else if (source instanceof SelectorPickClass) {
      this.primarySource = 'selector' as PrimarySource
      this.selector = source._toSelector() as SelectorClass<true, boolean>
    } else {
      this.primarySource = 'data' as PrimarySource
      this.data = source
    }

    if (options) {
      if (options.holder) {
        this.holder = options.holder
      }

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

      const hex = UUIDData.getBigUint64(0, false).toString(16).padStart(16, '0') + UUIDData.getBigUint64(8, false).toString(16).padStart(16, '0')
      const groups = []
      let groupStart = 0
      for (const groupSize of UUID_GROUP_SIZES) {
        groups.push(hex.substring(groupStart, groupStart + groupSize))
        groupStart += groupSize
      }
      return groups.join('-')
    }
    throw new Error('Cannot convert a non-existent UUID array to a string!')
  }

  setKnown(uuid: UUIDinNumber) {
    this.known = uuid

    return this
  }

  setScores(scores?: UUIDinScore | [UUIDinScore]) {
    const { core } = this
    const {
      Data, getTempStorage, initMCFunction, Variable,
    } = core.pack

    const handleConversions = (_scores: UUIDinScore) => {
      switch (this.primarySource) {
        case 'known': {
          for (let i = 0; i < 4; i++) {
            _scores[i].set((this.known as UUIDinNumber)[i])
          }
        } break
        case 'data': {
          const storagePoint = this.data as DataPointClass<'storage'>

          if (storagePoint.type !== 'storage') {
            const dataPoint = getTempStorage('UUID')

            dataPoint.set(storagePoint)
          }
          for (let i = 0; i < 4; i++) {
            _scores[i].set(storagePoint.select([i]))
          }
        } break
        case 'selector': {
          const storagePoint = getTempStorage('UUID')

          storagePoint.set(Data('entity', this.selector as SelectorClass<true, any>, 'UUID'))

          for (let i = 0; i < 4; i++) {
            _scores[i].set(storagePoint.select([i]))
          }
        } break
        default: break
      }
    }

    // Generating & setting scores
    if (scores === undefined) {
      handleConversions([Variable(), Variable(), Variable(), Variable()])
      // Setting existing scores
    } else if (Array.isArray(scores[0])) {
      // UUIDClass is being constructed in an MCFunction
      if (core.mcfunctionStack.length !== 0) {
        /* @ts-ignore */
        core.getCurrentMCFunctionOrThrow().resource.push(() => handleConversions(scores[0]))
      // UUIDClass is being constructed outside of a MCFunction
      } else {
        /* @ts-ignore */
        initMCFunction.push(() => handleConversions(scores[0]))
      }
    } else {
      this.scores = scores as UUIDinScore
    }

    return this
  }

  setData(data?: DataPointClass | DataPointClass[]) {
    if (Array.isArray(data) || data === undefined) {
      const {
        Data, DataVariable, ResolveNBT,
      } = this.core.pack

      // User doesn't want to set up a storage location
      if (data === undefined) {
        this.data = DataVariable(undefined, '__sandstone')
      // User has set a storage location
      } else {
        this.data = data[0]
      }

      switch (this.primarySource) {
        case 'known': {
          this.data.set(new NBTIntArray(this.known as UUIDinNumber))
        } break
        case 'scores': {
          ResolveNBT((this.scores as UUIDinScore).map((score) => ResolveNBTPart(score)), this.data)
        } break
        case 'selector': {
          this.data.set(Data('entity', this.selector as SelectorClass<true, any>, 'UUID'))
        } break
        default: break
      }
    } else {
      this.data = data
    }
    return this
  }

  /** Selector for the entity with the UUID. If `known` is set this will go unused. */
  setSelector(selector: SelectorClass<true, any>) {
    this.selector = selector
    return this
  }

  /**
   * Used for `on relation origin` links. Usually an Area Effect Cloud, must be a projectile.
   * @param holder Optional. The holder. If unspecified it will be generated.
   * @param timerSet Optional. Whether the AEC's Duration has been set. (Unless you're using a Score this should've been done in the summon command)
   * @param ownerSet Optional. Whether the AEC's Owner has been set. If false it will be set.
   */
  setHolder(holder?: string | UUIDClass<any, any> | SelectorClass<true, any>, timerSet = true, ownerSet = false): UUIDClass<any, any> | SingleEntityArgument | [SingleEntityArgument, MCFunctionClass] {
    const { pack } = this.core

    let nbt: NBTObject = {}

    if (!timerSet) {
      if (this.relationLasts === 'singleTick') {
        nbt = { Duration: new NBTShort(1) }
      } else if (this.relationLasts === 'permanent' as RelationLasts) {
        nbt = parseNBT(NBT, '{Age:-2147483648,Duration:-1s,WaitTime:-2147483648}') as Omit<NBTObject, string>
      } else {
        nbt = { Duration: typeof this.timer === 'number' ? new NBTShort(this.timer) : ResolveNBTPart(this.timer as Score, 1, NBTShort) }
      }
    }

    const { Data, Selector, ResolveNBT } = pack

    if (!ownerSet) {
      switch (this.primarySource) {
        case 'known': nbt.Owner = new NBTIntArray(this.known as UUIDinNumber)
          break
        case 'data': nbt.Owner = ResolveNBTPart(this.data as DataPointClass, NBTIntArray)
          break
        case 'scores': nbt.Owner = ResolveNBTPart(this.scores as Score[])
          break
        case 'selector': nbt.Owner = ResolveNBTPart(Data('entity', this.selector as SelectorClass<true, any>, 'UUID'), NBTIntArray)
          break
        default: break
      }
    }

    const relationAEC = pack.Label('__sandstone.relation_aec')

    nbt.Tags = [`${relationAEC}`]

    const resolvedNBT = () => ResolveNBT(nbt)

    const { execute } = pack.commands

    if (!holder) {
      if (this.stack) {
        this.stack.createMember('minecraft:area_effect_cloud', nbt, this.timer instanceof Score || this.primarySource !== 'known')

        this.holder = relationAEC(Selector('@e', { limit: 1 })).selector
        return this.holder
      }

      const mcfunction = pack.MCFunction(`__sandstone:uuid/relation${Math.floor(Math.random() * 10000)}}`, () => Data('entity', '@s', ['{}']).set(resolvedNBT()))

      execute.summon('area_effect_cloud').run.functionCmd(mcfunction)

      this.holder = relationAEC(Selector('@e', { limit: 1 })).selector

      return [this.holder, mcfunction]
    }

    if (holder instanceof UUIDClass) {
      this.holder = holder
      if (Object.keys(nbt).length !== 0) {
        Data('entity', this.holder, ['{}']).set(resolvedNBT())
      }
      return this.holder
    }

    this.holder = holder

    if (Object.keys(nbt).length !== 0) {
      Data('entity', this.holder, ['{}']).set(resolvedNBT())
    }

    return this.holder
  }

  /** Partial execute command executing as (not at) the entity */
  get execute(): ExecuteCommand {
    const { execute } = this.core.pack.commands
    if (this.known) {
      return execute.as(this.arrayToString())
    }
    if (this.stack) {
      // TODO: Add member test that isn't a selector, requires `_.if` getting `.run` so I can make it a Condition
      this.stack.execute.if.entity(this._toSelector()).on('origin')
    }
    if (this.holder) {
      if (this.holder instanceof UUIDClass) {
        return this.holder.execute.on('origin')
      }
      return execute.as(this.holder).on('origin')
    }
    if (this.selector) {
      return execute.as(this.selector)
    }
    return execute.as(this.setHolder() as SingleEntityArgument).on('origin')
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
  /* @ts-ignore */
  _toMinecraftCondition = () => (new this.core.pack.conditions.UUID(this.core, this)) as ConditionClass

  /**
   * @internal
   */
  public _toSelector() {
    const selector = this.known ? this.arrayToString() : this.selector
    if (!selector) {
      throw new Error('Cannot create a selector without a UUID or existing selector')
    }
    return selector
  }
}

// TODO: Add proper indexing utilities

export class UUIDStackClass<InUtilityChunk extends boolean> {
  constructor(private core: SandstoneCore, public base: UUIDClass<any, any> | UtilityChunkMember) {
  }

  /** Partial execute command executing as all of the members of the stack */
  get execute() {
    return this.core.pack.commands.execute.as(this.base).on('passengers')
  }

  createMember(entityType: LiteralUnion<ENTITY_TYPES>, nbt: any, resolveNBT = false) {
    const { execute, data, ride } = this.core.pack.commands

    const selector = (this.base.known ? this.base.arrayToString() : this.base.selector) as SingleEntityArgument

    execute.as(selector).at('@s').summon(entityType).run(() => {
      if (nbt) {
        if (resolveNBT) {
          new DataPointClass(this.core.pack, 'entity', '@s', ['{}']).set(this.core.pack.ResolveNBT(nbt))
        } else {
          data.merge.entity('@s', nbt)
        }
      }
      ride('@s').mount(selector)
    })
  }
}
