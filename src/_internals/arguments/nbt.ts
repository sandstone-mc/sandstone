import util from 'util'

export type NBTObject = (
    string |
    number |
    { [NBTTAg: string]: NBTObject } |
    NBTObject[]
)

export type NBT = Record<string, NBTObject>

export const nbtParser = (nbt: NBT) => util.inspect(nbt, {
  depth: null,
  showHidden: false,
  compact: true,
  maxArrayLength: null,
  maxStringLength: null,
  breakLength: Infinity,
  colors: false,
})
