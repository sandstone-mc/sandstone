import type { TextObject } from './generated/util/text'
import { TextComponentClass } from 'sandstone/variables'
import type {
  NBTByte,
  NBTByteArray,
  NBTClass,
  NBTDouble,
  NBTFloat,
  NBTInt,
  NBTIntArray,
  NBTLong,
  NBTLongArray,
  NBTShort,
} from 'sandstone/variables/nbt/NBTs'
import { NonEmptyString } from 'sandstone/utils'

export interface NBTSerializable {
  toNBT(): string
}

export type NBTObject = string | number | boolean | URL | undefined | NBTSerializable | TextComponentClass | TextObject | { [key: string]: NBTObject | undefined } | NBTObject[] | NBTClass

export type RootNBT = Record<NonEmptyString, NBTObject | undefined>

/**
 * Recursively walks a type, unioning Sandstone NBT primitive classes with their plain JSON equivalents
 */
export type MCDocToJSON<T> =
  T extends NBTInt | NBTFloat | NBTDouble | NBTByte | NBTShort | NBTLong ? (number | T) :
  T extends NBTIntArray | NBTLongArray | NBTByteArray ? (number | T)[] :
  T extends (...args: any[]) => any ? T :
  T extends NBTSerializable | TextComponentClass ? T :
  T extends ReadonlyArray<infer U> ? Array<MCDocToJSON<U>> :
  T extends object ? { [K in keyof T]: MCDocToJSON<T[K]> } :
  T
