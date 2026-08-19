import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'
import type { NonEmptyString } from 'sandstone'

export type JsonUnknownDynamicAdditions = ({
  [Key in NonEmptyString]?: JsonNBTObject
})
