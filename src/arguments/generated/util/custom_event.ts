import type { NBTObject } from 'sandstone/arguments/nbt.ts'
import type { NonEmptyString } from 'sandstone'

export type UnknownDynamicAdditions = ({
  [Key in NonEmptyString]?: NBTObject
})
