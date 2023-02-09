/* eslint-disable no-lone-blocks */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import { DataPointClass } from './Data'
import { NBT, NBTIntArray, NBTShort } from './index'
import { Score } from './Score'
import { SelectorClass } from './Selector'

import type { JSONTextComponent } from 'sandstone/arguments/index'
import type { SandstoneCore } from 'sandstone/core/index'
import type { ConditionTextComponentClass } from './index'

export type UUIDinNumber = [number, number, number, number]
export type UUIDinScore = [Score, Score, Score, Score]

// Conversion methods ported from https://github.com/AjaxGb/mc-uuid-converter/blob/master/convert.js
const UUIDData = new DataView((new Uint8Array(16)).buffer)
const UUID_GROUP_SIZES = [8, 4, 4, 4, 12]

export type UUIDOptions = {
  /** Used for `on relation origin` links. Usually an Area Effect Cloud, must be a projectile. Will be automatically generated if needed. */
  holder?: SelectorClass<true, boolean> | UUIDClass

  stack?: UUIDStackClass

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

export class UUIDClass<RelationLasts = 'singleTick' | 'timed' | 'permament'> implements ConditionTextComponentClass {
  relationLasts: RelationLasts

  readonly primarySource: 'known' | 'scores' | 'selector' | 'data'

  known?: UUIDinNumber

  scores?: UUIDinScore

  data?: DataPointClass

  selector?: SelectorClass<true, boolean>

  timer?: number | Score

  stack?: UUIDStack

  /** Used for `on relation origin` links. Usually an Area Effect Cloud, always a projectile. Will be automatically generated if needed. */
  holder?: SelectorClass<true, boolean> | UUIDClass

  /**
   *
   * @param _source A primary source for the UUID. Either a UUID string, a UUID integer array, 4 scores set to the UUID, a selector, or a Data Point set to the UUID.
   * @param holderState Whether a holder for the origin relation will be permanent or last a certain amount of ticks.
   */
  constructor(private core: SandstoneCore, _source: string | UUIDinNumber | UUIDinScore | SelectorClass<true, boolean> | DataPointClass, holderState: number | Score | 'permanent', options?: UUIDOptions) {
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
        this.primarySource = 'known'
        this.known = source as UUIDinNumber
      } else {
        this.primarySource = 'scores'
        this.scores = source as UUIDinScore
      }
    } else if (source instanceof SelectorClass) {
      this.primarySource = 'selector'
      this.selector = source
    } else {
      this.primarySource = 'data'
      this.data = source
    }

    if (options) {
      if (options.holder) {
        this.holder = options.holder
      }

      if (options.sources) {
        if (this.primarySource !== 'known' && options.sources[this.primarySource]) {
          throw new Error('Attempted to set UUID source of the same type as the primary source in options!')
        }

        if (options.sources.scores) {
          const handleConversions = (scores: UUIDinScore) => {
            switch (this.primarySource) {
              case 'known': {
                for (let i = 0; i < 4; i++) {
                  scores[i].set((this.known as UUIDinNumber)[i])
                }
              } break
              case 'data': {
                let storagePoint = this.data as DataPointClass<'storage'>

                if (storagePoint.type !== 'storage') {
                  const dataPoint = new DataPointClass(core.pack, 'storage', '__sandstone:temp', ['UUID'])

                  dataPoint.set(storagePoint)

                  storagePoint = dataPoint
                }
                for (let i = 0; i < 4; i++) {
                  scores[i].set(storagePoint.select([i]))
                }
              } break
              case 'selector': {
                const storagePoint = new DataPointClass(core.pack, 'storage', '__sandstone:temp', ['UUID'])

                storagePoint.set(new DataPointClass(core.pack, 'entity', this.selector as SelectorClass<true, any>, ['UUID']))

                for (let i = 0; i < 4; i++) {
                  scores[i].set(storagePoint.select([i]))
                }
              } break
              default: break
            }
          }

          // Generating & setting scores
          if (options.sources.scores === true) {
            handleConversions([core.pack.Variable(), core.pack.Variable(), core.pack.Variable(), core.pack.Variable()])
            // Setting existing scores
          } else if (Array.isArray(options.sources.scores[0])) {
            // UUIDClass is being constructed in an MCFunction
            if (core.mcfunctionStack.length !== 0) {
              core.insideMCFunction(core.mcfunctionStack[core.mcfunctionStack.length - 1].resource, () => {
                /* @ts-ignore */
                handleConversions(options.sources.scores[0])
              })
            // UUIDClass is being constructed outside of a MCFunction
            } else {
              core.insideMCFunction(core.pack.getInitMCFunction(), () => {
                /* @ts-ignore */
                handleConversions(options.sources.scores[0])
              })
            }
          } else {
            this.scores = options.sources.scores as UUIDinScore
          }
        }
        if (options.sources.data) {
          // Storage needs to be set
          if (Array.isArray(options.sources.data) || options.sources.data === true) {
            // User doesn't want to set up a storage location
            if (options.sources.data === true) {
              this.data = new DataPointClass(core.pack, 'storage', '__sandstone:variables', ['UUID', `${this.known?.[0] || Math.floor(Math.random() * 10000)}`])
            // User has set a storage location
            } else {
              this.data = options.sources.data[0]
            }

            // TODO: Add __init__
            switch (this.primarySource) {
              case 'known': {
                this.data.set(this.known as UUIDinNumber)
              } break
              case 'scores': {
                this.data.set([0])
                for (let i = 0; i < 4; i++) {
                  this.data.select([i]).set((this.scores as UUIDinScore)[i], 'int')
                }
              } break
              case 'selector': {
                this.data.set(new DataPointClass(core.pack, 'entity', this.selector as SelectorClass<true, any>, ['UUID']))
              } break
              default: break
            }
          } else {
            this.data = options.sources.data
          }
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

  setKnown(uuid: UUIDinNumber) {
    this.known = uuid
  }

  setScores(scores?: UUIDinScore, alreadySet = false) {

  }

  setData(data?: DataPointClass<'storage'>, alreadySet = false) {

  }

  setSelector(selector: SelectorClass<true, any>) {

  }

  /**
   * Used for `on relation origin` links. Usually an Area Effect Cloud, must be a projectile.
   * @param holder Optional. The holder. If unspecified it will be generated.
   * @param timerSet Optional. Whether the AEC's Duration has been set. (Unless you're using a Score this should've been done in the summon command)
   * @param ownerSet Optional. Whether the AEC's Owner has been set. If false it will be set.
   */
  setHolder(holder?: string | UUIDinNumber | UUIDinScore | UUIDClass | SelectorClass<true, any>, timerSet = true, ownerSet = false) {
    if (!holder) {
      let nbt: any = {}

      if (this.relationLasts === 'singleTick') {
        nbt = { Duration: new NBTShort(1) }
      } else if (this.relationLasts === 'permanent') {
        nbt = NBT`{Age:-2147483648,Duration:-1s,WaitTime:-2147483648}`
      } else {
        nbt = { Duration: new ResolveNBTPart(this.timer, NBTShort) }
      }
      if (this.stack) {
        switch (this.primarySource) {
          case 'known': nbt.Owner = new NBTIntArray(this.known as UUIDinNumber)
            break
          case 'data': nbt.Owner = new ResolveNBTPart(this.data)
            break
          case 'scores': nbt.Owner = new ResolveNBTPart(this.scores, NBTIntArray)
            break
          case 'selector': nbt.Owner = new ResolveNBTPart(new DataPointClass(this.core.pack, 'entity', this.selector as SelectorClass<true, any>, ['UUID']))
            break
          default: break
        }
        this.holder = this.stack.addMember('minecraft:area_effect_cloud', nbt, this.timer instanceof Score || this.primarySource !== 'known')
        return this.holder as SelectorClass<true, any>
      }

      nbt.Tags = ['__sandstone.relation_aec']

      const resolvedNBT = new ResolveNBT(this.core, nbt)

      const mcfunction = this.core.pack.MCFunction(`__sandstone:uuid/relation${Math.floor(Math.random() * 10000)}}`, () => this.core.pack.commands.data.modify.entity('@s', '.').set.from.storage(resolvedNBT.target, resolvedNBT.path))

      this.core.pack.commands.execute.summon('area_effect_cloud').run.functionCmd(mcfunction)

      this.holder = this.core.pack.Label('__sandstone.relation_aec')(new SelectorClass(this.core.pack, '@e', { tag: '__sandstone.relation_aec', limit: 1 }))
      return [this.holder, mcfunction]
    }
    if (holder instanceof UUIDClass) {
      this.holder = holder
      return this.holder
    }
    this.holder = new UUIDClass(this.core, holder, this.relationLasts === 'permanent' ? 'permanent' : (this.timer as number | Score))
    return this.holder
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
      return { selector: this.arrayToString() }
    }
    if (this.selector) {
      return { selector: this.selector.toString() }
    }
    return 'Stored in scores or data storage'
  }

  /**
   * @internal
   */
  _toMinecraftCondition() {
    if (this.known) {
      return { value: ['if', 'entity', this.arrayToString()] }
    }
    return { value: ['as', this.setHolder(), 'on', 'passengers', 'if', 'entity', '@s'] }
  }
}
