import type { DiscreteAttribute } from 'sandstone/arguments/generated/data/worldgen/attribute.ts'
import type { NBTObject } from 'sandstone/arguments/nbt.ts'

export type UnknownDynamicAdditions = ({
  [Key in `${any}${string}`]?: NBTObject;
})
