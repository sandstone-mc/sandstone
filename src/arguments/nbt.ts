type NBTObject = (
    string |
    number |
    { [NBTTAg: string]: NBTObject } |
    NBTObject[]
)

type NBT = Record<string, NBTObject>