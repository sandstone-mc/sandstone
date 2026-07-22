import { ComponentClass } from 'sandstone/variables'
import type { NBTClass } from 'sandstone/variables/nbt/NBTs'

export interface NBTSerializable {
  toNBT(): string
}

export type NBTObject = string | number | boolean | URL | undefined | NBTSerializable | ComponentClass | { [key: string]: NBTObject | undefined } | NBTObject[] | NBTClass

export type RootNBT = Record<string, NBTObject | undefined>
