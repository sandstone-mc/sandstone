import type { NBTClass } from '#variables/nbt/NBTs'

export type NBTObject = (
  string |
  number |
  boolean |
  { [key: string]: NBTObject } |
  NBTObject[] |
  NBTClass
)

export type RootNBT = Record<string, NBTObject>
