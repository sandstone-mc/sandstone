import util from 'util'

export abstract class NBTCustomObject {
  abstract [util.inspect.custom]: () => string;
}

function customUnit(num: number, unit: string) {
  return new class {
    [util.inspect.custom] = () => `${num}${unit}`
  }()
}

export class NBT {
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
  static float = (floatNumber: number) => customUnit(floatNumber, 'f')

  /**
   * Transform several numbers into a an array of Minecraft NBT float numbers.
   *
   * @param floatNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.floats(0, 1, 2) }) // => { Test: [0f, 1f, 2f] }
   */
  static floats = (...floatNumbers: number[]) => floatNumbers.map(NBT.float)

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
  static double = (doubleNumber: number) => customUnit(doubleNumber, 'd')

  /**
   * Transform several numbers into a an array of Minecraft NBT double numbers.
   *
   * @param doubleNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.doubles(0, 1, 2) }) // => { Test: [0d, 1d, 2d] }
   */
  static doubles = (...doubleNumbers: number[]) => doubleNumbers.map(NBT.double)

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
  static byte = (byteNumber: number) => customUnit(byteNumber, 'b')

  /**
   * Transform several numbers into a an array of Minecraft NBT byte numbers.
   *
   * @param byteNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.bytes(0, 1, 2) }) // => { Test: [0b, 1b, 2b] }
   */
  static bytes = (...byteNumbers: number[]) => byteNumbers.map(NBT.byte)

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
  static short = (shortNumber: number) => customUnit(shortNumber, 's')

  /**
   * Transform several numbers into a an array of Minecraft NBT short numbers.
   *
   * @param shortNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.shorts(0, 1, 2) }) // => { Test: [0b, 1b, 2b] }
   */
  static shorts = (...shortNumbers: number[]) => shortNumbers.map(NBT.short)

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
  static long = (longNumber: number) => customUnit(longNumber, 'l')

  /**
   * Transform several numbers into a an array of Minecraft NBT long numbers.
   *
   * @param longNumbers The numbers to transform.
   *
   * @example
   * summon(..., { Test: [0, 1, 2] }) // => { Test: [0, 1, 2] }
   *
   * summon(..., { Test: NBT.longs(0, 1, 2) }) // => { Test: [0l, 1l, 2l] }
   */
  static longs = (...longNumbers: number[]) => longNumbers.map(NBT.long)
}
