import type { NBT as NBTObj } from '@arguments'
import { nbtParser } from '@variables'
import util from 'util'

export abstract class NBTCustomObject {
  abstract [util.inspect.custom]: () => string;
}

function customUnit(num: number, unit: string): NBTCustomObject {
  return new class {
    [util.inspect.custom] = () => `${num}${unit}`
  }()
}

function customNumber(num: number | number[], unit: string): NBTCustomObject | NBTCustomObject[] {
  if (Array.isArray(num)) {
    return num.map((n) => customUnit(n, unit))
  }
  return customUnit(num, unit)
}

interface NBTInterface {
  /** Transforms a NBT object to a string. */
  toString: (nbt: NBTObj) => string

  /**
  * Transform a number into a Minecraft NBT float number.
   *
   * @param floatNumber The number to transform.
   *
   * @example
   * summon(..., { Health: 20 }) // => { Health: 20 }
   *
   * summon(..., { Health: NBT.float(20) }) // => { Health: 20f }
   */
  float(floatNumber: number): NBTCustomObject

  /**
   * Transform several numbers into a an array of Minecraft NBT float numbers.
   *
   * @param floatNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.float([0, 1, 2]) }) // => { Test: [0f, 1f, 2f] }
   */
  float(floatNumbers: number[]): NBTCustomObject[]

  /**
   * Transform a number into a Minecraft NBT double number.
   *
   * @param doubleNumber The number to transform.
   *
   * @example
   * summon(..., { Health: 20 }) // => { Health: 20 }
   *
   * summon(..., { Health: NBT.double(20) }) // => { Health: 20d }
   */
  double(doubleNumber: number): NBTCustomObject

  /**
   * Transform several numbers into a an array of Minecraft NBT double numbers.
   *
   * @param doubleNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.double([0, 1, 2]) }) // => { Test: [0d, 1d, 2d] }
   */
  double(doubleNumbers: number[]): NBTCustomObject[]

  /**
   * Transform a number into a Minecraft NBT byte number.
   *
   * @param byteNumber The number to transform.
   *
   * @example
   * summon(..., { Health: 20 }) // => { Health: 20 }
   *
   * summon(..., { Health: NBT.byte(20) }) // => { Health: 20b }
   */
  byte(byteNumber: number): NBTCustomObject

  /**
   * Transform several numbers into a an array of Minecraft NBT byte numbers.
   *
   * @param byteNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.byte([0, 1, 2]) }) // => { Test: [0b, 1b, 2b] }
   */
  byte(byteNumbers: number[]): NBTCustomObject[]

  /**
   * Transform a number into a Minecraft NBT short number.
   *
   * @param shortNumber The number to transform.
   *
   * @example
   * summon(..., { Health: 20 }) // => { Health: 20 }
   *
   * summon(..., { Health: NBT.short(20) }) // => { Health: 20b }
   */
  short(shortNumber: number): NBTCustomObject

  /**
   * Transform several numbers into a an array of Minecraft NBT short numbers.
   *
   * @param shortNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.short([0, 1, 2]) }) // => { Test: [0s, 1s, 2s] }
   */
  short(shortNumbers: number[]): NBTCustomObject[]

  /**
   * Transform a number into a Minecraft NBT long number.
   *
   * @param longNumber The number to transform.
   *
   * @example
   * summon(..., { Health: 20 }) // => { Health: 20 }
   *
   * summon(..., { Health: NBT.long(20) }) // => { Health: 20l }
   */
  long(longNumber: number): NBTCustomObject

  /**
   * Transform several numbers into a an array of Minecraft NBT long numbers.
   *
   * @param longNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.long([0, 1, 2]) }) // => { Test: [0l, 1l, 2l] }
   */
  long(longNumbers: number[]): NBTCustomObject[]
}

export const NBT: NBTInterface = {
  /** Transforms a NBT object to a string. */
  toString: nbtParser,

  float: (num: number | number[]): any => customNumber(num, 'f'),

  double: (num: number | number[]): any => customNumber(num, 'd'),

  byte: (num: number | number[]): any => customNumber(num, 'b'),

  short: (num: number | number[]): any => customNumber(num, 's'),

  long: (num: number | number[]): any => customNumber(num, 'l'),
}
