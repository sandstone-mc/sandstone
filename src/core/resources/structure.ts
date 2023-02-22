/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import lodash from 'lodash'
import prismarine, { NBT } from 'prismarine-nbt'
import { add } from 'sandstone/utils'
import { ConditionClass, relative } from 'sandstone/variables/index'
import { ResolveNBTPart } from 'sandstone/variables/ResolveNBT'

import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { BlockState, StructureNBT } from 'sandstone/arguments/resources/structure'
import type { LiteralUnion } from 'sandstone/utils'
import type {
  DataPointClass, Score, StructureMirror, StructureRotation,
} from 'sandstone/variables/index'
import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type {
  BLOCKS, Coordinates, ENTITY_TYPES, NBTObject, RootNBT,
} from '#arguments'

const same = lodash.isEqual

/**
 * A node representing a Minecraft trim material.
 */
export class StructureNode extends ContainerNode implements ResourceNode<StructureClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: StructureClass) {
    super(sandstoneCore)
  }

  getValue = () => (this.resource.structureNBT ? encodeStructure(this.resource.structure as StructureNBT) : this.resource.structureBuffer)
}

type Block = {
  id: LiteralUnion<BLOCKS>,
  state?: { [key: string]: string }
  /* Must use NBT Primitives! */
  nbt?: RootNBT
}

type StructureEntry = {
  block?: Block | Block[],
  entities?: [{
    id: LiteralUnion<ENTITY_TYPES>,
    /* Must use NBT Primitives! */
    nbt?: RootNBT,
    offset?: [number, number, number]
  }]
}

export type StructureClassArguments = {
  /**
   * Either:
   * - Path in existing resources
   * - Structure's NBT
   * - Existing Structure definition
   * - 3D Array representing the structure. Longest entry will be counted as bounds, missing or empty elements will be counted as air from origin.
   */
  structure?: string | StructureNBT | StructureClass | [[[StructureEntry]]]
} & ResourceClassArguments<'default'> // Yes I could implement append/prepend ie. structure merging, will I? No :). Feel free to PR.

type VariableInsertion = Score | DataPointClass<'storage'>

export class StructureClass extends ResourceClass<StructureNode> {
  structureBuffer?: Promise<Buffer>

  structureNBT?: StructureNBT

  constructor(sandstoneCore: SandstoneCore, name: string, args: StructureClassArguments) {
    super(sandstoneCore, { packType: sandstoneCore.pack.dataPack(), extension: 'nbt', encoding: false }, StructureNode, sandstoneCore.pack.resourceToPath(name, ['structures']), args)

    if (args.structure === undefined) {
      this.structureBuffer = sandstoneCore.getExistingResource(this) as Promise<Buffer>
    } else if (typeof args.structure === 'string') {
      this.structureBuffer = sandstoneCore.getExistingResource(args.structure, false)
    } else if (args.structure instanceof StructureClass) {
      if (args.structure.structureNBT) {
        this.structureNBT = args.structure.structureNBT
      } else if (args.structure.structureBuffer) {
        this.structureBuffer = args.structure.structureBuffer
      } else {
        this.structureBuffer = args.structure.structure as Promise<Buffer>
      }
    } else if (Array.isArray(args.structure)) {
      this.structureNBT = this.arrayToNBT(args.structure)
    } else {
      this.structureNBT = args.structure
    }

    this.handleConflicts()
  }

  get structure(): StructureNBT | Promise<Buffer> {
    if (this.structureNBT) {
      return this.structureNBT
    }
    if (this.structureBuffer) {
      return this.structureBuffer
    }

    this.structureBuffer = this.node.sandstoneCore.getExistingResource(this.name, false)
    return this.structureBuffer
  }

  async readBuffer() {
    this.structureNBT = await decodeStructure(await (this.structureBuffer as Promise<Buffer>))
  }

  async array(): Promise<[[[StructureEntry]]]> {
    if (!this.structureNBT) {
      await this.readBuffer()
    }
    const _NBT = this.structureNBT as StructureNBT
    const array: any = [[[]]]

    for (let x = 0; x < _NBT.size[0]; x++) {
      array.push([])
      for (let y = _NBT.size[1]; y--; y > 0) {
        array[x].push([])
        for (let z = _NBT.size[2]; z--; z > 0) {
          array[x][y].push({})
        }
      }
    }

    for (const block of _NBT.blocks) {
      const convert = (_block: BlockState) => ({ id: _block.Name, state: _block.Properties, ...add({ nbt: block.nbt }) })

      array[block.pos[0]][block.pos[1]][block.pos[2]] = {
        /* @ts-ignore */
        block: (NBT.palettes ? NBT.palettes.map((palette) => convert(palette[block.state])) : convert(NBT.palette[block.state])),
      } as StructureEntry
    }

    for (const entity of _NBT.entities) {
      array[entity.blockPos[0]][entity.blockPos[1]][entity.blockPos[2]] += {
        entity: [{
          id: entity.nbt.id,
          nbt: (() => {
            const nbt = { ...entity.nbt }
            delete nbt.id
            return nbt
          })(),
          offset: (() => {
            const diff = (num1: number, num2: number) => (Math.sign(num1) === -1 ? (Math.abs(num1) - Math.abs(num2)) * -1 : num1 - num2)

            return [
              diff(entity.pos[0], entity.blockPos[0]),
              diff(entity.pos[1], entity.blockPos[1]),
              diff(entity.pos[2], entity.blockPos[2]),
            ]
          })(),
        }],
      }
    }

    return array as [[[StructureEntry]]]
  }

  arrayToNBT(array: [[[StructureEntry]]]) {
    const nbt: any = {
      DataVersion: 3329,
      size: [0, 0, 0],
      blocks: [],
      entities: [],
    }

    // Ima have an aneurism. Codecs are fun. This is definitely worth it. Definitely.
    nbt.size[0] = array.length
    for (const layer of array.entries()) {
      if (layer.length > nbt.size[1]) {
        nbt.size[1] = layer.length
      }
      for (const row of layer[1].entries()) {
        if (row.length > nbt.size[2]) {
          nbt.size[2] = row.length
        }
        for (const entry of row[1].entries()) {
          if (entry[1].block) {
            if (Array.isArray(entry[1].block)) {
              let paletteIndex = -1

              if (!nbt.palettes) {
                nbt.palettes = []
                for (let i = 0; i < entry[1].block.length; i++) {
                  nbt.palettes.push([])
                }
              } else {
                // Yeah this can break. Maybe I'll make this a class instead.
                for (const block of nbt.palettes[0]) {
                  if (same(entry[1].block[0], block[1])) {
                    paletteIndex = block[0]
                  }
                }
                if (paletteIndex === -1) {
                  for (const palette of nbt.pallettes.entries()) {
                    palette[1].push({
                      Name: entry[1].block[palette[0]].id,
                      ...add({
                        Properties: entry[1].block[palette[0]].state,
                      }),
                    })
                  }
                }
              }

              nbt.blocks.push({
                state: paletteIndex === -1 ? nbt.palettes.length - 1 : paletteIndex,
                pos: [layer[0], row[0], entry[0]],
                ...add({
                  nbt: entry[1].block[0].nbt,
                }),
              })
            } else {
              let paletteIndex = -1
              if (!nbt.palette) {
                nbt.palette = []
              }
              for (const block of nbt.palette) {
                if (same(entry[1].block, block[1])) {
                  paletteIndex = block[0]
                }
              }
              if (paletteIndex === -1) {
                nbt.palette.push({
                  Name: entry[1].block.id,
                  ...add({
                    Properties: entry[1].block.state,
                  }),
                })
              }

              nbt.blocks.push({
                state: paletteIndex === -1 ? nbt.palettes.length - 1 : paletteIndex,
                pos: [layer[0], row[0], entry[0]],
                ...add({
                  nbt: entry[1].block.nbt,
                }),
              })
            }
          }
          if (entry[1].entities) {
            for (const entity of entry[1].entities) {
              nbt.push({
                pos: entity.offset ? [layer[0] + entity.offset[0], row[0] + entity.offset[1], entry[0] + entity.offset[2]] : [layer[0], row[0], entry[0]],
                blockPos: [layer[0], row[0], entry[0]],
                nbt: {
                  id: entity.id,
                  ...add(entity.nbt),
                },
              })
            }
          }
        }
      }
    }

    return nbt as StructureNBT
  }

  /**
   * Places the structure.
   *
   * Usage of `VariableInsertion` or `xz` will result in a structure block being used.
   *
   * @param pos Optional. Where to place relative to the current location.
   * @param rotation Optional. Rotation to apply to the structure.
   * @param mirror Optional. Mirroring to apply to the structure. `xz` will clear all existing blocks in the region, only works for structures with defined size, & will await structures not in memory.
   * @param integrity Optional. How complete the structure will be. Must be a float between 1.0 & 0.0 (inclusive), if below 1 the structure will be randomly degraded.
   * @param seed Optional. Integer applied to the integrity random. Defaults to 0.
   */
  async load(pos: [number, number, number] = [0, 0, 0], rotation?: StructureRotation | VariableInsertion, mirror?: StructureMirror | '^xz' | 'xz' | VariableInsertion, integrity?: number | VariableInsertion, seed?: number | VariableInsertion) {
    const {
      Variable, Data, ResolveNBT, dimensionMarker,
    } = this.pack
    const {
      place, fill, setblock, execute,
    } = this.pack.commands
    const structure = place.template

    const rel = relative(...pos)

    if (rotation instanceof ConditionClass || mirror instanceof ConditionClass || integrity instanceof ConditionClass || seed instanceof ConditionClass) {
      const currentLevel = Variable()
      const bottomCoordinate = Variable()

      currentLevel.set(Data('entity', '@s', 'Position[1]'))
      dimensionMarker.run(() => bottomCoordinate.set(Data('entity', '@s', 'Position[1]')))

      execute.summon('marker').run(() => {
        Data('entity', '@s', 'Position[1]').set(bottomCoordinate, 'double')

        const nbt: NBTObject = {
          mode: 'LOAD',
          showboundingbox: false,
          powered: false,
          ignoreEntities: false,
          name: structure.name,
          posX: pos[0],
          posY: ResolveNBTPart(currentLevel['+'](pos[1])),
          posZ: pos[2],
        }

        setblock(`~${pos[0]} ~ ~${pos[2]}`, 'structure_block')
        Data('block', `~${pos[0]} ~ ~${pos[2]}`, '{}').set(ResolveNBT(nbt))
        setblock(`~${pos[0]} ~ ~${pos[2] + 1}`, 'redstone_block')
        setblock(`~${pos[0]} ~ ~${pos[2]}`, 'bedrock')
        setblock(`~${pos[0]} ~ ~${pos[2] + 1}`, 'bedrock')
      })
    } else if (mirror && (mirror === '^xz' || mirror === 'xz')) {
      if (!this.structureNBT) {
        await this.readBuffer()
      }

      const temp = new StructureClass(this.core, '__sandstone:temp', { addToSandstoneCore: false, creator: 'sandstone' })

      const coords = (this.structureNBT as RootNBT).size as [number, number, number]
      // TODO: Calculate with rotation
      const outerCorner = relative(...coords)

      fill(rel, outerCorner, 'air')

      structure(this, rel, rotation as StructureRotation, '^x')

      temp.save(rel, coords)

      fill(rel, outerCorner, 'air')

      structure(temp, rel, 'none', '^z', integrity as number, seed as number)
    } else {
      structure(this, rel, rotation as StructureRotation, mirror as StructureMirror, integrity as number, seed as number)
    }
  }

  save(pos: Coordinates | [Score, Score, Score] = '~ ~ ~', size: [number, number, number] | [Score, Score, Score]) {

  }

  toString() {
    return this.name
  }
}

const objectMap = (obj: any, fn: any) => Object.fromEntries(Object.entries(obj).map(([k, v], i) => fn(v, k, i)))

function encodeStructure(nbt: StructureNBT) {
  const {
    comp, list, int, double, string, writeUncompressed,
  } = prismarine

  return writeUncompressed(comp({
    DataVersion: int(nbt.DataVersion as number),
    size: list(comp(nbt.size.map((axis) => int(axis)))),
    blocks: list(comp(nbt.blocks.map((block) => ({
      state: int(block.state),
      pos: list(comp(block.pos.map((axis) => int(axis)))),
      /**
       *  ...add({
       * nbt: fun(block.nbt), // TODO
       *}),
       */
    })))),
    entities: list(comp(nbt.entities.map((entity) => ({
      pos: list(comp(entity.pos.map((axis) => double(axis)))),
      blockPos: list(comp(entity.blockPos.map((axis) => int(axis)))),
      // nbt: fun(entity.nbt), // TODO
    })))),
    // eslint-disable-next-line no-nested-ternary
    ...(nbt.palette
      ? {
        palette: list(comp(nbt.palette.map((block) => ({
          Name: string(block.Name),
          Properties: list(comp(objectMap(block.Properties, (v: string, k: string) => [string(k), string(v)]))),
        })))),
      }
      : nbt.palettes ? {
        palettes: list(comp(nbt.palettes.map((palette) => palette.map((block) => ({
          Name: string(block.Name),
          Properties: list(comp(objectMap(block.Properties, (v: string, k: string) => [string(k), string(v)]))),
        }))))),
      } : {}
    ),
  }) as unknown as NBT)
}

async function decodeStructure(buffer: Buffer) {
  const nbt = await prismarine.parse(buffer)

  return prismarine.simplify(nbt.parsed) as StructureNBT
}
