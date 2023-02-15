/* eslint-disable max-len */
import { randomUUID } from '../utils'
import {
  absolute, coordinatesParser, DataPointClass, NBTIntArray, NBTLong, NBTString, nbtStringifier, Score,
} from './index'
import { ResolveNBTPart } from './ResolveNBT'
import { UUIDClass } from './UUID'

import type { LootTableClass } from 'sandstone/core/index'
import type {
  DIMENSIONS, ENTITY_TYPES, JSONTextComponent, NBTObject,
} from '../arguments/index'
import type { SandstonePack } from '../pack/pack'
import type { LiteralUnion } from '../utils'
import type { DataClass, NBTInt } from './index'
import { StructureClass } from 'sandstone/core/resources/structure'

export class UtilityChunkClass {
  readonly chunk

  readonly coordinates

  constructor(protected pack: SandstonePack, public dimension: LiteralUnion<DIMENSIONS>, chunk: [number, number], public marker: UUIDClass<'permanent'>) {
    this.chunk = coordinatesParser(absolute(...chunk))
    this.coordinates = coordinatesParser(absolute(chunk[0] * 16, chunk[1] * 16))
  }

  get inDimension() {
    return this.pack.commands.execute.in(this.dimension)
  }

  createMember(entityType: LiteralUnion<ENTITY_TYPES>, nbt: { [key: string]: NBTObject } = {}, resolveNBT = false) {
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

export class DimensionChunkClass extends UtilityChunkClass {
  constructor(pack: SandstonePack, id: string, name?: JSONTextComponent) {
    super(pack, id, [-1875000, 200], pack.UUID(pack.Selector('@e', {
      type: 'marker', tag: 'smithed.dimensions.marker', x: 30000000, z: 3200, limit: 1,
    })))
  }

  /** Partial execute command executing as (not at) the per-dimension marker */
  get execute() {
    return this.pack.commands.execute.as(this.pack.rootChunk.marker).on('passengers').if.score('@s', 'smithed.dimensions.id', '=', '#target', 'smithed.dimensions.id')
  }

  get dimensionID() {
    return Score
  }

  get commandBlockTick() {
    return TagClass
  }

  get dimensionSetup() {
    return TagClass
  }

  get dimensionInit() {
    return TagClass
  }

  get dimensionReady() {
    return TagClass
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

export class RootChunkClass extends UtilityChunkClass {
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
    super(pack, 'smithed:void', [0, 0], pack.UUID('000000fe-0000-0000-0000-000000000000'))
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

    this.inDimension.run(() => blockData.set(text instanceof DataPointClass ? text : `${text}`))
    this.inDimension.run(() => output.set(blockData))

    return output
  }

  /**
   * A shulker box, for using loot insert into containers using dynamic items, detecting the stack limit of items without hardcoding, or running loot tables with a seed.
   */
  shulkerBox = {
    __variable: this.pack.DataVariable('shulkerBox'),

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
    loot: (lootTable: LootTableClass | DataPointClass, output: DataPointClass<'storage'> = this.shulkerBox.__variable, seed?: Score | DataPointClass, scale?: number): DataPointClass<'storage'> => {
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

  /*
   * TODO
   * get commandBlockTick() {
   *   return TagClass
   * }
   */
}

export class UtilityChunkMember extends UUIDClass {

}
