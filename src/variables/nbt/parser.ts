import nearley from 'nearley'

import grammar, { isCompoundSymbol } from './grammar.js'

import type { NBTCompound, NBTExpression } from './grammar.js'
import type { NBT as NBTMethods } from './NBTs.js'
import type { NBTObject } from 'sandstone/arguments/index.js'

function isCompoundNbt(nbt: any): nbt is NBTCompound {
  return !!nbt[isCompoundSymbol]
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
      case 'byte': return NBT.byte(nbt.value)
      case 'short': return NBT.short(nbt.value)
      case 'long': return NBT.long(nbt.value)
      case 'float': return NBT.float(nbt.value)
      case 'double': return NBT.double(nbt.value)
      case 'number': return nbt.value
      case 'string': return nbt.value
      case 'byteArray': return NBT.byteArray(nbt.value.map((x) => x.value))
      case 'intArray': return NBT.intArray(nbt.value.map((x) => x.value))
      case 'longArray': return NBT.longArray(nbt.value.map((x) => x.value))
    }
  }

  throw new Error(`Unrecognized data type: ${nbt.dataType}`)
}

export function parseNBT(NBT: typeof NBTMethods, nbt: string): NBTObject {
  const rawResult = parseRaw(nbt)
  return parseExpression(NBT, rawResult)
}
