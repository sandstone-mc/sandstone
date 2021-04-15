import util from 'util'
import { nbtParser } from '@variables'

import type { NBTObject, RootNBT as NBTObj, RootNBT } from '@arguments'

export abstract class NBTCustomObject {
  abstract [util.inspect.custom]: () => string;
}

function customUnit(num: number, unit: string): NBTCustomObject {
  return new class {
    [util.inspect.custom] = () => `${num}${unit}`
  }()
}

function customUnitArray(numbers: number[], unit: string): NBTCustomObject {
  return new class extends NBTCustomObject {
    [util.inspect.custom] = () => `[I; ${numbers.join(', ')}]`
  }()
}

function customNumber(num: number | number[], unit: string): NBTCustomObject | NBTCustomObject[] {
  if (Array.isArray(num)) {
    return num.map((n) => customUnit(n, unit))
  }
  return customUnit(num, unit)
}

export class NotNBT {
  nbt

  constructor(nbt: RootNBT) {
    this.nbt = nbt
  }

  [util.inspect.custom] = () => `!${nbtParser(this.nbt)}`
}

function dynamicNBT(template: TemplateStringsArray): NBTCustomObject {
  const result = template.map((element: any) => (element instanceof NBTCustomObject ? nbtParser(element) : element.toString()))

  return new class implements NBTCustomObject {
      [util.inspect.custom] = () => result.join('')
  }()
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

  /**
   * Transforms an array into an Integer array.
   *
   * @param intNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.intArray([0, 1, 2]) }) // => { Test: [I; 0, 1, 2] }
   */
  intArray(intNumbers: number[]): NBTCustomObject,

  /**
   * Transforms an array into a Long array.
   *
   * @param longNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.longArray([0, 1, 2]) }) // => { Test: [L; 0, 1, 2] }
   */
  longArray(longNumbers: number[]): NBTCustomObject,

  /**
   * Used to check for the absence of a NBT in a selector.
   *
   * @param nbt The NBT to check the absence of.
   *
   * @example
   *
   * // Check for entities that are NOT new babies.
   * >>> Selector('@e', { nbt: NBT.not({ Age: -32768 }) }).toString()
   * @e[nbt=!{ Age: -32768 }]
   */
  not: (nbt: RootNBT) => NotNBT

  /**
   * Return a stringified version of a NBT.
   *
   * @param nbt The NBT to stringify.
   *
   * @example
   *
   * >>> NBT.stringify({ Invisible: NBT.byte(1) })
   * '{ Invisible: 1b }'
   *
   * >>> NBT.stringify({ Rotation: NBT.float([ 90, 0 ]) })
   * '{ Rotation: [90f, 0f] }'
   *
   * >>> NBT.stringify({ Test: NBT.longArray([0, 1, 2]) })
   * '{ Test: [L; 0, 1, 2] }'
   */
  stringify: (nbt: RootNBT) => string

  /**
   * Evaluate the given NBT.
   */
  (nbts: TemplateStringsArray): NBTCustomObject
}

export const NBT: NBTInterface = Object.assign(dynamicNBT, {
  float: (num: number | number[]): any => customNumber(num, 'f'),

  double: (num: number | number[]): any => customNumber(num, 'd'),

  byte: (num: number | number[]): any => customNumber(num, 'b'),

  short: (num: number | number[]): any => customNumber(num, 's'),

  long: (num: number | number[]): any => customNumber(num, 'l'),

  intArray: (numbers: number[]): any => customUnitArray(numbers, 'I'),

  longArray: (numbers: number[]): any => customUnitArray(numbers, 'L'),

  not: (nbt: RootNBT) => new NotNBT(nbt),

  stringify: (nbt: RootNBT) => nbtParser(nbt),
})
