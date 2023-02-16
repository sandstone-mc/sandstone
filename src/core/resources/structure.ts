/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import { ConditionClass, nbtStringifier, relative } from 'sandstone/variables/index'

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
  BLOCKS, Coordinates, ENTITY_TYPES, RootNBT,
} from '#arguments'

/**
 * A node representing a Minecraft trim material.
 */
export class StructureNode extends ContainerNode implements ResourceNode<StructureClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: StructureClass) {
    super(sandstoneCore)
  }

  getValue = () => (this.resource.structureNBT ? nbtStringifier(this.resource.structure as StructureNBT) : this.resource.structureBuffer)
}

type Block = {
  id: LiteralUnion<BLOCKS>,
  state?: { [key: string]: string }
  nbt?: RootNBT
}

type StructureEntry = {
  block?: Block | Block[],
  entities?: [{
    id: LiteralUnion<ENTITY_TYPES>,
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
} & ResourceClassArguments<'default'> & {
  /**
   * Optional. Defaults to true. Automatically adds trim material to #minecraft:trim_materials.
   */
  registerMaterial?: boolean
}

type VariableInsertion = Score | DataPointClass<'storage'>

export class StructureClass extends ResourceClass<StructureNode> {
  structureBuffer?: Promise<Buffer>

  structureNBT?: StructureNBT

  constructor(sandstoneCore: SandstoneCore, name: string, args: StructureClassArguments) {
    super(sandstoneCore, sandstoneCore.pack.dataPack(), 'nbt', StructureNode, sandstoneCore.pack.resourceToPath(name, ['structures']), args)

    if (args.structure === undefined) {
      this.structureBuffer = sandstoneCore.getExistingResource(true, this.path)
    } else if (typeof args.structure === 'string') {
      this.structureBuffer = sandstoneCore.getExistingResource(true, args.structure)
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
  }

  get structure(): StructureNBT | Promise<Buffer> {
    if (this.structureNBT) {
      return this.structureNBT
    }
    if (this.structureBuffer) {
      return this.structureBuffer
    }
    this.structureBuffer = this.node.sandstoneCore.getExistingResource(true, this.name)
    return this.structureBuffer as Promise<Buffer>
  }

  async readBuffer() {
    this.structureNBT = parseBinary(await this.structureBuffer) as StructureNBT
  }

  async array(): Promise<[[[StructureEntry]]]> {
    if (!this.structureNBT) {
      await this.readBuffer()
    }
    const NBT = this.structureNBT as StructureNBT
    const array: any = [[[]]]

    for (let x = 0; x < NBT.size[0]; x++) {
      array.push([])
      for (let y = NBT.size[1]; y--; y > 0) {
        array[x].push([])
        for (let z = NBT.size[2]; z--; z > 0) {
          array[x][y].push({})
        }
      }
    }

    for (const block of NBT.blocks) {
      const convert = (_block: BlockState) => ({ id: _block.Name, state: _block.Properties, ...(block.nbt ? { nbt: block.nbt } : {}) })

      array[block.pos[0]][block.pos[1]][block.pos[2]] = {
        /* @ts-ignore */
        block: (NBT.palettes ? NBT.palettes.map((palette) => convert(palette[block.state])) : convert(NBT.palette[block.state])),
      } as StructureEntry
    }

    for (const entity of NBT.entities) {
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
    for (const layer of array.entries()) {
      for (const row of layer[1].entries()) {
        for (const entry of row[1].entries()) {
          if (entry[1].block) {
            if (entry[0] > nbt.size[2]) {
              nbt.size[2] = entry[0]
            }
            if (row[0] > nbt.size[1]) {
              nbt.size[1] = row[0]
            }
            if (layer[0] > nbt.size[0]) {
              nbt.size[0] = entry[0]
            }

            if (Array.isArray(entry[1].block)) {
              let paletteIndex = -1

              if (!nbt.palettes) {
                nbt.palettes = []
                for (let i = 0; i < entry[1].block.length; i++) {
                  nbt.palettes.push([])
                }
              } else {
                for (const block of nbt.palettes[0]) {
                  if (_.same(entry[1].block[0], block[1])) {
                    paletteIndex = block[0]
                  }
                }
                if (paletteIndex === -1) {
                  for (const palette of nbt.pallettes.entries()) {
                    palette[1].push({
                      Name: entry[1].block[palette[0]].id,
                      ...(entry[1].block[palette[0]].state ? {
                        Properties: entry[1].block[palette[0]].state,
                      } : {}),
                    })
                  }
                }
              }

              nbt.blocks.push({
                state: paletteIndex === -1 ? nbt.palettes.length - 1 : paletteIndex,
                pos: [layer[0], row[0], entry[0]],
                ...(entry[1].block[0].nbt ? {
                  nbt: entry[1].block[0].nbt,
                } : {}),
              })
            } else {
              let paletteIndex = -1
              if (!nbt.palette) {
                nbt.palette = []
              }
              for (const block of nbt.palette) {
                if (_.same(entry[1].block, block[1])) {
                  paletteIndex = block[0]
                }
              }
              if (paletteIndex === -1) {
                nbt.palette.push({
                  Name: entry[1].block.id,
                  ...(entry[1].block.state ? {
                    Properties: entry[1].block.state,
                  } : {}),
                })
              }

              nbt.blocks.push({
                state: paletteIndex === -1 ? nbt.palettes.length - 1 : paletteIndex,
                pos: [layer[0], row[0], entry[0]],
                ...(entry[1].block.nbt ? {
                  nbt: entry[1].block.nbt,
                } : {}),
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
                  ...(entity.nbt ? entity.nbt : {}),
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
   * @param pos Optional. Where to place.
   * @param rotation Optional. Rotation to apply to the structure.
   * @param mirror Optional. Mirroring to apply to the structure. `xz` will clear all existing blocks in the region, only works for structures with defined size, & will await structures not in memory.
   * @param integrity Optional. How complete the structure will be. Must be a float between 1.0 & 0.0 (inclusive), if below 1 the structure will be randomly degraded.
   * @param seed Optional. Integer applied to the integrity random. Defaults to 0.
   */
  async load(pos: Coordinates = '~ ~ ~', rotation?: StructureRotation | VariableInsertion, mirror?: StructureMirror | '^xz' | 'xz' | VariableInsertion, integrity?: number | VariableInsertion, seed?: number | VariableInsertion) {
    const structure = this.pack.commands.place.template

    if (rotation instanceof ConditionClass || mirror instanceof ConditionClass || integrity instanceof ConditionClass || seed instanceof ConditionClass) {
      // TODO: handle structure block loading
    } else if (mirror && (mirror === '^xz' || mirror === 'xz')) {
      if (!this.structureNBT) {
        await this.readBuffer()
      }

      const temp = new StructureClass(this.core, '__sandstone:temp', { addToSandstoneCore: false, creator: 'sandstone' })

      const coords = (this.structureNBT as RootNBT).size as [number, number, number]
      // TODO: Calculate with rotation
      const outerCorner = relative(...coords)

      this.pack.commands.fill(pos, outerCorner, 'air')

      structure(this, pos, rotation, '^x')

      temp.save(pos, outerCorner)

      this.pack.commands.fill(pos, outerCorner, 'air')

      structure(temp, pos, 'none', '^z', integrity, seed)
    } else {
      structure(this, pos, rotation, mirror, integrity, seed)
    }
  }

  save(pos: Coordinates | [Score, Score, Score] = '~ ~ ~', size: [number, number, number] | [Score, Score, Score]) {

  }

  toString() {
    return this.name
  }
}
