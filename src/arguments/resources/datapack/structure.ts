import type { LiteralUnion } from 'sandstone/utils'
import type { BLOCKS, RootNBT } from '../index'

type Vec3 = [number, number, number]

export type StructureNBT = {
  /** [Data version](https://minecraft.fandom.com/wiki/Data_version). A positive integer. */
  DataVersion?: number

  /** Size. A list of positive integers. */
  size: Vec3

  blocks: {
    /** Index of the block in the palette. A positive integer. */
    state: number
    /** Position. A list of positive integers. */
    pos: Vec3
    /** BlockEntity nbt. Must use NBT Primitives! */
    nbt?: RootNBT
  }[]

  entities: {
    /** Exact position. A list of positive doubles. */
    pos: Vec3
    /** Block position */
    blockPos: Vec3
    /** Entity NBT. Must use NBT Primitives! */
    nbt: RootNBT
  }[]

  /** Exclusive of palettes. */
  palette?: BlockState[]

  /** Exclusive of palette. Sets of different block states used in the structure, a random palette gets selected based on coordinates. */
  palettes?: BlockState[][]
}

export type BlockState = {
  Name: LiteralUnion<BLOCKS>
  Properties?: {
    [key: string]: string
  }
}
