import * as util from 'node:util'
import type { NBTObject, RootNBT } from 'sandstone/arguments'
import type { MacroArgument } from 'sandstone/core'
import { makeCallable } from 'sandstone/utils'
import { parseNBT } from './parser.js'

export abstract class NBTClass {
  abstract [util.inspect.custom]: () => string

  toString = this[util.inspect.custom]
}

export class NBTPrimitive extends NBTClass {
  value: number

  unit: string

  constructor(value: number, unit: string) {
    super()
    this.value = value
    this.unit = unit
  }

  [util.inspect.custom] = () => `${this.value}${this.unit}`
}

export class NBTLong extends NBTPrimitive {
  constructor(value: number) {
    super(value, 'l')
  }
}

export class NBTByte extends NBTPrimitive {
  constructor(value: number) {
    super(value, 'b')
  }
}

export class NBTShort extends NBTPrimitive {
  constructor(value: number) {
    super(value, 's')
  }
}

export class NBTFloat extends NBTPrimitive {
  constructor(value: number) {
    super(value, 'f')
  }
}

export class NBTDouble extends NBTPrimitive {
  constructor(value: number) {
    super(value, 'd')
  }
}

export class NBTTypedArray extends NBTClass {
  values: number[]

  unit: string

  constructor(values: number[], unit: string) {
    super()
    this.values = values
    this.unit = unit
  }

  [util.inspect.custom] = () => `[${this.unit};${this.values.length === 0 ? '' : this.values.join(',')}]`
}

export class NBTLongArray extends NBTTypedArray {
  constructor(values: number[]) {
    super(values, 'L')
  }
}

export class NBTByteArray extends NBTTypedArray {
  constructor(values: number[]) {
    super(values, 'B')
  }
}

export class NBTIntArray extends NBTTypedArray {
  constructor(values: number[]) {
    super(values, 'I')
  }
}

export class NotNBT extends NBTClass {
  nbt

  constructor(nbt: RootNBT) {
    super()
    this.nbt = nbt
  }

  [util.inspect.custom] = () => `!${nbtStringifier(this.nbt)}`
}

export type NBTSimpleClasses = typeof NBTLong | typeof NBTShort | typeof NBTByte | typeof NBTFloat | typeof NBTDouble

export class NBTInt extends NBTPrimitive {}

export type NBTAllNumbers = typeof NBTInt | NBTSimpleClasses

export type NBTAllArrays = typeof NBTTypedArray | typeof NBTLongArray | typeof NBTByteArray | typeof NBTIntArray

export class NBTString extends NBTPrimitive {}

export type NBTAllPrimitives = NBTAllNumbers | NBTAllArrays | typeof NBTString

// Type Hack, not actually a primitive
export class NBTAnyValue extends NBTPrimitive {}

export type NBTAllValues = NBTAllPrimitives | NBTAnyValue

function customNumber<T extends number | number[], C extends NBTSimpleClasses>(
  num: T,
  _class: C,
): T extends number ? C : C[] {
  if (Array.isArray(num)) {
    return num.map((n) => new _class(n)) as any
  }
  return new _class(num) as any
}

function dynamicNBT(template: TemplateStringsArray, ...args: unknown[]): NBTObject {
  const mixedArgs = template.flatMap((s, i) => [s, args[i]]).slice(0, -1) // Remove the last argument, which will always be undefined
  const result = mixedArgs
    .map((element: any) => (element instanceof NBTClass ? nbtStringifier(element) : element.toString()))
    .join('')

  return parseNBT(NBT, result)
}

interface NBTInterface {
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
  float(floatNumber: number): NBTFloat

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
  float(floatNumbers: number[]): NBTFloat[]

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
  double(doubleNumber: number): NBTDouble

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
  double(doubleNumbers: number[]): NBTDouble[]

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
  byte(byteNumber: number): NBTByte

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
  byte(byteNumbers: number[]): NBTByte[]

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
  short(shortNumber: number): NBTShort

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
  short(shortNumbers: number[]): NBTShort[]

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
  long(longNumber: number): NBTLong

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
  long(longNumbers: number[]): NBTLong[]

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
  intArray(intNumbers: number[]): NBTIntArray

  /**
   * Transforms an array into a Byte array.
   *
   * @param intNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.byteArray([0, 1, 2]) }) // => { Test: [B; 0, 1, 2] }
   */
  byteArray(intNumbers: number[]): NBTByteArray

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
  longArray(longNumbers: number[]): NBTLongArray

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
  stringify: (nbt: NBTObject) => string

  /**
   * Parses the given NBT.
   *
   * @param nbt The NBT to parse.
   *
   * @example
   *
   * >>> NBT.parse(`{ Invisible: NBT.byte(1) }`)
   * { Invisible: 1b }
   *
   * >>> const inv = NBT.parse(`[{ Slot: 1b, Count: 1, id: 'minecraft:dirt' }]`)
   * [{ Slot: 1b, Count: 1, id: 'minecraft:dirt' }]
   * >>> inv.length
   * 1
   *
   * >>> NBT.parse('{ Test: [L; 0, 1, 2] }')
   * { Test: [L; 0, 1, 2] }
   */
  parse: (nbt: string) => NBTObject

  /**
   * Parses the given NBT.
   *   *
   * @example
   *
   * >>> NBT`{ Invisible: NBT.byte(1) }`
   * { Invisible: 1b }
   *
   * >>> const inv = NBT`[{ Slot: 1b, Count: 1, id: 'minecraft:dirt' }]`
   * [{ Slot: 1b, Count: 1, id: 'minecraft:dirt' }]
   * >>> inv.length
   * 1
   *
   * >>> NBT`{ Test: [L; 0, 1, 2] }`
   * { Test: [L; 0, 1, 2] }
   */
  (nbts: TemplateStringsArray, ...args: unknown[]): NBTObject
}

// TODO: Look into the weird typing on this
export const NBT: NBTInterface = makeCallable(
  {
    float: (num: number | number[]): any => customNumber(num, NBTFloat),

    double: (num: number | number[]): any => customNumber(num, NBTDouble),

    byte: (num: number | number[]): any => customNumber(num, NBTByte),

    short: (num: number | number[]): any => customNumber(num, NBTShort),

    long: (num: number | number[]): any => customNumber(num, NBTLong),

    intArray: (numbers: number[]): any => new NBTIntArray(numbers),

    longArray: (numbers: number[]): any => new NBTLongArray(numbers),

    byteArray: (numbers: number[]): any => new NBTByteArray(numbers),

    not: (nbt: RootNBT) => new NotNBT(nbt),

    stringify: (nbt: NBTObject) => nbtStringifier(nbt),

    parse: (nbt: string) => parseNBT(NBT, nbt),
  },
  dynamicNBT,
)

export const nbtStringifier = (nbt: NBTObject | MacroArgument): string => {
  if (typeof nbt === 'number') {
    // We have a number
    return nbt.toString()
  }

  if (typeof nbt === 'boolean') {
    // We have a boolean
    return nbt.toString()
  }

  if (typeof nbt === 'string') {
    // We have a string

    /*
     * Sometimes, when we have both a " and a ' in a string,
     * util.inspect will end up creating a template string, invalid for Minecraft.
     */
    const inspectedStr = util.inspect(nbt, {
      breakLength: Number.POSITIVE_INFINITY,
      compact: true,
      maxStringLength: Number.POSITIVE_INFINITY,
      depth: Number.POSITIVE_INFINITY,
    })

    if (inspectedStr[0] === '`') {
      return JSON.stringify(nbt)
    }

    return inspectedStr
  }

  if (Array.isArray(nbt)) {
    // We have an array
    const itemsStr = nbt.map(nbtStringifier).join(',')
    return `[${itemsStr}]`
  }

  // We have an object
  if (nbt instanceof NBTClass) {
    // It's actually a "Minecraft Primitive", like 1b, and not an object
    return nbt[util.inspect.custom]()
  }

  if (typeof nbt === 'object' && nbt.toMacro) {
    /* @ts-ignore */
    return nbt.toMacro()
  }

  // It's a real object.
  const objectStr = Object.entries(nbt)
    .map(([key, value]) => `${key}:${nbtStringifier(value as NBTObject)}`)
    .join(',')
  return `{${objectStr}}`
}
