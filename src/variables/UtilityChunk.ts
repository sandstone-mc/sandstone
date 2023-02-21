/* eslint-disable max-len */

import { randomUUID } from '../utils'
import {
  absolute, coordinatesParser, DataPointClass, JSONTextComponentClass, NBTIntArray, NBTLong, NBTString, nbtStringifier, Score,
} from './index'
import { ResolveNBTPart } from './ResolveNBT'
import { UUIDClass } from './UUID'

import type {
  _RawMCFunctionClass, LootTableClass, PredicateClass, ResourceClassArguments,
} from 'sandstone/core/index'
import type { StructureClass } from 'sandstone/core/resources/structure'
import type {
  ENTITY_TYPES, JSONTextComponent, NBTObject, RootNBT,
} from '../arguments/index'
import type { ChunkTuple, DimensionID, SandstonePack } from '../pack/pack'
import type { LiteralUnion } from '../utils'
import type { DataClass, NBTInt } from './index'
import type { UUIDinNumber } from './UUID'

export class UtilityChunkClass<Chunk extends ChunkTuple, ID extends DimensionID> {
  readonly chunk

  readonly coordinates

  constructor(protected pack: SandstonePack, public dimension: ID, chunk: Chunk, public marker: UUIDClass<'known' | 'selector', 'permanent'>) {
    this.chunk = coordinatesParser(absolute(...chunk))
    this.coordinates = coordinatesParser(absolute(chunk[0] * 16, chunk[1] * 16))
  }

  get inDimension() {
    return this.pack.commands.execute.in(this.dimension.join(':'))
  }

  createMember(entityType: LiteralUnion<ENTITY_TYPES>, nbt: RootNBT = {}, resolveNBT = false) {
    const { execute, data } = this.pack.commands

    const selector = this.marker

    nbt.UUID = new NBTIntArray(randomUUID())

    execute.as(selector).at('@s').summon(entityType).run(() => {
      if (resolveNBT) {
        this.pack.Data('entity', '@s', '{}').set(this.pack.ResolveNBT(nbt))
      } else {
        data.merge.entity('@s', nbt)
      }
    })
  }
}

const resourceOpts: ResourceClassArguments<'function'> = { addToSandstoneCore: true, creator: 'sandstone', onConflict: 'append' }

export class DimensionChunkClass<ID extends DimensionID> extends UtilityChunkClass<[-1875000, 200], ID> {
  constructor(pack: SandstonePack, id: ID, create: false | { name?: JSONTextComponent, uuid: string | UUIDinNumber }) {
    super(pack, id, [-1875000, 200], create ? pack.UUID(create.uuid) : pack.UUID(
      pack.Selector('@e', {
        type: 'marker', tag: 'smithed.dimensions.marker', x: 30000000, z: 3200, limit: 1,
      }),
      'permanent',
    ))

    if (create) {
      pack.initMCFunction.push(() => {
        pack.Data('storage', 'smithed.dimensions:temp', '{}').merge({
          DimensionID: id,
          ...(create.name ? { PrettyName: `${new JSONTextComponentClass(create.name)}` } : {}),
        })
      })
      if (!pack.__dimensionEntryPoints.markerMissing) {
        pack.__dimensionEntryPoints.markerMissing = pack.Tag('functions', 'smithed.dimensions:marker_missing', [pack.MCFunction('__sandstone:dimension/marker_missing', () => {}, resourceOpts)])
      }

      (pack.__dimensionEntryPoints.markerMissing.tagJSON.values[0] as _RawMCFunctionClass).push.execute.if.predicate(this.predicate).run.summon('marker', '~ ~ ~', {
        Tags: ['smithed.dimensions.marker', 'smithed.entity', 'smithed.strict'],
        UUID: create.uuid,
      })
    }
  }

  /** Partial execute command executing as (not at) the per-dimension marker */
  get execute() {
    // TODO: Switch this to `Thrower` based relation linkage due to MC-260322. Figure out how to set #target.
    return this.pack.commands.execute.as(this.pack.rootChunk.armorStand).on('passengers').if.score(this.pack.dimensionID('@s'), '=', this.pack.dimensionTarget)
  }

  __predicate?: PredicateClass

  get predicate() {
    if (!this.__predicate) {
      this.__predicate = this.pack.Predicate(`__internal/dimension_check/${this.dimension.join('.')}`, {
        condition: 'minecraft:location_check',
        predicate: {
          dimension: this.dimension.join(':'),
        },
      })
    }
    return this.__predicate
  }

  // TODO
  get dimensionNumber() {
    return Score
  }

  /** Not yet implemented by Smithed Core */
  get commandBlockTick() {
    if (!this.pack.__dimensionEntryPoints.commandBlock) {
      this.pack.__dimensionEntryPoints.commandBlock = this.pack.Tag('functions', 'smithed.todo:dimension_command_block_tick', [
        this.pack.MCFunction('__sandstone:dimension/command_block_tick', () => {}, resourceOpts),
      ], resourceOpts)
    }
    return (this.pack.__dimensionEntryPoints.commandBlock.tagJSON.values[0] as _RawMCFunctionClass).push.execute.if.predicate(this.predicate)
  }

  get setup() {
    if (!this.pack.__dimensionEntryPoints.setup) {
      this.pack.__dimensionEntryPoints.setup = this.pack.Tag('functions', 'smithed.dimensions:setup_dimension', [
        this.pack.MCFunction('__sandstone:dimension/setup_dimension', () => {}, resourceOpts),
      ], resourceOpts)
    }
    return (this.pack.__dimensionEntryPoints.setup.tagJSON.values[0] as _RawMCFunctionClass).push.execute.if.predicate(this.predicate)
  }

  get init() {
    if (!this.pack.__dimensionEntryPoints.init) {
      this.pack.__dimensionEntryPoints.init = this.pack.Tag('functions', 'smithed.dimensions:dimension_initialized', [
        this.pack.MCFunction('__sandstone:dimension/dimension_initialized', () => {}, resourceOpts),
      ], resourceOpts)
    }
    return (this.pack.__dimensionEntryPoints.init.tagJSON.values[0] as _RawMCFunctionClass).push.execute.if.predicate(this.predicate)
  }

  get dimensionReady() {
    if (!this.pack.__dimensionEntryPoints.ready) {
      this.pack.__dimensionEntryPoints.ready = this.pack.Tag('functions', 'smithed.dimensions:dimension_ready', [
        this.pack.MCFunction('__sandstone:dimension/dimension_ready', () => {}, resourceOpts),
      ], resourceOpts)
    }
    return (this.pack.__dimensionEntryPoints.ready.tagJSON.values[0] as _RawMCFunctionClass).push.execute.if.predicate(this.predicate)
  }

  /**
   * Stores information for this chunk with efficient access.
   *
   * @param executingAt Callback that is executed as the per-dimension marker, at the jukebox
   */
  jukebox(executingAt: (data: DataClass<'block'>) => void) {
    this.execute.at('@s').positioned('~ ~ ~1').run(() => executingAt(this.pack.Data('block', '~ ~ ~')))
  }
}

export class RootChunkClass extends UtilityChunkClass<[0, 0], ['smithed', 'void']> {
  declare marker: UUIDClass<'known', 'permanent'>

  /** Partial execute command executing as (not at) the root marker */
  readonly execute = this.pack.commands.execute.as(this.marker)

  /**
   * For checking arbitrary items that cannot be directly targeted against a predicate & getting the low 32 bits of a long by copying the long using data modify to DisabledSlots
   */
  readonly armorStand = this.pack.UUID('000000fe-0000-0000-0000-000000000001')

  /**
   * Corner of chunk open for any arbitrary temporary block manipulations. Packs can do anything they want in the user space, and there is no guarantee of the lifespan of blocks placed in this region.
   */
  readonly userspace = '-16 0 0'

  constructor(pack: SandstonePack) {
    super(pack, ['smithed', 'void'], [0, 0], pack.UUID('000000fe-0000-0000-0000-000000000000'))
  }

  /**
   * A sign, for resolving JSON text without using an item.
   *
   * @param executingAt Callback that is executed in the dimension at the sign.
   */
  sign(executingAt: (data: DataClass<'block'>) => void) {
    this.inDimension.positioned('0 0 0').run(() => executingAt(this.pack.Data('block', '~ ~ ~')))
  }

  /**
   * Resolves JSON text without using an item.
   */
  resolveText(text: JSONTextComponent | DataPointClass) {
    const blockData = this.pack.Data('block', '0 0 0', 'Text1')
    const output = this.pack.DataVariable(undefined, 'textOutput')

    this.inDimension.run(() => blockData.set(text instanceof DataPointClass ? text : `${new JSONTextComponentClass(text)}`))
    this.inDimension.run(() => output.set(blockData))

    return output
  }

  __variable = this.pack.DataVariable('shulkerBox')

  /**
   * A shulker box, for using loot insert into containers using dynamic items, detecting the stack limit of items without hardcoding, or running loot tables with a seed.
   */
  shulkerBox = {
    /**
     * @param executingAt Callback that is executed in the dimension at the shulker box.
     */
    execute: this.inDimension.positioned('0 0 1'),

    /**
     * @param output Optional. Set where the result of the loot table is stored in data storage.
     * @param seed Optional. Set seed of the loot table when ran.
     * @param scale Optional. Set the scale for the seed if using a score.
     * @returns List of all items that resulted from running the loot table.
     */
    loot: (lootTable: LootTableClass | DataPointClass, output: DataPointClass<'storage'> = this.__variable, seed?: Score | DataPointClass, scale?: number): DataPointClass<'storage'> => {
      const data = this.pack.Data('block', '0 0 1')

      if (!(lootTable instanceof DataPointClass) && !seed) {
        this.inDimension.run(() => data.merge('{Items:[]}'))
        this.inDimension.run.loot.insert('0 0 1').loot(lootTable)
        return output.set(data.select('Items'))
      }
      const nbt = this.pack.ResolveNBT({
        Items: [],
        LootTable: ResolveNBTPart(lootTable as DataPointClass, NBTString),
        ...(seed ? {
          LootTableSeed: seed instanceof DataPointClass ? ResolveNBTPart(seed, NBTLong) : ResolveNBTPart(seed, scale, NBTLong),
        } : {}),
      }, output)

      this.inDimension.run(() => data.select('{}').set(nbt))

      this.inDimension.run.loot.insert('0 0 1').mine('0 0 1', 'air{drop_contents:1b}')

      return output.set(data.select('Items'))
    },
  }

  /**
   * A structure block, for saving a structure that has been placed into the user space.
   *
   * Redstone block for saving is placed at `~1 ~ ~`
   *
   * @param executingAt Callback that is executed in the dimension at the structure block.
   */
  structureBlock(executingAt: (data: DataClass<'block'>) => void) {
    this.inDimension.positioned('0 0 3').run(() => executingAt(this.pack.Data('block', '~ ~ ~')))
  }

  /**
   * Saves defined cuboid to a structure in-memory, is executed at `-16 0 0`
   * @param structure The structure you want to use.
   * @param offset Optional. Offset in relative x, y, z.
   * @param size Optional. Size of the structure in x, y, z. Defaults to 1 block.
   */
  saveStructure(structure: StructureClass, offset?: [NBTInt, NBTInt, NBTInt], size?: [NBTInt, NBTInt, NBTInt]) {
    this.inDimension.positioned(this.userspace).run(() => {
      const nbt: NBTObject = {
        mode: 'SAVE',
        showboundingbox: false,
        powered: false,
        ignoreEntities: false,
        name: structure.name,
        ...(offset ? {
          posX: offset[0],
          posY: offset[1],
          posZ: offset[2],
        } : {}),
        ...(size ? {
          sizeX: size[0],
          sizeY: size[1],
          sizeZ: size[2],
        } : {}),
      }
      const { setblock } = this.pack.commands

      setblock('0 0 3', `structure_block${nbtStringifier(nbt)}`)
      setblock('1 0 3', 'air')
      setblock('1 0 3', 'redstone_block')
    })
  }
}

export class UtilityChunkMember extends UUIDClass<any, any> {

}
