import type { NBTClass } from 'sandstone/variables/nbt/NBTs'

export type NBTObject = string | number | boolean | { [key: string]: NBTObject | undefined } | NBTObject[] | NBTClass

export type RootNBT = Record<string, NBTObject | undefined>
