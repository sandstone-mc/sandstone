import type { NonEmptyString } from 'sandstone/utils'
import type { TextObject } from './generated/util/text'
import type { JsonTextObject } from './generated/_json/util/text'
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

export interface NBTSerializable {
  toNBT(): string
}

export type NBTObject = string | number | boolean | URL | undefined | NBTSerializable | TextComponentClass | TextObject | { [key: string]: NBTObject | undefined } | NBTObject[] | NBTClass

export type RootNBT = Record<NonEmptyString, NBTObject | undefined>

/**
 * `NBTObject` for the generated JSON surface (`arguments/generated/_json`).
 *
 * Identical to `NBTObject` except that it references `JsonTextObject` rather
 * than `TextObject`. `NBTObject` reaches into the generated types, so it is
 * bound to whichever surface it names - without this twin, `_json` types would
 * pull the non-JSON `TextObject` back in through every `NBTObject` fallback.
 */
export type JsonNBTObject = string | number | boolean | URL | undefined | NBTSerializable | TextComponentClass | JsonTextObject | { [key: string]: JsonNBTObject | undefined } | JsonNBTObject[] | NBTClass

export type JsonRootNBT = Record<NonEmptyString, JsonNBTObject | undefined>

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
