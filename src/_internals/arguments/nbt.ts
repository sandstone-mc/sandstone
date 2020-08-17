export type NBTObject = (
    string |
    number |
    { [NBTTAg: string]: NBTObject } |
    NBTObject[]
)

export type NBT = Record<string, NBTObject>
