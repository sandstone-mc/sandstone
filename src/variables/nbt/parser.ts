import nearley from 'nearley'
import type { NBTObject } from 'sandstone/arguments'
import type { NBTCompound, NBTExpression } from './grammar'
import grammar, { isCompoundSymbol } from './grammar'
import type { NBT as NBTMethods } from './NBTs'

function isCompoundNbt(nbt: any): nbt is NBTCompound {
  return !!nbt[isCompoundSymbol]
}

const INT32_MIN = -2147483648
const INT32_MAX = 2147483647
const INT64_MIN = -9223372036854775808n
const INT64_MAX = 9223372036854775807n

/**
 * The largest magnitude a single-precision float can hold without
 * losing integer precision (2^24). Beyond it, a float's spacing
 * between representable values is wider than 1, so anything stored
 * in a float would come back changed.
 */
const SAFE_FLOAT_MAGNITUDE = 16777216

/**
 * The type MC gives to a numeric literal that carries no explicit
 * suffix (`b` / `s` / `i` / `l` / `f` / `d`).
 *
 * - A whole number becomes an `int`, or a `long` when it doesn't fit
 *   in an int.
 * - A fractional number becomes a `float` while its magnitude stays
 *   within the range a float can represent without losing precision,
 *   and a `double` beyond it.
 */
function inferNumericType(value: number): 'int' | 'long' | 'float' | 'double' {
  if (Number.isInteger(value)) {
    if (value >= INT32_MIN && value <= INT32_MAX) {
      return 'int'
    }
    const asLong = BigInt(value)
    if (asLong >= INT64_MIN && asLong <= INT64_MAX) {
      return 'long'
    }
    return 'double'
  }

  return Math.abs(value) <= SAFE_FLOAT_MAGNITUDE ? 'float' : 'double'
}

function parseRaw(nbt: string): NBTExpression {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
  parser.feed(nbt)
  parser.finish()
  return parser.results[0]
}

function parseExpression(NBT: typeof NBTMethods, nbt: NBTExpression): NBTObject {
  if (Array.isArray(nbt)) {
    return nbt.map((x) => parseExpression(NBT, x))
  }

  if (typeof nbt === 'object') {
    if (isCompoundNbt(nbt)) {
      return Object.keys(nbt).reduce((acc: Record<string, NBTObject>, key) => {
        acc[key] = parseExpression(NBT, nbt[key])
        return acc
      }, {})
    }

    // eslint-disable-next-line default-case
    switch (nbt.dataType) {
      case 'byte':
        return NBT.byte(nbt.value)
      case 'short':
        return NBT.short(nbt.value)
      case 'int':
        return NBT.int(nbt.value)
      case 'long':
        return NBT.long(nbt.value)
      case 'float':
        return NBT.float(nbt.value)
      case 'double':
        return NBT.double(nbt.value)
      case 'number':
        switch (inferNumericType(nbt.value)) {
          case 'int':
            return NBT.int(nbt.value)
          case 'long':
            return NBT.long(nbt.value)
          case 'float':
            return NBT.float(nbt.value)
          case 'double':
            return NBT.double(nbt.value)
        }
      case 'string':
        return nbt.value
      case 'byteArray':
        return NBT.byteArray(nbt.value.map((x) => x.value))
      case 'intArray':
        return NBT.intArray(nbt.value.map((x) => x.value))
      case 'longArray':
        return NBT.longArray(nbt.value.map((x) => x.value))
    }
  }

  throw new Error(`Unrecognized data type: ${nbt.dataType}`)
}

export function parseNBT(NBT: typeof NBTMethods, nbt: string): NBTObject {
  const rawResult = parseRaw(nbt)
  return parseExpression(NBT, rawResult)
}
